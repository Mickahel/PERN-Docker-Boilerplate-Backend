import passport from "passport";
import * as passportLocal from "passport-local";
import * as passportFacebook from "passport-facebook";
import * as passportGoogle from "passport-google-oauth20";
import UserRepository from "../../repositories/user";
import UserService from "../../services/user";
import { statuses } from "../../enums";
import _ from "lodash";
import Logger from "../../services/logger";
import User from "../../models/userEntity";
const logger = new Logger("AUTH", "#2AB7CA");

import MailerService from "../../services/mailer";

export default function initializeAuthentication(): void {
	const createUser = async (profile: passport.Profile, origin: string): Promise<User> => {
		try {
			const newUser = new User();
			newUser.status = statuses.values().ACTIVE as string;

			if (profile.emails) newUser.email = profile.emails[0].value;

			if (profile.name) {
				newUser.firstname = profile?.name?.givenName;
				newUser.lastname = profile?.name?.familyName;
			}

			// ? Add profile images
			let imageUrl;
			if (origin == "facebook") {
				imageUrl = _.get(profile, "photos[0].value");
			} else if (origin == "google") {
				imageUrl = _.get(profile, "photos[0].value").replace("=s96-c", "=s400-c");
			}
			if (imageUrl) {
				const profileImageUrlName = await UserService.uploadProfileImageFromUrl(imageUrl);
				newUser.profileImageUrl = `uploads/profileImgs/${profileImageUrlName}`;
			}

			newUser.createPassword();
			MailerService.sendUserActivatedMail(newUser);
			return newUser;
		} catch (e) {
			logger.error(e);
			throw e;
		}
	};

	const socialLogin = async (user: User, done: Function, origin?: string, socialId?: string) => {
		// TODO Add typescript
		if (user.status == statuses.values().ACTIVE) {
			if (origin == "google") user.googleId = socialId;
			else if (origin == "facebook") user.facebookId = socialId;
			await user.save();
			return done(null, user);
		}
		if (user.status == statuses.values().PENDING || !user.status) {
			user.status = statuses.values().ACTIVE as string;
			if (origin == "google") user.googleId = socialId;
			else if (origin == "facebook") user.facebookId = socialId;
			await user.save();
			return done(null, user);
		}
		if (user.status == statuses.values().DISABLED) return done("disabledUser");
	};

	passport.use(
		"local",
		new passportLocal.Strategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			async function (email: string, password: string, done: Function) {
				try {
					const userRepository = new UserRepository();
					const user = await userRepository.getBy({ where: { email } });
					if (!user)
						return done(null, false, {
							message: "user doesn't exist",
							status: 404,
						});
					else if (user.status == statuses.values().DISABLED)
						return done(null, false, {
							message: "user is disabled",
							status: 401,
						});
					else if (user.status == statuses.values().PENDING)
						return done(null, false, {
							message: "user is not activated",
							status: 401,
						});
					else if (!user.validatePassword(password) && user.status == statuses.values().ACTIVE)
						return done(null, false, {
							message: "email or password is invalid",
							status: 403,
						});
					return done(null, user);
				} catch (e) {
					done(null, false, e);
				}
			}
		)
	);

	// ? http://www.passportjs.org/docs/facebook/
	passport.use(
		new passportFacebook.Strategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				callbackURL: process.env.BACKEND_URL + "/v1/auth/login/callback/facebook",
				profileFields: ["id", "displayName", "email", "first_name", "last_name", "picture.type(large)"],
				//scope: ['email'],
				//enableProof: true,
			},
			async (accessToken: string, refreshToken: string, profile: passportFacebook.Profile, done: Function) => {
				// ? Check if there is a user inside the database by Facebook ID
				try {
					const facebookId = profile.id;
					const userRepository = new UserRepository();
					let user = await userRepository.getBy({ where: { facebookId } });
					if (user) return socialLogin(user, done);

					// ? If there isn't, check if there is the user by email and attach the facebookId
					if (profile.emails) {
						let emails = profile.emails.map((single) => single.value);
						if (_.isEmpty(emails) && profile._json.email) emails = [profile._json.email];
						if (_.isEmpty(emails)) return done("No email found");

						// ? Found, I attach the facebook id
						user = await userRepository.getUserByEmail(emails);
						if (user) return socialLogin(user, done, "facebook", facebookId);

						// ? The user is not in the database, I register it
						let newUser = await createUser(profile, "facebook");
						newUser.facebookId = facebookId;
						await newUser.save();

						return done(null, newUser);
					}
				} catch (e) {
					return done(e, false);
				}
			}
		)
	);

	//? http://www.passportjs.org/packages/passport-google-oauth20/

	passport.use(
		new passportGoogle.Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: process.env.BACKEND_URL + "/v1/auth/login/callback/google",
			},
			async (accessToken: string, refreshToken: string, profile: passportGoogle.Profile, done: Function) => {
				// TODO ADD Typescript
				// ? Check if there is a user inside the database by Google ID
				try {
					const googleId = profile.id;
					const userRepository = new UserRepository();
					let user = await userRepository.getBy({ where: { googleId } });
					if (user) return socialLogin(user, done);

					// ? If there isn't, check if there is the user by email and attach the facebookId
					if (profile.emails) {
						let emails = profile.emails.map((single) => single.value);
						if (_.isEmpty(emails) && profile._json.email) emails = [profile._json.email];
						if (_.isEmpty(emails)) return done("No email found");

						// ? Found, I attach the facebook id
						user = await userRepository.getUserByEmail(emails);
						if (user) return socialLogin(user, done, "google", googleId);

						// ? The user is not in the database, I register it
						let newUser = await createUser(profile, "google");
						newUser.googleId = googleId;
						await newUser.save();

						return done(undefined, newUser);
					}
				} catch (e) {
					logger.error(e);
					done(e, false);
				}
			}
		)
	);
}
