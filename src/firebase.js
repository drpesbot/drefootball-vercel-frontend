import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// طلب إذن الإشعارات والحصول على التوكن
export const requestNotificationPermission = async () => {
  try {
    console.log("طلب إذن الإشعارات...");
    
    // طلب الإذن من المستخدم
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log("تم منح إذن الإشعارات");
      
      // الحصول على التوكن
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      
      if (currentToken) {
        console.log("تم الحصول على التوكن:", currentToken);
        
        // إرسال التوكن إلى الـ Backend
        try {
          const response = await fetch("https://pop-srne.onrender.com/api/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: currentToken }),
          });
          
          if (response.ok) {
            console.log("تم حفظ التوكن بنجاح في الـ Backend");
          } else {
            console.error("فشل في حفظ التوكن:", response.statusText);
          }
        } catch (error) {
          console.error("خطأ في إرسال التوكن إلى الـ Backend:", error);
        }
        
        return currentToken;
      } else {
        console.log("لم يتم الحصول على التوكن");
      }
    } else {
      console.log("تم رفض إذن الإشعارات");
    }
  } catch (err) {
    console.error("خطأ في طلب إذن الإشعارات:", err);
  }
};

// الاستماع للرسائل في المقدمة
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("تم استلام رسالة في المقدمة:", payload);
      resolve(payload);
    });
  });

export { messaging };

