const router = require("express").Router();
const UserValidator = require("../../validators/user");
const UserRepository = require("../../repositories/user");
const UserService = require("../../services/user");
const { canAdminActOnUser } = require("../../auxiliaries/permission")
const { publicFolder } = require("../../auxiliaries/server");
const MailerService = require("../../services/mailer")
const fs = require("fs");
/**
 * @swagger
 * /v1/admin/user/info/all:
 *    get:
 *      summary: get all users information
 *      tags: [User]
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          404:
 *              description: User not found
 */
router.get("/info/all", async (req, res, next) => {
  try {
    const usersDB = await UserRepository.getUserList(true);
    if (usersDB) {
      res.send(usersDB);
    } else {
      next({ message: "Users not found", status: 404 });
    }
  } catch (e) {
    next(e);
  }
});

// TODO DO SWAGGER
router.post(
  "/send-activation-email/:id",
  UserValidator.sendActivationEmail,
  async (req, res, next) => {
    try {
      const userDB = await UserRepository.getUserById(req.params.id);
      if (userDB) {
        userDB.setActivationCode();
        await userDB.save()
        MailerService.sendNewUserActivationMail(userDB);
        res.send({ message: "ok" });
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  })

// TODO DO SWAGGER
router.post(
  "/send-lost-password-email/:id",
  UserValidator.sendPasswordRemindEmail,
  async (req, res, next) => {
    try {
      const userDB = await UserRepository.getUserById(req.params.id);
      if (userDB) {
        userDB.setActivationCode();
        await userDB.save()
        MailerService.sendResetPasswordMail(userDB);
        res.send({ message: "ok" });
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  })

/**
 * @swagger
 * /v1/admin/user/create:
 *    post:
 *      summary: Creates new user
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: user
 *        description: user details. Email Required
 *        schema:
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *                  required: true
 *              lastname:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              status:
 *                  type: string
 *              role:
 *                  type: string
 *      - in: body
 *        name: sendActivationEmail
 *        description: Send Activation Email
 *      - in: formData
 *        name: profileImage
 *        type: file
 *        description: The file of the profile image
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          401:
 *              description: You don't have the permission due to your user role
 */
router.post(
  "/create",
  UserValidator.createUserByAdmin,
  async (req, res, next) => {
    //TODO REVISE SWAGGER DOCUMENTATION
    const sendActivationEmail = req.body.sendActivationEmail;
    const user = req.body;
    delete user.sendActivationEmail
    if (!canAdminActOnUser(req.user, user)) next({ message: "You don't have the permission due to your user role", status: 401 })
    else {
      try {
        user.email = user.email.trim();
        const isIn = await UserService.isUserRegistrated(user.email);
        if (isIn !== false) next(isIn);
        else {
          // ? Set new image
          if (req.files?.profileImageUrl) user.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl)
          let userInDB = await UserRepository.createUser(user, sendActivationEmail);
          if (sendActivationEmail == true) sendNewUserActivationMail(userInDB)
          res.status(201).send(userInDB);
        }

      } catch (e) {
        next(e);
      }
    }
  }
);

/**
 * @swagger
 * /v1/admin/user/info/:id:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *      security:
 *          - cookieAuthAdmin: []
 *      responses:
 *        404:
 *          description: User not found
 */
router.get("/info/:id", UserValidator.getUserById, async (req, res, next) => {
  try {
    const userDB = await UserRepository.getUserById(req.params.id);
    if (userDB) {
      res.send(userDB);
    } else {
      next({ message: "User not found", status: 404 });
    }
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/admin/user/edit:
 *    put:
 *      summary: Edit user info
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: id
 *        description: id of the user
 *        required: true
 *      - in: body
 *        name: firstname
 *      - in: body
 *        name: lastname
 *      - in: body
 *        name: email
 *      - in: body
 *        name: password
 *      - in: body
 *        name: status
 *      - in: body
 *        name: theme
 *      - in: body
 *        name: language
 *      - in: body
 *        name: createdAt
 *      - in: body
 *        name: updatedAt
 *      - in: body
 *        name: password
 *      - in: body
 *        name: role
 *      - in: body
 *        name: removeBackgroundImage
 *        description: if set true, removes the profile image
 *      - in: formData
 *        name: profileImageUrl
 *        type: file
 *        description: The file of the profile image
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          406:
 *            description: User is not activated / User is disabled
 *          404:
 *            description: User not found
 *          401:
 *            description: You don't have the permission due to your user role
 */
router.put(
  "/edit",
  UserValidator.editUserByAdmin,
  async (req, res, next) => {
    // TODO  REVISE SWAGGER DOCUMENTATION
    const newData = req.body;
    if (newData.email) newData.email = newData.email.trim();
    try {
      const userDB = await UserRepository.getUserById(newData.id);
      if (userDB) {
        if (!canAdminActOnUser(req.user, userDB)) next({ message: "You don't have the permission due to your user role", status: 401 })
        else {
          // ? Only Remove old image
          if (newData.removeProfileImageUrl == true) {
            fs.unlink(publicFolder + newData.profileImageUrl, (err) => {
              if (err) throw err;
            });
            newData.profileImageUrl = null;
          } else if (req.files?.profileImageUrl) {
            // ? Set new image - Remove old image
            if (newData.profileImageUrl) {
              fs.unlink(publicFolder + newData.profileImageUrl, (err) => {
                if (err) throw err;
              });
            }
            newData.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl)
          }


          const newUser = await UserRepository.updateUser(userDB, newData);
          res.send(newUser);
        }
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);


// TODO SWAGGER and VALIDATOR
router.post(
  "/impersonificate/:id",
  async (req, res, next) => {
    try {
      // ? Get user
      const userDB = await UserRepository.getUserById(req.params.id);
      if (userDB) {
        if (!canAdminActOnUser(req.user, userDB)) next({ message: "You don't have the permission due to your user role", status: 401 })
        else {
          let refreshToken
          if (!userDB.refreshToken) {
            const refreshToken = UserService.generateRefreshToken(userDB.id);
            await UserRepository.setRefreshToken(userDB, refreshToken);
          } else refreshToken = userDB.refreshToken
          const accessToken = UserService.generateAccessToken(userDB.id);


          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24,
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000 * 60 * 60 * 24 * 10,
          });
          res.send({
            accessToken,
            refreshToken,
            user: userDB,
          });
        }
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) { next(e) }
  })
module.exports = router;
