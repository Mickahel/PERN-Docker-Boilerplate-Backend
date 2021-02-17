import express, { Response, Request, NextFunction } from "express";
const router: express.Router = express.Router();
/**
 * @swagger
 * /v1/admin/server/healthcheck:
 *    get:
 *      summary: Healthcheck
 *      security:
 *          - cookieAuthAdmin: []
 *      tags: [Server]
 */
router.get("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
	res.send({
		pid: process.pid,
		uptime: Math.floor(process.uptime()) + " Seconds",
		timestamp: Date.now(),
	});
});

/**
 * @swagger
 * /v1/admin/server/kill-process:
 *    delete:
 *      summary: kills the process
 *      security:
 *          - cookieAuthAdmin: []
 *      tags: [Server]
 */
/*router.delete("/kill-process", (req, res, next) => {
  res.send("killing " + process.pid);
  process.exit();
});
*/

export default router;
