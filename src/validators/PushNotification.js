const Ajv = require("ajv");
const ajv = new Ajv();

class PushNotificationValidator {

    setPushNotificationUserToken(req, res, next) {
        const { token } = req.params
        const schema = {
            type: "string",
            additionalProperties: false,
        };
        const valid = ajv.validate(schema, token);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }

}

module.exports = new PushNotificationValidator();

