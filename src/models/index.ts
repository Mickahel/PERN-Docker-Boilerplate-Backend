import "reflect-metadata";
import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { isProduction } from "../auxiliaries/server";
import Logger from "../services/logger";
const logger = new Logger("Database", "#FF9A00");

const databaseConfig: ConnectionOptions = {
	type: "postgres",
	host: process.env.DB_HOST as string,
	username: process.env.DB_USER as string,
	password: process.env.DB_PASSWORD as string,
	database: process.env.DB_NAME as string,
	logging: false,
	synchronize: true,
	entities: ["src/models/*Entity.js", "src/models/*Entity.ts"],
	poolErrorHandler: (error) => {
		console.log(error);
	},
};
let connection: Connection;

async function initializeDatabase(): Promise<void> {
	try {
		logger.info("Connecting to database");
		connection = await createConnection(databaseConfig);
		logger.info("Connection to database has been established successfully.");
		// ? One To Many relationship between user and push notification tokens
	} catch (error) {
		logger.error("Unable to connect to the database:", error);
		logger.error("Closing app");
		//process.exit(1);
	}
}

export { initializeDatabase, connection };
