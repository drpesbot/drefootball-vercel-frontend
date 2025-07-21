// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app\'s Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKeJxpUximZQGJNRg9pYnu82WlwWWL26A",
  authDomain: "drefootball-push.firebaseapp.com",
  projectId: "drefootball-push",
  storageBucket: "drefootball-push.firebasestorage.app",
  messagingSenderId: "679680926337",
  appId: "1:679680926337:web:ee4635a25b5008cf8a6380"
};

// VAPID public key for FCM
export const VAPID_KEY = "BCag4MVhMLnkq40eH2yVCtwi_jbvnxMVKgTmQE5bKbYYtUJpCAkW4I83XsBeCYGYNTpuMGjACJsPfKj1woHzAyI";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize messaging with error handling
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.error("Error initializing Firebase messaging:", error);
}

// دالة لتسجيل Service Worker بشكل صحيح
const registerServiceWorker = async () => {
  if (
    'serviceWorker' in navigator
  ) {
      console.log("🔧 تسجيل Service Worker...");
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      
      console.log("✅ تم تسجيل Service Worker بنجاح:", registration);
      
      // انتظار حتى يصبح Service Worker نشطاً
      if (registration.installing) {
        console.log("⏳ Service Worker قيد التثبيت...");
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', () => {
            if (registration.installing.state === 'installed') {
              resolve();
            }
          });
        });
      }
      
      if (registration.waiting) {
        console.log("⏳ Service Worker في انتظار التفعيل...");
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });     }
      
      if (registration.active) {
        console.log("✅ Service Worker نشط ومستعد");
      }
      
      return registration;
    } catch (error) {
      console.error("❌ فشل في تسجيل Service Worker:", error);
      throw error;
    }
  } else {
    throw new Error("Service Worker غير مدعوم في هذا المتصفح");
  }
};

// دالة لإرسال التوكن إلى الـ Backend
const sendTokenToBackend = async (token) => {
  try {
    console.log("📤 إرسال التوكن إلى الـ Backend...");
    const response = await fetch("https://pop-srne.onrender.com/api/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });
    
    const responseData = await response.json();
    console.log("📥 استجابة الـ Backend:", responseData);
    
    if (response.ok) {
      console.log("✅ تم حفظ التوكن بنجاح في الـ Backend");
      return true;
    } else {
      console.error("❌ فشل في حفظ التوكن:", response.statusText, responseData);
      return false;
    }
  } catch (error) {
    console.error("❌ خطأ في إرسال التوكن إلى الـ Backend:", error);
    return false;
  }
};

// دالة لاختبار التوكن الجديد
const testNewToken = async (token) => {
  try {
    console.log("🧪 اختبار التوكن الجديد...");
    const testResponse = await fetch("https://pop-srne.onrender.com/api/send-to-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        token: token,
        title: "🎉 تم تفعيل الإشعارات بنجاح!",
        body: "مرحباً! التوكن الجديد يعمل بشكل مثالي ✅"
      }),
    });
    
    const testData = await testResponse.json();
    console.log("🧪 نتيجة اختبار التوكن:", testData);
    
    if (testResponse.ok) {
      alert("🎉 تم تفعيل الإشعارات بنجاح! ستصلك رسالة اختبار الآن.");
      return true;
    } else {
      alert("⚠️ تم حفظ التوكن لكن فشل في إرسال رسالة الاختبار: " + testData.error);
      return false;
    }
  } catch (error) {
    console.error("❌ خطأ في إرسال رسالة الاختبار:", error);
    alert("❌ خطأ في الاتصال بالخادم لاختبار التوكن: " + error.message);
    return false;
  }
};

// طلب إذن الإشعارات والحصول على التوكن مع تحسينات
export const requestNotificationPermission = async () => {
  try {
    console.log("🔔 بدء عملية طلب إذن الإشعارات...");
    
    // التحقق من دعم المتصفح للإشعارات
    if (!("Notification" in window)) {
      throw new Error("هذا المتصفح لا يدعم الإشعارات");
    }

    // التحقق من دعم Service Worker
    if (!("serviceWorker" in navigator)) {
      throw new Error("هذا المتصفح لا يدعم Service Worker");
    }

    // التحقق من تهيئة messaging
    if (!messaging) {
      throw new Error("فشل في تهيئة Firebase messaging");
    }
    
    // تسجيل Service Worker أولاً
    console.log("🔧 تسجيل Service Worker...");
    const registration = await registerServiceWorker();
    
    // طلب الإذن من المستخدم
    console.log("📋 طلب إذن الإشعارات من المستخدم...");
    const permission = await Notification.requestPermission();
    console.log("📋 نتيجة طلب الإذن:", permission);
    
    if (permission === 'granted') {
      console.log("✅ تم منح إذن الإشعارات");
      
      try {
        // الحصول على التوكن مع تمرير Service Worker registration
        console.log("🔑 الحصول على FCM Token...");
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          console.log("🔑 FCM Token تم الحصول عليه بنجاح:", currentToken);
          console.log("🔑 طول التوكن:", currentToken.length, "حرف");
          
          // التحقق من صحة التوكن (يجب أن يكون أطول من 100 حرف)
          if (currentToken.length < 100) {
            throw new Error("التوكن المُستلم قصير جداً وقد يكون غير صالح");
          }
          
          // إرسال التوكن إلى الـ Backend
          const saved = await sendTokenToBackend(currentToken);
          if (saved) {
            await testNewToken(currentToken);
          }
          
          return currentToken;
        } else {
          console.log("❌ لم يتم الحصول على التوكن");
          alert("❌ فشل في الحصول على توكن الجهاز. تأكد من تفعيل الإشعارات في إعدادات المتصفح.");
          return null;
        }
      } catch (tokenError) {
        console.error("❌ خطأ في الحصول على التوكن:", tokenError);
        alert("❌ خطأ في الحصول على توكن الجهاز: " + tokenError.message);
        return null;
      }
    } else {
      console.log("❌ تم رفض إذن الإشعارات");
      alert("❌ تم رفض إذن الإشعارات. يرجى السماح بالإشعارات من إعدادات المتصفح.");
      return null;
    }
  } catch (err) {
    console.error("❌ خطأ في طلب إذن الإشعارات:", err);
    alert("❌ خطأ في طلب إذن الإشعارات: " + err.message);
    return null;
  }
};

// الاستماع للرسائل في المقدمة
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("📨 تم استلام رسالة في المقدمة:", payload);
        
        // عرض إشعار مخصص
        if (payload.notification) {
          const { title, body } = payload.notification;
          
          // إنشاء إشعار مخصص
          if (Notification.permission === \'granted\') {
            new Notification(title, {
              body: body,
              icon: \'/firebase-logo.png\',
              badge: \'/firebase-logo.png\',
              tag: \'fcm-notification\',
              requireInteraction: true
            });
          }
        }
        
        resolve(payload);
      });
    } else {
      console.error("Messaging not initialized");
    }
  });

export { messaging };





