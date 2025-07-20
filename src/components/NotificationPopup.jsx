import React from 'react';
import { Button } from './ui/button';
import { Bell, Sparkles } from 'lucide-react';

const NotificationPopup = ({ onClose, onEnableNotifications }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 border border-slate-600/50 backdrop-blur-2xl max-w-sm w-full rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
        <div className="p-6 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Bell className="w-16 h-16 text-blue-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            تفعيل الإشعارات المجانية
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            احصل على آخر أخبار اللاعبين فوراً، تحديثات حصرية للإحصائيات الجديدة، وعروض خاصة ومحتوى حصري.
            كن أول من يعرف بالتحديثات الجديدة!
          </p>
          <Button
            onClick={onEnableNotifications}
            className="bg-gradient-to-r from-orange-500 via-red-400 to-pink-500 hover:from-orange-600 hover:via-red-500 hover:to-pink-600 text-white font-black py-3 px-8 text-base rounded-full shadow-2xl shadow-orange-500/60 transition-all duration-300 hover:scale-105 relative overflow-hidden group border-2 border-orange-300/50 hover:border-orange-200/70"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>انقر هنا للمتابعة</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </Button>
          <p className="text-slate-500 text-xs mt-4">
            انضم إلى أكثر من 10,000 مستخدم يتلقون التحديثات يومياً. يمكنك إلغاء الاشتراك في أي وقت من إعدادات المتصفح.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;


