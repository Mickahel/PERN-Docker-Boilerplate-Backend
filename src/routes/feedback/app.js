const router = require("express").Router();
const { v4: uuid } = require("uuid");
const { publicFolder } = require("../../auxiliaries/server");
const FeedbackRepository = require("../../repositories/feedback");
const UserRepository = require("../../repositories/user");
const FeedbackValidator = require("../../validators/feedback");
const MailerService = require("../../services/Mailer")
const { roles } = require("../../../config");
/**
 * @swagger
 * /v1/app/feedback/create:
 *    post:
 *      summary: sends a new feedback
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: type
 *        schema:
 *          type: string
 *          enum: [BUG, FEATURE]
 *        required: true
 *      - in: body
 *        name: description
 *        description: description of the feedback
 *        required: true
 *      - in: formData
 *        name: screenshot
 *        type: file
 *        description: The file of the screenshot
 */
router.post("/create", FeedbackValidator.createFeedback, async (req, res, next) => {
  // ? Set new feedback
  try {
    let feedbackData = {
      ...req.body,
      createdBy: req.user.id
    }

    if (req.files?.screenshot) {
      let extension =
        "." +
        req.files.screenshot.name.split(".")[
        req.files.screenshot.name.split(".").length - 1
        ];
      screenshotName = uuid() + extension;
      req.files.screenshot.mv(
        publicFolder + "uploads/feedbacks/" + screenshotName,
        (err) => {
          if (err) throw err;
        }
      );
      feedbackData.screenshotUrl = "uploads/feedbacks/" + screenshotName
    }
    const newFeedback = await FeedbackRepository.createFeedback(feedbackData);

    // ? Get Admins
    const adminUsers = await UserRepository.getUsersByRole(roles.getAdminRoles())
    // ? Send Emails to Admins
    MailerService.sendNewFeedbackMail(newFeedback, adminUsers)
    res.send(newFeedback);
  } catch (e) {
    next(e);
  }
});


module.exports = router;
