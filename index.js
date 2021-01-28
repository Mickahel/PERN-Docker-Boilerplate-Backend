require("dotenv").config();
const Logger = require("./src/services/logger");
const crashLogger = new Logger("CRASH", "#ff0000");

process.on("unhandledRejection", (error) => {
  crashLogger.error("unhandledRejection", error);
});

process.on("uncaughtException", (error) => {
  crashLogger.error("uncaughtException", error);
});

const fs = require('fs');
const { config } = require("./config");
const cluster = require("cluster");
const os = require("os");
const createServer = require("./src/server");
const logger = new Logger("Cluster", "#F2FE");
const { isProduction } = require("./src/auxiliaries/server");
const { initializeDatabase } = require("./src/models");
logger.info("Environement: " + process.env.NODE_ENV);
const { publicFolder } = require("./src/auxiliaries/server");

const startCluster = () => {
  // ? Check if current process is master.
  if (cluster.isMaster) {
    logger.info("Master Cluster [" + process.pid + "]");

    // Get total CPU cores.
    os.cpus().forEach((cpu) => cluster.fork());

    // Cluster API has a variety of events.
    // Here we are creating a new process if a worker die.
    cluster.on("exit", (worker) => {
      logger.error(
        "worker process " +
        worker.process.pid +
        " died." +
        Object.keys(cluster.workers).length +
        "worker remaining. Starting new Cluster"
      );
      cluster.fork();
    });
  } else {
    logger.info("Spawn Child [" + process.pid + "]");
    // This is not the master process, so we spawn the express server.
    startSingle();
  }
};

function startSingle() {
  createServer();
}

async function start() {
  logger.info(`Starting ${config.longTitle}`);

  // ? Start services
  try {
    //const jobs = new jobs()
    /* if (isProduction) {
      await initializeDatabase();
      //await jobs.create()
      //await initializeAgendaJS();
      //await initializeExthernalServices();
    } else {
      initializeDatabase();
      // jobs.create()
      // initializeAgendaJS();
      // await initializeExthernalServices();
    }*/

    await initializeDatabase();

    // ? Start server
    if (process.env.CLUSTER === "true") {
      startCluster();
    } else {
      startSingle();
    }
  } catch (e) {
    crashLogger.error(e);
  }
}

const createFolders = () => {
  if (!fs.existsSync(publicFolder + "/uploads/feedbacks")) {
    fs.mkdirSync(publicFolder + "/uploads/feedbacks", { recursive: true })
    logger.info("Created Feedbacks Folder")
  }
  if (!fs.existsSync(publicFolder + "/uploads/profileImgs")) {
    fs.mkdirSync(publicFolder + "/uploads/profileImgs", { recursive: true })
    logger.info("Created ProfileImgs Folder")
  }
  if (!fs.existsSync(publicFolder + "/uploads/pushNotificationImages")) {
    fs.mkdirSync(publicFolder + "/uploads/pushNotificationImages", { recursive: true })
    logger.info("Created pushNotificationImages Folder")
  }
}

createFolders()
start();
