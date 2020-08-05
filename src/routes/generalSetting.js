const router = require('express').Router()
const GeneralSettingsRepository = require('../repositories/GeneralSetting')
const GeneralSettingsValidator = require("../validators/GeneralSettings")
const authRequired = require('../middlewares/authRequired')
const {roles} = require("../../config")

/**
 * @swagger
 * /v1/general-settings:
 *    get:
 *      summary: Gets all the general settings
 *      tags: [General Settings]
*/
router.get('/',authRequired(roles.SUPERADMIN), async (req, res, next) => {
    try {
        const result = await GeneralSettingsRepository.getList()
        res.send(result)
    } catch (e) {
        next(e)
    }
})

/**
 * @swagger
 * /v1/general-settings/:feature:
 *    get:
 *      summary: Gets single general setting
 *      tags: [General Settings]
 *      parameters:
 *      - in: path
 *        name: feature
 *        description: feature name
 *        required: true
 *      responses:
 *        404:
 *          description: Cannot find data
*/
router.get('/:feature',authRequired(roles.SUPERADMIN), GeneralSettingsValidator.getGeneralSettingByFeature, async (req, res, next) => {
    try {
        const result = await GeneralSettingsRepository.getGeneralSettingByFeature(req.params.feature)
        if (!result) next({ message: "Cannot find data", status: 404 })
        else res.send(result.value)
    } catch (e) {
        next(e)
    }
})


/**
 * @swagger
 * /v1/general-settings:
 *    post:
 *      summary: Gets single general setting
 *      tags: [General Settings]
 *      parameters:
 *      - in: body
 *        name: feature
 *        description: feature name
 *        required: true
 *      - in: body
 *        name: value
 *        description: string of information
 *        required: true
 *      responses:
 *        409:
 *          description: General Setting already exists
*/
router.post('/', authRequired(roles.SUPERADMIN),GeneralSettingsValidator.createGeneralSetting, async (req, res, next) => {
    const { feature, value } = req.body
    try {
        let generalSettingDB = await GeneralSettingsRepository.getGeneralSettingByFeature(feature)
        if (!generalSettingDB) {
            let generalSettingCreated = await GeneralSettingsRepository.createGeneralSetting(req.body)
            res.status(201).send({ message: "ok" })
        } else {
            next({ message: "General Setting already exists", status: 409 })
        }
    } catch (e) {
        next(e)
    }
})

/**
 * @swagger
 * /v1/general-settings:
 *    put:
 *      summary: edits single general setting
 *      tags: [General Settings]
 *      parameters:
 *      - in: body
 *        name: feature
 *        description: feature name
 *        required: true
 *      - in: body
 *        name: newFeatureName
 *        description: new name of the feature 
 *      - in: body
 *        name: newValue
 *        description: new string of information for the value
 *      responses:
 *        404:
 *          description: Cannot find data
*/
router.put('/', authRequired(roles.SUPERADMIN), GeneralSettingsValidator.updateGeneralSetting, async (req, res, next) => {
    const { feature, newFeatureName, newValue } = req.body
    try {
        const generalSetting = await GeneralSettingsRepository.getGeneralSettingByFeature(feature,false)
        if (!generalSetting) next({ message: "Cannot find data", status: 404 })
        else {
            const newGeneralSetting = await GeneralSettingsRepository.updateGeneralSetting(generalSetting,{
                feature:newFeatureName, 
                value: newValue
            })
            res.send({message:"ok"})
        }
    } catch (e) {
        next(e)
    }

})

/**
 * @swagger
 * /v1/general-settings/:feature:
 *    delete:
 *      summary: Deletes single general setting
 *      tags: [General Settings]
 *      parameters:
 *      - in: path
 *        name: feature
 *        description: feature name
 *        required: true
 *      responses:
 *        404:
 *          description: Cannot find data
*/
router.delete('/:feature',authRequired(roles.SUPERADMIN), GeneralSettingsValidator.getGeneralSettingByFeature, async (req, res, next) => {
    try {
        const result = await GeneralSettingsRepository.deleteGeneralSettingByFeature(req.params.feature)
        if (!result) next({ message: "Cannot find data", status: 404 })
        else res.status(204).send()
    } catch (e) {
        next(e)
    }
})

module.exports = router