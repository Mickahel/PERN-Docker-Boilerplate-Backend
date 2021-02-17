import express, { Response, Request, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import { publicFolder } from "../../auxiliaries/server";
import FeedbackRepository from "../../repositories/feedback";
import UserRepository from "../../repositories/user";
import FeedbackValidator from "../../validators/feedback";
import MailerService from "../../services/mailer";
import { roles } from "../../enums";
const router: express.Router = express.Router();

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
			createdBy: req.user.id,
		};

		if (req.files?.screenshot) {
			let extension = "." + req.files.screenshot.name.split(".")[req.files.screenshot.name.split(".").length - 1];
			screenshotName = uuid() + extension;
			req.files.screenshot.mv(publicFolder + "uploads/feedbacks/" + screenshotName, (err) => {
				if (err) throw err;
			});
			feedbackData.screenshotUrl = "uploads/feedbacks/" + screenshotName;
		}
		const newFeedback = await FeedbackRepository.createFeedback(feedbackData);

		// ? Get Admins
		const adminUsers = await UserRepository.getUsersByRole(roles.getAdminRoles());
		// ? Send Emails to Admins
		MailerService.sendNewFeedbackMail(newFeedback, adminUsers);
		res.send(newFeedback);
	} catch (e) {
		next(e);
	}
});

export default router;
