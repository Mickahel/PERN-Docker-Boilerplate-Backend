const router = require("express").Router();
const PushNotificationService = require("../../services/pushNotification");
const PushNotificationValidator = require("../../validators/pushNotification");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { publicFolder } = require("../../auxiliaries/server");
const sharp = require("sharp")
// TODO SWAGGER
router.post('/sendNotification', PushNotificationValidator.sendPushNotification, async (req, res, next) => {
    const { title, body, clickAction } = req.body
    const { image } = req.files
    let ids = typeof req.body.ids == "string" ? [req.body.ids] : req.body.ids

    ids = ids.map(id => { return { id: id } })

    let notificationImagePath
    if (image) {
        const notificationImageName = uuid() + "." + image.name.split(".")[image.name.split(".").length - 1];
        notificationImagePath = publicFolder + "uploads/pushNotificationImages/" + notificationImageName
        sharp(image.data).toFile(notificationImagePath, (err, info) => { if (err) throw err })
    }
    const result = await PushNotificationService.sendNotification(ids, title, body, null, notificationImagePath, { click_action: clickAction })
    if (image) {
        fs.unlink(notificationImagePath, (err) => {
            if (err) throw err;
        });
    }
    res.send(result)
})

module.exports = router;