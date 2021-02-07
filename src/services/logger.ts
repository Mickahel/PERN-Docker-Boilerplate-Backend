import winston from "winston";
import "winston-daily-rotate-file";
import _ from "lodash";
const standardTimestampData = { format: "DD/MM/YYYY h:mm:ss:SSS" };
const cj = require("color-json");
import chalk, { Chalk } from "chalk";
import { v4 as uuid } from "uuid";

const rotationTransport = new winston.transports.DailyRotateFile({
	format: winston.format.combine(winston.format.timestamp(standardTimestampData), winston.format.splat(), winston.format.json()),
	filename: "%DATE%.log",
	datePattern: "DD-MM-YYYY",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "1d",
	auditFile: process.env.LOG_DIRECTORY + "/audit.json",
	dirname: process.env.LOG_DIRECTORY,
});

const consoleFromat = {
	format: winston.format.combine(winston.format.splat(), winston.format.colorize(), winston.format.simple()),
};

const fileFormat: object = {
	format: winston.format.combine(winston.format.timestamp(standardTimestampData), winston.format.splat(), winston.format.json()),
};

const transportsLog: Array<winston.transports.ConsoleTransportInstance> = [new winston.transports.Console(consoleFromat)];
const transportsException: Array<winston.transports.ConsoleTransportInstance> = [new winston.transports.Console(consoleFromat)];

/*if (process.env.LOG_FILE) {//log.log
  transportsLog.push(
    new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE,//log.log
    })
  );
}*/

const winstonCustomLogger: winston.Logger = winston.createLogger({
	level: process.env.LOG_LEVEL,
	exitOnError: false,
	transports: transportsLog,
	exceptionHandlers: transportsException,
});

const winstonFileLogger: winston.Logger = winston.createLogger({
	level: process.env.LOG_LEVEL,
	exitOnError: false,
	transports: [
		rotationTransport,
		/*new winston.transports.File({
      ...fileFormat,
      filename: process.env.LOG_FILE, //log.log
    }),*/
	],
	exceptionHandlers: transportsException,
});

const setBgColor = (bgColor: string): string => {
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
	if (bgColor.startsWith("#")) return bgColor;
	if (!bgColor.startsWith("bg")) bgColor = "bg" + bgColor.charAt(0).toUpperCase() + bgColor.slice(1);
	return bgColor;
};

export default class ModularLogger {
	readonly module: string;
	readonly bgColor: string;
	readonly otherOptions?: object;
	readonly bgColorType?: string;

	constructor(module: string, bgColor: string, otherOptions?: any) {
		if (!module) throw new Error("Module must Be Defined");
		this.module = module;
		this.bgColor = setBgColor(bgColor);
		this.bgColorType = this.bgColor.startsWith("#") ? "hex" : "text";
		if (!otherOptions) this.otherOptions = {};
		else this.otherOptions = otherOptions;
	}

	writeLogToFile(fileLoggerFunction: winston.LeveledLogMethod, parsedMessage: string, arg?: object): void {
		interface logToFile {
			id: string;
			object?: object;
			module?: string;
			bgColor?: string;
		}

		let logToFile: logToFile = {
			id: uuid(),
			...this.otherOptions,
		};

		if (arg) logToFile.object = arg;
		if (this.module) logToFile.module = this.module;
		if (this.bgColor && this.bgColorType === "hex") logToFile.bgColor = this.bgColor;
		fileLoggerFunction(parsedMessage, logToFile);
	}

	generic(message: any, arg: object, loggerFunction: winston.LeveledLogMethod, fileLoggerFunction: winston.LeveledLogMethod): void {
		let moduleText: string = this.bgColor
			? this.bgColorType === "hex"
				? chalk.bold.black.bgHex(this.bgColor)(`[${this.module}]`)
				: (chalk.bold.black[this.bgColor as keyof Chalk] as Chalk)(`[${this.module}]`)
			: `[${this.module}]`;

		if (typeof message === "object" && !arg) {
			// ? message is an object and is the only param
			const parsedMessage = message instanceof Error ? message.stack : cj(message);
			loggerFunction(moduleText + " - " + parsedMessage, {
				...this.otherOptions,
			});

			this.writeLogToFile(fileLoggerFunction, parsedMessage);
		} else if (typeof message !== "object" && !arg) {
			// ? message is not an object and is the only param
			loggerFunction(moduleText + " - " + message, {
				...this.otherOptions,
			});
			this.writeLogToFile(fileLoggerFunction, message);
		} else if (typeof message !== "object" && typeof arg === "object") {
			// ? message is not an object and there is arg
			const parsedMessage = message instanceof Error ? message.stack : message;
			const parsedArg = arg instanceof Error ? arg.stack : cj(arg);
			loggerFunction(moduleText + " - " + parsedMessage + " - " + parsedArg, {
				...this.otherOptions,
			});

			this.writeLogToFile(fileLoggerFunction, parsedMessage, parsedArg);
		} else {
			loggerFunction(moduleText + " - " + message.message, {
				...this.otherOptions,
				stack: _.get(message, "stack", undefined),
			});
			this.writeLogToFile(fileLoggerFunction, message.message);
		}
	}

	error(message: any, arg?: any): void {
		//level 0
		this.generic(message, arg, winstonCustomLogger.error, winstonFileLogger.error);
	}

	warn(message: any, arg?: any): void {
		//level 1
		this.generic(message, arg, winstonCustomLogger.warn, winstonFileLogger.warn);
	}

	info(message: any, arg?: any): void {
		// level 2
		this.generic(message, arg, winstonCustomLogger.info, winstonFileLogger.info);
	}

	verbose(message: any, arg?: any): void {
		// level 3
		this.generic(message, arg, winstonCustomLogger.verbose, winstonFileLogger.verbose);
	}

	debug(message: any, arg?: any): void {
		//level 4
		this.generic(message, arg, winstonCustomLogger.debug, winstonFileLogger.debug);
	}

	silly(message: any, arg?: any): void {
		// level 5
		this.generic(message, arg, winstonCustomLogger.silly, winstonFileLogger.silly);
	}
}

rotationTransport.on("rotate", function (oldFilename, newFilename) {
	const logger = new ModularLogger("Logger", "#dadada");
	logger.info("Log Rotated Successfully");
});
