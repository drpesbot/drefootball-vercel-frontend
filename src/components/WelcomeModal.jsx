import React from 'react';
import { Button } from './ui/button';
import { X, Send, CheckCircle } from 'lucide-react';

const WelcomeModal = ({ onClose, onTelegramClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-green-500/50 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto overflow-hidden animate-scale-in">
        
        {/* تأثير الفلاش المائل البطيء المحسن */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-y-12 -translate-x-full animate-[slide-flash_8s_ease-in-out_infinite] opacity-70"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/15 to-transparent transform -skew-y-12 -translate-x-full animate-[slide-flash_8s_ease-in-out_infinite_2s] opacity-50"></div>
        </div>

        {/* تأثيرات إضاءة خلفية فخمة */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl animate-pulse"></div>
        <div className="absolute top-3 left-3 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-3 right-3 w-12 h-12 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-700/90 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center z-10 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="relative z-10 text-center">
          {/* العنوان الفخم مع تأثيرات مبهرة */}
          <div className="mb-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-green-400 via-lime-400 to-green-500 bg-clip-text text-transparent mb-1 animate-pulse" style={{ 
              fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif',
              textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
            }}>
              مرحبًا بك في عالم
            </h2>
            <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse" style={{ 
              fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif',
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
            }}>
              eFootball Mobile
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mt-2 rounded-full animate-pulse"></div>
          </div>

          <p className="text-gray-300 text-sm mb-5 leading-relaxed" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            انضم إلى النخبة واحصل على تجربة استثنائية
          </p>

          {/* المميزات الفخمة بعلامات صح خضراء */}
          <div className="text-right mb-5 space-y-2 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-4 rounded-xl border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-start text-green-400 font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <CheckCircle className="w-4 h-4 mr-3 animate-pulse shadow-lg shadow-green-400/50" />
              <span>عروض حصرية وتحديثات يومية!</span>
            </div>
            <div className="flex items-center justify-start text-green-400 font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <CheckCircle className="w-4 h-4 mr-3 animate-pulse delay-300 shadow-lg shadow-green-400/50" />
              <span>تطويرات لاعبين فريدة ومميزة!</span>
            </div>
            <div className="flex items-center justify-start text-green-400 font-semibold text-sm" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <CheckCircle className="w-4 h-4 mr-3 animate-pulse delay-500 shadow-lg shadow-green-400/50" />
              <span>مجتمع نشط ودعم مستمر!</span>
            </div>
          </div>

          {/* الزر الأول في الوسط - انطلق إلى التطبيق */}
          <div className="mb-4">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-black py-3 text-base rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-blue-500/50 border border-blue-400/30 relative overflow-hidden"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              <span className="text-xl mr-2">🚀</span>
              انطلق إلى التطبيق
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            </Button>
          </div>
          
          {/* الزر الثاني في الأسفل - انضم معنا VIP */}
          <div className="mb-3">
            <Button
              onClick={onTelegramClick}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black py-3 text-base rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/50 border border-purple-400/30 relative overflow-hidden"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              <Send className="w-5 h-5 ml-2" />
              انضم معنا 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-black text-lg ml-1">VIP</span>
              <span className="text-lg mr-1">👑</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            </Button>
          </div>

          {/* نص تحفيزي إضافي */}
          <p className="text-yellow-400 text-xs font-semibold animate-pulse" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            ✨ كن جزءاً من النخبة ✨
          </p>
        </div>
      </div>

      {/* CSS للتأثيرات المخصصة */}
      <style jsx>{`
        @keyframes slide-flash {
          0% { transform: translateX(-150%) skewY(-12deg); }
          50% { transform: translateX(150%) skewY(-12deg); }
          100% { transform: translateX(-150%) skewY(-12deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;

