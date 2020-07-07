const winston = require("winston");
const _ = require("lodash");
const standardTimestampData = { format: "DD/MM/YYYY h:mm:ss:SSS" };
const cj = require("color-json");
const chalk = require("chalk");

const consoleFromat = {
  format: winston.format.combine(
    winston.format.timestamp(standardTimestampData),
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
  maxsize: 5e6,
  tailable: true,
  zippedArchive: true,
};

const transportsLog = [new winston.transports.Console(consoleFromat)];
const transportsException = [new winston.transports.Console(consoleFromat)];

/*if (process.env.LOG_FILE) {
  transportsLog.push(
    new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE,
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
    new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE,
    }),
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
  if (!bgColor.startsWith("bg")) {
    bgColor = "bg" + bgColor.charAt(0).toUpperCase() + bgColor.slice(1);
  }
  return bgColor;
};

const ModularLogger = class ModularLogger {
  constructor(module, bgColor, type, otherOptions) {
    this.module = module;
    this.type = type;
    this.otherOptions = otherOptions;
    this.bgColor = setBgColor(bgColor);
    if (!otherOptions) this.otherOptions = {};
  }

  error(message, arg) {
    //level 0
    this.generic(message, arg, "error");
  }

  warn(message, arg) {
    //level 1
    this.generic(message, arg, "warn");
  }

  info(message, arg) {
    // level 2
    this.generic(message, arg, "info");
  }

  verbose(message, arg) {
    // level 3
    this.generic(message, arg, "verbose");
  }

  debug(message, arg) {
    //level 4
    this.generic(message, arg, "debug");
  }

  silly(message, arg) {
    // level 5
    this.generic(message, arg, "silly");
  }

  generic(message, arg, func) {
    //winstonFileLogger[func](message)

    let moduleText = this.bgColor
      ? chalk.bold.black[this.bgColor](`[${this.module}]`)
      : `[${this.module}]`;

    if (typeof message === "object" && !arg) {
      //message is an object and is the only param
      const parsedMessage = message instanceof Error ? message.stack : cj(message);
      winstonCustomLogger[func](moduleText + " - " + parsedMessage, {
        ...this.otherOptions,
      });

      winstonFileLogger[func](parsedMessage, {
        object: arg,
        module: this.module,
        ...this.otherOptions,
      });
    } else if (typeof message !== "object" && !arg) {
      //message is not an object and is the only param

      winstonCustomLogger[func](moduleText + " - " + message, {
        ...this.otherOptions,
      });
      winstonFileLogger[func](message, {
        object: arg,
        module: this.module,
        ...this.otherOptions,
      });
    } else if (typeof message !== "object" && typeof arg === "object") {
      //message is not an object and there is arg

      winstonCustomLogger[func](
        moduleText + " - " + message + " - " + cj(arg),
        {
          ...this.otherOptions,
        }
      );
      winstonFileLogger[func](message, {
        object: arg,
        module: this.module,
        ...this.otherOptions,
      });
    } else {
      winstonCustomLogger[func](moduleText + " - " + message.message, {
        ...this.otherOptions,
        stack: _.get(message, "stack", undefined),
      });
      winstonFileLogger[func](message, {
        object: arg,
        module: this.module,
        ...this.otherOptions,
      });
    }
  }
};

module.exports = ModularLogger;
