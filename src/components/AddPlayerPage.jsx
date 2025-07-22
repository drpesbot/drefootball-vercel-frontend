import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Upload, Crown, User, Camera, Edit, Trash2, Settings, ArrowLeft, X, Users, Eye, EyeOff, MessageSquare, Phone, Search } from 'lucide-react'
import ApiService from '../services/api.js'

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
  const [editingPlayerId, setEditingPlayerId] = useState(null)
  const [searchTerm, setSearchTerm] = useState(''); // حالة جديدة لشريط البحث
  const [globalSettings, setGlobalSettings] = useState({ showWelcomeModal: true, showContactButton: true });

  // تحميل الإعدادات العالمية عند تحميل الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await ApiService.getSettings();
        setGlobalSettings(settings);
      } catch (error) {
        console.error('Error fetching global settings:', error);
      }
    };
    fetchSettings();
  }, []);

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

  // دالة لعرض عدد المشتركين في الإشعارات (تم إزالتها من الواجهة)
  const handleShowSubscribersCount = () => {
    // لا يوجد منطق هنا بعد الآن
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
        // يجب توفير كلمة المرور هنا
        const password = prompt('الرجاء إدخال كلمة المرور:');
        if (!password) return;
        await ApiService.deletePlayer(playerId, password);
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
      const password = prompt('الرجاء إدخال كلمة المرور:');
      if (!password) return;

      let imageUrl = imagePreview; // استخدام الصورة الحالية إذا لم يتم تغييرها
      
      // رفع الصورة إلى S3 إذا كانت موجودة وجديدة
      if (playerData.image && typeof playerData.image !== 'string') {
        const uploadResult = await ApiService.uploadImage(password, playerData.image);
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
        await ApiService.updatePlayer(editingPlayerId, password, finalData);
        setSuccessMessage('تم تعديل اللاعب بنجاح ✅');
        setEditingPlayerId(null);
      } else {
        // إضافة لاعب جديد
        await ApiService.addPlayer(password, finalData);
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
      alert('حدث خطأ أثناء حفظ اللاعب');
    }
  }

  // دالة لإلغاء التعديل
  const handleCancelEdit = () => {
    setEditingPlayerId(null);
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
  };

  // دوال التحكم في العناصر
  const toggleWelcomeModal = async () => {
    const password = prompt('الرجاء إدخال كلمة المرور:');
    if (!password) return;
    try {
      const newSettings = { ...globalSettings, showWelcomeModal: !globalSettings.showWelcomeModal };
      await ApiService.updateSettings(password, newSettings);
      setGlobalSettings(newSettings);
      setSuccessMessage('تم تحديث إعدادات الشاشة الترحيبية بنجاح ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating welcome modal setting:', error);
      alert('حدث خطأ أثناء تحديث إعدادات الشاشة الترحيبية');
    }
  };

  const toggleContactButton = async () => {
    const password = prompt('الرجاء إدخال كلمة المرور:');
    if (!password) return;
    try {
      const newSettings = { ...globalSettings, showContactButton: !globalSettings.showContactButton };
      await ApiService.updateSettings(password, newSettings);
      setGlobalSettings(newSettings);
      setSuccessMessage('تم تحديث إعدادات زر التواصل بنجاح ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating contact button setting:', error);
      alert('حدث خطأ أثناء تحديث إعدادات زر التواصل');
    }
  };

  // قائمة البوسترات المتاحة
  const boosterOptions = [
    'No Booster',
    'Aerial +1',
    'Agility +1',
    'Ball-carrying +1',
    'Crossing +1',
    'Defending +1',
    'Duelling +1',
    'Fantasista +1',
    'Free-kick Taking +1',
    'Goalkeeping +1',
    'Hard Worker +1',
    'Passing +1',
    'Physicality +1',
    'Saving +1',
    'Shooting +1',
    'Shutdown +1',
    'Striker\'s Instinct +1',
    'Technique +1'
  ]

  // فلترة اللاعبين بناءً على شريط البحث
  const filteredPlayers = allPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إذا كان يعرض جميع اللاعبين
  if (showAllPlayers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* الشريط العلوي */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => setShowAllPlayers(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              جميع اللاعبين ({filteredPlayers.length})
            </h1>
          </div>

          {/* شريط البحث */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="ابحث عن لاعب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-lg pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>

          {/* شبكة اللاعبين */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-4">
                  {/* صورة اللاعب */}
                  {player.image && (
                    <div className="mb-4">
                      <img 
                        src={player.image} 
                        alt={player.name}
                        className="w-full h-48 object-cover rounded-lg border-2 border-blue-500/30"
                      />
                    </div>
                  )}
                  
                  {/* اسم اللاعب */}
                  <h3 className="text-lg font-bold text-yellow-400 mb-2 text-center">
                    {player.name}
                  </h3>
                  
                  {/* القوة الإجمالية */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 mb-4 text-center">
                    <span className="text-2xl font-black text-yellow-300">
                      {player.overallRating || 0}
                    </span>
                    <p className="text-xs text-slate-300">القوة الإجمالية</p>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEditPlayer(player)}
                      className="flex-1 bg-blue-600/80 hover:bg-blue-700/80 text-white py-2 rounded-lg transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      onClick={() => handleDeletePlayer(player.id)}
                      className="flex-1 bg-red-600/80 hover:bg-red-700/80 text-white py-2 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* خلفية محسنة */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/98 to-black/95"></div>
        <div className="absolute top-16 left-8 w-80 h-80 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-8 w-72 h-72 bg-gradient-to-r from-emerald-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 relative z-10">
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            className="bg-gradient-to-r from-slate-700/95 to-slate-600/95 hover:from-slate-600/95 hover:to-slate-500/95 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-slate-500/50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            العودة للرئيسية
          </Button>
          
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              لوحة التحكم
            </h1>
          </div>
        </div>

        {/* رسالة النجاح */}
        {successMessage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-xl text-green-300 text-center font-semibold backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        {/* قسم التحكم في العناصر */}
        <Card className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <Settings className="w-5 h-5 text-purple-400" />
              إعدادات التحكم في الواجهة
            </CardTitle>
            <CardDescription className="text-slate-400" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              تحكم في ظهور العناصر في الصفحة الرئيسية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* التحكم في الشاشة الترحيبية */}
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="welcomeModal"
                    checked={globalSettings.showWelcomeModal}
                    onChange={toggleWelcomeModal}
                    className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <label htmlFor="welcomeModal" className="font-semibold text-blue-300 cursor-pointer" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    الشاشة الترحيبية المنبثقة
                  </label>
                  <p className="text-sm text-slate-400" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    تظهر للمستخدمين عند دخول الموقع
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  globalSettings.showWelcomeModal 
                    ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-600/20 text-red-300 border border-red-500/30'
                }`}>
                  {globalSettings.showWelcomeModal ? 'مفعلة' : 'معطلة'}
                </div>
              </div>
            </div>

            {/* التحكم في زر التواصل معنا */}
            <div className="p-4 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl border border-red-500/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="contactButton"
                    checked={globalSettings.showContactButton}
                    onChange={toggleContactButton}
                    className="w-5 h-5 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <Phone className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <label htmlFor="contactButton" className="font-semibold text-red-300 cursor-pointer" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    زر "تواصل معنا"
                  </label>
                  <p className="text-sm text-slate-400" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    يظهر في الصفحة الرئيسية
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  globalSettings.showContactButton 
                    ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-600/20 text-red-300 border border-red-500/30'
                }`}>
                  {globalSettings.showContactButton ? 'مفعل' : 'معطل'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أزرار الإدارة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={handleShowAllPlayers}
            className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-500/30"
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-semibold" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              عرض جميع اللاعبين
            </span>
          </Button>
        </div>

        {/* نموذج إضافة/تعديل اللاعب */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-blue-500/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <Crown className="w-5 h-5 text-yellow-400" />
              {editingPlayerId ? 'تعديل لاعب' : 'إضافة لاعب جديد'}
            </CardTitle>
            <CardDescription className="text-slate-400" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              {editingPlayerId ? 'قم بتعديل بيانات اللاعب' : 'أدخل بيانات اللاعب الجديد'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* إلغاء التعديل */}
              {editingPlayerId && (
                <div className="flex justify-end">
                  <Button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-600/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    إلغاء التعديل
                  </Button>
                </div>
              )}

              {/* اسم اللاعب */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  <User className="w-4 h-4 text-blue-400" />
                  اسم اللاعب
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={playerData.name}
                  onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-lg"
                  placeholder="أدخل اسم اللاعب"
                  style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
                />
              </div>

              {/* رفع صورة اللاعب */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  <Camera className="w-4 h-4 text-green-400" />
                  صورة اللاعب
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-700/50 border-slate-600/50 text-white file:bg-blue-600/80 file:text-white file:border-none file:rounded-md file:px-4 file:py-2 file:mr-4 hover:file:bg-blue-700/80 transition-all duration-300"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-blue-500/50">
                      <img 
                        src={imagePreview} 
                        alt="معاينة" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* القوة الإجمالية */}
              <div className="space-y-2">
                <Label htmlFor="overallRating" className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  <Crown className="w-4 h-4 text-yellow-400" />
                  القوة الإجمالية (اختياري)
                </Label>
                <Input
                  id="overallRating"
                  type="number"
                  min="0"
                  max="150"
                  value={playerData.overallRating}
                  onChange={(e) => handleInputChange('overallRating', e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-yellow-500/50 focus:ring-yellow-500/20 rounded-lg"
                  placeholder="0-150"
                />
              </div>

              {/* الإحصائيات */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Finishing */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={finishingIcon} alt="Finishing" className="w-4 h-4 rounded" />
                    Finishing
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.finishing}
                    onChange={(e) => handleInputChange('finishing', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Passing */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={passingIcon} alt="Passing" className="w-4 h-4 rounded" />
                    Passing
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.passing}
                    onChange={(e) => handleInputChange('passing', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Dribbling */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={dribblingIcon} alt="Dribbling" className="w-4 h-4 rounded" />
                    Dribbling
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.dribbling}
                    onChange={(e) => handleInputChange('dribbling', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Dexterity */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={dexterityIcon} alt="Dexterity" className="w-4 h-4 rounded" />
                    Dexterity
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.dexterity}
                    onChange={(e) => handleInputChange('dexterity', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Lower Body Strength */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={lowerBodyIcon} alt="Lower Body Strength" className="w-4 h-4 rounded" />
                    Lower Body Strength
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.lowerBodyStrength}
                    onChange={(e) => handleInputChange('lowerBodyStrength', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Aerial Strength */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={aerialIcon} alt="Aerial Strength" className="w-4 h-4 rounded" />
                    Aerial Strength
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.aerialStrength}
                    onChange={(e) => handleInputChange('aerialStrength', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* Defending */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={defendingIcon} alt="Defending" className="w-4 h-4 rounded" />
                    Defending
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.defending}
                    onChange={(e) => handleInputChange('defending', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* GK 1 */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={gk1Icon} alt="GK 1" className="w-4 h-4 rounded" />
                    GK 1
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.gk1}
                    onChange={(e) => handleInputChange('gk1', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* GK 2 */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={gk2Icon} alt="GK 2" className="w-4 h-4 rounded" />
                    GK 2
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.gk2}
                    onChange={(e) => handleInputChange('gk2', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>

                {/* GK 3 */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold text-sm flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                    <img src={gk3Icon} alt="GK 3" className="w-4 h-4 rounded" />
                    GK 3
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="150"
                    value={playerData.gk3}
                    onChange={(e) => handleInputChange('gk3', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-white text-sm rounded-lg"
                    placeholder="0-150"
                  />
                </div>
              </div>

              {/* البوستر */}
              <div className="space-y-2">
                <Label htmlFor="booster" className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  <Crown className="w-4 h-4 text-purple-400" />
                  البوستر
                </Label>
                <Select value={playerData.booster} onValueChange={(value) => setPlayerData(prev => ({ ...prev, booster: value }))}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 rounded-lg">
                    <SelectValue placeholder="اختر البوستر" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    {boosterOptions.map((booster) => (
                      <SelectItem key={booster} value={booster} className="hover:bg-slate-700 focus:bg-slate-700">
                        {booster}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* زر الحفظ */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-700/80 hover:to-emerald-700/80 text-white py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 font-semibold text-lg"
                style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
              >
                <Upload className="w-5 h-5 mr-2" />
                {editingPlayerId ? 'تحديث اللاعب' : 'إضافة اللاعب'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddPlayerPage





