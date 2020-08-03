const Ajv = require('ajv');
const ajv = new Ajv();

class AuthValidator {

    signup(req, res, next) {
        let { body: user } = req
        let schema = {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email"},
                password: { type: "string", minLength: 8 }
            }
        }
        var valid = ajv.validate(schema, user);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
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
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

    activation(req, res, next) {
        const { activationCode } = req.params
        let schema = {
            type: "string",
            format: "uuid",
        }
        var valid = ajv.validate(schema, activationCode);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

    lostPasswordMail(req, res, next) {
        const { activationCode } = req.params
        let schema = {
            type: "string",
            format: "uuid",
        }
        var valid = ajv.validate(schema, activationCode);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
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
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

    token(req, res, next) {
        const { token } = req.params
        let schema = {
            type: "string",
        }
        var valid = ajv.validate(schema, token);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

}

module.exports = new AuthValidator()