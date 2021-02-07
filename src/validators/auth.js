const ajv = require("./AJVInstance")

class AuthValidator {
  signup(req, res, next): void {
    const { body: user } = req;
    const schema = {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, user);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  login(req, res, next): void {
    const { body: user } = req;
    const schema = {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, user);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  activation(req, res, next): void {
    const { activationCode } = req.params;
    const schema = {
      type: "string",
      format: "uuid",
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, activationCode);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  lostPasswordMail(req, res, next): void {
    const { email } = req.body;
    const schema = {
      type: "string",
      format: "email",
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, email);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  passwordReset(req, res, next): void {
    const data = req.body;
    const schema = {
      type: "object",
      required: ["activationCode", "password"],
      properties: {
        activationCode: { type: "string", format: "uuid" },
        password: { type: "string", minLength: 8 },
      },
      additionalProperties: false,
    };
    const valid = ajv.validate(schema, data);
    if (valid) next();
    else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
  }

  /*token(req, res, next) {
        const { token } = req.params
        const schema = {
            type: "string",
            additionalProperties: false
        }
        const valid = ajv.validate(schema, token);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }*/
}

module.exports = new AuthValidator();
