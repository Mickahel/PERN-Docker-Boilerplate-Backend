import { isProduction } from "../../auxiliaries/server";
import config from "../../config";
import authRequired from "../../middlewares/authRequired";
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { roles } from "../../enums";

// ? import routes
import debugRoutes from "../../routes/debug";
import authRoutes from "../../routes/auth";
import serverRoutes from "../../routes/server";
import logsRoutes from "../../routes/log";
import databaseRoutes from "../../routes/database";
//import generalSettingRoutes from "../../routes/generalSetting";
import userAdminRoutes from "../../routes/user/admin";
export default function initializeRoutes(router: Router): void {
	//router.get('/', (req, res, next) => { // Echo route
	//res.redirect(301, process.env.FRONTEND_URL)
	//})

	// ? Echo route
	router.get("/", (req: Request, res: Response, next: NextFunction) =>
		res.send(
			`
    <h1>${config.longTitle}</h1>
    <h2><a href=\"${config.apiDocsLink}\">API Documentation</h2>
    `
		)
	);

	router.get("/favicon.ico", (req: Request, res: Response, next: NextFunction) => res.status(204));

	// * https://stackoverflow.com/questions/46783270/expressjs-best-way-to-add-prefix-versioning-routes
	// ? Import Routes & Add Middlewares

	// ? Public Routes
	router.use("/v1/auth", authRoutes);

	// ? Admin Routes
	router.use("/v1/admin*", authRequired(roles.getRoleWithMinimumPermissionLevelByUserType(true)));
	router.use("/v1/admin/server", serverRoutes);
	//router.use("/v1/admin/general-settings", generalSettingRoutes);
	router.use("/v1/admin/user", userAdminRoutes);
	router.use("/v1/admin/logs", logsRoutes);
	//	router.use("/v1/admin/feedback", require("../../routes/feedback/admin"));
	//	router.use("/v1/admin/pushNotification", require("../../routes/pushNotification/admin"));
	router.use("/v1/admin/database", databaseRoutes);

	// ? App Routes
	router.use("/v1/app*", authRequired(roles.getRoleWithMinimumPermissionLevelByUserType(false)));
	//	router.use("/v1/app/user", require("../../routes/user/app"));
	//	router.use("/v1/app/feedback", require("../../routes/feedback/app"));
	//	router.use("/v1/app/pushNotification", require("../../routes/pushNotification/app"));

	// ? Development routes
	if (!isProduction) router.use("/v1/debug", debugRoutes);

	router.use("*", (req: Request, res: Response, next: NextFunction) => {
		next({ message: "Cannot find Endpoint", status: 404 });
	});
}
