import nodemailer from "nodemailer";
import nunjucks from "nunjucks";
import Logger from "./logger";
const logger = new Logger("Mails", "#cacaca");
import config from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import User from "../models/userEntity";
import Feedback from "../models/feedbackEntity";
// TODO Add typescript
nunjucks.configure("src/resources", { autoescape: true });

const transporter: Mail = nodemailer.createTransport(<SMTPTransport.Options>{
	//service: process.env.MAILER_TRANSPORT,
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	auth: {
		user: process.env.MAILER_USER,
		pass: process.env.MAILER_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

interface mailOptions {
	to?: string;
	subject: string;
	html: string;
	bcc?: string | string[];
}
const MailerService = {
	sendMail(options: mailOptions): void {
		const mailOptions: Mail.Options = {
			from: process.env.MAILER_USER,
			priority: "high",
			...options,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) logger.error("Email send error ", error);
		});
	},

	sendNewUserActivationMail(user: User): void {
		let html = nunjucks.render("newUserMailActivation.html", {
			user,
			appName: config.longTitle,
			frontendUrl: process.env.FRONTEND_URL,
			imagesUrl: process.env.BACKEND_IMAGES_URL,
			color: config.notificationColor,
		});
		const mailOptions: mailOptions = {
			to: user.email,
			subject: `${config.shortTitle} - Account Activation`,
			html,
		};

		this.sendMail(mailOptions);
	},

	sendUserActivatedMail(user: User): void {
		const html = nunjucks.render("newUserMailActivated.html", {
			user,
			appName: config.longTitle,
			frontendUrl: process.env.FRONTEND_URL,
			imagesUrl: process.env.BACKEND_IMAGES_URL,
			color: config.notificationColor,
		});

		const mailOptions: mailOptions = {
			to: user.email,
			subject: `${config.shortTitle} - Account Activated`,
			html,
		};

		this.sendMail(mailOptions);
	},

	sendNewUserMail(user: User, plainPassword: string): void {
		const html = nunjucks.render("newUserMail.html", {
			appName: config.longTitle,
			frontendUrl: process.env.FRONTEND_URL,
			imagesUrl: process.env.BACKEND_IMAGES_URL,
			color: config.notificationColor,
			user,
			plainPassword,
		});

		const mailOptions: mailOptions = {
			to: user.email,
			subject: `${config.shortTitle} - Welcome`,
			html,
		};
		this.sendMail(mailOptions);
	},

	sendResetPasswordMail(user: User): void {
		const html = nunjucks.render("resetPasswordMail.html", {
			user,
			appName: config.longTitle,
			frontendUrl: process.env.FRONTEND_URL,
			imagesUrl: process.env.BACKEND_IMAGES_URL,
			color: config.notificationColor,
		});

		const mailOptions: mailOptions = {
			to: user.email,
			subject: `${config.shortTitle} - Reset your password`,
			html,
		};

		this.sendMail(mailOptions);
	},

	sendNewFeedbackMail(feedback: Feedback, users: User[]): void {
		const mails = users.map((user) => user.email);
		const html = nunjucks.render("newFeedback.html", {
			feedback,
			appName: config.longTitle,
			adminUrl: process.env.ADMIN_FRONTEND_URL,
			imagesUrl: process.env.BACKEND_IMAGES_URL,
			color: config.notificationColor,
		});

		const mailOptions: mailOptions = {
			bcc: mails,
			subject: `${config.shortTitle} - A New Feedback has been received`,
			html: html,
		};

		this.sendMail(mailOptions);
	},
};

export default MailerService;
