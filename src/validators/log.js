const ajv = require("./AJVInstance")

class LogValidator {
    getLogs(req, res, next): void {
        const newData = req.body;
        const schema = {
            type: "object",
            properties: {
                startDate: { type: "string" },
                endDate: { type: "string" },
                additionalProperties: true,
            }
        }
        const valid = ajv.validate(schema, newData);
        if (valid) next();
        else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
    }
}

module.exports = new LogValidator();
