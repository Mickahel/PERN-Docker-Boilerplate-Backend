const router = require("express").Router();
//const PushNotificationValidator = require("../validators/log");
const PushNotificationUserTokenRepository = require("../repositories/pushNotificationUserToken");
const PushNotificationService = require("../services/pushNotification");
const PushNotificationValidator = require("../validators/pushNotification");


/**
 * @swagger
 * /v1/app/pushNotification/:token:
 *    post:
 *      summary: Registers firebase token
 *      tags: [Push Notification]
 *      parameters:
 *      - in: path
 *        name: token
 *        description: user token from firebase
 *        required: true
 *      security:
 *          - cookieAuthBasic: []
 */
router.post('/:token', PushNotificationValidator.setPushNotificationUserToken, async (req, res, next) => {
    try {
        let ut = {
            token: req.params.token,
            userId: req.user.id
        }
        const result = await PushNotificationUserTokenRepository.registerUserToken(ut)
        res.send(result)
    } catch (err) {
        next(err)
    }
})

/*
router.post('/send/:id', async (req, res, next) => {
    let result = await PushNotificationService.sendNotification(
        [
            { id: "a011ad04-d426-4506-bff1-f3b32d8c6536" },
            { id: "45929340-0753-4051-ae9a-028bacabcab1" }
        ]
        , "titolo", "body", null, null, { click_action: "/account/profile" })
    //let result = await PushNotificationService.sendNotification(req.params.id, "titolo", "sottotitolo", "body", "url che urla")
    res.send(result)
})
*/
module.exports = router;