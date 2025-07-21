import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Zap, Star, Trophy, Award, Crown, Sparkles } from 'lucide-react';

// استيراد الأيقونات
import finishingIcon from '../assets/icons/finishing.jpg';
import passingIcon from '../assets/icons/passing.jpg';
import dribblingIcon from '../assets/icons/dribbling.jpg';
import dexterityIcon from '../assets/icons/dexterity.jpg';
import lowerBodyStrengthIcon from '../assets/icons/lower_body_strength.jpg';
import aerialStrengthIcon from '../assets/icons/aerial_strength.jpg';
import defendingIcon from '../assets/icons/defending.jpg';
import gk1Icon from '../assets/icons/gk1.jpg';
import gk2Icon from '../assets/icons/gk2.jpg';
import gk3Icon from '../assets/icons/gk3.jpg';

const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  const statIcons = {
    finishing: finishingIcon,
    passing: passingIcon,
    dribbling: dribblingIcon,
    dexterity: dexterityIcon,
    lowerBodyStrength: lowerBodyStrengthIcon,
    aerialStrength: aerialStrengthIcon,
    defending: defendingIcon,
    gk1: gk1Icon,
    gk2: gk2Icon,
    gk3: gk3Icon,
  };

  const statNames = {
    finishing: 'Finishing',
    passing: 'Passing',
    dribbling: 'Dribbling',
    dexterity: 'Dexterity',
    lowerBodyStrength: 'Lower Body Strength',
    aerialStrength: 'Aerial Strength',
    defending: 'Defending',
    gk1: 'GK 1',
    gk2: 'GK 2',
    gk3: 'GK 3',
  };

  const calculateOverallRating = (playerStats) => {
    if (playerStats.overallRating && playerStats.overallRating > 0) {
      return playerStats.overallRating;
    }
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
      playerStats.gk3 || 0,
    ];
    const total = stats.reduce((sum, stat) => sum + stat, 0);
    return Math.round(total / stats.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-blue-600/60 rounded-2xl shadow-2xl relative w-full max-w-md mx-auto overflow-hidden animate-fade-in-up">
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-700/90 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center z-10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>
        <CardContent className="p-6 text-center relative">
          {player.image && (
            <div className="mb-4 relative flex justify-center">
              <img
                src={player.image}
                alt={player.name}
                className="w-48 h-auto object-cover object-center rounded-xl border-2 border-blue-500/50 shadow-lg"
              />
              <div className="absolute inset-0 rounded-xl border-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse shadow-lg shadow-white/30"></div>
            </div>
          )}
          <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-3" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            {player.name}
          </h3>
          <div className="bg-gradient-to-r from-yellow-500/25 via-orange-500/35 to-yellow-500/25 rounded-2xl p-3 mb-4 border-2 border-yellow-500/50 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                {calculateOverallRating(player)}
              </span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-sm text-slate-300 font-semibold" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
              Overall Rating
            </p>
          </div>

          {player.poster && (
            <div className="mb-4 relative">
              <img
                src={player.poster}
                alt={`${player.name} poster`}
                className="w-full h-auto object-cover object-center rounded-xl border-2 border-blue-500/50 shadow-lg"
              />
            </div>
          )}

          <h4 className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3" style={{ fontFamily: '"Cairo", "Noto Sans Arabic", sans-serif' }}>
            Detailed Statistics
          </h4>

          <div className="space-y-3 text-sm text-left">
            {Object.keys(statIcons).map((statKey) => {
              const statValue = player[statKey];
              if (statValue !== undefined && statValue !== null) {
                return (
                  <div key={statKey} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 shadow-md">
                    <div className="flex items-center">
                      <img src={statIcons[statKey]} alt={statNames[statKey]} className="w-6 h-6 rounded-full mr-3" />
                      <span className="text-slate-300 font-medium" style={{ fontFamily: '"Cairo", sans-serif' }}>
                        {statNames[statKey]}
                      </span>
                    </div>
                    <span className="font-bold text-white text-lg">{statValue}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerModal;


