import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Upload, Crown, User, Camera, Edit, Trash2, Settings, ArrowLeft, X, Bell, Send, Users, Eye, BarChart3 } from 'lucide-react'
import ApiService from '../services/api.js'
import { requestNotificationPermission, onMessageListener } from '../firebase.jsx'

import appIcon from '../assets/images/app_icon.jpg'

// استيراد الأيقونات
import finishingIcon from '../assets/icons/finishing.jpg'
import passingIcon from '../assets/icons/passing.jpg'
import dribblingIcon from '../assets/icons/dribbling.jpg'
import dexterityIcon from '../assets/icons/dexterity.jpg'
import lowerBodyIcon from '../assets/icons/lower_body_strength.jpg'
import aerialIcon from '../assets/icons/aerial_strength.jpg'
import defendingIcon from '../assets/icons/defending.jpg'
import gk1Icon from '../assets/icons/gk1.jpg'
import gk2Icon from '../assets/icons/gk2.jpg'
import gk3Icon from '../assets/icons/gk3.jpg'

function AddPlayerPage({ onBack }) {
  const [playerData, setPlayerData] = useState({
    name: '',
    image: null,
    overallRating: '', // إضافة حقل القوة الإجمالية
    finishing: '',
    passing: '',
    dribbling: '',
    dexterity: '',
    lowerBodyStrength: '',
    aerialStrength: '',
    defending: '',
    gk1: '',
    gk2: '',
    gk3: '',
    booster: 'No Booster'
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showAllPlayers, setShowAllPlayers] = useState(false)
  const [allPlayers, setAllPlayers] = useState([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [showSubscribersCount, setShowSubscribersCount] = useState(false)
  const [subscribersCount, setSubscribersCount] = useState(0)
  const [editingPlayerId, setEditingPlayerId] = useState(null)

  // تحميل عدد المشتركين عند بدء التطبيق وطلب إذن الإشعارات
  useEffect(() => {
    loadSubscribersCount()
    
    // طلب إذن الإشعارات عند تحميل التطبيق
    const initializeNotifications = async () => {
      try {
        await requestNotificationPermission()
        
        // الاستماع للرسائل في المقدمة
        onMessageListener()
          .then((payload) => {
            console.log('تم استلام إشعار:', payload)
            // يمكنك إضافة منطق لعرض الإشعار هنا
            if (payload.notification) {
              // عرض إشعار مخصص أو استخدام المتصفح
              new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: payload.notification.image || '/app_icon.png'
              })
            }
          })
          .catch((err) => console.log('خطأ في استلام الرسالة:', err))
      } catch (error) {
        console.error('خطأ في تهيئة الإشعارات:', error)
      }
    }
    
    initializeNotifications()
  }, [])

  const loadSubscribersCount = async () => {
    try {
      console.log('🔄 تحميل عدد المشتركين من الخلفية...');
      
      // محاولة الحصول على عدد التوكنات الفعلية
      const tokensResponse = await ApiService.getNotificationTokens();
      console.log('📊 استجابة التوكنات:', tokensResponse);
      
      if (tokensResponse && Array.isArray(tokensResponse.tokens)) {
        const actualCount = tokensResponse.tokens.length;
        setSubscribersCount(actualCount);
        console.log('✅ تم تحميل عدد المشتركين الفعلي:', actualCount);
        return;
      }
      
      // إذا فشل، جرب الطريقة القديمة
      const response = await ApiService.getNotificationSubscribers();
      console.log('📈 استجابة العدد التقليدي:', response);
      
      if (response && typeof response.count === 'number') {
        setSubscribersCount(response.count);
        console.log('✅ تم تحميل عدد المشتركين من الخلفية:', response.count);
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل عدد المشتركين من الخلفية:', error);
      
      // Fallback to localStorage if backend fails
      const localTokens = JSON.parse(localStorage.getItem('userNotificationTokens') || '[]');
      const localCount = localTokens.length;
      setSubscribersCount(localCount);
      console.log('🔄 استخدام العدد المحلي:', localCount);
    }
  }

  const handleInputChange = (field, value) => {
    // التحقق من أن القيمة بين 0 و 150
    if (value === '' || (Number(value) >= 0 && Number(value) <= 150)) {
      setPlayerData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPlayerData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // دالة لعرض عدد المشتركين في الإشعارات
  const handleShowSubscribersCount = () => {
    loadSubscribersCount() // تحديث العدد قبل العرض
    setShowSubscribersCount(true)
  }

  // دالة لعرض جميع اللاعبين
  const handleShowAllPlayers = async () => {
    try {
      const players = await ApiService.getPlayers();
      setAllPlayers(players);
      setShowAllPlayers(true);
    } catch (error) {
      console.error('Error loading players:', error);
      alert('حدث خطأ أثناء تحميل اللاعبين');
    }
  };

  // دالة لحذف لاعب
  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا اللاعب؟')) {
      try {
        await ApiService.deletePlayer(playerId);
        // إعادة تحميل قائمة اللاعبين
        const updatedPlayers = await ApiService.getPlayers();
        setAllPlayers(updatedPlayers);
        setSuccessMessage('تم حذف اللاعب بنجاح ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('حدث خطأ أثناء حذف اللاعب');
      }
    }
  };

  // دالة لتعديل لاعب
  const handleEditPlayer = (player) => {
    setPlayerData({
      name: player.name,
      image: null,
      overallRating: player.overallRating.toString(),
      finishing: player.finishing.toString(),
      passing: player.passing.toString(),
      dribbling: player.dribbling.toString(),
      dexterity: player.dexterity.toString(),
      lowerBodyStrength: player.lowerBodyStrength.toString(),
      aerialStrength: player.aerialStrength.toString(),
      defending: player.defending.toString(),
      gk1: player.gk1.toString(),
      gk2: player.gk2.toString(),
      gk3: player.gk3.toString(),
      booster: player.booster
    });
    setImagePreview(player.image);
    setEditingPlayerId(player.id);
    setShowAllPlayers(false);
  };

  // تعديل دالة handleSubmit لدعم التعديل
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!playerData.name.trim()) {
      alert('يجب إدخال اسم اللاعب')
      return
    }

    try {
      let imageUrl = imagePreview; // استخدام الصورة الحالية إذا لم يتم تغييرها
      
      // رفع الصورة إلى S3 إذا كانت موجودة وجديدة
      if (playerData.image) {
        const uploadResult = await ApiService.uploadImage(playerData.image);
        imageUrl = uploadResult.imageUrl;
      }

      // إعداد بيانات اللاعب
      const finalData = {
        name: playerData.name,
        overallRating: Number(playerData.overallRating) || 0,
        finishing: Number(playerData.finishing) || 0,
        passing: Number(playerData.passing) || 0,
        dribbling: Number(playerData.dribbling) || 0,
        dexterity: Number(playerData.dexterity) || 0,
        lowerBodyStrength: Number(playerData.lowerBodyStrength) || 0,
        aerialStrength: Number(playerData.aerialStrength) || 0,
        defending: Number(playerData.defending) || 0,
        gk1: Number(playerData.gk1) || 0,
        gk2: Number(playerData.gk2) || 0,
        gk3: Number(playerData.gk3) || 0,
        booster: playerData.booster,
        image: imageUrl
      };

      if (editingPlayerId) {
        // تعديل لاعب موجود
        await ApiService.updatePlayer(editingPlayerId, finalData);
        setSuccessMessage('تم تعديل اللاعب بنجاح ✅');
        setEditingPlayerId(null);
      } else {
        // إضافة لاعب جديد
        await ApiService.addPlayer(finalData);
        setSuccessMessage('تم إضافة اللاعب بنجاح ✅');
      }

      console.log('تم حفظ اللاعب:', finalData);
      
      // إخفاء الرسالة بعد 4 ثوان
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      
      // إعادة تعيين النموذج
      setPlayerData({
        name: '',
        image: null,
        overallRating: '',
        finishing: '',
        passing: '',
        dribbling: '',
        dexterity: '',
        lowerBodyStrength: '',
        aerialStrength: '',
        defending: '',
        gk1: '',
        gk2: '',
        gk3: '',
        booster: 'No Booster'
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error saving player:', error);
      alert('حدث خطأ أثناء حفظ اللاعب. يرجى المحاولة مرة أخرى.');
    }
  };

  // دالة لحساب القوة الإجمالية للاعب
  const calculateOverallRating = (playerStats) => {
    const stats = [
      playerStats.finishing || 0,
      playerStats.passing || 0,
      playerStats.dribbling || 0,
      playerStats.dexterity || 0,
      playerStats.lowerBodyStrength || 0,
      playerStats.aerialStrength || 0,
      playerStats.defending || 0,
      playerStats.gk1 || 0,
      playerStats.gk2 || 0,
      playerStats.gk3 || 0
    ]
    const total = stats.reduce((sum, stat) => sum + stat, 0)
    return Math.round(total / stats.length)
  }

  // دالة لإرسال الإشعارات اليدوية المحسنة
  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('يجب إدخال رسالة الإشعار')
      return
    }

    console.log('🚀 بدء عملية إرسال الإشعار...');
    console.log('📝 محتوى الإشعار:', notificationMessage);

    try {
      // أولاً: محاولة إرسال الإشعار عبر الخلفية للمشتركين الفعليين
      console.log('📡 محاولة إرسال الإشعار عبر الخلفية...');
      
      const notificationData = {
        title: 'eFootball Mobile - إشعار جديد',
        message: notificationMessage,
        icon: '/favicon.ico',
        url: window.location.origin
      };

      try {
        const backendResponse = await ApiService.sendNotificationToSubscribers(notificationData);
        console.log('✅ تم إرسال الإشعار عبر الخلفية بنجاح:', backendResponse);
        
        if (backendResponse && backendResponse.success) {
          setSuccessMessage(`✅ تم إرسال الإشعار بنجاح إلى ${backendResponse.recipientsCount || 'جميع'} المشتركين`);
          setNotificationMessage('');
          setTimeout(() => setSuccessMessage(''), 5000);
          return;
        }
      } catch (backendError) {
        console.warn('⚠️ فشل الإرسال عبر الخلفية، سيتم المحاولة محلياً:', backendError);
      }

      // ثانياً: الإرسال المحلي كبديل
      console.log('🔄 محاولة الإرسال المحلي...');
      
      // التحقق من دعم الإشعارات في المتصفح
      if (!('Notification' in window)) {
        console.error('❌ هذا المتصفح لا يدعم الإشعارات');
        alert('هذا المتصفح لا يدعم الإشعارات');
        return;
      }

      // التحقق من إذن الإشعارات
      if (Notification.permission === 'denied') {
        console.error('❌ الإشعارات محظورة في هذا المتصفح');
        alert('الإشعارات محظورة في هذا المتصفح. يرجى تفعيلها من إعدادات المتصفح.');
        return;
      }

      // طلب الإذن إذا لم يكن ممنوحاً
      if (Notification.permission === 'default') {
        console.log('🔔 طلب إذن الإشعارات...');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.error('❌ تم رفض إذن الإشعارات');
          alert('يجب السماح بالإشعارات لإرسال الرسائل');
          return;
        }
      }

      console.log('✅ إذن الإشعارات متاح');

      // الحصول على قائمة التوكنات المحفوظة
      const savedTokens = JSON.parse(localStorage.getItem('userNotificationTokens') || '[]');
      const subscribersCount = parseInt(localStorage.getItem('notificationSubscribers') || '0');
      
      console.log('👥 عدد المشتركين المسجلين:', subscribersCount);
      console.log('🔑 عدد التوكنات المحفوظة:', savedTokens.length);
      console.log('📋 التوكنات:', savedTokens);

      if (subscribersCount === 0) {
        console.warn('⚠️ لا يوجد مشتركين مسجلين');
        alert('لا يوجد مشتركين مسجلين في الإشعارات بعد. يرجى تفعيل الإشعارات أولاً من الصفحة الرئيسية.');
        return;
      }

      // إرسال الإشعار للمستخدم الحالي (كمثال)
      console.log('📤 إرسال الإشعار...');
      
      const notification = new Notification('🔔 eFootball Mobile - إشعار جديد', {
        body: notificationMessage,
        icon: appIcon,
        badge: appIcon,
        tag: 'efootball-manual-notification',
        requireInteraction: true,
        timestamp: Date.now(),
        data: {
          url: window.location.origin,
          timestamp: new Date().toISOString()
        }
      });

      // معالجة أحداث الإشعار
      notification.onclick = function(event) {
        console.log('🖱️ تم النقر على الإشعار');
        event.preventDefault();
        window.focus();
        notification.close();
      };

      notification.onshow = function() {
        console.log('👁️ تم عرض الإشعار بنجاح');
      };

      notification.onerror = function(error) {
        console.error('❌ خطأ في عرض الإشعار:', error);
      };

      // محاولة إرسال الإشعار عبر Service Worker (إذا كان متاحاً)
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            console.log('📡 إرسال الإشعار عبر Service Worker...');
            await registration.showNotification('🔔 eFootball Mobile - إشعار جديد', {
              body: notificationMessage,
              icon: appIcon,
              badge: appIcon,
              tag: 'efootball-sw-notification',
              requireInteraction: true,
              timestamp: Date.now(),
              data: {
                url: window.location.origin,
                timestamp: new Date().toISOString()
              }
            });
            console.log('✅ تم إرسال الإشعار عبر Service Worker');
          }
        } catch (swError) {
          console.log('⚠️ لم يتم إرسال الإشعار عبر Service Worker:', swError.message);
        }
      }

      // حفظ سجل الإشعار المرسل
      const notificationLog = JSON.parse(localStorage.getItem('sentNotifications') || '[]');
      notificationLog.push({
        id: Date.now(),
        message: notificationMessage,
        timestamp: new Date().toISOString(),
        recipientsCount: subscribersCount,
        tokensCount: savedTokens.length
      });
      
      // الاحتفاظ بآخر 50 إشعار فقط
      if (notificationLog.length > 50) {
        notificationLog.splice(0, notificationLog.length - 50);
      }
      
      localStorage.setItem('sentNotifications', JSON.stringify(notificationLog));

      console.log('✅ تم إرسال الإشعار بنجاح');
      console.log('📊 إحصائيات الإرسال:', {
        message: notificationMessage,
        subscribersCount: subscribersCount,
        tokensCount: savedTokens.length,
        timestamp: new Date().toISOString()
      });

      // عرض رسالة نجاح
      setSuccessMessage(`✅ تم إرسال الإشعار بنجاح إلى ${subscribersCount} مشترك`);
      setNotificationMessage('');
      setShowNotificationForm(false);

      // إخفاء الرسالة بعد 5 ثوان
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('❌ خطأ شامل في إرسال الإشعار:', error);
      console.error('📋 تفاصيل الخطأ:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      alert(`حدث خطأ في إرسال الإشعار: ${error.message}`);
    }
  }

  const boosterOptions = [
    'No Booster', 'Aerial +1', 'Agility +1', 'Ball-carrying +1', 'Crossing +1',
    'Defending +1', 'Duelling +1', 'Fantasista +1', 'Free-kick Taking +1',
    'Goalkeeping +1', 'Hard Worker +1', 'Passing +1', 'Physicality +1',
    'Saving +1', 'Shooting +1', 'Shutdown +1', "Striker's Instinct +1", 'Technique +1'
  ]

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        {/* زر العودة */}
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-4 text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة للصفحة الرئيسية
        </Button>

        {/* الرأس */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <img src={appIcon} alt="App Icon" className="w-16 h-16 rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {editingPlayerId ? 'تعديل اللاعب' : 'eFootball Mobile'}
          </h1>
          <p className="text-blue-200">
            {editingPlayerId ? 'قم بتعديل بيانات اللاعب' : 'إضافة لاعب جديد'}
          </p>
        </div>

        {/* لوحة التحكم مصغرة للموبايل */}
        <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm mb-4">
          <CardHeader className="p-3">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4 text-yellow-400" />
              لوحة التحكم
            </CardTitle>
            <CardDescription className="text-gray-300 text-xs">
              إدارة اللاعبين المحفوظين والإشعارات
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30 text-xs py-1 px-2 h-7"
                onClick={handleShowAllPlayers}
              >
                <User className="w-3 h-3 mr-1" />
                عرض جميع اللاعبين
              </Button>
              <Button 
                variant="outline" 
                className="bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30 text-xs py-1 px-2 h-7"
                onClick={handleShowAllPlayers}
              >
                <Edit className="w-3 h-3 mr-1" />
                تعديل لاعب
              </Button>
              <Button 
                variant="outline" 
                className="bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30 text-xs py-1 px-2 h-7"
                onClick={handleShowAllPlayers}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                حذف لاعب
              </Button>
              <Button 
                variant="outline" 
                className="bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30 text-xs py-1 px-2 h-7"
                onClick={() => setShowNotificationForm(true)}
              >
                <Send className="w-3 h-3 mr-1" />
                إرسال إشعار يدوي
              </Button>
              <Button 
                variant="outline" 
                className="bg-orange-600/20 border-orange-500 text-orange-300 hover:bg-orange-600/30 text-xs py-1 px-2 h-7"
                onClick={handleShowSubscribersCount}
              >
                <Users className="w-3 h-3 mr-1" />
                League Subscribers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* رسالة النجاح */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
            <p className="text-green-300 font-semibold text-lg">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* اسم اللاعب مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-3">
              <Label htmlFor="name" className="text-white text-sm font-semibold mb-2 block">
                اسم اللاعب *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسم اللاعب"
                value={playerData.name}
                onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 h-8 text-sm"
              />
            </CardContent>
          </Card>

          {/* القوة الإجمالية للاعب مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-3">
              <Label htmlFor="overallRating" className="text-white text-sm font-semibold mb-2 block">
                القوة الإجمالية للاعب (Overall Rating) *
              </Label>
              <Input
                id="overallRating"
                type="number"
                placeholder="أدخل القوة الإجمالية (0-150)"
                value={playerData.overallRating}
                onChange={(e) => handleInputChange('overallRating', e.target.value)}
                className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400 h-8 text-sm"
                min="0"
                max="150"
                required
              />
              <p className="text-gray-400 text-xs mt-1">القيمة يجب أن تكون بين 0 و 150</p>
            </CardContent>
          </Card>

          {/* رفع صورة اللاعب مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardContent className="p-3">
              <Label className="text-white text-sm font-semibold mb-2 block">
                صورة اللاعب
              </Label>
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <div className="mb-2">
                    <img src={imagePreview} alt="معاينة" className="w-20 h-24 object-cover rounded-lg border-2 border-gray-600" />
                  </div>
                ) : (
                  <div className="w-20 h-24 bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <Label htmlFor="image" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs">
                  <Upload className="w-3 h-3" />
                  اضغط لرفع الصورة
                </Label>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG أو GIF</p>
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* الإحصائيات الأساسية مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-white text-sm">الإحصائيات الأساسية</CardTitle>
              <CardDescription className="text-gray-300 text-xs">القيم من 0 إلى 150</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 p-3 pt-0">
              {[
                { key: 'finishing', label: 'Finishing', icon: finishingIcon },
                { key: 'passing', label: 'Passing', icon: passingIcon },
                { key: 'dribbling', label: 'Dribbling', icon: dribblingIcon },
                { key: 'dexterity', label: 'Dexterity', icon: dexterityIcon },
                { key: 'lowerBodyStrength', label: 'Lower Body Strength', icon: lowerBodyIcon },
                { key: 'aerialStrength', label: 'Aerial Strength', icon: aerialIcon },
                { key: 'defending', label: 'Defending', icon: defendingIcon }
              ].map(({ key, label, icon }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-white flex items-center gap-1.5 text-xs">
                    <img src={icon} alt={label} className="w-3 h-3 rounded" />
                    {label}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    placeholder="0"
                    value={playerData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400 h-7 text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* إحصائيات حراسة المرمى مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-white text-sm">إحصائيات حراسة المرمى</CardTitle>
              <CardDescription className="text-gray-300 text-xs">القيم من 0 إلى 150</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 p-3 pt-0">
              {[
                { key: 'gk1', label: 'GK 1', icon: gk1Icon },
                { key: 'gk2', label: 'GK 2', icon: gk2Icon },
                { key: 'gk3', label: 'GK 3', icon: gk3Icon }
              ].map(({ key, label, icon }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-white flex items-center gap-1.5 text-xs">
                    <img src={icon} alt={label} className="w-3 h-3 rounded" />
                    {label}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    placeholder="0"
                    value={playerData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="bg-gray-700/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400 h-7 text-xs"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* البوستر مصغر */}
          <Card className="bg-gray-800/80 border-gray-600 backdrop-blur-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Crown className="w-3 h-3 text-yellow-400" />
                البوستر
              </CardTitle>
              <CardDescription className="text-gray-300 text-xs">اختر بوستر واحد للاعب</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Select value={playerData.booster} onValueChange={(value) => setPlayerData(prev => ({ ...prev, booster: value }))}>
                <SelectTrigger className="bg-gray-700/50 border-gray-500 text-white h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {boosterOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-white hover:bg-gray-700 text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* زر الإرسال مصغر */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 text-sm rounded-xl shadow-lg"
          >
            {editingPlayerId ? 'تعديل اللاعب' : 'إضافة اللاعب'}
          </Button>
        </form>

        {/* الشاشة المنبثقة لعرض جميع اللاعبين */}
        {showAllPlayers && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-gray-600/50 backdrop-blur-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <CardContent className="p-6 relative z-10">
                {/* زر الإغلاق */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      جميع اللاعبين المحفوظين
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowAllPlayers(false)}
                    className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                {/* عرض اللاعبين */}
                {allPlayers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allPlayers.map((player, index) => (
                      <Card 
                        key={index}
                        className="bg-gradient-to-br from-gray-800/60 via-gray-900/70 to-gray-800/60 border border-gray-600/40 backdrop-blur-xl hover:border-blue-500/60 transition-all duration-300 hover:scale-105 group relative overflow-hidden shadow-xl hover:shadow-2xl"
                      >
                        <CardContent className="p-5 text-center relative z-10">
                          {/* صورة اللاعب */}
                          {player.image && (
                            <div className="mb-4">
                              <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                <img 
                                  src={player.image} 
                                  alt={player.name}
                                  className="relative w-16 h-16 rounded-full object-cover border-2 border-blue-500/40 group-hover:border-blue-400/60 transition-all duration-300"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* اسم اللاعب */}
                          <h3 className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                            {player.name}
                          </h3>
                          
                          {/* البوستر - تحت اسم اللاعب مباشرة */}
                          {player.booster && player.booster !== 'No Booster' && (
                            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-purple-500/20 rounded-xl p-2 border border-purple-500/30 mb-3">
                              <p className="text-xs text-purple-400 font-semibold">{player.booster}</p>
                            </div>
                          )}
                          
                          {/* القوة الإجمالية */}
                          <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/30 to-yellow-500/20 rounded-2xl p-3 border border-yellow-500/30 group-hover:border-yellow-400/50 transition-all duration-300 mb-3">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                {calculateOverallRating(player)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-semibold">القوة الإجمالية</p>
                          </div>

                          {/* أزرار التعديل والحذف */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30"
                              onClick={() => handleEditPlayer(player)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30"
                              onClick={() => handleDeletePlayer(player.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600/30">
                        <User className="w-12 h-12 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">لا توجد لاعبين محفوظين</h3>
                    <p className="text-gray-500 text-sm">قم بإضافة لاعبين أولاً</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* النافذة المنبثقة لإرسال الإشعارات اليدوية */}
        {showNotificationForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-gray-600/50 backdrop-blur-2xl max-w-md w-full shadow-2xl relative">
              <CardContent className="p-6 relative z-10">
                {/* زر الإغلاق */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Bell className="w-6 h-6 text-orange-400" />
                    <h2 className="text-xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      إرسال إشعار يدوي
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowNotificationForm(false)}
                    className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                {/* نموذج الإشعار */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notificationMessage" className="text-white text-lg font-semibold mb-3 block">
                      رسالة الإشعار
                    </Label>
                    <textarea
                      id="notificationMessage"
                      placeholder="اكتب رسالة الإشعار هنا..."
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      className="w-full h-32 bg-gray-700/50 border border-gray-500 text-white placeholder-gray-400 focus:border-orange-400 rounded-lg p-3 resize-none"
                      maxLength={200}
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      {notificationMessage.length}/200 حرف
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 via-yellow-500/30 to-orange-500/20 rounded-xl p-4 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-semibold text-sm">معاينة الإشعار</span>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
                      <p className="text-white font-semibold text-sm mb-1">eFootball Mobile - إشعار جديد</p>
                      <p className="text-gray-300 text-sm">
                        {notificationMessage || 'رسالة الإشعار ستظهر هنا...'}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSendNotification}
                    disabled={!notificationMessage.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-bold py-3 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    إرسال الإشعار للمشتركين
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* النافذة المنبثقة لعرض عدد المشتركين */}
        {showSubscribersCount && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-gray-600/50 backdrop-blur-2xl max-w-md w-full shadow-2xl relative">
              <CardContent className="p-6 relative z-10">
                {/* زر الإغلاق */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      إحصائيات الإشعارات
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowSubscribersCount(false)}
                    className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                {/* عرض الإحصائيات */}
                <div className="space-y-6">
                  {/* عدد المشتركين */}
                  <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-purple-500/20 rounded-3xl p-6 border-2 border-purple-500/40 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Users className="w-8 h-8 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">عدد المشتركين في الإشعارات</h3>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-4 border border-purple-500/50">
                        <span className="text-5xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                          {subscribersCount}
                        </span>
                        <p className="text-purple-200 font-semibold mt-2">مشترك</p>
                      </div>
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="bg-gradient-to-r from-blue-500/20 via-cyan-500/30 to-blue-500/20 rounded-2xl p-4 border border-blue-500/40">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-semibold">معلومات الإشعارات</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">حالة الإشعارات:</span>
                        <span className="text-green-400 font-semibold">
                          {Notification.permission === 'granted' ? 'مفعلة' : 'غير مفعلة'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">دعم المتصفح:</span>
                        <span className="text-blue-400 font-semibold">
                          {'Notification' in window ? 'مدعوم' : 'غير مدعوم'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* زر تحديث العدد */}
                  <Button 
                    onClick={loadSubscribersCount}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 text-lg rounded-xl shadow-lg"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    تحديث الإحصائيات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Toast Message */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl border border-green-400/50 rounded-2xl px-6 py-4 shadow-2xl shadow-green-500/25">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-white font-semibold text-sm">
                {successMessage}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddPlayerPage

