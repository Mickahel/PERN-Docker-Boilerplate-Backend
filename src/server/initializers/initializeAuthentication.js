const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserRepository = require('../../repositories/User')


module.exports = function initializeAuthentication() {

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {

        UserRepository.getUserByMail(email).then(user => {
            console.log(user)
            if (!user) return done(null, false, { errors: { 'user': ' user doesn\'t exist' } });
            if (!user.validatePassword(password)) return done(null, false, { errors: { 'email or password': 'is invalid' } });
            return done(null, user);
        }).catch(e => {
            done(null, false, e)
        })
    }
    ))

    passport.serializeUser((user, done) => done(undefined, user))

    passport.deserializeUser(async (user, done) => {
        try {
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });
};
