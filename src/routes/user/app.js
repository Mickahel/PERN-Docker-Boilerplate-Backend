const router = require('express').Router();
const UserValidator = require("../../validators/User")
const UserReposiory = require("../../repositories/User")
/**
 * @swagger
 * /v1/app/user/info:
 *    get:
 *      summary: get user information
 *      tags: [User]
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
        const newUser = await UserReposiory.updateUser(req.user, newData)
        res.send(newUser)
    }
    catch (e) {
        next(e)
    }
})


module.exports = router;
