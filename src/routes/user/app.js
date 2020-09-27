const router = require('express').Router();
const UserValidator = require("../../validators/User")
const UserRepository = require("../../repositories/User")
const passport = require('passport');
const { publicFolder } = require('../../auxiliaries/server')
const { v4: uuid } = require('uuid');
const fs = require('fs')
const Logger = require("../../services/Logger");
const logger = new Logger("User API", "#9F9A00");


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
 *      - in: body
 *        name: removeBackgroundImage
 *        description: if set true, removes the profile image
*/
router.put('/edit', UserValidator.editUser, async (req, res, next) => {
    const newData = req.body
    try {
        // ? Only Remove old image 
        if (newData.removeProfileImageUrl) {
            fs.unlink(publicFolder + 'uploads/profileImgs/' + req.user.profileImageUrl, (err) => {
                if (err) logger.error(err)
            })
            newData.profileImageUrl = null
        }
        else {
            // ? Set new image - Remove old image
            if (req.user?.profileImageUrl) {
                fs.unlink(publicFolder + 'uploads/profileImgs/' + req.user.profileImageUrl, (err) => {
                    if (err) logger.error(err)
                })

            }

            // ? Set new image
            if (req.files?.profileImageUrl) {
                let extension = "." + req.files.profileImageUrl.name.split(".")[req.files.profileImageUrl.name.split(".").length - 1]
                newData.profileImageUrl = uuid() + extension
                req.files.profileImageUrl.mv(publicFolder + '/uploads/profileImgs/' + newData.profileImageUrl, function (err) {
                    if (err) throw err
                })
                newData.profileImageUrl = '/uploads/profileImgs/' + newData.profileImageUrl
            }

        }
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
            await UserRepository.updateUser(req.user, { password: req.body.password })
            res.send({ message: "ok" })
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