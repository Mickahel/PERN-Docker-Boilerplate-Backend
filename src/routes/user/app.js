const router = require('express').Router();
const UserValidator = require("../../validators/User")
const UserRepository = require("../../repositories/User")
const passport = require('passport');
/**
 * @swagger
 * /v1/app/user/info:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
*/
router.get('/info', (req, res, next) => {
    res.send(req.user)
})

/**
 * @swagger
 * /v1/app/user/edit:
 *    put:
 *      summary: edit user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
 *        description: new firstname
 *      - in: body
 *        name: lastname
 *        description: new lastname
*/
router.put('/edit', UserValidator.editUser, async (req, res, next) => { //TODO ADD IMAGE UPLOAD
    const newData = req.body
    try {
        const newUser = await UserRepository.updateUser(req.user, newData)
        res.send(newUser)
    }
    catch (e) {
        next(e)
    }
})

/**
 * @swagger
 * /v1/app/user/reset-password:
 *    put:
 *      summary: reset password
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
*/
router.put('/reset-password', UserValidator.resetPassword, async (req, res, next) => {
    try {
        if (req.user.validatePassword(req.body.currentPassword)) {
            await UserRepository.updateUser(req.user,{password: req.body.password})           
            res.send({message:"ok"})
        }
        else {
            next({ message: "Current Password is Wrong", status: 401 })
        }
    }
    catch (e) {
        next(e)
    }
})



module.exports = router;