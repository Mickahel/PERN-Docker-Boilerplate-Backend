require("dotenv").config();
const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");
const Logger = require("./Logger");
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

function sendMail(to, subject, html) {
  let mailOptions = {
    from: process.env.MAILER_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) logger.error("Email send error ", error);
  });
}

async function sendMailByOptions(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions)
    return info;
  } catch (e) {
    logger.error("Error in sending mail", e)
  }
}

function sendNewUserActivationMail(user) {
  let html = nunjucks.render("NewUserMailActivation.html", {
    user,
    appName: config.longTitle,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
    color: config.notificationColor,
  });
  sendMail(user.email, `${config.shortTitle} - Account Activation`, html);
}

function sendNewUserMail(user, plainPassword) {
  const html = nunjucks.render("NewUserMail.html", {
    user,
    plainPassword,
    appName: config.longTitle,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
    color: config.notificationColor,
  });
  sendMail(user.email, `${config.shortTitle} - Welcome`, html);
}

function sendUserActivatedMail(user) {
  const html = nunjucks.render("NewUserMailActivated.html", {
    user,
    appName: config.longTitle,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
    color: config.notificationColor,
  });
  sendMail(user.email, `${config.shortTitle} - Account Activated`, html);
}

function sendResetPasswordMail(user) {
  const html = nunjucks.render("ResetPasswordMail.html", {
    user,
    appName: config.longTitle,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
    color: config.notificationColor,
  });
  sendMail(user.email, `${config.shortTitle} - Reset your password`, html);
}



async function sendNewFeedbackMail(feedback, users) {
  const mails = users.map(user => user.email)
  const html = nunjucks.render("NewFeedback.html", {
    feedback,
    appName: config.longTitle,
    adminUrl: process.env.ADMIN_FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
    color: config.notificationColor,
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    bcc: mails,
    subject: `${config.shortTitle} - A New Feedback has been received`,
    html: html,
    priority: "high",
  }

  await sendMailByOptions(mailOptions)
}
module.exports = {
  sendNewUserActivationMail,
  sendNewUserMail,
  sendUserActivatedMail,
  sendResetPasswordMail,
  sendMail,
  sendNewFeedbackMail
};