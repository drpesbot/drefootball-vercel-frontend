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
    console.log("🔔 Notification permission requested");
    console.log("🔔 بدء طلب إذن الإشعارات...");
    
    // طلب الإذن من المستخدم
    const permission = await Notification.requestPermission();
    console.log("📋 نتيجة طلب الإذن:", permission);
    
    if (permission === 'granted') {
      console.log("✅ تم منح إذن الإشعارات");
      
      // الحصول على التوكن
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      
      if (currentToken) {
        console.log("🔑 FCM Token:", currentToken);
        
        // إرسال التوكن إلى الـ Backend
        try {
          console.log("📤 إرسال التوكن إلى الـ Backend...");
          const response = await fetch("https://pop-srne.onrender.com/api/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: currentToken }),
          });
          
          const responseData = await response.json();
          console.log("📥 استجابة الـ Backend:", responseData);
          
          if (response.ok) {
            console.log("✅ تم حفظ التوكن بنجاح في الـ Backend");
            alert("تم تفعيل الإشعارات بنجاح! ✅");
          } else {
            console.error("❌ فشل في حفظ التوكن:", response.statusText, responseData);
            alert("فشل في حفظ التوكن: " + response.statusText);
          }
        } catch (error) {
          console.error("❌ خطأ في إرسال التوكن إلى الـ Backend:", error);
          alert("خطأ في الاتصال بالخادم: " + error.message);
        }
        
        return currentToken;
      } else {
        console.log("❌ لم يتم الحصول على التوكن");
        alert("فشل في الحصول على توكن الجهاز");
        return null;
      }
    } else {
      console.log("❌ تم رفض إذن الإشعارات");
      alert("تم رفض إذن الإشعارات. يرجى السماح بالإشعارات من إعدادات المتصفح.");
      return null;
    }
  } catch (err) {
    console.error("❌ خطأ في طلب إذن الإشعارات:", err);
    alert("خطأ في طلب إذن الإشعارات: " + err.message);
    return null;
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

