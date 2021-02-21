import express, { Response, Request, NextFunction } from "express";
import { ILogs, ISingleLogFile } from "../interfacesAndTypes/log";
import fs from "fs";
import LogValidator from "../validators/log";
import _ from "lodash";

const router: express.Router = express.Router();

/**
 * @swagger
 * /v1/admin/logs/all:
 *    get:
 *      summary: gets all the logs
 *      tags: [Logs]
 *      security:
 *        - cookieAuthAdmin: []
 *      parameters:
 *        - in: body
 *          name: startDate
 *          description: timestamp of the start date
 *        - in: body
 *          name: endDate
 *          description: timestamp of the start date
 */
router.get("/", LogValidator.getLogs, async (req: Request, res: Response, next: NextFunction) => {
	if (fs.existsSync(`../.${process.env.LOG_DIRECTORY}/audit.json`)) {
		const logsAudit = require(`../.${process.env.LOG_DIRECTORY}/audit.json`);

		let { endDate, startDate } = req.body;
		let logsJSON: ILogs = {
			keep: logsAudit.keep,
			logs: [],
		};
		if (!startDate) logsJSON.startDate = logsAudit.files[0].date;
		if (!endDate) logsJSON.endDate = logsAudit.files[logsAudit.files.length - 1].date;
		let addLogs = (file: ISingleLogFile) => {
			try {
				let logFile = fs.readFileSync(file.name, "utf8");
				const lines = logFile.split("\r\n");
				lines.forEach((line) => {
					if (!_.isEmpty(line)) logsJSON.logs.push(JSON.parse(line));
				});
			} catch (e) {
				return;
			}
		};
		try {
			logsAudit.files.map((file: ISingleLogFile) => {
				if ((startDate || endDate) && file.date <= endDate && file.date >= startDate) addLogs(file);
				else addLogs(file);
			});
			res.send(logsJSON);
		} catch (e) {
			next(e);
		}
	} else {
		res.send({
			endDate: req.body.endDate,
			startDate: req.body.startDate,
			logs: [],
			keep: undefined,
		});
	}
});

export default router;
