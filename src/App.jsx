import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Search, Phone, Settings, Trophy, X, Star, Zap, Target, Shield, Gauge, Eye, Heart, Footprints, Users, Sparkles, Crown, Award, Bell } from 'lucide-react'
import './App.css'
import ApiService from './services/api.js'

import appIcon from './assets/images/football_icon_no_black_edges.png'
import PasswordProtection from './components/PasswordProtection.jsx'
import AddPlayerPage from './components/AddPlayerPage.jsx'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'password', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [players, setPlayers] = useState([])
  const [filteredPlayers, setFilteredPlayers] = useState([]) // حالة جديدة للاعبين المفلترين
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)

  // تحميل اللاعبين من API عند بدء التطبيق
  useEffect(() => {
    loadPlayers();

    // التحقق من LocalStorage لعرض النافذة المنبثقة
    const hasSeenPopup = localStorage.getItem('hasSeenNotificationPopup')
    if (!hasSeenPopup) {
      // setShowNotificationPopup(true); // سيتم تفعيلها عند الضغط على البحث
    }
  }, [])

  // دالة لتحميل اللاعبين من API
  const loadPlayers = async () => {
    try {
      const playersData = await ApiService.getPlayers();
      // ترتيب عشوائي للاعبين
      const shuffledPlayers = [...playersData].sort(() => Math.random() - 0.5);
      setPlayers(shuffledPlayers);
      setFilteredPlayers(shuffledPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
      // في حالة فشل تحميل البيانات من API، استخدم localStorage كبديل
      const savedPlayers = localStorage.getItem('efootball_players');
      if (savedPlayers) {
        const parsedPlayers = JSON.parse(savedPlayers);
        const shuffledPlayers = [...parsedPlayers].sort(() => Math.random() - 0.5);
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
    // التحقق من آخر مرة ظهرت فيها النافذة المنبثقة
    const lastPopupTime = localStorage.getItem("lastNotificationPopupTime");
    const currentTime = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
    
    // إظهار النافذة المنبثقة إذا مر 24 ساعة أو أكثر من آخر مرة
    if (term.trim() !== '' && (!lastPopupTime || (currentTime - parseInt(lastPopupTime)) >= twentyFourHours)) {
      setShowNotificationPopup(true);
      localStorage.setItem("lastNotificationPopupTime", currentTime.toString());
      return; // لا تقم بالبحث حتى يتم التعامل مع النافذة المنبثقة
    }

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

  const handleNotificationPopupContinue = () => {
    // تفعيل الإشعارات (هذا الجزء يتطلب واجهة برمجة تطبيقات متصفح حقيقية)
    // For demonstration, we'll just simulate it.
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.')
          // هنا يمكنك إرسال إشعار تجريبي أو تسجيل خدمة عامل
          
          // تتبع المشتركين في localStorage
          const currentSubscribers = parseInt(localStorage.getItem('notificationSubscribers') || '0');
          localStorage.setItem('notificationSubscribers', (currentSubscribers + 1).toString());
        } else {
          console.log('Notification permission denied.')
        }
      });
    }
    
    localStorage.setItem('hasSeenNotificationPopup', 'true')
    setShowNotificationPopup(false)
    
    // تنفيذ البحث الآن
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = players.filter((player) =>
      player.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredPlayers(results);
  };

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
      {/* خلفية متحركة محسنة */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10 px-4">
        {/* الشريط العلوي المحسن - ترتيب جديد للأزرار */}
        <div className="flex justify-between items-center mb-4 pt-2 relative">
          {/* زر الإعدادات على اليمين */}
          <button 
            onClick={handleControlPanel}
            className="bg-gradient-to-r from-slate-700/90 to-slate-600/90 hover:from-slate-600/90 hover:to-slate-500/90 p-2.5 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-slate-500/40 shadow-lg hover:shadow-xl hover:border-slate-400/60"
          >
            <Settings className="w-4 h-4 text-slate-200" />
          </button>

          {/* زر التواصل في المنتصف */}
          <Button 
            onClick={handleContactUs}
            className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-white font-bold py-1.5 px-3 text-xs rounded-full shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden group border border-emerald-300/30 hover:border-emerald-200/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center justify-center gap-1.5 relative z-10">
              <Phone className="w-3 h-3" />
              <span>تواصل معنا</span>
            </div>
          </Button>

          {/* مساحة فارغة على اليسار للتوازن */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Hero Section مصغر جداً للموبايل */}
        <Card className="bg-gradient-to-br from-slate-800/50 via-slate-900/70 to-black/90 border border-slate-600/40 backdrop-blur-2xl shadow-xl mb-4 relative overflow-hidden hover:border-slate-500/60 transition-all duration-500">
          {/* تأثيرات الإضاءة المحسنة */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/12 to-blue-500/8 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400"></div>
          
          <CardContent className="p-3 text-center relative z-10">
            {/* الأيقونة الرئيسية مصغرة جداً */}
            <div className="flex justify-center mb-2">
              <div className="relative group">
                {/* تأثير الهالة الخارجية مصغر */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-110 animate-pulse"></div>
                
                {/* الكرة الرئيسية مصغرة جداً */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-400 to-emerald-400 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/50 hover:shadow-purple-400/70 transition-all duration-500 hover:scale-110 group">
                  {/* تأثير الإضاءة الداخلية */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/25 to-transparent rounded-full"></div>
                  <div className="absolute inset-2 bg-gradient-to-tl from-white/15 to-transparent rounded-full"></div>
                  
                  {/* الأيقونة مع تأثير الفلاش */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={appIcon} 
                      alt="eFootball Mobile" 
                      className="w-full h-full object-cover relative z-10 group-hover:animate-pulse drop-shadow-xl rounded-full"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 20px rgba(147, 51, 234, 0.2))',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                    
                    {/* تأثير الفلاش المتحرك على الصورة */}
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="absolute -top-1 -left-1 w-4 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transform rotate-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 ease-out"></div>
                    </div>
                    
                    {/* فلاش إضافي حول الإطار */}
                    <div className="absolute inset-0 rounded-full border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                  
                  {/* تأثير الدوران مصغر */}
                  <div className="absolute inset-0 border border-white/20 rounded-full animate-spin-slow"></div>
                </div>
                
                {/* شارات الإنجاز مصغرة جداً */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Crown className="w-3 h-3 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-0 -left-0 w-4 h-4 bg-gradient-to-r from-emerald-300 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-2 h-2 text-white animate-pulse drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* العنوان مصغر جداً */}
            <div className="mb-2">
              <h1 className="text-xl md:text-2xl font-black mb-1 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-xl">
                eFootball Mobile
              </h1>
              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-slate-200 text-xs font-bold bg-gradient-to-r from-slate-200 to-slate-50 bg-clip-text text-transparent">
                  الدليل الشامل للاعبين المحترفين
                </p>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mx-auto rounded-full shadow-lg"></div>
            </div>

            {/* مربع الإنجاز مصغر جداً مع كأسين */}
            <div className="relative bg-gradient-to-r from-yellow-500/15 via-orange-500/25 to-yellow-500/15 border border-yellow-400/50 rounded-xl p-2 mb-2 backdrop-blur-sm overflow-hidden group hover:border-yellow-300/70 transition-all duration-500 hover:scale-105 shadow-xl">
              {/* تأثيرات الخلفية المتحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-yellow-400 via-orange-400 to-yellow-400"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
                  <span className="text-sm font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent text-center leading-tight">
                    رقم 1 في تطوير لاعبي eFootball
                  </span>
                  <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-orange-400" />
                  <p className="text-slate-100 font-bold text-xs text-center">
                    تطوير لجميع لاعبيه بشكل علمي ومدروس
                  </p>
                  <Award className="w-4 h-4 text-orange-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شريط البحث مصغر جداً للموبايل */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-emerald-500/15 rounded-xl blur-lg"></div>
          <div className="relative bg-gradient-to-r from-slate-800/70 to-slate-700/70 backdrop-blur-xl border border-slate-500/30 rounded-full p-0.5 shadow-lg hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full">
              <div className="p-1.5 bg-blue-500/20 rounded-full">
                <Search className="w-3 h-3 text-blue-400" />
              </div>
              <Input
                type="text"
                placeholder="ابحث عن لاعب..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 text-xs font-medium flex-1 h-6"
              />
            </div>
          </div>
        </div>

        {/* عرض اللاعبين المحسن */}
        {filteredPlayers.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                قسم التطويرات الأسطورية
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                <Users className="w-5 h-5 text-blue-400" />
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {filteredPlayers.map((player, index) => (
                  <Card 
                  key={index}
                  className="bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-slate-800/70 border border-slate-600/50 backdrop-blur-xl hover:border-blue-500/70 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden shadow-xl hover:shadow-2xl"
                  onClick={() => showPlayerDetails(player)}
                >
                  {/* تأثير الإضاءة عند التمرير */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-5 text-center relative z-10">
                    {/* صورة اللاعب مع الفلاش المتحرك */}
                    {player.image && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          {/* الهالة الخلفية */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          
                          {/* الصورة */}
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="relative w-20 h-30 object-cover object-center rounded-lg border-2 border-blue-500/40 group-hover:border-blue-400/60 transition-all duration-300"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center center',
                              aspectRatio: '3/4'
                            }}
                          />
                          
                          {/* الفلاش المتحرك المائل */}
                          <div className="absolute inset-0 overflow-hidden rounded-lg">
                            <div className="absolute -top-2 -left-2 w-6 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transform rotate-12 translate-x-[-100%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out"></div>
                          </div>
                          
                          {/* النجمة */}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <Star className="w-2.5 h-2.5 text-white" />
                          </div>
                          
                          {/* فلاش إضافي حول الإطار */}
                          <div className="absolute inset-0 rounded-lg border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* اسم اللاعب */}
                    <h3 className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {player.name}
                    </h3>
                    
                    {/* القوة الإجمالية */}
                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/30 to-yellow-500/20 rounded-2xl p-3 border border-yellow-500/40 group-hover:border-yellow-400/60 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {calculateOverallRating(player)}
                        </span>
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">القوة الإجمالية</p>
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

        {/* النافذة المنبثقة المحسنة للإشعارات */}
        {showNotificationPopup && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-500">
            <Card className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 border-2 border-slate-600/60 backdrop-blur-2xl max-w-sm w-full shadow-2xl relative overflow-hidden">
              {/* فلاش متحرك */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl animate-ping"></div>
              
              <CardContent className="p-6 text-center relative z-10">
                {/* عنوان الترحيب */}
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
                    <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                      مرحباً بك في eFootball Mobile!
                    </h2>
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>

                {/* النص التشجيعي */}
                <p className="text-slate-200 mb-4 text-base font-medium">
                  المكان الأفضل لتطوير لاعبيك المفضلين
                </p>

                {/* طلب تفعيل الإشعارات */}
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  للاستمتاع بتجربة كاملة والوصول إلى جميع الميزات، قم بتفعيل الإشعارات الآن مجانًا
                </p>

                {/* الزر الكبير */}
                <Button 
                  onClick={handleNotificationPopupContinue}
                  className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 hover:from-emerald-500 hover:via-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden group mb-6 w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Bell className="w-5 h-5" />
                    <span>تفعيل الإشعارات الآن</span>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  </div>
                </Button>

                {/* النقاط التشجيعية */}
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span>كن أول من يعرف عن اللاعبين الجدد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>تحديثات ومعلومات حصرية للمحترفين</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>أحدث التسريبات الحصرية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                    <span>محتوى حصري مجاني</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

