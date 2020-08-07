const winston = require("winston");
require('winston-daily-rotate-file');
const _ = require("lodash");
const standardTimestampData = { format: "DD/MM/YYYY h:mm:ss:SSS" };
const cj = require("color-json");
const chalk = require("chalk");


const rotationTransport = new (winston.transports.DailyRotateFile)({
  format: winston.format.combine(
    winston.format.timestamp(standardTimestampData),
    winston.format.splat(),
    winston.format.json()
  ),
  filename: '%DATE%.log',
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  auditFile: process.env.LOG_DIRECTORY+"/audit.json",

  dirname:process.env.LOG_DIRECTORY
});


const consoleFromat = {
  format: winston.format.combine(
    //winston.format.timestamp(standardTimestampData),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.simple()
  ),
};



const fileFormat = {
  format: winston.format.combine(
    winston.format.timestamp(standardTimestampData),
    winston.format.splat(),
    winston.format.json()
  ),
};

const transportsLog = [new winston.transports.Console(consoleFromat)];
const transportsException = [new winston.transports.Console(consoleFromat)];

/*if (process.env.LOG_FILE) {//log.log
  transportsLog.push(
    new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE,//log.log
    })
  );
}*/

const winstonCustomLogger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  exitOnError: false,
  transports: transportsLog,
  exceptionHandlers: transportsException,
});

const winstonFileLogger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  exitOnError: false,
  transports: [
    rotationTransport
    /*new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE, //log.log
    }),*/

  ],
  exceptionHandlers: transportsException,
});

const setBgColor = (bgColor) => {
  /*
        bgBlack
        bgRed
        bgGreen
        bgYellow
        bgBlue
        bgMagenta
        bgCyan
        bgWhite
        bgBlackBright (alias: bgGray, bgGrey)
        bgRedBright
        bgGreenBright
        bgYellowBright
        bgBlueBright
        bgMagentaBright
        bgCyanBright
        bgWhiteBright
    */
  if (!bgColor) return;
  if (bgColor.startsWith("#")) return bgColor;
  if (!bgColor.startsWith("bg")) {
    bgColor = "bg" + bgColor.charAt(0).toUpperCase() + bgColor.slice(1);
  }
  return bgColor;
};

function ModularLogger(module, bgColor, otherOptions) {
  if (!module) throw new Error("Module must Be Defined");
  this.module = module;
  if (bgColor) {
    this.bgColor = setBgColor(bgColor);
    this.bgColorType = this.bgColor.startsWith("#") ? "hex" : "text";
  }
  if (!otherOptions) this.otherOptions = {};
  else this.otherOptions = otherOptions;
}

ModularLogger.prototype.writeLogToFile = function (func, parsedMessage, arg) {
  let logToFile = {
    ...this.otherOptions,
  };

  if (arg) logToFile.object = arg;
  if (this.module) logToFile.module = this.module;
  if (this.bgColor && this.bgColorType === "hex")
    logToFile.bgColor = this.bgColor;
  winstonFileLogger[func](parsedMessage, logToFile);
};

ModularLogger.prototype.generic = function (message, arg, func) {
  let moduleText = this.bgColor
    ? this.bgColorType === "hex"
      ? chalk.bold.black.bgHex(this.bgColor)(`[${this.module}]`)
      : chalk.bold.black[this.bgColor](`[${this.module}]`)
    : `[${this.module}]`;

  if (typeof message === "object" && !arg) {
    // ? message is an object and is the only param
    const parsedMessage =
      message instanceof Error ? message.stack : cj(message);

    winstonCustomLogger[func](moduleText + " - " + parsedMessage, {
      ...this.otherOptions,
    });

    this.writeLogToFile(func, parsedMessage);
  } else if (typeof message !== "object" && !arg) {
    // ? message is not an object and is the only param

    winstonCustomLogger[func](moduleText + " - " + message, {
      ...this.otherOptions,
    });

    this.writeLogToFile(func, message);
  } else if (typeof message !== "object" && typeof arg === "object") {
    // ? message is not an object and there is arg
    const parsedMessage = message instanceof Error ? message.stack : message;
    const parsedArg = arg instanceof Error ? arg.stack : cj(arg);
    winstonCustomLogger[func](
      moduleText + " - " + parsedMessage + " - " + parsedArg,
      {
        ...this.otherOptions,
      }
    );

    this.writeLogToFile(func, parsedMessage, parsedArg);
  } else {
    winstonCustomLogger[func](moduleText + " - " + message.message, {
      ...this.otherOptions,
      stack: _.get(message, "stack", undefined),
    });
    this.writeLogToFile(func, message.message);
  }
};

ModularLogger.prototype.error = function (message, arg) {
  //level 0
  this.generic(message, arg, "error");
};

ModularLogger.prototype.warn = function (message, arg) {
  //level 1
  this.generic(message, arg, "warn");
};

ModularLogger.prototype.info = function (message, arg) {
  // level 2
  this.generic(message, arg, "info");
};

ModularLogger.prototype.verbose = function (message, arg) {
  // level 3
  this.generic(message, arg, "verbose");
};

ModularLogger.prototype.debug = function (message, arg) {
  //level 4
  this.generic(message, arg, "debug");
};

ModularLogger.prototype.silly = function (message, arg) {
  // level 5
  this.generic(message, arg, "silly");
};


rotationTransport.on('rotate', function(oldFilename, newFilename) {
  const logger = new ModularLogger("Logger", "#dadada")
  logger.info("Log Rotated Successfully")
});

module.exports = ModularLogger;
