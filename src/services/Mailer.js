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

function sendNewUserActivationMail(user) {
  let html = nunjucks.render("NewUserMailActivation.html", {
    user,
    appName: config.longTitle,
    mainDomain: config.mainDomain,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
  });
  sendMail(user.email, `${config.shortTitle} - Account Activation`, html);
}

async function sendNewUserMail(user, plainPassword) {
  const html = nunjucks.render("NewUserMail.html", {
    user,
    plainPassword,
    appName: config.longTitle,
    mainDomain: config.mainDomain,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
  });
  sendMail(user.email, `${config.shortTitle} - Welcome`, html);
}

async function sendUserActivatedMail(user) {
  const html = nunjucks.render("NewUserMailActivated.html", {
    user,
    appName: config.longTitle,
    mainDomain: config.mainDomain,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
  });
  sendMail(user.email, `${config.shortTitle} - Account Activated`, html);
}

async function sendResetPasswordMail(user) {
  const html = nunjucks.render("ResetPasswordMail.html", {
    user,
    appName: config.longTitle,
    mainDomain: config.mainDomain,
    frontendUrl: process.env.FRONTEND_URL,
    imagesUrl: process.env.BACKEND_IMAGES_URL,
  });
  sendMail(user.email, `${config.shortTitle} - Reset your password`, html);
}

module.exports = {
  sendNewUserActivationMail,
  sendNewUserMail,
  sendUserActivatedMail,
  sendResetPasswordMail,
  sendMail,
};
