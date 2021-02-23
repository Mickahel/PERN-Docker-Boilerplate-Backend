import express, { Response, Request, NextFunction } from "express";
import GeneralSettingsRepository from "../repositories/generalSetting";
import GeneralSettingsValidator from "../validators/generalSetting";
const router: express.Router = express.Router();
const generalSettingsRepository = new GeneralSettingsRepository();

/**
 * @swagger
 * /v1/admin/gdpr/privacy-policy:
 *    get:
 *      summary: Gets privacy policy
 *      tags: [GDPR]
 *      security:
 *          - cookieAuthAdmin: []
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.get("/privacy-policy", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await generalSettingsRepository.getBy({ where: { feature: "privacyPolicy" } });
		if (!result) next({ message: "Cannot find data", status: 404 });
		else res.send(result);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /v1/admin/gdpr/terms-and-conditions:
 *    get:
 *      summary: Gets terms and conditions
 *      tags: [GDPR]
 *      security:
 *          - cookieAuthAdmin: []
 *      responses:
 *        404:
 *          description: Cannot find data
 */
router.get("/terms-and-conditions", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await generalSettingsRepository.getBy({ where: { feature: "termsAndConditions" } });
		if (!result) next({ message: "Cannot find data", status: 404 });
		else res.send(result);
	} catch (e) {
		next(e);
	}
});

export default router;
