import express, { Response, Request, NextFunction } from "express";
import PushNotificationService from "../../services/pushNotification";
import PushNotificationValidator from "../../validators/pushNotification";
import { v4 as uuid } from "uuid";
import { publicFolder } from "../../auxiliaries/server";
import sharp from "sharp";
import { UploadedFile } from "express-fileupload";
const router: express.Router = express.Router();
const pushNotificationService = new PushNotificationService();
/**
 * @swagger
 * /v1/admin/pushNotification/sendNotification:
 *    post:
 *      summary: sends a push notification to users
 *      tags: [Push Notification]
 *      parameters:
 *      - in: body
 *        name: ids
 *        type: array
 *        description: ids of the users
 *      - in: body
 *        name: title
 *        description: title
 *      - in: body
 *        name: description
 *        description: description of the notification
 *      - in: body
 *        name: clickAction
 *        description: clickAction parameter
 *      - in: formData
 *        name: image
 *        type: file
 *        description: image to show
 *      security:
 *      - cookieAuthAdmin: []
 */
router.post("/sendNotification", PushNotificationValidator.sendPushNotification, async (req: Request, res: Response, next: NextFunction) => {
	const { title, body, clickAction } = req.body;
	let ids = typeof req.body.ids == "string" ? [req.body.ids] : req.body.ids;
	ids = ids.map((id: string) => {
		return { id: id };
	});
	let notificationImagePath;
	let notificationImageName;
	let notificationImageLink;
	if (req?.files?.image) {
		const image = req.files.image as UploadedFile;
		notificationImageName = uuid() + "." + image.name.split(".")[image.name.split(".").length - 1];
		notificationImagePath = publicFolder + "uploads/pushNotificationImages/" + notificationImageName;
		sharp(image.data).toFile(notificationImagePath, (err, info) => {
			if (err) throw err;
		});
		notificationImageLink = process.env.BACKEND_URL + "/public/uploads/pushNotificationImages/" + notificationImageName;
	}
	const result = await pushNotificationService.sendNotification(ids, title, body, undefined, notificationImageLink, { click_action: clickAction || undefined });
	res.send(result);
});

export default router;
