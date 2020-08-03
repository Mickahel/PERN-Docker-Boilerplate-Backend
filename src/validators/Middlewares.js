const Ajv = require('ajv');
const ajv = new Ajv();

class MiddlewareValidator {

    paginatedResults(req) {
        let data = req.query

        data.page = parseInt(data.page)
        data.limit = parseInt(data.limit)
        let schema = {
            type: "object",
            required: ["page", "limit"],
            properties: {
                page: { type: "number", minimum:1},
                limit: { type: "number", minimum:1 }
            }
        }
        var valid = ajv.validate(schema, data);

        if (valid) return
        else return {message:"Validation Error", errors: ajv.errors, status: 400}
    }
}

module.exports = new MiddlewareValidator()