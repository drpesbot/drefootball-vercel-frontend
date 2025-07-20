import React from 'react';
import { Button } from './ui/button';
import { Bell, Sparkles, X, CheckCircle, Zap, Gift, AlertTriangle } from 'lucide-react';

const NotificationPopup = ({ onClose, onEnableNotifications }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-slate-600/50 backdrop-blur-2xl max-w-sm w-full rounded-3xl shadow-2xl relative overflow-hidden">
        {/* تأثير الفلاش الأبيض المتحرك */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-[flash_4s_ease-in-out_infinite] pointer-events-none"></div>
        
        {/* زر الإغلاق */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-2 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-400/50 z-20"
        >
          <X className="w-5 h-5 text-red-400" />
        </button>
        
        <div className="p-6 relative z-10 text-center">
          {/* أيقونة الجرس مع التوهج المحسن */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <Bell className="w-10 h-10 text-white" />
              </div>
              {/* النجوم المتحركة */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-5 h-5 text-blue-400 animate-bounce delay-500" />
              </div>
              {/* هالة متوهجة محسنة */}
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-red-500/40 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -inset-2 w-24 h-24 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
          </div>
          
          {/* العنوان */}
          <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            🔔 تفعيل الإشعارات المجاني
          </h2>
          
          {/* قائمة المميزات */}
          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-4 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  احصل على آخر أخبار اللاعبين فوراً
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-4 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  تحديثات حصرية للإحصائيات الجديدة
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  عروض خاصة ومحتوى حصري
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
                  كن أول من يعرف بالتحديثات الجديدة
                </span>
              </div>
            </div>
          </div>
          
          {/* الزر الرئيسي */}
          <Button
            onClick={onEnableNotifications}
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-black py-4 px-8 text-base rounded-2xl shadow-2xl shadow-green-500/60 transition-all duration-300 hover:scale-105 relative overflow-hidden group border-2 border-green-400/50 hover:border-green-300/70"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center justify-center gap-3 relative z-10" style={{ fontFamily: '"Cairo", "Tajawal", sans-serif' }}>
              <Bell className="w-5 h-5" />
              <span>اضغط هنا للمتابعة</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </Button>
          
          {/* النص السفلي */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <p className="text-slate-400 text-xs" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              انضم إلى أكثر من 10,000 مستخدم يتلقون التحديثات يومياً
            </p>
          </div>
          
          <p className="text-slate-500 text-xs mt-2" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            يمكنك إلغاء الاشتراك في أي وقت من إعدادات المتصفح
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;


