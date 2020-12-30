const Ajv = require("ajv");
const ajv = new Ajv();

class FeedbackValidator {

    createFeedback(req, res, next) {
        const data = {
            ...req.body,
            ...req.files
        };
        const schema = {
            type: "object",
            required: ["type", "description"],
            properties: {
                type: { enum: ["BUG", "FEATURE"] },
                description: { type: "string" },
                screenshot: { type: "object" }
            },
            additionalProperties: false,
        };
        const valid = ajv.validate(schema, data);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }

    getFeedbackById(req, res, next) {
        const feature = req.params.id;
        const schema = {
            type: "string",
            additionalProperties: false,
        };
        const valid = ajv.validate(schema, feature);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }
}

module.exports = new FeedbackValidator();

