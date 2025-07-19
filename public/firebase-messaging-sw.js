importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// "Default" Firebase configuration (prevents errors during init)
const firebaseConfig = {
  apiKey: "AIzaSyDKeJxpUximZQGJNRg9pYnu82WlwWWL26A",
  authDomain: "drefootball-push.firebaseapp.com",
  projectId: "drefootball-push",
  storageBucket: "drefootball-push.firebasestorage.app",
  messagingSenderId: "679680926337",
  appId: "1:679680926337:web:ee4635a25b5008cf8a6380",
  measurementId: "G-T6XDC93ZJ8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || ".//firebase-logo.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


