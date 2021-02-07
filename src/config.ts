import rolesEnum from "./enums/rolesEnum";
import Logger from "./services/logger";
const logger = new Logger("Database", "#FF9A00");
const config = {
	base: {
		longTitle: "PERN Boilerplate",
		shortTitle: "PERNB",
		description: "A PERN Boilerplate",
		apiDocsLink: "/api-docs",
		mainDomain: "https://app.pernboilerplate.it",
		notificationColor: "#86DAF1",
		contact: {
			name: "Michelangelo De Francesco",
			url: "https://www.linkedin.com/in/michelangelodefrancesco",
			email: "df.michelangelo@gmail.com",
		},
	},
	production: {
		databaseConfig: {
			options: {
				type: "postgres",
				//logging: (msg) => logger.silly(msg),
				//logging: false,
			},
		},
	},
	development: {
		databaseConfig: {
			options: {
				type: "postgres",
				//logging: false,
			},
		},
	},
};

const exportConfig = {
	...(process.env.NODE_ENV === "production" ? config.production : config.development),
	...config.base,
};

export { exportConfig as config };
