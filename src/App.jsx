import { useState, useEffect } from 'react'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Search, Settings, Users, Star, Zap, Trophy, Award, Crown, Sparkles, Phone, Bell, Play, Gamepad2, Info, X } from 'lucide-react'
import AddPlayerPage from './components/AddPlayerPage'
import './App.css'
import ApiService from './services/api.js'

import appIcon from './assets/images/football_icon_no_black_edges.png'
import PasswordProtection from './components/PasswordProtection.jsx'
import NotificationPopup from './components/NotificationPopup.jsx'; // استيراد مكون الشاشة المنبثقة

import { requestNotificationPermission } from './firebase';


// استيراد الأيقونات
import finishingIcon from './assets/icons/finishing.jpg'
import passingIcon from './assets/icons/passing.jpg'
import dribblingIcon from './assets/icons/dribbling.jpg'
import dexterityIcon from './assets/icons/dexterity.jpg'
import lowerBodyStrengthIcon from './assets/icons/lower_body_strength.jpg'
import aerialStrengthIcon from './assets/icons/aerial_strength.jpg'
import defendingIcon from './assets/icons/defending.jpg'
import gk1Icon from './assets/icons/gk1.jpg'
import gk2Icon from './assets/icons/gk2.jpg'
import gk3Icon from './assets/icons/gk3.jpg'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [players, setPlayers] = useState([])
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false); // حالة للتحكم في ظهور النافذة المنبثقة
  const [showToast, setShowToast] = useState(false); // حالة للتحكم في ظهور رسالة التوست

  // تحميل اللاعبين من API عند بدء التطبيق
  useEffect(() => {
    loadPlayers();
    checkNotificationStatus();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log('✅ Service Worker registered successfully:', registration);
          })
          .catch((err) => {
            console.log('❌ Service Worker registration failed:', err);
          });
      });
    }
  }, [])

  const checkNotificationStatus = async () => {
    const permission = Notification.permission;
    const hasSeenPopup = localStorage.getItem('notificationPopupSeen');

    // إذا لم يرَ المستخدم النافذة من قبل وليس لديه إذن مُمنوح
    if (!hasSeenPopup && permission !== 'granted') {
      setShowNotificationPopup(true);
    }
  };

  const handleEnableNotificationsClick = async () => {
    if (Notification.permission === 'granted') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // إخفاء التوست بعد 3 ثوانٍ
    } else {
      setShowNotificationPopup(true);
    }
  };

  const handleNotificationPopupContinue = async () => {
    console.log("🚀 Continue clicked - handleNotificationPopupContinue called");
    console.log("🔔 Notification permission requested");
    console.log("بدء عملية تفعيل الإشعارات...");
    
    // إضافة تنبيه للمستخدم
    alert("تم النقر على زر المتابعة - سيتم طلب إذن الإشعارات الآن");
    
    try {
      console.log("📞 Calling requestNotificationPermission function...");
      // طلب إذن الإشعارات وحفظ التوكن
      const token = await requestNotificationPermission();
      
      if (token) {
        console.log("✅ تم تفعيل الإشعارات بنجاح وحفظ التوكن:", token);
        alert("تم تفعيل الإشعارات بنجاح! التوكن: " + token.substring(0, 20) + "...");
        // لا نغلق النافذة المنبثقة - يجب على المستخدم إغلاقها يدوياً
      } else {
        console.log("❌ فشل في الحصول على التوكن");
        alert("فشل في الحصول على التوكن");
      }
    } catch (error) {
      console.error("❌ خطأ في تفعيل الإشعارات:", error);
      alert("خطأ في تفعيل الإشعارات: " + error.message);
    }
  };

  const handleNotificationPopupClose = () => {
    setShowNotificationPopup(false); // إخفاء النافذة المنبثقة
    localStorage.setItem('notificationPopupSeen', 'true'); // تسجيل أن المستخدم رأى النافذة
  };

  // دالة لتحميل اللاعبين من API مع ترتيب عشوائي جديد في كل مرة
  const loadPlayers = async () => {
    try {
      const playersData = await ApiService.getPlayers();
      // ترتيب عشوائي قوي للاعبين باستخدام Fisher-Yates shuffle
      const shuffledPlayers = [...playersData];
      for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
      }
      setPlayers(shuffledPlayers);
      setFilteredPlayers(shuffledPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
      // في حالة فشل تحميل البيانات من API، استخدم localStorage كبديل
      const savedPlayers = localStorage.getItem('efootball_players');
      if (savedPlayers) {
        const parsedPlayers = JSON.parse(savedPlayers);
        // ترتيب عشوائي قوي للاعبين المحفوظين محلياً
        const shuffledPlayers = [...parsedPlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }
        setPlayers(shuffledPlayers);
        setFilteredPlayers(shuffledPlayers);
      }
    }
  };

  // دالة لحساب القوة الإجمالية للاعب
  const calculateOverallRating = (playerStats) => {
    // إذا كانت القوة الإجمالية مدخلة مسبقاً، استخدمها
    if (playerStats.overallRating && playerStats.overallRating > 0) {
      return playerStats.overallRating
    }
    
    // وإلا احسبها من الإحصائيات
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

  // دالة لعرض تفاصيل اللاعب في النافذة المنبثقة
  const showPlayerDetails = (player) => {
    setSelectedPlayer(player)
    setShowPlayerModal(true)
  }

  // دالة لإغلاق النافذة المنبثقة
  const closePlayerModal = () => {
    setShowPlayerModal(false)
    setSelectedPlayer(null)
  }

  const handleSearch = (term = searchTerm) => {
    const lowerCaseSearchTerm = term.toLowerCase();
    const results = players.filter((player) =>
      player.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredPlayers(results);
  };

  const handleContactUs = () => {
    window.open('https://linktr.ee/Drefootball26', '_blank')
  }

  const handleControlPanel = () => {
    if (isAuthenticated) {
      setCurrentPage('admin')
    } else {
      setCurrentPage('password')
    }
  }

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    setCurrentPage('admin')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    // إعادة تحميل اللاعبين من API مع ترتيب عشوائي جديد
    loadPlayers();
  }


  // عرض صفحة الحماية
  if (currentPage === 'password') {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />
  }

  // عرض صفحة إضافة اللاعب
  if (currentPage === 'admin') {
    return <AddPlayerPage onBack={handleBackToHome} />
  }

  // الصفحة الرئيسية
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden pt-2 pb-8">
      {/* خلفية محسنة أكثر حدة ووضوحاً */}
      <div className="absolute inset-0 opacity-20">
        {/* طبقة خلفية أساسية محسنة */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/98 to-black/95"></div>
        
        {/* عناصر الإضاءة المتحركة المحسنة */}
        <div className="absolute top-16 left-8 w-80 h-80 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-8 w-72 h-72 bg-gradient-to-r from-emerald-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-gradient-to-r from-violet-600/25 to-pink-600/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* نقاط إضاءة صغيرة محسنة */}
        <div className="absolute top-28 right-16 w-28 h-28 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-28 left-16 w-36 h-36 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>
      
      {/* شبكة خلفية أكثر وضوحاً للمظهر الاحترافي */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      {/* خطوط هندسية خفيفة للمظهر الاحترافي */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      </div>
      
      {/* حاوي متجاوب للأجهزة المختلفة مع محاذاة مثالية */}
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto relative z-10 px-4 sm:px-6 md:px-8">
        {/* الشريط العلوي المحسن - ترتيب جديد للأزرار مع مسافات متساوية */}
        <div className="flex justify-between items-center mb-6 pt-3 px-2 relative">
          {/* زر Live Updates على اليسار */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/25 to-emerald-600/25 px-4 py-2 rounded-full border border-green-500/40 backdrop-blur-sm shadow-lg hover:shadow-green-500/20 transition-all duration-300">
            <span className="text-green-400 text-sm font-semibold">Live Updates</span>
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/60"></div>
          </div>

          {/* زر الإعدادات على اليمين */}
          <button 
            onClick={handleControlPanel}
            className="bg-gradient-to-r from-slate-700/95 to-slate-600/95 hover:from-slate-600/95 hover:to-slate-500/95 p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-slate-500/50 shadow-lg hover:shadow-xl hover:border-slate-400/70 hover:shadow-slate-400/20"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
        {/* Hero Section محسن مع تنظيم احترافي للعناصر */}
        <div className="text-center mb-6 relative px-2">
          {/* الكرة الرئيسية بحجم مناسب ومحسن */}
          <div className="relative inline-block mb-4">
            <div className="relative w-24 h-24 mx-auto">
              <img 
                src={appIcon} 
                alt="Football" 
                className="w-full h-full rounded-full object-cover shadow-2xl border-2 border-white/20"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.4))',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              {/* فلاش متحرك على الصورة محسن */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full animate-[flash_3s_ease-in-out_infinite] pointer-events-none"></div>
              </div>
              {/* هالة خارجية متحركة محسنة */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
              <div className="absolute -inset-2 rounded-full border border-blue-400/20 animate-pulse delay-500"></div>
            </div>
            
            {/* التاج والنجوم مع تحسين المواضع */}
            <div className="absolute -top-2 -right-2">
              <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce border border-yellow-300/50">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="absolute -bottom-2 -left-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-pulse border border-green-300/50">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* نص eFootball Mobile في سطر منفصل باللون الأبيض */}
          <p className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-center leading-tight tracking-wider relative" style={{ 
            fontFamily: '"Montserrat", "Poppins", sans-serif',
            fontWeight: '900'
          }}>
            <span className="text-white animate-pulse drop-shadow-2xl" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)',
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.9))'
            }}>
              eFootball Mobile
            </span>
            
            {/* تأثير التوهج الإضافي الأبيض */}
            <div className="absolute inset-0 text-white opacity-60 blur-sm animate-pulse-slow" style={{ 
              fontFamily: '"Montserrat", "Poppins", sans-serif',
              fontWeight: '900'
            }}>
              eFootball Mobile
            </div>
          </p>

          {/* مربع الإنجاز الذهبي المحسن مع نصوص عربية متسقة */}
          <div className="bg-gradient-to-r from-yellow-600/25 to-amber-600/25 border-2 border-yellow-500/50 rounded-2xl p-4 mb-4 backdrop-blur-sm shadow-2xl relative overflow-hidden mx-2">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-base font-bold text-yellow-300" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  منصة التطوير الاحترافية
                </span>
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex items-center justify-center gap-2 text-amber-200 text-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  تطوير شامل ومدروس لجميع اللاعبين
                </span>
              </div>
            </div>
          </div>

          {/* الأزرار المحسنة */}
          <div className="flex flex-col gap-4 items-center">
            {/* زر تفعيل الإشعارات الجديد */}
            <Button 
              onClick={handleEnableNotificationsClick} // تم تغيير الدالة المستدعاة
              className="bg-gradient-to-r from-green-400 via-lime-400 to-green-500 hover:from-green-500 hover:via-lime-500 hover:to-green-600 text-black font-black py-3 px-8 text-base rounded-full shadow-2xl shadow-green-400/60 transition-all duration-300 hover:scale-105 relative overflow-hidden group border-2 border-green-300/50 hover:border-green-200/70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center justify-center gap-3 relative z-10" style={{ fontFamily: '"Cairo", "Tajawal", sans-serif' }}>
                <Bell className="w-5 h-5" />
                <span>تفعيل الإشعارات</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </Button>

            {/* الزر الثانوي - تواصل معنا */}
            <Button 
              onClick={handleContactUs}
              className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white font-bold py-3 px-8 text-sm rounded-full shadow-xl shadow-blue-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden group border border-blue-400/40 hover:border-blue-300/60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center justify-center gap-2 relative z-10" style={{ fontFamily: '"Cairo", "Tajawal", sans-serif' }}>
                <Phone className="w-4 h-4" />
                <span>تواصل معنا</span>
              </div>
            </Button>
          </div>
        </div>



        {/* شريط البحث مصغر ومتناسق مع التصميم */}
        <div className="space-y-3 mb-6">
          {/* شريط البحث الرئيسي مصغر */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl blur-md"></div>
            <div className="relative bg-gradient-to-r from-slate-800/70 to-slate-700/70 backdrop-blur-xl border border-slate-500/30 rounded-full p-0.5 shadow-lg hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-full">
                <div className="p-1.5 bg-blue-500/20 rounded-full">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <Input
                  type="text"
                  placeholder="ابحث عن لاعب..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 text-sm font-medium flex-1 h-5"
                  style={{ fontFamily: '"Cairo", "Tajawal", sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* قائمة التصفية السريعة مصغرة - تم إزالة الأزرار غير الضرورية */}
          <div className="flex gap-2 justify-center overflow-x-auto pb-1">
            {/* تم إزالة أزرار الكل والنجوم والمتميزون */}
          </div>
        </div>

        {/* عرض اللاعبين المحسن مع تصميم احترافي */}
        {filteredPlayers.length > 0 ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-3" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                نجوم التطوير الأسطوري
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                <Users className="w-5 h-5 text-blue-400" />
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-400 text-sm mt-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                اكتشف أفضل اللاعبين المطورين
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {filteredPlayers.map((player, index) => (
                  <Card 
                  key={index}
                  className="bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 border-2 border-slate-600/60 backdrop-blur-xl hover:border-blue-500/80 transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden shadow-2xl hover:shadow-blue-500/20 animate-white-pulse-glow rounded-2xl"
                  onClick={() => showPlayerDetails(player)}
                >
                  {/* تأثير الإضاءة عند التمرير مع فلاش محسن */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-hover-flash"></div>
                  
                  {/* فلاش أبيض خفيف حول الكارت مع ظلال */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-border-glow shadow-2xl shadow-white/20"></div>
                  
                  <CardContent className="p-4 sm:p-5 text-center relative z-10">
                    {/* صورة اللاعب مع الفلاش المتحرك المحسن */}
                    {player.image && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          {/* الهالة الخلفية المحسنة مع تدرج أكثر تعقيداً */}
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/40 via-purple-500/50 to-emerald-500/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-white-pulse-glow"></div>
                          
                          {/* إطار إضافي للصورة */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl"></div>
                          
                          {/* الصورة مع تحسينات متجاوبة */}
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 object-cover object-center rounded-xl border-2 border-blue-500/50 group-hover:border-blue-400/80 transition-all duration-500 shadow-xl"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center center',
                              aspectRatio: '3/4',
                              filter: 'contrast(1.1) saturate(1.2)'
                            }}
                          />
                          
                          {/* الفلاش المتحرك المائل المحسن */}
                          <div className="absolute inset-0 overflow-hidden rounded-xl">
                            <div className="absolute -top-4 -left-4 w-8 h-full bg-gradient-to-r from-transparent via-white/90 to-transparent transform rotate-12 translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-1200 ease-out animate-flash-sweep"></div>
                          </div>
                          
                          {/* النجمة مع تحسين */}
                          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse shadow-xl border border-green-300/60">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                          
                          {/* فلاش إضافي حول الإطار مع تأثيرات متقدمة */}
                          <div className="absolute inset-0 rounded-xl border-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg shadow-white/30"></div>
                          
                          {/* تأثير التوهج الأبيض الخفيف المحسن */}
                          <div className="absolute inset-0 rounded-xl border-2 border-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow shadow-2xl shadow-white/40"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* اسم اللاعب مع ألوان مميزة وحجم متجاوب */}
                    <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-3 group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-yellow-400 transition-all duration-500" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                      {player.name}
                    </h3>
                    
                    {/* القوة الإجمالية مع تصميم محسن ومتجاوب */}
                    <div className="bg-gradient-to-r from-yellow-500/25 via-orange-500/35 to-yellow-500/25 rounded-2xl p-3 sm:p-4 border-2 border-yellow-500/50 group-hover:border-yellow-400/70 transition-all duration-500 shadow-lg group-hover:shadow-yellow-500/20">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                          {calculateOverallRating(player)}
                        </span>
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      </div>
                      <p className="text-xs text-slate-300 font-semibold" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                        القوة الإجمالية
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
                <Users className="w-12 h-12 text-slate-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">لا توجد لاعبين متاحين</h3>
            <p className="text-slate-500 text-sm mb-4">قم بإضافة لاعبين من لوحة التحكم</p>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-auto rounded-full"></div>
          </div>
        )}

        {/* النافذة المنبثقة لتفاصيل اللاعب المحسنة */}
        {showPlayerModal && selectedPlayer && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 border border-slate-600/50 backdrop-blur-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              {/* تأثير الإضاءة */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
              
              <CardContent className="p-6 relative z-10">
                {/* زر الإغلاق المحسن */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      تفاصيل اللاعب
                    </h2>
                  </div>
                  <button 
                    onClick={closePlayerModal}
                    className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                {/* صورة اللاعب المحسنة */}
                {selectedPlayer.image && (
                  <div className="mb-6 text-center">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
                      <img 
                        src={selectedPlayer.image} 
                        alt={selectedPlayer.name}
                        className="relative w-32 h-44 object-contain bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border-2 border-blue-500/40 shadow-xl p-2"
                        style={{ aspectRatio: '3/4' }}
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* اسم اللاعب المحسن */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {selectedPlayer.name}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* إحصائية البوستر تحت اسم اللاعب مباشرة */}
                {selectedPlayer.poster && (
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-purple-500/20 rounded-3xl p-4 border-2 border-purple-500/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <img src={selectedPlayer.poster} alt="Poster" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            بوستر اللاعب
                          </span>
                          <img src={selectedPlayer.poster} alt="Poster" className="w-8 h-8 rounded-lg object-cover" />
                        </div>
                        <p className="text-sm text-slate-300 font-bold">البوستر الخاص</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* بوستر اللاعب */}
                {selectedPlayer.poster && (
                  <div className="mb-6 text-center">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
                      <img 
                        src={selectedPlayer.poster} 
                        alt={`${selectedPlayer.name} Poster`}
                        className="relative w-full max-w-xs h-48 object-cover bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border-2 border-purple-500/40 shadow-xl"
                      />
                      {/* تأثير الفلاش على البوستر */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-[flash_3s_ease-in-out_infinite] pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* القوة الإجمالية المحسنة */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/30 to-yellow-500/20 rounded-3xl p-4 border-2 border-yellow-500/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {calculateOverallRating(selectedPlayer)}
                        </span>
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-sm text-slate-300 font-bold">القوة الإجمالية</p>
                    </div>
                  </div>
                </div>

                {/* الإحصائيات المحسنة */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-black text-white mb-2">الإحصائيات التفصيلية</h4>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                  </div>
                  
                  {/* الإحصائيات الأساسية */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                          <img src={finishingIcon} alt="Finishing" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Finishing</span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 rounded-full">
                        <span className="text-blue-400 font-black text-lg">{selectedPlayer.finishing || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-xl">
                          <img src={passingIcon} alt="Passing" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Passing</span>
                      </div>
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-400 font-black text-lg">{selectedPlayer.passing || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                          <img src={dribblingIcon} alt="Dribbling" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Dribbling</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full">
                        <span className="text-purple-400 font-black text-lg">{selectedPlayer.dribbling || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-xl">
                          <img src={dexterityIcon} alt="Dexterity" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Dexterity</span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-1 rounded-full">
                        <span className="text-orange-400 font-black text-lg">{selectedPlayer.dexterity || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                          <img src={lowerBodyStrengthIcon} alt="Lower Body Strength" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Lower Body Strength</span>
                      </div>
                      <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 px-3 py-1 rounded-full">
                        <span className="text-red-400 font-black text-lg">{selectedPlayer.lowerBodyStrength || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-xl">
                          <img src={aerialStrengthIcon} alt="Aerial Strength" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Aerial Strength</span>
                      </div>
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 rounded-full">
                        <span className="text-cyan-400 font-black text-lg">{selectedPlayer.aerialStrength || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-xl">
                          <img src={defendingIcon} alt="Defending" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">Defending</span>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full">
                        <span className="text-yellow-400 font-black text-lg">{selectedPlayer.defending || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                          <img src={gk1Icon} alt="GK 1" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">GK 1</span>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1 rounded-full">
                        <span className="text-indigo-400 font-black text-lg">{selectedPlayer.gk1 || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/20 rounded-xl">
                          <img src={gk2Icon} alt="GK 2" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">GK 2</span>
                      </div>
                      <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-3 py-1 rounded-full">
                        <span className="text-teal-400 font-black text-lg">{selectedPlayer.gk2 || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-4 border border-slate-600/30 hover:border-blue-500/40 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                          <img src={gk3Icon} alt="GK 3" className="w-6 h-6 rounded-lg" />
                        </div>
                        <span className="text-white font-semibold">GK 3</span>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-emerald-400 font-black text-lg">{selectedPlayer.gk3 || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* البوستر المحسن */}
                {selectedPlayer.booster && selectedPlayer.booster !== 'No Booster' && (
                  <div className="mt-8 text-center">
                    <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-purple-500/20 rounded-3xl p-4 border-2 border-purple-500/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          <h4 className="text-sm text-slate-300 font-bold">البوستر المضاف</h4>
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {selectedPlayer.booster}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* النافذة المنبثقة للإشعارات */}
        {showNotificationPopup && (
          <NotificationPopup
            onClose={handleNotificationPopupClose}
            handleNotificationPopupContinue={handleNotificationPopupContinue}
          />
        )}

        {/* رسالة التوست */}
        {showToast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
            Notifications are already enabled ✅
          </div>
        )}
      </div>
    </div>
  )
}

export default App


