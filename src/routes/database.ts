import express, { Response, Request, NextFunction } from "express";
import DatabaseRepository from "../repositories/database";
const router: express.Router = express.Router();

const databaseRepository = new DatabaseRepository();

/**
 * @swagger
 * /v1/admin/database/tables-size:
 *    get:
 *      summary: gets the size of each table
 *      tags: [Database]
 *      security:
 *          - cookieAuthAdmin: []
 */
router.get("/tables-size", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await databaseRepository.getTablesSizes();
		res.send(result);
	} catch (e) {
		next(e);
	}
});

export default router;
