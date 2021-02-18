import express, { Response, Request, NextFunction } from "express";
import GeneralSettingsRepository from "../repositories/generalSetting";
import GeneralSettingsValidator from "../validators/generalSetting";
const router: express.Router = express.Router();
const generalSettingsRepository = new GeneralSettingsRepository();

/**
 * @swagger
 * /v1/admin/general-settings/all:
 *    get:
 *      summary: Gets all the general settings
 *      tags: [General Settings]
 *      security:
 *          - cookieAuthAdmin: []
 */
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await generalSettingsRepository.getAll();
		res.send(result);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/general-settings/:feature:
 *    get:
 *      summary: Gets single general setting
 *      tags: [General Settings]
 *      security:
 *          - cookieAuthAdmin: []
 *      parameters:
 *      - in: path
 *        name: feature
 *        description: feature name
 *        required: true
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.get("/:feature", GeneralSettingsValidator.getGeneralSettingByFeature, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await generalSettingsRepository.getBy({ where: { feature: req.params.feature } });
		if (!result) next({ message: "Cannot find data", status: 404 });
		else res.send(result);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/general-settings:
 *    post:
 *      summary: create single general setting
 *      tags: [General Settings]
 *      security:
 *          - cookieAuthAdmin: []
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
router.post("/", GeneralSettingsValidator.createGeneralSetting, async (req: Request, res: Response, next: NextFunction) => {
	const { feature, value } = req.body;
	try {
		let generalSettingDB = await generalSettingsRepository.getBy({ where: { feature } });
		if (!generalSettingDB) {
			let generalSettingCreated = await generalSettingsRepository.create(req.body);
			res.status(201).send(generalSettingCreated);
		} else {
			next({ message: "General Setting already exists", status: 409 });
		}
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/general-settings:
 *    put:
 *      summary: edits single general setting
 *      tags: [General Settings]
 *      security:
 *          - cookieAuthAdmin: []
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
router.put("/", GeneralSettingsValidator.updateGeneralSetting, async (req: Request, res: Response, next: NextFunction) => {
	const { feature, newFeatureName, newValue } = req.body;
	try {
		const generalSetting = await generalSettingsRepository.getBy({ where: { feature } });
		if (!generalSetting) next({ message: "Cannot find data", status: 404 });
		else {
			const newGeneralSetting = await generalSettingsRepository.update(generalSetting.feature, {
				feature: newFeatureName,
				value: newValue,
			});
			res.send(newGeneralSetting);
		}
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/general-settings/:feature:
 *    delete:
 *      summary: Deletes single general setting
 *      tags: [General Settings]
 *      security:
 *          - cookieAuthAdmin: []
 *      parameters:
 *      - in: path
 *        name: feature
 *        description: feature name
 *        required: true
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.delete("/:feature", GeneralSettingsValidator.getGeneralSettingByFeature, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await generalSettingsRepository.deletePhysical({ feature: req.params.feature });
		if (!result) next({ message: "Cannot find data", status: 404 });
		else res.status(204).send();
	} catch (e) {
		next(e);
	}
});

export default router;
