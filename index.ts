import dotenv from "dotenv";
dotenv.config();
import Logger from "./src/services/logger";
const crashLogger = new Logger("CRASH", "#ff0000");

/*process.on("unhandledRejection", (error: Error, origin: string): void => {
	crashLogger.error("unhandledRejection", error);
});*/
/*process.on("uncaughtException", (error: Error, origin: string): void => {
	crashLogger.error("uncaughtException", error);
});*/

import fs from "fs";
import config from "./src/config";
import cluster from "cluster";
import os from "os";
import createServer from "./src/server";
const logger = new Logger("Cluster", "#F2FE");
import { isProduction, publicFolder } from "./src/auxiliaries/server";
import { initializeDatabase } from "./src/models";
logger.info("Environement: " + process.env.NODE_ENV);

const startCluster = (): void => {
	// ? Check if current process is master.
	if (cluster.isMaster) {
		logger.info("Master Cluster [" + process.pid + "]");

		// ? Get total CPU cores.
		os.cpus().forEach((cpu: os.CpuInfo): cluster.Worker => cluster.fork());

		// Cluster API has a variety of events.
		// Here we are creating a new process if a worker die.
		cluster.on("exit", (worker: cluster.Worker, signal: number): void => {
			logger.error("worker process " + worker.process.pid + " died." + Object.keys(cluster.workers).length + "worker remaining. Starting new Cluster");
			cluster.fork();
		});
	} else {
		logger.info("Spawn Child [" + process.pid + "]");
		//* This is not the master process, so we spawn the express server.
		startSingle();
	}
};

function startSingle(): void {
	createServer();
}

async function start(): Promise<void> {
	logger.info(`Starting ${config.longTitle}`);

	// ? Start services
	try {
		//const jobs = new jobs()
		await initializeDatabase();

		if (isProduction) {
			//await jobs.create()
			//await initializeAgendaJS();
			//await initializeExthernalServices();
		} else {
			// jobs.create()
			// initializeAgendaJS();
			// await initializeExthernalServices();
		}

		// ? Start server
		if (process.env.CLUSTER === "true") startCluster();
		else startSingle();
	} catch (e) {
		crashLogger.error(e);
	}
}

function createFolders(): void {
	if (!fs.existsSync(publicFolder + "/uploads/feedbacks")) {
		fs.mkdirSync(publicFolder + "/uploads/feedbacks", { recursive: true });
		logger.info("Created Feedbacks Folder");
	}
	if (!fs.existsSync(publicFolder + "/uploads/profileImgs")) {
		fs.mkdirSync(publicFolder + "/uploads/profileImgs", { recursive: true });
		logger.info("Created ProfileImgs Folder");
	}
	if (!fs.existsSync(publicFolder + "/uploads/pushNotificationImages")) {
		fs.mkdirSync(publicFolder + "/uploads/pushNotificationImages", { recursive: true });
		logger.info("Created pushNotificationImages Folder");
	}
}

createFolders();
start();
