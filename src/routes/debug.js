const router = require("express").Router();
const DebugValidator = require("../validators/debug");
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
router.get("/status/:status", DebugValidator.status, (req, res, next) => {
  res.status(req.params.status).send(
    req.params.status == 500
      ? {}
      : {
          status: req.params.status,
          data: "SomeData",
          nestedData: {
            anotherThing: "do",
          },
        }
  );
});

module.exports = router;
