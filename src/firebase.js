import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKeJxpUximZQGJNRg9pYnu82WlwWWL26A",
  authDomain: "drefootball-push.firebaseapp.com",
  projectId: "drefootball-push",
  storageBucket: "drefootball-push.firebasestorage.app",
  messagingSenderId: "679680926337",
  appId: "1:679680926337:web:ee4635a25b5008cf8a6380",
  measurementId: "G-T6XDC93ZJ8"
};

// VAPID public key for FCM
export const VAPID_KEY = "BCag4MVhMLnkq40eH2yVCtwi_jbvnxMVKgTmQE5bKbYYtUJpCAkW4I83XsBeCYGYNTpuMGjACJsPfKj1woHzAyI";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };

