import React from 'react';
import { Button } from './ui/button';
import { X, Send } from 'lucide-react';

const WelcomeModal = ({ onClose, onTelegramClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-green-500/50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto overflow-hidden animate-scale-in">
        
        {/* تأثير الفلاش المائل المحسن - أكثر وضوحاً ومبهراً */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-y-12 -translate-x-full animate-[slide-flash_4s_ease-in-out_infinite] opacity-80"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-400/20 to-transparent transform -skew-y-12 -translate-x-full animate-[slide-flash_4s_ease-in-out_infinite_1s] opacity-60"></div>
        </div>

        {/* تأثيرات إضاءة خلفية فخمة */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl animate-pulse"></div>
        <div className="absolute top-4 left-4 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <Button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-700/90 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center z-10 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="relative z-10 text-center">
          {/* العنوان الفخم مع تأثيرات مبهرة */}
          <div className="mb-6">
            <h2 className="text-4xl font-black bg-gradient-to-r from-green-400 via-lime-400 to-green-500 bg-clip-text text-transparent mb-2 animate-pulse" style={{ 
              fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif',
              textShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
            }}>
              مرحبًا بك في عالم
            </h2>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse" style={{ 
              fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.6)'
            }}>
              eFootball Mobile
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto mt-3 rounded-full animate-pulse"></div>
          </div>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            انضم إلى النخبة واحصل على تجربة استثنائية
          </p>

          {/* المميزات الفخمة بنقاط خضراء وامضة */}
          <div className="text-right mb-8 space-y-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 rounded-2xl border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-start text-green-400 font-bold text-lg" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <div className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse shadow-lg shadow-green-400/50"></div>
              <span>عروض حصرية وتحديثات يومية!</span>
            </div>
            <div className="flex items-center justify-start text-green-400 font-bold text-lg" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <div className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse delay-300 shadow-lg shadow-green-400/50"></div>
              <span>تطويرات لاعبين فريدة ومميزة!</span>
            </div>
            <div className="flex items-center justify-start text-green-400 font-bold text-lg" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              <div className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse delay-500 shadow-lg shadow-green-400/50"></div>
              <span>مجتمع نشط ودعم مستمر!</span>
            </div>
          </div>

          {/* الأزرار الفخمة */}
          <div className="flex flex-col space-y-5">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-black py-4 text-lg rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-blue-500/50 border border-blue-400/30"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              <span className="text-2xl mr-3">🚀</span>
              انطلق إلى التطبيق
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </Button>
            
            <Button
              onClick={onTelegramClick}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black py-4 text-lg rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/50 border border-purple-400/30"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              <Send className="w-6 h-6 ml-3" />
              انضم معنا
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </Button>
          </div>

          {/* نص تحفيزي إضافي */}
          <p className="text-yellow-400 text-sm mt-6 font-semibold animate-pulse" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
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

