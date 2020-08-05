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
                email:{type:"string",   format: "email"},
                status:{type:"string"},
                role:{type:"string"}
            },
            additionalProperties: false
        }
        const valid = ajv.validate(schema, newData);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }

    getUserById(req,res,next){
        const schema  = {
            type:"string",
            format:"uuid",
            required: ["id"],
            additionalProperties: false
        }
        const valid = ajv.validate(schema, req.params.id);
        if (valid) next()
        else next({message:"Validation Error", errors: ajv.errors, status: 400})
    }


}

module.exports = new UserValidator()