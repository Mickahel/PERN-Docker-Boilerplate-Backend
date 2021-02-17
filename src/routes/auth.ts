import express, { Response, Request, NextFunction } from "express";
import MailerService from "../services/mailer";
import passport from "passport";
import _ from "lodash";
import UserService from "../services/user";
import UserRepository from "../repositories/user";
import AuthValidator from "../validators/auth";
import jwt from "jsonwebtoken";
import { statuses } from "../enums";
const router: express.Router = express.Router();

const userRepository = new UserRepository();

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
router.post("/signup", AuthValidator.signup, async (req: Request, res: Response, next: NextFunction) => {
	let { body: user } = req;
	try {
		user.email = user.email.trim();
		const isIn = await UserService.isUserRegistrated(user.email);
		if (isIn !== false) next(isIn);
		else {
			let userInDB = await userRepository.createUser(user);
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
router.post("/login", AuthValidator.login, (req: Request, res: Response, next: NextFunction) => {
	let { body: user } = req;
	try {
		user.email = user.email.trim();
		passport.authenticate("local", { session: false }, async (err, passportUser, info) => {
			if (err) return next(err);
			else if (!passportUser && info) return next(info);
			else {
				const accessToken = UserService.generateAccessToken(passportUser.id);
				const refreshToken = UserService.generateRefreshToken(passportUser.id);
				await userRepository.update(passportUser.id, { refreshToken });

				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24,
				});
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24 * 10,
				});
				res.send({
					accessToken,
					refreshToken,
					user: passportUser,
				});
			}
		})(req, res, next);
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
router.post("/activation/:activationCode", AuthValidator.activation, async (req: Request, res: Response, next: NextFunction) => {
	const { activationCode } = req.params;
	try {
		let user = await userRepository.getBy({ where: { activationCode } });
		if (user && user.id) {
			await userRepository.update(user.id, {
				status: statuses.values().ACTIVE,
				activationCode: undefined,
			});
			MailerService.sendUserActivatedMail(user);
			res.send({ message: "ok" });
		} else {
			next({ message: "User not found", status: 404 });
		}
	} catch (e) {
		next(e);
	}
});

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
router.post("/lost-password-mail", AuthValidator.lostPasswordMail, async (req: Request, res: Response, next: NextFunction) => {
	let email = req.body.email.trim();
	try {
		const user = await userRepository.getUserByEmail(email);
		if (user) {
			user.setActivationCode();
			await user.save();
			MailerService.sendResetPasswordMail(user);
			res.send({ message: "ok" });
		} else {
			next({ message: "User not found", status: 404 });
		}
	} catch (e) {
		next(e);
	}
});

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
router.post("/password-reset", AuthValidator.passwordReset, async (req: Request, res: Response, next: NextFunction) => {
	const { activationCode, password } = req.body;
	try {
		const user = await userRepository.getBy({ where: { activationCode } });
		if (user) {
			user.setPassword(password);
			user.activationCode = undefined;
			await user.save();
			res.send({ message: "ok" });
		} else {
			next({ message: "User not found", status: 404 });
		}
	} catch (e) {
		next(e);
	}
});

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
router.post("/token", async (req: Request, res: Response, next: NextFunction) => {
	let refreshToken = req.cookies.refreshToken;
	if (!refreshToken) next({ message: "RefreshToken Not Found", status: 403 });
	else {
		let refreshTokenDB = await userRepository.getBy({ where: { refreshToken } });
		if (refreshTokenDB) {
			jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, data: any) => {
				if (err) return next({ message: "Error in RefreshToken", status: 403 });
				const accessToken = UserService.generateAccessToken(data.id);
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24,
				});
				res.send({ accessToken });
			});
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
router.delete("/logout", async (req: Request, res: Response, next: NextFunction) => {
	let refreshToken = req.cookies.refreshToken;
	try {
		// ? Delete Refresh Token
		if (refreshToken) await userRepository.update(refreshToken, { refreshToken: undefined });
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
	session: false,
};

const originGetter = (req: Request, res: Response, next: NextFunction) => {
	if (!req.hostname) return next();
	if (req.headers.referer)
		res.cookie("socialRedirect", req.headers.referer.slice(-1) == "/" ? req.headers.referer.slice(0, -1) : req.headers.referer, {
			httpOnly: true,
			secure: false,
		});
	next();
};

const getOrigin = (req: Request, res: Response, next: NextFunction) => {
	if (req.cookies.socialRedirect) {
		const redirect = req.cookies.socialRedirect;
		res.clearCookie("socialRedirect");
		return redirect;
	}
	return process.env.FRONTEND_URL;
};

//? -------------------- Social Login -------------------
/**
 * @swagger
 * /v1/auth/login/facebook:
 *    get:
 *      summary: facebook social login
 *      tags: [Auth]
 */
router.get("/login/facebook", originGetter, passport.authenticate("facebook", { scope: ["email"] }));

/**
 * @swagger
 * /v1/auth/login/google:
 *    get:
 *      summary: google social login
 *      tags: [Auth]
 */
router.get("/login/google", originGetter, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
	"/login/callback/facebook",
	(req: Request, res: Response, next: NextFunction) => {
		passport.authenticate("facebook", async (err, passportUser, info) => {
			if (err) res.redirect(`${loginCallbackOptions.failureRedirect}?failReason=${err}`);
			else {
				const accessToken = UserService.generateAccessToken(passportUser.id);
				const refreshToken = UserService.generateRefreshToken(passportUser.id);
				// ? Update refresh token
				await userRepository.update(passportUser.id, { refreshToken });
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24,
				});
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24 * 10,
				});
				res.redirect(loginCallbackOptions.successRedirect);
			}
		})(req, res, next);
	}
	/*(err, req, res, next) => res.redirect(`${getOrigin(req, res, next)}/auth/login/failed?error=${err.message.replace(/\s/g, "").replace(".", "")}`)
	 */
);

router.get("/login/callback/google", (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("google", async (err, passportUser, info) => {
		if (err) res.redirect(`${loginCallbackOptions.failureRedirect}?failReason=${err}`);
		else {
			const accessToken = UserService.generateAccessToken(passportUser.id);
			const refreshToken = UserService.generateRefreshToken(passportUser.id);
			// ? Update refresh token
			await userRepository.update(passportUser.id, { refreshToken });

			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: true,

				sameSite: "none",
				maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24,
			});
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: true,

				sameSite: "none",
				maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string) * 1000 * 60 * 60 * 24 * 10,
			});
			res.redirect(loginCallbackOptions.successRedirect);
		}
	})(req, res, next);
});

router.get("/login/callback/failed", (req: Request, res: Response, next: NextFunction) => res.redirect(`${getOrigin(req, res, next)}/auth/social/failed?failReason=${req.query.failReason}`));

router.get("/login/callback/success", (req: Request, res: Response, next: NextFunction) => res.redirect(`${getOrigin(req, res, next)}/auth/social/success`));

export default router;
