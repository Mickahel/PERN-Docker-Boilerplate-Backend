const ajv = require("./AJVInstance")

class PushNotificationValidator {

    setPushNotificationUserToken(req, res, next): void {
        const { token } = req.params
        const schema = {
            type: "string",
        };
        const valid = ajv.validate(schema, token);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }

    sendPushNotification(req, res, next): void {
        const schema = {
            type: "object",
            properties: {
                ids: {
                    type: ["string", "array"],
                    items: { type: "string" }
                },
                title: { type: "string" },
                body: { type: "string" },
                clickAction: { type: "string" },
            },
            additionalProperties: false
        }
        const valid = ajv.validate(schema, req.body);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }
}

module.exports = new PushNotificationValidator();

