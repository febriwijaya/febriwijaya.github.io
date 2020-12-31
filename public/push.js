const webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BG8ZFCw2IxIlOak5fQyJBafuYPkQyaOkqLsrpjTVUYALYhO638zwW33wondWB_-ZRC3fxuHy-7mkFYvh9UQpw2A",
   "privateKey": "4Pm3LS8dirk-W8y2PAsIxIoVuetXWJKojZJlH0InKcs"
};

webPush.setVapidDetails(
   'mailto:febriwijaya0298@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
);

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/er1zBjDo2eI:APA91bFedlUybmF0XeJ28Gmv1QKsY5-cNzbrU3qMmq_ZqA76Emy4MCHutaDTs6mg0pqsqJDS_HIBKGLthkS2ITMC3W9PyNunguPaxlM4O_mkv4EaK2kbIXIbbJHcSFv4NPLJS09oY5M7",
   "keys": {
      "p256dh": "BIdl74EdkxjAkPxFtkbILPlzaBMC0qlMT/G80GE9D0Ghj8kz1tQd9BwzVzt8BuRM6W5bCFjir+Ir5IrXZfvsOU0=",
      "auth": "T8HUezoIt+pic6SRxg0ATg==",
   }
};

const payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

const options = {
   gcmAPIKey: "78743329978",
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);