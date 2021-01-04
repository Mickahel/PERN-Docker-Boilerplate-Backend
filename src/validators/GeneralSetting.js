const Ajv = require("ajv").default;
const ajv = new Ajv();

class GenralSettingsValidator {
  getGeneralSettingByFeature(req, res, next) {
    const feature = req.params.feature;
    const schema = {
      type: "string",
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, feature);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  createGeneralSetting(req, res, next) {
    const data = req.body;
    const schema = {
      type: "object",
      required: ["value", "feature"],
      properties: {
        feature: { type: "string" },
        value: { type: "string" },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, data);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  updateGeneralSetting(req, res, next) {
    const data = req.body;
    const schema = {
      type: "object",
      required: ["feature"],
      properties: {
        feature: { type: "string" },
        newFeatureName: { type: "string" },
        newValue: { type: "string" },
      },
      anyOf: [{ required: ["newFeatureName"] }, { required: ["newValue"] }],
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, data);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }
}

module.exports = new GenralSettingsValidator();
