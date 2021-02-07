const ajv = require("./AJVInstance")

class MiddlewareValidator {
  paginatedResults(req): void {
    const paginationData = req.query.data;
    let data;
    data.page = parseInt(paginationData.page);
    data.limit = parseInt(paginationData.limit);
    const schema = {
      type: "object",
      required: ["page", "limit"],
      properties: {
        page: { type: "number", minimum: 1 },
        limit: { type: "number", minimum: 1 },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, data);

    if (valid) return;
    else
      return { message: "Validation Error", errors: ajv.errors, status: 400 };
  }
}

module.exports = new MiddlewareValidator();
