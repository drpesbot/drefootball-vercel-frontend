import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Search, Phone, Settings, Trophy, X, Star, Zap, Target, Shield, Gauge, Eye, Heart, Footprints, Users, Sparkles, Crown, Award } from 'lucide-react'
import './App.css'
import ApiService from './services/api.js'

import appIcon from './assets/images/football_icon_no_white_edges.png'
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
    // عرض النافذة المنبثقة عند أول بحث
    const hasSeenPopup = localStorage.getItem("hasSeenNotificationPopup");
    if (!hasSeenPopup) {
      setShowNotificationPopup(true);
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
      })
    }

    localStorage.setItem('hasSeenNotificationPopup', 'true')
    setShowNotificationPopup(false)
    handleSearch() // قم بإجراء البحث بعد إغلاق النافذة المنبثقة
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
      {/* خلفية متحركة محسنة */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* الشريط العلوي المحسن */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-xl rounded-full px-5 py-3 border border-emerald-500/30 shadow-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              تحديث مباشر
            </span>
          </div>
          <button 
            onClick={handleControlPanel}
            className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/80 hover:to-slate-500/80 p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-slate-500/30 shadow-lg hover:shadow-xl"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* زر التواصل المحسن */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <Button 
            onClick={handleContactUs}
            className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 text-sm rounded-full shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Phone className="w-4 h-4" />
              <span>تواصل معنا</span>
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            </div>
          </Button>
        </div>

        {/* Hero Section المحسن بالكامل */}
        <Card className="bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-black/80 border-slate-600/30 backdrop-blur-2xl shadow-2xl mb-8 relative overflow-hidden">
          {/* تأثيرات الإضاءة المحسنة */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-blue-500/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
          
          <CardContent className="p-8 text-center relative z-10">
            {/* الأيقونة الرئيسية المحسنة بشكل كبير */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {/* تأثير الهالة الخارجية */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-110"></div>
                
                {/* الكرة الرئيسية */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-500 hover:scale-110 group">
                  {/* تأثير الإضاءة الداخلية */}
                  <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                  
                  {/* الأيقونة */}
                  <img 
                    src={appIcon} 
                    alt="eFootball Mobile" 
                    className="w-24 h-24 object-contain relative z-10 group-hover:animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
                    }}
                  />
                  
                  {/* تأثير الدوران */}
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin-slow"></div>
                </div>
                
                {/* شارات الإنجاز */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* العنوان المحسن بشكل كبير */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent leading-tight tracking-tight">
                eFootball Mobile
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                <p className="text-slate-300 text-lg font-bold bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent">
                  الدليل الشامل للاعبين المحترفين
                </p>
                <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* مربع الإنجاز المحسن بشكل كبير */}
            <div className="relative bg-gradient-to-r from-yellow-500/15 via-orange-500/25 to-yellow-500/15 border-2 border-yellow-400/50 rounded-3xl p-6 mb-4 backdrop-blur-sm overflow-hidden group hover:border-yellow-300/70 transition-all duration-500 hover:scale-105">
              {/* تأثيرات الخلفية المتحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-yellow-400 via-orange-400 to-yellow-400"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                  <span className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    رقم 1 في تطوير لاعبي eFootball
                  </span>
                  <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Award className="w-5 h-5 text-orange-400" />
                  <p className="text-slate-200 font-bold text-base">
                    تطوير لجميع لاعبيه بشكل علمي ومدروس
                  </p>
                  <Award className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شريط البحث المحسن */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-slate-800/70 to-slate-700/70 backdrop-blur-2xl border border-slate-500/40 rounded-full p-1 shadow-2xl">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-800/50 rounded-3xl">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <Input
                type="text"
                placeholder="ابحث عن لاعب..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 text-base font-medium flex-1"
              />
            </div>
          </div>
        </div>

        {/* عرض اللاعبين المحسن */}
        {filteredPlayers.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                اللاعبين المتاحين
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                <Users className="w-7 h-7 text-blue-400" />
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
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
                    {/* صورة اللاعب */}
                    {player.image && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
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
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-white" />
                          </div>
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

        {/* Notification Popup المحسن */}
        {showNotificationPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 border border-slate-600/50 backdrop-blur-2xl max-w-sm w-full shadow-2xl relative text-center">
              <CardContent className="p-6">
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  مرحباً بك في eFootball Mobile! 💥
                </h2>
                <p className="text-slate-300 mb-6">
                  استمتع بتطوير لاعبيك بشكل احترافي واحصل على إشعارات بالتحديثات الجديدة مجانًا 🎯
                </p>
                <Button 
                  onClick={handleNotificationPopupContinue}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  اضغط هنا للمتابعة
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

