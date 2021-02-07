const ajv = require("./AJVInstance")
class FeedbackValidator {

    createFeedback(req, res, next): void {
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
                path: { type: "string" },
                screenshot: { type: "object" },
                createdBy: {
                    type: "string", format: "uuid"
                }
            },
            additionalProperties: false,
        };
        const valid = ajv.validate(schema, data);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }

    getFeedbackById(req, res, next): void {
        const feature = req.params.id;
        const schema = {
            type: "string",
            format: "uuid",
        };
        const valid = ajv.validate(schema, feature);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }

    editFeedback(req, res, next): void {
        const data = req.body

        const schema = {
            type: "object",
            required: ["id"],
            properties: {
                id: { type: "string", format: "uuid" },
                type: { enum: ["BUG", "FEATURE"] },
                description: { type: "string" },
                handled: { type: "boolean" },

            },
            additionalProperties: false,
        };
        const valid = ajv.validate(schema, data);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }
}

module.exports = new FeedbackValidator();

