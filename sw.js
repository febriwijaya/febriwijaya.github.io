importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
   console.log("Workbox berhasil dimuat");

   // Lakukan precaching app shell
   workbox.precaching.precacheAndRoute([{
         url: "/",
         revision: "1"
      },
      {
         url: "/nav.html",
         revision: "1"
      },
      {
         url: "/index.html",
         revision: "1"
      },
      {
         url: "/push.js",
         revision: "1"
      },
      {
         url: "/sw.js",
         revision: "1"
      },
      {
         url: "/manifest.json",
         revision: "1"
      },
      {
         url: "/css/materialize.min.css",
         revision: "1"
      },
      {
         url: "/img/icon_72.png",
         revision: "1"
      },
      {
         url: "/img/icon_96.png",
         revision: "1"
      },
      {
         url: "/img/icon_128.png",
         revision: "1"
      },
      {
         url: "/img/icon_256.png",
         revision: "1"
      },
      {
         url: "/img/facebook.png",
         revision: "1"
      },
      {
         url: "/img/github.png",
         revision: "1"
      },
      {
         url: "/img/instagram.png",
         revision: "1"
      },
      {
         url: "/js/api.js",
         revision: "1"
      },
      {
         url: "js/db.js",
         revision: "1"
      },
      {
         url: "/js/idb.js",
         revision: "1"
      },
      {
         url: "/js/script.js",
         revision: "1"
      },
      {
         url: "/js/materialize.min.js",
         revision: "1"
      },
      {
         url: "/js/nav.js",
         revision: "1"
      },
      {
         url: "/pages/favorite.html",
         revision: "1"
      },
      {
         url: "/pages/klasemen.html",
         revision: "1"
      },
      {
         url: "/pages/teams.html",
         revision: "1"
      }
   ], {
      ignoreUrlParametersMatching: [/.*/]
   });

   workbox.routing.registerRoute(
      new RegExp("https://api.football-data.org/v2/"),
      workbox.strategies.staleWhileRevalidate({
         plugins: [
            new workbox.cacheableResponse.Plugin({
               statuses: [200]
            }),
            new workbox.expiration.Plugin({
               maxAgeSeconds: 60 * 60 * 24 * 365,
               maxEntries: 30
            })
         ]
      })
   );

   workbox.routing.registerRoute(
      /.*(?:googleapis|gstatic)\.com/,
      workbox.strategies.staleWhileRevalidate({
         cacheName: "google-fonts-stylesheets"
      })
   );

   workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
         cacheName: 'images',
         plugins: [
            new workbox.expiration.Plugin({
               maxEntries: 60,
               maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
         ],
      }),
   );

   workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      new workbox.strategies.StaleWhileRevalidate({
         cacheName: 'static-resources',
      })
   );

   workbox.routing.registerRoute(
      new RegExp("/pages/"),
      workbox.strategies.staleWhileRevalidate()
   );
} else {
   console.log("Workbox gagal dimuat");
}

self.addEventListener('push', function (event) {
   var body;
   if (event.data) {
      body = event.data.text();
   } else {
      body = 'Push message no payload';
   }
   var options = {
      body: body,
      icon: 'img/icon_128.png',
      vibrate: [100, 50, 100],
      data: {
         dateOfArrival: Date.now(),
         primaryKey: 1
      }
   };
   event.waitUntil(
      self.registration.showNotification('Push Notification', options)
   );
});