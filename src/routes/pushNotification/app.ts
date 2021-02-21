import express, { Response, Request, NextFunction } from "express";
import PushNotificationUserTokenRepository from "../../repositories/pushNotificationUserToken";
import PushNotificationValidator from "../../validators/pushNotification";
const router: express.Router = express.Router();
const pushNotificationUserTokenRepository = new PushNotificationUserTokenRepository();
/**
 * @swagger
 * /v1/app/pushNotification/:token:
 *    post:
 *      summary: Registers firebase token
 *      tags: [Push Notification]
 *      parameters:
 *      - in: path
 *        name: token
 *        description: user token from firebase
 *        required: true
 *      security:
 *          - cookieAuthBasic: []
 */
router.post("/registerToken/:token", PushNotificationValidator.setPushNotificationUserToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		let ut = {
			token: req.params.token,
			user: req.user,
		};

		const result = await pushNotificationUserTokenRepository.create(ut);
		res.send(result);
	} catch (err) {
		next(err);
	}
});

export default router;
