const router = require('express').Router()
const GeneralSettingsRepository = require('../repositories/GeneralSetting')

/**
 * @swagger
 * /api/v1/general-settings:
 *    get:
 *      description: Gets all the general settings
 *      tags: [General-settings]
 */
router.get('/', async (req, res, next) => {
    try{
        const result = await GeneralSettingsRepository.getList()
        res.send(result)
    }catch(e){
        logger.error(e)
        next(e)
    }
})

/**
 * @swagger
 * /api/v1/general-settings/:feature:
 *    get:
 *      description: Gets single general setting
 *      tags: [General-settings]
 */
router.get('/:feature', async (req, res, next) => {
    try{
        const result = await GeneralSettingsRepository.getByFeature(req.params.feature)
        if(!result){
            next({message: "Cannot find data"})
            return;
        }
        res.send(result.value)
    }catch(e){
        logger.error(e)
        next(e)
    }
})

router.put('/', async (req, res, next) => {
    const {feature, value} = req.body
})

router.delete('/:feature', async (req, res, next) => {

})

module.exports = router