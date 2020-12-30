const Ajv = require("ajv");
const ajv = new Ajv();
const { roles, statuses } = require("../../config");
class UserValidator {
  editUser(req, res, next) {
    const newData = {
      ...req.body,
      ...req.files
    };
    const schema = {
      type: "object",
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        email: { type: "string", format: "email" },
        language: { type: "string" },
        removeBackgroundImage: { enum: [true, false] },
        theme: { enum: ["light", "dark"] },
        profileImageUrl: { type: "object" }
      },
      additionalProperties: true,
    };
    const valid = ajv.validate(schema, newData);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  resetPassword(req, res, next) {
    const schema = {
      type: "object",
      properties: {
        currentPassword: { type: "string" },
        password: { type: "string" },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, req.body);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  editUserByAdmin(req, res, next) {
    const newData = req.body;
    const id = req.params;
    const schema = {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", format: "uuid" },
        firstnama: { type: "string" },
        lastname: { type: "string" },
        password: { type: "string" },
        email: { type: "string", format: "email" },
        language: { type: "string" },
        theme: { enum: ["light", "dark"] },
        status: { enum: statuses.names() },
        role: { enum: roles.names() },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, { ...newData, ...id });
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  getUserById(req, res, next) {
    const schema = {
      type: "string",
      format: "uuid",
      required: ["id"],
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, req.params.id);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  createUserByAdmin(req, res, next) {
    const schema = {
      type: "object",
      required: ["user"],
      properties: {
        user: {
          type: "object",
          required: ["email"],
          additionalProperties: false,
          properties: {
            firstname: { type: "string" },
            lastname: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            status: { enum: statuses.names() },
            role: { enum: roles.names() },
            language: { type: "string" },
            theme: { enum: ["light", "dark"] },
          },
        },
        sendActivationEmail: { type: "boolean" },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, req.body);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }
}

module.exports = new UserValidator();
