require('dotenv').config();
const nodemailer = require('nodemailer')
const nunjucks = require('nunjucks')
const Logger = require('./Logger')
const logger = new Logger("Mailer", "#a2aec2")

nunjucks.configure('resources',{ autoescape: true });

const transporter = nodemailer.createTransport({
    //service: process.env.MAILER_TRANSPORT,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = {
   /* renderNewUserActivationMail,
    sendNewUserActivationMail,
    sendNewUserMail,
    sendUserActivatedMail,
    sendResetPasswordMail,
    sendMail,*/
}
