const router = require("express").Router();
const logsAudit = require(`../.${process.env.LOG_DIRECTORY}/audit.json`)
const fs = require('fs');
const LogValidator = require("../validators/log");
const _ = require("lodash");


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
router.get("/", LogValidator.getLogs, async (req, res, next) => {
  let { endDate, startDate } = req.body
  let logsJSON = {
    keep: logsAudit.keep,
    logs: []
  }
  if (!startDate) logsJSON.startDate = logsAudit.files[0].date
  if (!endDate) logsJSON.endDate = logsAudit.files[logsAudit.files.length - 1].date
  let addLogs = (file) => {
    try {
      let logFile = fs.readFileSync(file.name, 'utf8')
      const lines = logFile.split('\r\n');
      lines.forEach(line => { if (!_.isEmpty(line)) logsJSON.logs.push(JSON.parse(line)) });
    } catch (e) { return }
  }
  try {
    logsAudit.files.map(file => {
      if ((startDate || endDate) && file.date <= endDate && file.date >= startDate) addLogs(file)
      else addLogs(file)
    })
    res.send(logsJSON)
  } catch (e) {
    console.log(e)
    next(e)
  }


});

module.exports = router;