const router = require('express').Router();

/**
 * @swagger
 * /v1/debug/status/:status:
 *    get:
 *      summary: custom status code to test fetch in frontend
 *      security:
 *      tags: [Debug]
 */
router.get('/status/:status',   (req , res, next) => {

   res.status(req.params.status).send(req.params.status==500 ? {}: {
       status:req.params.status,
       data: "SomeData",
       nestedData: {
           anotherThing: "do",
       }
   })
    /* res.status(req.query.status).send({
        value: "hello"
      });*/
})

module.exports = router;
