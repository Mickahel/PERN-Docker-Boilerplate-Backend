const Ajv = require("ajv");
const ajv = new Ajv();

class AuthValidator {
  signup(req, res, next) {
    console.log(req.body)
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

  login(req, res, next) {
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

  activation(req, res, next) {
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

  lostPasswordMail(req, res, next) {
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

  passwordReset(req, res, next) {
    const data = req.body;
    //console.log(data);
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
