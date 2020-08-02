const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const AuthValidator = class AuthValidator {

    signup(req, res, next) {
        let { body: user } = req
        let schema = {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string" },
                password: { type: "string", minLength: 8 }
            }
        }
        var valid = ajv.validate(schema, user);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }


    login(req, res, next) {
        let { body: user } = req
        let schema = {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" }
            }
        }
        var valid = ajv.validate(schema, user);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }

    activation(req, res, next) {
        const { activationCode } = req.params
        let schema = {
            type: "string",
            format: "uuid",
        }
        var valid = ajv.validate(schema, activationCode);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }

    lostPasswordMail(req, res, next) {
        const { activationCode } = req.params
        let schema = {
            type: "string",
            format: "uuid",
        }
        var valid = ajv.validate(schema, activationCode);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }

    passwordReset(req, res, next) {
        const { activationCode, password } = req.body
        let schema = {
            type: "object",
            required: ["activationCode", "password"],
            properties: {
                activationCode: { type: "string", format: "uuid"},
                password: { type: "string", minLength: 8 }
            }
        }
        var valid = ajv.validate(schema, email);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }

    token(req, res, next) {
        const { token } = req.params
        let schema = {
            type: "string",
        }
        var valid = ajv.validate(schema, token);
        if (valid) next()
        else res.status(400).send(ajv.errors)
    }

}

module.exports = new AuthValidator()