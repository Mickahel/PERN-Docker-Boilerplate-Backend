require("dotenv").config();
const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");
const Logger = require("./logger");
const logger = new Logger("Mails", "#cacaca");
const { config } = require("../../config");

nunjucks.configure("src/resources", { autoescape: true });

const transporter = nodemailer.createTransport({
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

class MailerService {
  sendMail(options) {
    const mailOptions = {
      from: process.env.MAILER_USER,
      priority: "high",
      /*to,
      subject,
      html,*/
      ...options
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) logger.error("Email send error ", error);
    });
  }


  sendNewUserActivationMail(user) {
    let html = nunjucks.render("newUserMailActivation.html", {
      user,
      appName: config.longTitle,
      frontendUrl: process.env.FRONTEND_URL,
      imagesUrl: process.env.BACKEND_IMAGES_URL,
      color: config.notificationColor,
    })
      ;
    const mailOptions = {
      to: user.email,
      subject: `${config.shortTitle} - Account Activation`,
      html
    };

    this.sendMail(mailOptions);
  }


  sendUserActivatedMail(user) {
    const html = nunjucks.render("newUserMailActivated.html", {
      user,
      appName: config.longTitle,
      frontendUrl: process.env.FRONTEND_URL,
      imagesUrl: process.env.BACKEND_IMAGES_URL,
      color: config.notificationColor,
    });

    const mailOptions = {
      to: user.email,
      subject: `${config.shortTitle} - Account Activated`,
      html
    };

    this.sendMail(mailOptions);
  }

  sendNewUserMail(user, plainPassword) {
    const html = nunjucks.render('newUserMail.html', {
      appName: config.longTitle,
      frontendUrl: process.env.FRONTEND_URL,
      imagesUrl: process.env.BACKEND_IMAGES_URL,
      color: config.notificationColor,
      user,
      plainPassword
    });

    const mailOptions = {
      to: user.email,
      subject: `${config.shortTitle} - Welcome`,
      html
    };
    this.sendMail(mailOptions)
  }

  sendResetPasswordMail(user) {
    const html = nunjucks.render("resetPasswordMail.html", {
      user,
      appName: config.longTitle,
      frontendUrl: process.env.FRONTEND_URL,
      imagesUrl: process.env.BACKEND_IMAGES_URL,
      color: config.notificationColor,
    });

    const mailOptions = {
      to: user.email,
      subject: `${config.shortTitle} - Reset your password`,
      html
    };

    this.sendMail(mailOptions);
  }



  sendNewFeedbackMail(feedback, users) {
    const mails = users.map(user => user.email)
    const html = nunjucks.render("newFeedback.html", {
      feedback,
      appName: config.longTitle,
      adminUrl: process.env.ADMIN_FRONTEND_URL,
      imagesUrl: process.env.BACKEND_IMAGES_URL,
      color: config.notificationColor,
    });

    const mailOptions = {
      bcc: mails,
      subject: `${config.shortTitle} - A New Feedback has been received`,
      html: html,
    }

    this.sendMail(mailOptions)
  }
}

module.exports = new MailerService();