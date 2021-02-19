import express, { Response, Request, NextFunction } from "express";
import UserValidator from "../../validators/user";
import UserRepository from "../../repositories/user";
import { publicFolder } from "../../auxiliaries/server";
import fs from "fs";
import Logger from "../../services/logger";
const logger = new Logger("User API", "#9F9A00");
import UserService from "../../services/user";
import { roles } from "../../enums";
import { UploadedFile } from "express-fileupload";
import { statuses } from "../../enums";
const router: express.Router = express.Router();

const userRepository = new UserRepository();
/**
 * @swagger
 * /v1/app/user/info:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 */
router.get("/info", (req: Request, res: Response, next: NextFunction) => {
	const user: any = req.user;

	if (roles.getRoleByName(user.role)?.isAdmin === false) {
		delete user.role;
		delete user.status;
	}
	res.send(user);
});

/**
 * @swagger
 * /v1/app/user/edit:
 *    put:
 *      summary: edit user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
 *        description: new firstname
 *      - in: body
 *        name: lastname
 *        description: new lastname
 *      - in: body
 *        name: removeProfileImageUrl
 *        description: if set true, removes the profile image
 *      - in: formData
 *        name: profileImageUrl
 *        type: file
 *        description: The file of the profile image
 */
router.put("/edit", async (req: Request, res: Response, next: NextFunction) => {
	const newData = req.body;
	try {
		// ? Only Remove old image
		if (Boolean(newData.removeProfileImageUrl) == true) {
			fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
				if (err) throw err;
			});
			newData.profileImageUrl = null;
		} else {
			// ? Set new image - Remove old image
			if (req.user?.profileImageUrl) {
				fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
					if (err) throw err;
				});
			}
			if (req.files?.profileImageUrl) newData.profileImageUrl = UserService.uploadProfileImage(req.files.profileImageUrl as UploadedFile);
		}
		delete newData.removeProfileImageUrl;
		const newUser = await userRepository.update(req.user.id, newData);
		res.send(newUser);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/app/user/reset-password:
 *    put:
 *      summary: reset password
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
 */
router.put("/reset-password", UserValidator.resetPassword, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user.validatePassword(req.body.currentPassword)) {
			req.user.setPassword(req.body.password);
			await req.user.save();
			res.send({ message: "ok" });
		} else {
			next({ message: "Current Password is Wrong", status: 401 });
		}
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/app/user/disable:
 *    delete:
 *      summary: Disable user
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: email
 *        description: email
 *      security:
 *          - cookieAuthBasic: []
 *      responses:
 *        401:
 *          description: Password is wrong
 */
router.delete("/disable", async (req: Request, res: Response, next: NextFunction) => {
	// ? Check password
	if (req.user.validatePassword(req.body.password)) {
		req.user.status = statuses.values().DISABLED;
		await req.user.save();
		res.status(204).send();
	} else next({ message: "Password is wrong", status: 401 });
});

export default router;
