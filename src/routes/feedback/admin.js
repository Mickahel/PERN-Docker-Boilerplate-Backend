const router = require("express").Router();
const { v4: uuid } = require("uuid");
const { publicFolder } = require("../../auxiliaries/server");
const FeedbackRepository = require("../../repositories/feedback");
const FeedbackValidator = require("../../validators/feedback");


/**
 * @swagger
 * /v1/admin/feedback/all:
 *    get:
 *      summary: Gets all feedbacks
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthAdmin: []
 */
router.get("/all", async (req, res, next) => {
    const feedbacks = await FeedbackRepository.getAll()
    res.send(feedbacks)
})



/**
 * @swagger
 * /v1/admin/feedback/:id:
 *    get:
 *      summary: Gets feedback by id
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthAdmin: []
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the feedback
 *        required: true
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.get("/:id", FeedbackValidator.getFeedbackById, async (req, res, next) => {
    try {

        const result = await FeedbackRepository.getFeedbackById(
            req.params.id
        );
        if (!result) next({ message: "Cannot find data", status: 404 });
        else res.send(result);
    } catch (e) {
        next(e);
    }
})

router.put("/edit", (req, res, next) => {

})

router.delete("/:id", (req, res, next) => {

})

module.exports = router;