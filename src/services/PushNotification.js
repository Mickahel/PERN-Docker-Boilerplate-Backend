const admin = require('firebase-admin')
const PushNotificationUserTokenRepository = require("../repositories/PushNotificationUserToken");
const { config } = require("../../config");


let serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
}

class PushNotificationUserTokenService {
    constructor() {
        //admin.initializeApp({
        //    credential: admin.credential.cert(serviceAccount),
        //    databaseURL: "https://.firebaseio.com"
        //});

        let apps = admin.apps
        let appToAssign = undefined
        for (let i = 0; i < apps.length; i++) {
            let app = apps[i]
            if (app && app.name === process.env.FIREBASE_PROJECT_ID) {
                appToAssign = app
                break;
            }
        }

        if (appToAssign) {
            this.app = appToAssign
        } else {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            }, process.env.FIREBASE_PROJECT_ID)
        }
    }

    sendNotificationUrl(user, title, body, logoImage, image, click_action) {
        return this.sendNotification(user, title, body, logoImage, image, { click_action })
    }

    async sendNotification(user, title, body, logoImage, image, data) {
        try {
            if (!user) return
            let userTokens = await PushNotificationUserTokenRepository.getUsersTokens(user);
            if (userTokens.length === 0) {
                //console.log("No tokens found", { user })
                return
            }
            //console.log(`Start sending to ${userTokens.length} clients`)
            // * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#Notification
            // * https://firebase.google.com/docs/cloud-messaging/send-message#node.js_7
            let result = await this.app.messaging().sendMulticast({
                tokens: userTokens,
                webpush: {
                    notification: {
                        // ? https://developer.mozilla.org/en-US/docs/Web/API/Notification/requireInteraction
                        //requireInteraction: true,
                        image,
                        //color: config.notificationColor,
                        icon: logoImage || 'img/icons/icon-96.png',
                        silent: false, // ? https://developer.mozilla.org/en-US/docs/Web/API/Notification/silent
                        title,
                        body,
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
                    data,
                    fcmOptions: {
                        link: data?.click_action,
                    },
                },
                android: {
                    priority: "high",
                    notification: {
                        click_action: data?.click_action,
                        image,
                        body,
                        title,
                        color: config.notificationColor,
                        icon: logoImage || 'img/icons/icon-96.png',
                        sound: "default",
                        visibility: "public",
                        default_vibrate_timings: true,
                        //default_light_settings: boolean,
                        vibrate_timings: ["0.5s", "1s", "2s"],
                        lightSettings: {
                            color: config.notificationColor,
                            lightOffDurationMillis: 100,
                            lightOnDurationMillis: 100,
                        }
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            category: config.shortTitle,
                            sound: "default",
                            contentAvailable: true,
                        }
                    }
                },
                //notification: {
                //    title,
                //    body,
                //    imageUrl: "",
                //}
            })
            return result
        } catch (e) {
            throw e
        }
    }

}

module.exports = new PushNotificationUserTokenService();