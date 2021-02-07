import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { isProduction } from "../../auxiliaries/server";
import { config } from "../../config";
import { Express, Router } from "express";
const swaggerOptions = {
	swaggerDefinition: {
		// Like the one described here: https://swagger.io/specification/#infoObject
		openapi: "3.0.1",
		host: process.env.BACKEND_URL,
		info: {
			title: config.longTitle,
			version: "0.0.0",
			description: config.description,
			contact: config.contact,
			license: {
				name: "PROPRIETARY LICENSE",
			},
		},
		components: {
			securitySchemes: {
				cookieAuthBasic: {
					type: "apiKey",
					in: "cookie",
					name: "accessToken",
					//scheme: "bearer",
					//bearerFormat: "JWT",
					description: "Cookie accessToken required, Basic Role Required",
				},
				cookieAuthAdmin: {
					type: "apiKey",
					in: "cookie",
					name: "accessToken",
					//scheme: "bearer",
					//bearerFormat: "JWT",
					description: "Cookie accessToken required, Admin Role Required",
				},
				cookieAuthSuperAdmin: {
					type: "apiKey",
					in: "cookie",
					name: "accessToken",
					//scheme: "bearer",
					//bearerFormat: "JWT",
					description: "Cookie accessToken required, SuperAdmin Role Required",
				},
				//basicAuth: {
				//  type: 'apiKey',
				//  scheme: 'basic'
				//}
			},
		},
		servers: [
			{
				url: process.env.BACKEND_URL,
				description: "Main API Server",
			},
		],
	},
	apis: ["./src/routes/*.js", "./src/routes/*/*.js"],
};

export default function initializeSwagger(app: Express, router: Router): void {
	if (isProduction) return;
	const specs = swaggerJsdoc(swaggerOptions);
	router.use(config.apiDocsLink, swaggerUi.serve, swaggerUi.setup(specs));
}
