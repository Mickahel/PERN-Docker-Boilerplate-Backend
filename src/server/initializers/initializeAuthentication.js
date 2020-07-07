const passport = require("passport");
const passportLocal = require("passport-local");
//const ModularLogger = require("../../services/logger");
//const logger = new ModularLogger("Server Starter", "bgGreenBright");

module.exports = function initializeAuthentication() {

    passport.use('local', new passportLocal.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },function (email, password, done) {
            UserRepository.getUserByMail(email).then(user => {
                if (!user || !user.validatePassword(password)) {
                    return done(null, false, { errors: { 'email or password': 'is invalid' } });
                }
                return done(null, user);
            }).catch(e => {
                done(null, false, e)
            })
        }
    ))

    passport.serializeUser((user, done) => {
        done(undefined, user);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });
};
