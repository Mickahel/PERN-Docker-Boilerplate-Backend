const router = require('express').Router();
const UserValidator = require("../../validators/user")
const UserRepository = require("../../repositories/User");
const UserService = require("../../services/User")

/**
 * @swagger
 * /v1/admin/user/info/all:
 *    get:
 *      summary: get all users information
 *      tags: [User]
 *      security:
 *      - bearerAuthAdmin: []
 *      responses:
 *          404:
 *              description: User not found
*/
router.get('/info/all', async (req , res, next) => {
    try{
        const usersDB = await UserRepository.getUserList(true)
        if(usersDB){
            res.send(usersDB)
        }else{
            next({message:"Users not found", status: 404})
        }
    }catch(e){
        next(e)
    }
})

/**
 * @swagger
 * /v1/admin/user/create:
 *    post:
 *      summary: Creates new user
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: user
 *        description: user details. Email Required
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *              lastname:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              status:
 *                  type: string
 *              role:
 *                  type: string
 *      - in: body
 *        name: sendActivationEmail
 *        description: Send Activation Email
 *      security:
 *      - bearerAuthAdmin: []
 *      responses:
 *          409:
 *              description: User is registered
 *          406:
 *              description: User is not activated / User is disabled
*/
router.post('/create',UserValidator.createUserByAdmin, async (req , res, next) => {  //TODO ADD USER IMAGE
    let { user,sendActivationEmail } = req.body
    try {
      user.email = user.email.trim();
      const isIn = await UserService.isUserRegistrated(user.email);
      if (isIn) next(isIn)
      else {
        let userInDB = await UserRepository.createUser(user,sendActivationEmail)
        
        if(sendActivationEmail){} //sendNewUserActivationMail(userInDB) //userInDB.dataValues //TODO
        if(!user.password){} //sendNewUserSetPasswordMail(userInDB) //TODO
        res.status(201).send({ message: "ok" })
      }
    } catch (e) {
      next(e)
    }
})


/**
 * @swagger
 * /v1/admin/user/info/:id:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *      security:
 *          - bearerAuthAdmin: []
 *      responses:
 *        404:
 *          description: User not found
*/
router.get('/info/:id', UserValidator.getUserById, async (req , res, next) => {
    try{
        const userDB = await UserRepository.getUserById(req.params.id)
        if(userDB){
            res.send(userDB)
        }else{
            next({message:"User not found", status: 404})
        }
    }catch(e){
        next(e)
    }
})


/**
 * @swagger
 * /v1/admin/user/edit/:id:
 *    put:
 *      summary: Edit user info
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: firstname
 *        type: string
 *      - in: body   
 *        name: lastname
 *        type: string
 *      - in: body
 *        name: email
 *        type: string
 *      - in: body
 *        name: password
 *        type: string
 *      - in: body
 *        name: status
 *        type: string
 *      - in: body
 *        name: role
 *        type: string
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *      security:
 *      - bearerAuthAdmin: []
 *      responses:
 *          409:
 *              description: User is registered
 *          406:
 *              description: User is not activated / User is disabled
*/
router.put('/edit/:id',UserValidator.editUserByAdmin,  async (req , res, next) => {
    try{
        const userDB = await UserRepository.getUserById(req.params.id)
        if(userDB){
            const newUser = await UserRepository.updateUser(userDB,req.body)
            res.send({message:"ok"})
        }else{
            next({message:"User not found", status: 404})
        }
    }catch(e){
        next(e)
    }
})

module.exports = router;
