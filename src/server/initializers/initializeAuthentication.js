const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportFacebook = require("passport-facebook");
const passportGoogle = require("passport-google-oauth20");
const UserRepository = require("../../repositories/User");
const UserService = require("../../services/User");
const { database } = require("../../models")
const { statuses } = require("../../../config");
const _ = require("lodash");
const Logger = require("../../services/Logger");
const logger = new Logger("AUTH", "#2AB7CA");



module.exports = function initializeAuthentication() {


  const createUser = async (profile, origin) => {
    try {
      let newUser = database.models.user.build()
      newUser.status = statuses.ACTIVE;

      if (profile.emails) newUser.email = profile.emails[0].value;

      if (profile.name) {
        newUser.firstname = profile?.name?.givenName
        newUser.lastname = profile?.name?.familyName
      }

      // ? Add profile images
      let imageUrl
      if (origin == "facebook") {
        imageUrl = _.get(profile, 'photos[0].value')

      }
      else if (origin == "google") {
        imageUrl = _.get(profile, 'photos[0].value').replace("=s96-c", "=s400-c")
      }
      if (imageUrl) {
        const profileImageUrlName = await UserService.uploadProfileImageFromUrl(imageUrl)
        newUser.profileImageUrl = `uploads/profileImgs/${profileImageUrlName}`;
      }

      newUser.createPassword();
      return newUser;
    } catch (e) {
      logger.error(e)
      throw e
    }
  }

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        UserRepository.getUserByEmail(email)
          .then((user) => {
            if (!user)
              return done(null, false, {
                message: "user doesn't exist",
                status: 404,
              });
            else if (user.status == statuses.DISABLED)
              return done(null, false, {
                message: "user is disabled",
                status: 401,
              });
            else if (user.status == statuses.PENDING)
              return done(null, false, {
                message: "user is not activated",
                status: 401,
              });
            else if (
              !user.validatePassword(password) &&
              user.status == statuses.ACTIVE
            )
              return done(null, false, {
                message: "email or password is invalid",
                status: 403,
              });
            return done(null, user);
          })
          .catch((e) => {
            done(null, false, e);
          });
      }
    )
  );

  // ? http://www.passportjs.org/docs/facebook/
  passport.use(new passportFacebook.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL + "/v1/auth/login/callback/facebook",
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture.type(large)'],
    //scope: ['email'],
    //enableProof: true,
  }, async (accessToken, refreshToken, profile, done) => {
    // ? Check if there is a user inside the database by Facebook ID
    try {
      const id = profile.id;
      let user = await UserRepository.getUserByFacebookId(id)
      if (user) return done(null, user)

      // ? If there isn't, check if there is the user by email and attach the facebookId
      let emails = profile?.emails.map(single => single.value);
      if (_.isEmpty(emails) && profile._json.email) emails = [profile._json.email]
      if (_.isEmpty(emails)) return done("No email found")

      user = await UserRepository.getUserByEmails(emails);
      if (user) { // ? Found, I attach the facebook id
        user.facebookId = id;
        await user.save()
        return done(null, user)

      }

      // ? The user is not in the database, I register it
      let newUser = await createUser(profile, "facebook")
      newUser.facebookId = id;
      await newUser.save()

      return done(null, newUser)
    } catch (e) {
      return done(e, false)
    }
  }))

  //? http://www.passportjs.org/packages/passport-google-oauth20/

  passport.use(
    new passportGoogle.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + "/v1/auth/login/callback/google",
      },
      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        // ? Check if there is a user inside the database by Google ID
        try {
          const id = profile.id;
          let user = await UserRepository.getUserByGoogleId(id)
          if (user) return done(null, user)

          // ? If there isn't, check if there is the user by email and attach the facebookId
          let emails = profile.emails.map((single) => single.value);
          if (_.isEmpty(emails) && profile._json.email) emails = [profile._json.email]
          if (_.isEmpty(emails)) return done("No email found");

          user = await UserRepository.getUserByEmails(emails);
          if (user) {  // ? Found, I attach the facebook id
            user.googleId = id;
            await user.save();
            return done(undefined, user);
          }

          // ? The user is not in the database, I register it
          let newUser = await createUser(profile, "google");
          newUser.googleId = id;
          await newUser.save();

          return done(undefined, newUser);
        } catch (e) {
          logger.error(e)
          done(e, false);
        }
      }
    )
  );
};