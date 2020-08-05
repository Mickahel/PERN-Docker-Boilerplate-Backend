const Ajv = require('ajv');
const ajv = new Ajv();

class UserValidator {

    editUser(req,res,next){
        const newData = req.body
        const schema  = {
            type:"object",
            properties: {
                firstnama:{type:"string"},
                lastname:{type:"string"},
                email:{type:"string", format: "email"}
            },
            additionalProperties: false
        }
        const valid = ajv.validate(schema, newData);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

    editUserByAdmin(req,res,next){
        const newData = req.body
        const schema  = {
            type:"object",
            properties: {
                firstnama:{type:"string"},
                lastname:{type:"string"},
                email:{type:"string", format: "email"}
            },
            additionalProperties: false
        }
        const valid = ajv.validate(schema, newData);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }



}

module.exports = new UserValidator()