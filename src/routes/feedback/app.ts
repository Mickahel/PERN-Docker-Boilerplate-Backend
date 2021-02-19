import express, { Response, Request, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import { publicFolder } from "../../auxiliaries/server";
import FeedbackRepository from "../../repositories/feedback";
import UserRepository from "../../repositories/user";
import FeedbackValidator from "../../validators/feedback";
import MailerService from "../../services/mailer";
import { roles } from "../../enums";
import { UploadedFile } from "express-fileupload";
const router: express.Router = express.Router();
const feedbackRepository = new FeedbackRepository();
const userRepository = new UserRepository();

/**
 * @swagger
 * /v1/app/feedback/create:
 *    post:
 *      summary: sends a new feedback
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: type
 *        schema:
 *          type: string
 *          enum: [BUG, FEATURE]
 *        required: true
 *      - in: body
 *        name: description
 *        description: description of the feedback
 *        required: true
 *      - in: body
 *        name: createdBy
 *        description: id of the user who created the feedback
 *        required: true
 *      - in: formData
 *        name: screenshot
 *        type: file
 *        description: The file of the screenshot
 */
router.post("/create", FeedbackValidator.createFeedback, async (req: Request, res: Response, next: NextFunction) => {
	// ? Set new feedback
	try {
		let feedbackData = {
			...req.body,
			user: req.user,
		};
		let screenshotFile: UploadedFile = req.files?.screenshot as UploadedFile;
		if (screenshotFile) {
			let extension = "." + screenshotFile.name.split(".")[screenshotFile.name.split(".").length - 1];
			let screenshotName = uuid() + extension;
			screenshotFile.mv(publicFolder + "uploads/feedbacks/" + screenshotName, (err) => {
				if (err) throw err;
			});
			feedbackData.screenshotUrl = "uploads/feedbacks/" + screenshotName;
		}
		const newFeedback = await feedbackRepository.create(feedbackData);

		// ? Get Admins
		const adminUsers = await userRepository.getUsersByRole(roles.getAdminRoles());
		// ? Send Emails to Admins
		if (adminUsers.length > 0) MailerService.sendNewFeedbackMail(newFeedback, adminUsers);
		res.send(newFeedback);
	} catch (e) {
		next(e);
	}
});

export default router;
