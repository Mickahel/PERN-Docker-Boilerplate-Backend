const Ajv = require("ajv").default;
const ajv = new Ajv();
require("ajv-formats")(ajv)
class DebugValidator {
  status(req, res, next) {
    const status = req.params.status;
    status = parseInt(status);
    const schema = {
      type: "integer",
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, status);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }
}

module.exports = new DebugValidator();