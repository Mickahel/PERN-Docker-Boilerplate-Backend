import express, { Response, Request, NextFunction } from "express";
import { publicFolder } from "../../auxiliaries/server";
import FeedbackRepository from "../../repositories/feedback";
import FeedbackValidator from "../../validators/feedback";
import fs from "fs";
const router: express.Router = express.Router();
const feedbackRepository = new FeedbackRepository();
/**
 * @swagger
 * /v1/admin/feedback/all:
 *    get:
 *      summary: Gets all feedbacks
 *      tags: [Feedback]
 *      security:
 *          - cookieAuthAdmin: []
 */
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
	const feedbacks = await feedbackRepository.getAll({
		relations: ["user"],
	});
	res.send(feedbacks);
});

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
router.get("/info/:id", FeedbackValidator.getFeedbackById, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await feedbackRepository.getById(req.params.id);
		if (!result) next({ message: "Cannot find data", status: 404 });
		else res.send(result);
	} catch (e) {
		next(e);
	}
});

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
router.put("/edit", FeedbackValidator.editFeedback, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const feedback = await feedbackRepository.getById(req.body.id);
		if (!feedback) next({ message: "Cannot find data", status: 404 });
		else {
			const newFeedback = await feedbackRepository.update(feedback.id, req.body);
			res.send(newFeedback);
		}
	} catch (e) {
		next(e);
	}
});

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
router.delete("/delete/:id", FeedbackValidator.getFeedbackById, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await feedbackRepository.getById(req.params.id);
		if (!result) next({ message: "Cannot find data", status: 404 });
		else {
			await feedbackRepository.deletePhysical(req.params.id);
			fs.unlinkSync(publicFolder + result.screenshotUrl);
			res.status(204).send();
		}
	} catch (e) {
		next(e);
	}
});

export default router;
