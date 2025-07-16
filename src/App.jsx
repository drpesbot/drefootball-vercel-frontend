import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Search, Phone, Settings, Trophy, X, Star, Zap, Target, Dribble, Shield, Gauge, Eye, Heart, Footprints, Users, Sparkles, Crown, Award } from 'lucide-react'
import './App.css'

import appIcon from './assets/images/football_icon_shimmer.png'
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
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showPlayerModal, setShowPlayerModal] = useState(false)

  // تحميل اللاعبين من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedPlayers = localStorage.getItem('efootball_players')
    if (savedPlayers) {
      const parsedPlayers = JSON.parse(savedPlayers)
      // ترتيب عشوائي للاعبين
      const shuffledPlayers = [...parsedPlayers].sort(() => Math.random() - 0.5)
      setPlayers(shuffledPlayers)
    }
  }, [])

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

  const handleSearch = () => {
    alert(`البحث عن: ${searchTerm}`)
  }

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
    // إعادة تحميل اللاعبين مع ترتيب عشوائي جديد
    const savedPlayers = localStorage.getItem('efootball_players')
    if (savedPlayers) {
      const parsedPlayers = JSON.parse(savedPlayers)
      const shuffledPlayers = [...parsedPlayers].sort(() => Math.random() - 0.5)
      setPlayers(shuffledPlayers)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden pt-4 pb-8">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="max-w-md mx-auto relative z-10">
        {/* الشريط العلوي المحسن */}
        <div className="flex justify-between items-center mb-4 pt-2">
          <div className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-xl rounded-full px-4 py-2 border border-green-500/30">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              تحديث مباشر
            </span>
          </div>
          <button 
            onClick={handleControlPanel}
            className="bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600/80 hover:to-gray-500/80 p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-500/30 shadow-lg hover:shadow-xl"
          >
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* المحتوى الرئيسي المحسن */}
        <Card className="bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-black/80 border-gray-600/30 backdrop-blur-2xl shadow-2xl mb-8 relative overflow-hidden">
          {/* تأثير الإضاءة */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
          
          <CardContent className="p-8 text-center relative z-10">
            {/* الأيقونة الرئيسية المحسنة */}
            <div className="flex justify-center mb-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105">
                  <img 
                    src={appIcon} 
                    alt="eFootball Mobile" 
                    className="w-20 h-20 object-contain animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
                      animation: 'shimmer 3s ease-in-out infinite'
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* العنوان المحسن */}
            <div className="mb-2">
              <h1 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight tracking-tight">
                eFootball Mobile
              </h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-gray-300 text-sm md:text-base font-semibold">
                  الدليل الشامل للاعبين المحترفين
                </p>
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full"></div>
            </div>

            {/* مربع الإنجاز المحسن */}
            <div className="relative bg-gradient-to-r from-yellow-600/20 via-orange-600/30 to-yellow-600/20 border-2 border-yellow-500/40 rounded-3xl p-4 mb-3 backdrop-blur-sm overflow-hidden group hover:border-yellow-400/60 transition-all duration-300">
              {/* تأثير الخلفية المتحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                  <span className="text-lg font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    رقم 1 في تطوير لاعبي eFootball
                  </span>
                  <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-orange-400" />
                  <p className="text-gray-200 font-bold text-sm md:text-base">
                    تطوير لجميع لاعبيه بشكل علمي ومدروس
                  </p>
                  <Award className="w-4 h-4 text-orange-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شريط البحث المحسن */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-2xl border border-gray-500/30 rounded-3xl p-1 shadow-2xl">
            <div className="flex items-center gap-4 px-6 py-4 bg-gray-800/40 rounded-3xl">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <Input
                type="text"
                placeholder="ابحث عن لاعب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-lg font-medium flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* زر التواصل المحسن */}
        <Button 
          onClick={handleContactUs}
          className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-black py-6 text-xl rounded-3xl shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/60 mb-10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="flex items-center justify-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-full">
              <Phone className="w-6 h-6" />
            </div>
            <span>تواصل معنا</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </Button>

        {/* عرض اللاعبين المحسن */}
        {players.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                اللاعبين المتاحين
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                <Users className="w-6 h-6 text-blue-400" />
                <div className="w-8 h-1 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {players.map((player, index) => (
                <Card 
                  key={index}
                  className="bg-gradient-to-br from-gray-800/60 via-gray-900/70 to-gray-800/60 border border-gray-600/40 backdrop-blur-xl hover:border-blue-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden shadow-xl hover:shadow-2xl"
                  onClick={() => showPlayerDetails(player)}
                >
                  {/* تأثير الإضاءة عند التمرير */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-5 text-center relative z-10">
                    {/* صورة اللاعب */}
                    {player.image && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <img 
                            src={player.image} 
                            alt={player.name}
                            className="relative w-18 h-18 rounded-full object-cover object-center border-3 border-blue-500/40 group-hover:border-blue-400/60 transition-all duration-300"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center center'
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
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
                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/30 to-yellow-500/20 rounded-2xl p-3 border border-yellow-500/30 group-hover:border-yellow-400/50 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {calculateOverallRating(player)}
                        </span>
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-xs text-gray-400 font-semibold">القوة الإجمالية</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600/30">
                <Users className="w-12 h-12 text-gray-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">لا توجد لاعبين متاحين</h3>
            <p className="text-gray-500 text-sm mb-4">قم بإضافة لاعبين من لوحة التحكم</p>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto rounded-full"></div>
          </div>
        )}

        {/* النافذة المنبثقة لتفاصيل اللاعب المحسنة */}
        {showPlayerModal && selectedPlayer && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-black/95 border border-gray-600/50 backdrop-blur-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
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
                        className="relative w-32 h-44 object-contain bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border-2 border-blue-500/40 shadow-xl p-2"
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
                      <p className="text-sm text-gray-300 font-bold">القوة الإجمالية</p>
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
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-2xl p-4 border border-gray-600/30 hover:border-blue-500/40 transition-all duration-300">
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
                          <h4 className="text-sm text-gray-300 font-bold">البوستر المضاف</h4>
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
      </div>
    </div>
  )
}

export default App

