const router = require('express').Router();
const authRequired = require('../middlewares/AuthMiddleware')
/**
 * @swagger
 * /v1/server/healthcheck:
 *    get:
 *      summary: Healthcheck
 *      security:
 *          - bearerAuthBasic: []
 *      tags: [Server]
 */
router.get('/healthcheck',authRequired("lol"), (req, res, next) => {
  res.send({
    pid: process.pid,
    uptime: Math.floor(process.uptime()) + " Seconds",
    timestamp: Date.now()
  });
})

/**
 * @swagger
 * /v1/server/kill-process:
 *    delete:
 *      summary: kills the process
 *      security:
 *          - bearerAuthAdmin: []
 *      tags: [Server]
 */
router.delete("/kill-process", (req, res, next) => {
  console.log("killing ", process.pid);
  res.send("killing " + process.pid);
  process.exit();
});

module.exports = router;
