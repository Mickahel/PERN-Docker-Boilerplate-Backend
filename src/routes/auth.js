const router = require("express").Router();
const MailerService = require("../services/mailer");
const passport = require("passport");
const _ = require("lodash");
const UserService = require("../services/user");
const UserRepository = require("../repositories/user");
const AuthValidator = require("../validators/auth");
const jwt = require("jsonwebtoken");
const { statuses } = require("../../config");
const { roles } = require("../../config");

/**
 * @swagger
 * /v1/auth/signup:
 *    post:
 *      summary: Registration endpoint
 *      tags: [Auth]
 *      parameters:
 *      - in: body
 *        name: email
 *        description: Registration email
 *        required: true
 *      - in: body
 *        name: password
 *        description: Password chosen
 *        required: true
 *      responses:
 *        409:
 *          description: User is already registered
 *        406:
 *          description: User is not activated / User is disabled
 */
router.post("/signup", AuthValidator.signup, async (req, res, next) => {
  let { body: user } = req;
  try {
    user.email = user.email.trim();
    const isIn = await UserService.isUserRegistrated(user.email);
    if (isIn !== false) next(isIn);
    else {
      let userInDB = await UserRepository.createUser(user);
      MailerService.sendNewUserActivationMail(userInDB);
      res.status(201).send({ message: "ok" });
    }
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/auth/login:
 *    post:
 *      summary: Login endpoint
 *      tags: [Auth]
 *      parameters:
 *      - in: body
 *        name: email
 *        description: Registration email
 *        required: true
 *      - in: body
 *        name: password
 *        description: Password chosen
 *        required: true
 *      responses:
 *        404:
 *          description: User doesn't exist
 *        401:
 *          description: User is disabled / user is not activated
 *        403:
 *          description: Email or password is invalid
 */
router.post("/login", AuthValidator.login, (req, res, next) => {
  let { body: user } = req;
  try {
    user.email = user.email.trim();
    passport.authenticate(
      "local",
      { session: false },
      async (err, passportUser, info) => {
        if (err) return next(err);
        else if (!passportUser && info) return next(info);
        else {
          const accessToken = UserService.generateAccessToken(passportUser.id);
          const refreshToken = UserService.generateRefreshToken(
            passportUser.id
          );
          await UserRepository.setRefreshToken(passportUser, refreshToken);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
          });
          res.send({
            accessToken,
            refreshToken,
            user: passportUser,
          });
        }
      }
    )(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/auth/activation/:activationCode:
 *    post:
 *      summary: Activates the user using the activationCode
 *      tags: [Auth]
 *      parameters:
 *      - in: path
 *        name: activationCode
 *        description: the activation code
 *        required: true
 *      responses:
 *        404:
 *          description: User not found
 */
router.post(
  "/activation/:activationCode",
  AuthValidator.activation,
  async (req, res, next) => {
    const { activationCode } = req.params;
    try {
      let user = await UserRepository.getUserByActivationCode(activationCode);
      if (user) {
        user.status = statuses.ACTIVE;
        user.activationCode = null;
        user.save();
        MailerService.sendUserActivatedMail(user.dataValues);
        res.send({ message: "ok" });
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @swagger
 * /v1/auth/lost-password-mail:
 *    post:
 *      summary: Send lost password email
 *      tags: [Auth]
 *      parameters:
 *      - in: "body"
 *        name: "email"
 *        description: "Registration email"
 *        required: true
 *      responses:
 *        "404":
 *          description: "User not found"
 */
router.post(
  "/lost-password-mail",
  AuthValidator.lostPasswordMail,
  async (req, res, next) => {
    let email = req.body.email.trim();
    try {
      let user = await UserRepository.getUserByEmail(email);
      if (user) {
        user.setActivationCode();
        await user.save();
        MailerService.sendResetPasswordMail(user.dataValues);
        res.send({ message: "ok" });
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @swagger
 * /v1/auth/password-reset:
 *    post:
 *      summary : Resets the password
 *      tags: [Auth]
 *      parameters:
 *      - in: body
 *        name: activationCode
 *        description: activation Code
 *        required: true
 *      - in: body
 *        name: password
 *        description: new password
 *        required: true
 *      responses:
 *        404:
 *          description: User not found
 *
 */
router.post(
  "/password-reset",
  AuthValidator.passwordReset,
  async (req, res, next) => {
    const { activationCode, password } = req.body;
    try {
      const user = await UserRepository.getUserByActivationCode(activationCode);
      if (user) {
        user.setPassword(password);
        user.activationCode = null;
        await user.save();
        res.send({ message: "ok" });
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @swagger
 * /v1/auth/token:
 *    post:
 *      summary : Gets new access token
 *      tags: [Auth]
 *      parameters:
 *      - in: body
 *        name: token
 *        description: Refresh Token
 *        required: true
 *      responses:
 *        403:
 *          description: Error in RefreshToken / RefreshToken Not Found
 *
 */
router.post("/token", async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) next({ message: "RefreshToken Not Found", status: 403 });
  else {
    let refreshTokenDB = await UserRepository.getRefreshToken(refreshToken);
    if (refreshTokenDB) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, data) => {
          if (err)
            return next({ message: "Error in RefreshToken", status: 403 });
          const accessToken = UserService.generateAccessToken(data.id);
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24,
          });
          res.send({ accessToken });
        }
      );
    } else next({ message: "RefreshToken Not Found", status: 403 });
  }
});

/**
 * @swagger
 * /v1/auth/logout:
 *    delete:
 *      summary : Removes Refresh Token
 *      tags: [Auth]
 *      parameters:
 *      - in: cookie
 *        name: refreshToken
 *        schema:
 *          type: string
 *
 */
router.delete("/logout", async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) await UserRepository.deleteRefreshToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

const loginCallbackOptions = {
  failureRedirect: "/v1/auth/login/callback/failed",
  successRedirect: "/v1/auth/login/callback/success",
  session: false
};

const getOrigin = (req, res, next) => {
  if (!req.session) return process.env.FRONTEND_URL;
  if (_.includes(req.session.hostname, "admin"))
    return process.env.ADMIN_FRONTEND_URL;
  return process.env.FRONTEND_URL;
};

//? -------------------- Social Login -------------------
router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/callback/facebook",
  //  passport.authenticate(
  //    "facebook",
  //    loginCallbackOptions),
  (req, res, next) => {
    passport.authenticate(
      "facebook",
      async (err, passportUser, info) => {
        if (err) res.redirect(`${loginCallbackOptions.failureRedirect}?failReason=${err}`)
        else {
          const accessToken = UserService.generateAccessToken(passportUser.id);
          const refreshToken = UserService.generateRefreshToken(passportUser.id);
          await UserRepository.setRefreshToken(passportUser, refreshToken);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
          });
          res.redirect(loginCallbackOptions.successRedirect)
        }
      }
    )(req, res, next)
  }
  /*(err, req, res, next) => res.redirect(`${getOrigin(req, res, next)}/auth/login/failed?error=${err.message.replace(/\s/g, "").replace(".", "")}`)
*/
)

router.get(
  "/login/callback/google",
  (req, res, next) => {
    passport.authenticate(
      "google",
      async (err, passportUser, info) => {
        if (err) res.redirect(`${loginCallbackOptions.failureRedirect}?failReason=${err}`)
        else {
          const accessToken = UserService.generateAccessToken(passportUser.id);
          const refreshToken = UserService.generateRefreshToken(passportUser.id);
          await UserRepository.setRefreshToken(passportUser, refreshToken);

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
          });
          res.redirect(loginCallbackOptions.successRedirect)
        }
      }
    )(req, res, next)
  }
);

router.get("/login/callback/failed", (req, res, next) => res.redirect(`${getOrigin(req, res, next)}/auth/social/failed?failReason=${req.query.failReason}`))

router.get("/login/callback/success", (req, res, next) => res.redirect(`${getOrigin(req, res, next)}/auth/social/success`))

module.exports = router;
