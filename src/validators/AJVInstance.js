const Ajv = require("ajv").default;
const ajv = new Ajv({
    coerceTypes: true,
    allowUnionTypes: true
});
require("ajv-formats")(ajv)


module.exports = ajv