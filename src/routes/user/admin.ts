import express, { Response, Request, NextFunction } from "express";
import UserValidator from "../../validators/user";
import UserRepository from "../../repositories/user";
import UserService from "../../services/user";
import { canAdminActOnUser } from "../../auxiliaries/permission";
import { publicFolder } from "../../auxiliaries/server";
import MailerService from "../../services/mailer";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
const router: express.Router = express.Router();

const userRepository = new UserRepository();

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
router.get("/info/all", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const usersDB = await userRepository.getAll();
		if (usersDB) res.send(usersDB);
		else next({ message: "Users not found", status: 404 });
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/user/send-activation-email/:id:
 *    post:
 *      summary: sends a send activation email
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: id of the user
 */
router.post("/send-activation-email/:id", UserValidator.sendActivationEmail, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userDB = await userRepository.getById(req.params.id);
		if (userDB) {
			userDB.setActivationCode();
			await userDB.save();
			MailerService.sendNewUserActivationMail(userDB);
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
 * /v1/admin/user/send-lost-password-email/:id:
 *    post:
 *      summary: sends a lost password email
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: id of the user
 */
router.post("/send-lost-password-email/:id", UserValidator.sendPasswordRemindEmail, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userDB = await userRepository.getById(req.params.id);
		if (userDB) {
			userDB.setActivationCode();
			await userDB.save();
			MailerService.sendResetPasswordMail(userDB);
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
 * /v1/admin/user/create:
 *    post:
 *      summary: Creates new user
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
 *        name: role
 *      - in: body
 *        name: removeProfileImageUrl
 *        description: if set true, removes the profile image
 *      - in: formData
 *        name: profileImageUrl
 *        type: file
 *        description: The file of the profile image
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          401:
 *              description: You don't have the permission due to your user role
 */
router.post("/create", UserValidator.createUserByAdmin, async (req: Request, res: Response, next: NextFunction) => {
	const sendActivationEmail = req.body.sendActivationEmail;
	const user = req.body;
	delete user.sendActivationEmail;
	if (!canAdminActOnUser(req.user, user)) next({ message: "You don't have the permission due to your user role", status: 401 });
	else {
		try {
			user.email = user.email.trim();
			const isIn = await UserService.isUserRegistrated(user.email);
			if (isIn !== false) next(isIn);
			else {
				// ? Set new image
				if (req.files?.profileImageUrl) user.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl as UploadedFile);
				let userInDB = await userRepository.createUser(user, sendActivationEmail);
				if (sendActivationEmail == true) MailerService.sendNewUserActivationMail(userInDB);
				res.status(201).send(userInDB);
			}
		} catch (e) {
			next(e);
		}
	}
});

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
router.get("/info/:id", UserValidator.getUserById, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userDB = await userRepository.getById(req.params.id);
		if (userDB) res.send(userDB);
		else next({ message: "User not found", status: 404 });
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
 *        name: role
 *      - in: body
 *        name: removeProfileImageUrl
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
router.put("/edit", UserValidator.editUserByAdmin, async (req: Request, res: Response, next: NextFunction) => {
	const newData = req.body;
	if (newData.email) newData.email = newData.email.trim();
	try {
		const userDB = await userRepository.getById(newData.id);
		if (userDB) {
			if (!canAdminActOnUser(req.user, userDB)) next({ message: "You don't have the permission due to your user role", status: 401 });
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
					newData.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl as UploadedFile);
				}
				const newUser = await userRepository.update(userDB.id, newData);
				res.send(newUser);
			}
		} else next({ message: "User not found", status: 404 });
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/user/impersonificate/:id:
 *    post:
 *      summary: impersonificate user
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          404:
 *            description: User not found
 *          401:
 *            description: You don't have the permission due to your user role
 */
router.post("/impersonificate/:id", UserValidator.impersonificate, async (req: Request, res: Response, next: NextFunction) => {
	try {
		// ? Get user
		const userDB = await userRepository.getById(req.params.id);
		if (userDB) {
			if (!canAdminActOnUser(req.user, userDB)) next({ message: "You don't have the permission due to your user role", status: 401 });
			else {
				let refreshToken;
				if (!userDB.refreshToken) {
					const refreshToken = UserService.generateRefreshToken(userDB.id);
					userDB.refreshToken = refreshToken;
					await userDB.save();
				} else refreshToken = userDB.refreshToken;
				const accessToken = UserService.generateAccessToken(userDB.id);

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
					user: userDB,
				});
			}
		} else next({ message: "User not found", status: 404 });
	} catch (e) {
		next(e);
	}
});

export default router;
