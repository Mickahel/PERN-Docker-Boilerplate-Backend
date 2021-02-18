import admin from "firebase-admin";
import PushNotificationUserTokenRepository from "../repositories/pushNotificationUserToken";
import config from "../config";
import User from "../models/userEntity";
const pushNotificationUserTokenRepository = new PushNotificationUserTokenRepository();
let serviceAccount = {
	type: process.env.FIREBASE_TYPE as string,
	project_id: process.env.FIREBASE_PROJECT_ID as string,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID as string,
	private_key: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
	client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
	client_id: process.env.FIREBASE_CLIENT_ID as string,
	auth_uri: process.env.FIREBASE_AUTH_URI as string,
	token_uri: process.env.FIREBASE_TOKEN_URI as string,
	auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL as string,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL as string,
};

export default class PushNotificationUserTokenService {
	app: admin.app.App;
	constructor() {
		//admin.initializeApp({
		//    credential: admin.credential.cert(serviceAccount),
		//    databaseURL: "https://.firebaseio.com"
		//});

		let apps = admin.apps;
		let appToAssign: admin.app.App | undefined = undefined;
		for (let i = 0; i < apps.length; i++) {
			let app = apps[i];
			if (app && app.name === process.env.FIREBASE_PROJECT_ID) {
				appToAssign = app;
				break;
			}
		}

		if (appToAssign) {
			this.app = appToAssign;
		} else {
			this.app = admin.initializeApp(
				{
					credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
					databaseURL: process.env.FIREBASE_DATABASE_URL,
				},
				process.env.FIREBASE_PROJECT_ID
			);
		}
	}

	sendNotificationUrl(user: User[] | undefined, title?: string, body?: string, logoImage?: string, image?: string, click_action?: any) {
		return this.sendNotification(user, title, body, logoImage, image, { click_action });
	}

	async sendNotification(user: User[] | undefined, title?: string, body?: string, logoImage?: string, image?: string, data?: any) {
		try {
			if (!user) return;
			let userTokens = await pushNotificationUserTokenRepository.getUsersTokens(user);
			if (userTokens.length === 0) return;
			// * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification
			// * https://firebase.google.com/docs/cloud-messaging/send-message#node.js_7
			let result = await this.app.messaging().sendMulticast({
				tokens: userTokens,
				webpush: {
					notification: {
						priority: "high",
						// ? https://developer.mozilla.org/en-US/docs/Web/API/Notification/requireInteraction
						//requireInteraction: true,
						image,
						//color: config.notificationColor,
						icon: logoImage || "img/icons/icon-96.png",
						silent: false, // ? https://developer.mozilla.org/en-US/docs/Web/API/Notification/silent
						title: title || "",
						body: body || "",
						data,
						//click_action: data.click_action, // ? useless
						sound: "default",
						// ? https://firebase.googleblog.com/2018/05/web-notifications-api-support-now.html
						/*"actions": [
                            {
                                "title": "Like",
                                "action": "like",
                                "icon": "img/icons/icon-96.png"
                            },
                            {
                                "title": "Unsubscribe",
                                "action": "unsubscribe",
                                "icon": "img/icons/icon-96.png"
                            }
                        ]*/
					},
					//data,
					fcmOptions: {
						link: data?.click_action,
					},
				},
				android: {
					priority: "high",
					notification: {
						//click_action: data?.click_action, // ? TS NO
						//image,// ? TS NO
						body,
						title,
						color: config.notificationColor,
						icon: logoImage || "img/icons/icon-96.png",
						sound: "default",
						visibility: "public",
						//default_vibrate_timings: true, // ? TS NO
						//default_light_settings: boolean, // ? TS NO
						//vibrate_timings: ["0.5s", "1s", "2s"], // ? TS NO
						lightSettings: {
							color: config.notificationColor,
							lightOffDurationMillis: 100,
							lightOnDurationMillis: 100,
						},
					},
				},
				apns: {
					payload: {
						aps: {
							category: config.shortTitle,
							sound: "default",
							contentAvailable: true,
						},
					},
				},
				//notification: {
				//    title,
				//    body,
				//    imageUrl: "",
				//}
			});
			return result;
		} catch (e) {
			throw e;
		}
	}
}
