const router = require('express').Router();
const authRequired = require('../middlewares/authRequired')
const {roles} = require("../../config")
/**
 * @swagger
 * /v1/server/healthcheck:
 *    get:
 *      summary: Healthcheck
 *      security:
 *          - bearerAuthSuperAdmin: []
 *      tags: [Server]
 */
router.get('/healthcheck',authRequired(roles.SUPERADMIN), (req, res, next) => {
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
 *          - bearerAuthSuperAdmin: []
 *      tags: [Server]
 */
router.delete("/kill-process",authRequired(roles.SUPERADMIN), (req, res, next) => {
  console.log("killing ", process.pid);
  res.send("killing " + process.pid);
  process.exit();
});

module.exports = router;
