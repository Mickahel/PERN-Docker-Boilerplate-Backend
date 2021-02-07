import express, { Response, Request, NextFunction } from "express";
import DebugValidator from "../validators/debug";
const router: express.Router = express.Router();
/**
 * @swagger
 * /v1/debug/status/:status:
 *    get:
 *      summary: custom status code to test fetch in frontend
 *      tags: [Debug - Enabled only in Development]
 *      parameters:
 *      - in: path
 *        name: status
 *        description: status code that has to return
 *        required: true
 *
 */
router.get("/status/:status", DebugValidator.status, (req: Request, res: Response, next: NextFunction) => {
	res.status(+req.params.status).send(
		+req.params.status == 500
			? {}
			: {
					status: req.params.status,
					data: "SomeData",
					nestedData: {
						bar: "foo",
					},
			  }
	);
});

export default router;
