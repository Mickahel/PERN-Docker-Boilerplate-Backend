const router = require('express').Router();

/**
 * @swagger
 * /healthcheck:
 *    get:
 *      summary: Healthcheck
 *      security:
 *          - bearerAuth: []
 *      tags: [Server]
 */
router.get('/healthcheck',   (req , res, next) => {
    res.send({
        pid: process.pid,
        uptime: Math.floor(process.uptime())+ " Seconds",
        timestamp: Date.now()
      });
})

/**
 * @swagger
 * /killProcess:
 *    get:
 *      summary: kills the process
 *      security:
 *          - basicAuth: []
 *      tags: [Server]
 */
router.get("/killProcess", (req, res, next) => {
    console.log("killing ", process.pid);
    res.send("killing " + process.pid);
    process.exit();
  });

module.exports = router;
