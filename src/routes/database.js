const router = require("express").Router();
const BaseRepository = require("../repositories/base")

/**
 * @swagger
 * /v1/admin/database/tables-size:
 *    get:
 *      summary: gets the size of each table   
 *      tags: [Database]
 *      security:
 *          - cookieAuthAdmin: []
 */
router.get("/tables-size", async (req, res, next) => {
    try {
        const Repository = new BaseRepository()
        const [results, metadata] = await Repository.getTablesSize()
        res.send(results)
    } catch (e) {
        next(e)
    }
})


module.exports = router;