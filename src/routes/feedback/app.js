const router = require("express").Router();
const { v4: uuid } = require("uuid");
const { publicFolder } = require("../../auxiliaries/server");
/**
 * @swagger
 * /v1/app/feedback/sendNew:
 *    post:
 *      summary: sends a new feedback
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthBasic: []
 */
router.post("/sendNew", (req, res, next) => {
  // ? Set new feedback
  if (req.files?.screenshot) {
    try {
      let extension =
        "." +
        req.files.screenshot.name.split(".")[
          req.files.screenshot.name.split(".").length - 1
        ];
      screenshotName = uuid() + extension;
      console.log(screenshotName);
      req.files.screenshot.mv(
        publicFolder + "uploads/feedbacks/" + screenshotName,
        function (err) {
          if (err) throw err;
        }
      );
      res.send("ok");
    } catch (e) {
      next(e);
    }
  }
});

module.exports = router;
