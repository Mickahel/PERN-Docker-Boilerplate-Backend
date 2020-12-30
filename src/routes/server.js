const router = require("express").Router();
/**
 * @swagger
 * /v1/admin/server/healthcheck:
 *    get:
 *      summary: Healthcheck
 *      security:
 *          - cookieAuthAdmin: []
 *      tags: [Server]
 */
router.get("/healthcheck", (req, res, next) => {
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
  console.log("killing ", process.pid);
  res.send("killing " + process.pid);
  process.exit();
});
*/
module.exports = router;
