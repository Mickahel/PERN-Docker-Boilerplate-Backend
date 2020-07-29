require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const createServer = require("./src/server");
const Logger = require("./src/services/Logger");
const logger = new Logger("Cluster", "#F2FE");
const { isProduction } = require("./src/auxiliaries/ServerAuxiliaries");
const { initializeDatabase } = require("./src/models");
const test = require("./testServices");
const crashLogger = new Logger("CRASH", "#ff0000");
logger.info("Environement: " + process.env.NODE_ENV);

const startCluster = () => {
  // Check if current process is master.
  if (cluster.isMaster) {
    logger.info("MASTER [" + process.pid + "]");

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
    logger.info("CHILD [" + process.pid + "]");
    // This is not the master process, so we spawn the express server.
    startSingle();
  }
};

function startSingle() {
  createServer();
} 

async function start() {
  logger.info("Starting PERN Docker Boilerplate");

  process.on("unhandledRejection", (error) => {
    crashLogger.error("unhandledRejection", error);
  });

  process.on("uncaughtException", (error) => {
    crashLogger.error("uncaughtException", error);
  });

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
    logger.error(e);
  }
}

start(); 
test(); 