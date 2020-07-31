const Ajv = require('ajv');
const ajv = new Ajv({allErrors:true, format:'fast'});

const AuthValidator = class AuthValidator {

    signup(req,res,next) {
        let { body: user } = req
        let schema ={
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string" },
              password: { type: "string", minLength:8 }
            }
        }
        var valid = ajv.validate(schema, user);
        if (!valid) res.status(400).send(ajv.errors)
        else next()
    }


    login(req,res,next) {

    }

    lostPasswordMail(req,res,next) {

    }

    passwordReset(req,res,next) {

    }

    activation(req,res,next) {

    }

}

module.exports = new AuthValidator()