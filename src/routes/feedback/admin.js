const router = require("express").Router();
const { v4: uuid } = require("uuid");
const { publicFolder } = require("../../auxiliaries/server");
const FeedbackRepository = require("../../repositories/feedback");
const FeedbackValidator = require("../../validators/feedback");
const fs = require("fs");

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
 * /v1/admin/feedback/info/:id:
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
router.get("/info/:id", FeedbackValidator.getFeedbackById, async (req, res, next) => {
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

/**
 * @swagger
 * /v1/admin/feedback/edit:
 *    get:
 *      summary: edits feedback by id
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthAdmin: []
 *      parameters:
 *      - in: body
 *        name: id
 *        description: id of the feedback
 *        required: true
 *      - in: body
 *        name: type
 *        schema:
 *          type: string
 *          enum: [BUG, FEATURE]
 *      - in: body
 *        name: handled
 *        schema:
 *          type: boolean
 *      - in: body
 *        name: description
 *        description: description of the feedback
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.put("/edit", FeedbackValidator.editFeedback, async (req, res, next) => {
    try {
        const feedback = await FeedbackRepository.getFeedbackById(req.body.id);
        if (!feedback) next({ message: "Cannot find data", status: 404 });
        else {
            const newFeedback = await FeedbackRepository.editFeedback(feedback, req.body)
            res.send(newFeedback);
        }
    } catch (e) {
        next(e);
    }
})

/**
 * @swagger
 * /v1/admin/feedback/delete/:id:
 *    delete:
 *      summary: deletes feedback by id
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
router.delete("/delete/:id", FeedbackValidator.getFeedbackById, async (req, res, next) => {
    try {
        const result = await FeedbackRepository.getFeedbackById(req.params.id);
        if (!result) next({ message: "Cannot find data", status: 404 });
        else {
            fs.unlinkSync(publicFolder + result.screenshotUrl)
            await FeedbackRepository.deleteFeedback(req.params.id)
            res.status(204).send()
        }
    } catch (e) {
        next(e);
    }
})

module.exports = router;