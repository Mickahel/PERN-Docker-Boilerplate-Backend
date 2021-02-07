import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const PushNotificationValidator = {
	setPushNotificationUserToken: (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.params;
		const schema = {
			type: "string",
		};
		const valid = ajv.validate(schema, token);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	sendPushNotification: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "object",
			properties: {
				ids: {
					type: ["string", "array"],
					items: { type: "string" },
				},
				title: { type: "string" },
				body: { type: "string" },
				clickAction: { type: "string" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, req.body);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default PushNotificationValidator;
