const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserRepository = require('../../repositories/User')


module.exports = function initializeAuthentication() {

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {

        UserRepository.getUserByMail(email).then(user => {
            if (!user) return done(null, false, { message: 'user doesn\'t exist', status: 404 });
            else if (user.status==-1) return done(null, false, { message: 'user is deleted', status:401 });
            else if (user.status==0) return done(null, false, { message: 'user is not activated', status:401 });
            else if (!user.validatePassword(password) && user.status==1) return done(null, false, { message: ' email or password is invalid', status:403});
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
