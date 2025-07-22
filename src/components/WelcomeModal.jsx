import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const WelcomeModal = ({ onClose, onTelegramClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/50 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto overflow-hidden animate-scale-in">
        {/* White moving element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-12 animate-slide-in-out"></div>
        </div>

        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-700/90 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center z-10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-lime-400 to-green-500 bg-clip-text text-transparent mb-4" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            مرحبًا بك في عالم eFootball Mobile
          </h2>
          <p className="text-gray-300 text-base mb-6" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            احصل على أحدث التحديثات، العروض، وتطويرات اللاعبين من خلال قناتنا الرسمية على تيليجرام.
          </p>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              انطلق إلى التطبيق
            </Button>
            <Button
              onClick={onTelegramClick}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}
            >
              انضم معنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;


