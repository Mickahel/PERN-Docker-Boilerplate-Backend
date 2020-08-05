const router = require('express').Router();
const UserValidator = require("../../validators/user")
const UserRepository = require("../../repositories/User")


/**
 * @swagger
 * /v1/app/user/info/all:
 *    get:
 *      summary: get all users information
 *      tags: [User]
 *        security:
 *          - bearerAuthAdmin: []
 *       responses:
 *        404:
 *          description: User not found
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

router.post('/create', (req , res, next) => { //TODO ALL

})


/**
 * @swagger
 * /v1/app/user/info:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *        security:
 *          - bearerAuthAdmin: []
 *       responses:
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



router.put('/edit/:id',UserValidator.editUserByAdmin,  (req , res, next) => { // TODO ALL

})

/**
 * @swagger
 * /v1/app/user/disable/:id:
 *    delete:
 *      summary: disables user
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *        security:
 *          - bearerAuthAdmin: []
 *       responses:
 *        404:
 *          description: User not found
*/
router.delete('/disable/:id',UserValidator.getUserById,  (req , res, next) => { //TODO API 

})

module.exports = router;
