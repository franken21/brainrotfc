import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// CONSTANTS & DATA
// ============================================

const STORAGE_KEY = 'brainrotfc-v2-save';

// Character images from your GitHub repo
const CHARACTER_IMAGES = {
  tralalero: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Tralalero-Tralala.jpeg',
  bombardiro: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Bombardiro-Crocodilo.jpeg',
  tungtung: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Tung-Tung-Tung-Sahur.jpeg',
  cappuccino: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Cappuccino-Assassino.jpeg',
  ballerina: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Ballerina-Cappuccina.jpeg',
  brrbrr: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Brr-Brr-Patapim.png',
  lirili: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Lirilii-Larilaa.jpeg',
  haalandiro: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Haalandiro-Crocodilo.jpeg',
  messirili: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Messirili-Tralala.jpeg',
  vegimite: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/vegimite-dinamite.jpg'
};

// Rarity colors
const RARITIES = {
  common: { name: 'BRONZE', color: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32, #8b4513)' },
  rare: { name: 'SILVER', color: '#c0c0c0', gradient: 'linear-gradient(135deg, #e8e8e8, #a8a8a8)' },
  epic: { name: 'GOLD', color: '#ffd700', gradient: 'linear-gradient(135deg, #ffd700, #b8860b)' },
  legendary: { name: 'SPECIAL', color: '#00ffff', gradient: 'linear-gradient(135deg, #00ffff, #0080ff)' },
  goat: { name: 'ICON', color: '#ff6b6b', gradient: 'linear-gradient(135deg, #ff6b6b, #ffd93d)' },
};

// Powers - all meaningful now
const POWERS = {
  STUN: { name: 'STUN', emoji: '⚡', desc: 'Keeper freezes 0.5s', color: '#fbbf24' },
  CURL: { name: 'CURL', emoji: '🌀', desc: 'Ball curves more', color: '#8b5cf6' },
  ROCKET: { name: 'ROCKET', emoji: '🚀', desc: '2x ball speed', color: '#ef4444' },
  KNUCKLE: { name: 'KNUCKLE', emoji: '🎲', desc: 'Ball wobbles', color: '#22c55e' },
  DISGUISE: { name: 'DISGUISE', emoji: '🎭', desc: 'Hide swipe direction', color: '#ec4899' },
  SECOND_CHANCE: { name: 'SECOND CHANCE', emoji: '🔄', desc: 'Retry one miss', color: '#3b82f6' },
};

// Characters with new power mappings
const CHARACTERS = {
  brrbrr: { id: 'brrbrr', name: 'Brr Brr Patapim', rarity: 'common', power: 'STUN', emoji: '🌳', bgColor: '#22c55e' },
  lirili: { id: 'lirili', name: 'Lirilì Larilà', rarity: 'common', power: 'KNUCKLE', emoji: '🐘', bgColor: '#a855f7' },
  cappuccino: { id: 'cappuccino', name: 'Cappuccino Assassino', rarity: 'rare', power: 'ROCKET', emoji: '☕', bgColor: '#78350f' },
  ballerina: { id: 'ballerina', name: 'Ballerina Cappuccina', rarity: 'rare', power: 'CURL', emoji: '🩰', bgColor: '#ec4899' },
  tralalero: { id: 'tralalero', name: 'Tralalero Tralala', rarity: 'epic', power: 'DISGUISE', emoji: '🦈', bgColor: '#0ea5e9' },
  bombardiro: { id: 'bombardiro', name: 'Bombardiro', rarity: 'epic', power: 'ROCKET', emoji: '🐊', bgColor: '#65a30d' },
  tungtung: { id: 'tungtung', name: 'Tung Tung Sahur', rarity: 'legendary', power: 'STUN', emoji: '🥁', bgColor: '#92400e' },
  nusa: { id: 'nusa', name: 'Antonio Nusa', rarity: 'legendary', power: 'SECOND_CHANCE', emoji: '⭐', bgColor: '#a21caf' },
  bobb: { id: 'bobb', name: 'Oscar Bobb', rarity: 'legendary', power: 'DISGUISE', emoji: '💫', bgColor: '#6ee7b7' },
  mbappe: { id: 'mbappe', name: 'Kylian Mbappé', rarity: 'legendary', power: 'ROCKET', emoji: '⚡', bgColor: '#1d4ed8' },
  odegaard: { id: 'odegaard', name: 'Martin Ødegaard', rarity: 'goat', power: 'CURL', emoji: '👁️', bgColor: '#dc2626' },
  haaland: { id: 'haaland', name: 'Erling Haaland', rarity: 'goat', power: 'ROCKET', emoji: '👹', bgColor: '#6ee7b7' },
  messi: { id: 'messi', name: 'Lionel Messi', rarity: 'goat', power: 'DISGUISE', emoji: '🐐', bgColor: '#75aadb' },
  ronaldo: { id: 'ronaldo', name: 'Cristiano Ronaldo', rarity: 'goat', power: 'SECOND_CHANCE', emoji: '🏆', bgColor: '#065f46' },
  haalandiro: { id: 'haalandiro', name: 'Haalandiro Crocodilo', rarity: 'goat', power: 'ROCKET', emoji: '🦖', bgColor: '#dc2626' },
  messirili: { id: 'messirili', name: 'Messirili Tralala', rarity: 'goat', power: 'DISGUISE', emoji: '✨', bgColor: '#a855f7' },
  vegimite: { id: 'vegimite', name: 'Vegimite Dinamite', rarity: 'goat', power: 'KNUCKLE', emoji: '🧨', bgColor: '#ff00ff' },
};

// Leagues
const LEAGUES = [
  { 
    id: 'gata', 
    name: 'GATA', 
    fullName: 'Gata',
    subtitle: 'Street Football',
    emoji: '🟤', 
    matches: 3, 
    keepers: ['rookie', 'guesser'],
    unlocked: true,
    colors: { primary: '#78350f', secondary: '#451a03', accent: '#fbbf24' }
  },
  { 
    id: 'div3', 
    name: '3. DIVISJON', 
    fullName: '3. Divisjon',
    subtitle: 'Amateur League',
    emoji: '⚪', 
    matches: 4, 
    keepers: ['rookie', 'guesser', 'waiter'],
    unlocked: false,
    colors: { primary: '#374151', secondary: '#1f2937', accent: '#9ca3af' }
  },
  { 
    id: 'elite', 
    name: 'ELITESERIEN', 
    fullName: 'Eliteserien',
    subtitle: 'Norwegian Top Flight',
    emoji: '🟡', 
    matches: 5, 
    keepers: ['guesser', 'waiter', 'reader'],
    unlocked: false,
    colors: { primary: '#854d0e', secondary: '#422006', accent: '#fde047' }
  },
  { 
    id: 'ucl', 
    name: 'CHAMPIONS LEAGUE', 
    fullName: 'Champions League',
    subtitle: 'European Elite',
    emoji: '🔵', 
    matches: 6, 
    keepers: ['waiter', 'reader', 'giant'],
    unlocked: false,
    colors: { primary: '#1e3a8a', secondary: '#172554', accent: '#60a5fa' }
  },
  { 
    id: 'wc', 
    name: 'VM FINALE', 
    fullName: 'VM Finale',
    subtitle: 'World Cup Final',
    emoji: '🏆', 
    matches: 7, 
    keepers: ['reader', 'giant', 'chaos'],
    unlocked: false,
    colors: { primary: '#854d0e', secondary: '#451a03', accent: '#ffd700' }
  },
];

// Keeper types
const KEEPERS = {
  rookie: {
    id: 'rookie',
    name: 'ROOKIE',
    emoji: '🟢',
    desc: 'Dives early, often wrong',
    color: '#22c55e',
    behavior: 'early', // dives before shot
    speed: 0.6,
    size: 1,
  },
  guesser: {
    id: 'guesser',
    name: 'GUESSER', 
    emoji: '🟡',
    desc: 'Commits to a side',
    color: '#eab308',
    behavior: 'commit', // picks side and sticks
    speed: 0.8,
    size: 1,
  },
  waiter: {
    id: 'waiter',
    name: 'WAITER',
    emoji: '🔵', 
    desc: 'Waits and reacts fast',
    color: '#3b82f6',
    behavior: 'react', // waits then moves fast
    speed: 1.2,
    size: 1,
  },
  reader: {
    id: 'reader',
    name: 'READER',
    emoji: '🔴',
    desc: 'Tracks your aim',
    color: '#ef4444',
    behavior: 'track', // follows swipe direction
    speed: 1,
    size: 1,
  },
  giant: {
    id: 'giant',
    name: 'GIANT',
    emoji: '🟣',
    desc: 'Huge but slow',
    color: '#a855f7',
    behavior: 'react',
    speed: 0.5,
    size: 1.5,
  },
  chaos: {
    id: 'chaos',
    name: 'CHAOS',
    emoji: '⚫',
    desc: 'Completely unpredictable',
    color: '#171717',
    behavior: 'chaos', // random movements
    speed: 1,
    size: 1,
  },
};

// ============================================
// COMPONENTS
// ============================================

// Stadium Background Component
const Stadium = ({ league }) => {
  const stadiums = {
    gata: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - dusk */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200" />
        
        {/* Sun */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-yellow-300 blur-sm opacity-80" />
        
        {/* City silhouette */}
        <div className="absolute bottom-32 left-0 right-0 h-24">
          <div className="absolute bottom-0 left-[5%] w-8 h-16 bg-gray-800" />
          <div className="absolute bottom-0 left-[10%] w-12 h-24 bg-gray-700" />
          <div className="absolute bottom-0 left-[20%] w-6 h-12 bg-gray-800" />
          <div className="absolute bottom-0 right-[15%] w-10 h-20 bg-gray-700" />
          <div className="absolute bottom-0 right-[5%] w-8 h-14 bg-gray-800" />
        </div>
        
        {/* Chain fence */}
        <div className="absolute bottom-24 left-0 right-0 h-8 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 4px,
              #666 4px,
              #666 5px
            ), repeating-linear-gradient(
              0deg,
              transparent,
              transparent 4px,
              #666 4px,
              #666 5px
            )`
          }}
        />
        
        {/* Concrete ground */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-500 to-gray-400" />
        
        {/* Ground markings */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-white/30 rounded-t-full" />
        </div>
        
        {/* Graffiti */}
        <div className="absolute bottom-28 left-4 text-2xl opacity-60">🎨</div>
        <div className="absolute bottom-26 right-8 text-xl opacity-40">⚽</div>
        
        {/* Spectators (few kids) */}
        <div className="absolute bottom-24 left-8 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-lg">🧒</div>
          ))}
        </div>
        <div className="absolute bottom-24 right-8 flex gap-1">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="text-lg">👦</div>
          ))}
        </div>
      </div>
    ),
    div3: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - overcast/rainy */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-500 via-gray-400 to-gray-300" />
        
        {/* Rain effect */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 12px
            )`
          }}
        />
        
        {/* Small wooden stands */}
        <div className="absolute bottom-28 left-0 right-0 h-12 bg-gradient-to-t from-amber-800 to-amber-700 opacity-60" />
        
        {/* Norwegian flags */}
        <div className="absolute bottom-32 left-8 text-xl">🇳🇴</div>
        <div className="absolute bottom-32 right-8 text-xl">🇳🇴</div>
        
        {/* Grass pitch */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-700 to-green-600" />
        
        {/* Sparse crowd */}
        <div className="absolute bottom-28 left-4 right-4 flex justify-center gap-0.5 opacity-50">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-2 h-3 rounded-full bg-gray-600" />
          ))}
        </div>
        
        {/* Floodlight */}
        <div className="absolute top-4 right-4 text-2xl opacity-40">💡</div>
      </div>
    ),
    elite: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - evening */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-orange-500" />
        
        {/* Stadium lights glow */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30" />
        
        {/* Proper stands */}
        <div className="absolute bottom-24 left-0 right-0 h-20 bg-gradient-to-t from-gray-700 to-gray-600" />
        
        {/* Crowd - medium */}
        <div className="absolute bottom-28 left-2 right-2 flex justify-center flex-wrap gap-0.5 opacity-70">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#ef4444', '#3b82f6', '#fbbf24', '#22c55e'][i % 4] }} />
          ))}
        </div>
        
        {/* Team banners */}
        <div className="absolute bottom-36 left-4 text-2xl">🏟️</div>
        <div className="absolute bottom-36 right-4 text-2xl">🇳🇴</div>
        
        {/* Perfect grass */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-600 to-green-500" />
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 40px)`
          }}
        />
      </div>
    ),
    ucl: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - night with stars */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-blue-800" />
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ 
              top: `${Math.random() * 40}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* UCL starball */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl">⭐</div>
        
        {/* Massive stands */}
        <div className="absolute bottom-24 left-0 right-0 h-28 bg-gradient-to-t from-gray-800 to-gray-700" />
        
        {/* Huge crowd with wave effect */}
        <div className="absolute bottom-28 left-0 right-0 flex justify-center flex-wrap gap-px px-1">
          {[...Array(100)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-2 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: ['#1e40af', '#1e3a8a', '#3b82f6'][i % 3],
                animationDelay: `${(i % 10) * 0.1}s`,
                animationDuration: '1s'
              }} 
            />
          ))}
        </div>
        
        {/* Spotlight */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-20" />
        
        {/* Grass */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-700 to-green-600" />
      </div>
    ),
    wc: (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky - golden hour */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500 via-orange-400 to-red-400" />
        
        {/* Golden sun rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-yellow-300/50 to-transparent" />
        
        {/* Confetti */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 animate-bounce"
            style={{ 
              top: `${Math.random() * 60}%`, 
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#ffd700', '#ff6b6b', '#4ade80', '#60a5fa'][i % 4],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
        
        {/* Trophy */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🏆</div>
        
        {/* Massive stands */}
        <div className="absolute bottom-24 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-gray-600" />
        
        {/* Enormous crowd */}
        <div className="absolute bottom-28 left-0 right-0 flex justify-center flex-wrap gap-px px-0.5">
          {[...Array(150)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 h-1.5 rounded-full animate-pulse" 
              style={{ 
                backgroundColor: ['#ffd700', '#ffffff', '#22c55e', '#ef4444'][i % 4],
                animationDelay: `${Math.random() * 0.5}s`
              }} 
            />
          ))}
        </div>
        
        {/* Fireworks ready */}
        <div className="absolute top-12 left-4 text-2xl opacity-60">🎆</div>
        <div className="absolute top-12 right-4 text-2xl opacity-60">🎇</div>
        
        {/* Perfect golden grass */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-600 to-green-500" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10" />
      </div>
    ),
  };

  return stadiums[league] || stadiums.gata;
};

// Keeper SVG Component
const KeeperSVG = ({ type, state, position, stunned }) => {
  const keeper = KEEPERS[type];
  const scale = keeper.size;
  
  // Determine pose based on state
  let pose = 'ready';
  if (state === 'diving-left') pose = 'dive-left';
  if (state === 'diving-right') pose = 'dive-right';
  if (state === 'saved') pose = 'saved';
  if (state === 'beaten') pose = 'beaten';
  
  return (
    <div 
      className="relative transition-all duration-300"
      style={{ 
        transform: `translateX(${position}px) scale(${scale})`,
        opacity: stunned ? 0.5 : 1,
        filter: stunned ? 'brightness(1.5)' : 'none'
      }}
    >
      {/* Stun effect */}
      {stunned && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-spin">
          ⚡
        </div>
      )}
      
      <svg viewBox="0 0 80 120" className="w-20 h-28">
        {/* Kit color based on keeper type */}
        <defs>
          <linearGradient id={`kit-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={keeper.color} />
            <stop offset="100%" stopColor={keeper.color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        
        {/* Body */}
        <g className={`
          ${pose === 'dive-left' ? '-translate-x-4 -rotate-12' : ''}
          ${pose === 'dive-right' ? 'translate-x-4 rotate-12' : ''}
          ${pose === 'beaten' ? 'translate-y-2' : ''}
          transition-transform duration-500
        `}>
          {/* Head */}
          <ellipse cx="40" cy="20" rx="12" ry="11" fill="#f5d0b0" />
          
          {/* Hair */}
          <ellipse cx="40" cy="14" rx="10" ry="6" fill="#3d2914" />
          
          {/* Eyes */}
          <ellipse cx="35" cy="20" rx="3" ry="2.5" fill="white" />
          <ellipse cx="45" cy="20" rx="3" ry="2.5" fill="white" />
          <circle cx="35" cy="20" r="1.5" fill="#333" />
          <circle cx="45" cy="20" r="1.5" fill="#333" />
          
          {/* Expression based on state */}
          {pose === 'beaten' && (
            <>
              <line x1="33" y1="18" x2="37" y2="22" stroke="#333" strokeWidth="1" />
              <line x1="33" y1="22" x2="37" y2="18" stroke="#333" strokeWidth="1" />
              <line x1="43" y1="18" x2="47" y2="22" stroke="#333" strokeWidth="1" />
              <line x1="43" y1="22" x2="47" y2="18" stroke="#333" strokeWidth="1" />
            </>
          )}
          {pose === 'saved' && (
            <path d="M 35 26 Q 40 30 45 26" stroke="#333" strokeWidth="1.5" fill="none" />
          )}
          
          {/* Body/Jersey */}
          <path 
            d={`M 25 35 L 30 32 L 40 30 L 50 32 L 55 35 L 58 70 L 22 70 Z`}
            fill={`url(#kit-${type})`}
          />
          
          {/* Number 1 */}
          <text x="40" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
          
          {/* Arms */}
          <g className={`
            ${pose === 'dive-left' ? '-rotate-45 origin-right' : ''}
            ${pose === 'dive-right' ? 'rotate-0' : '-rotate-12'}
            transition-transform duration-300
          `}>
            <path d="M 25 38 L 5 45 L 3 55 L 8 55 L 22 48" fill={`url(#kit-${type})`} />
            <ellipse cx="5" cy="52" rx="6" ry="7" fill="#22c55e" /> {/* Glove */}
          </g>
          <g className={`
            ${pose === 'dive-right' ? 'rotate-45 origin-left' : ''}
            ${pose === 'dive-left' ? 'rotate-0' : 'rotate-12'}
            transition-transform duration-300
          `}>
            <path d="M 55 38 L 75 45 L 77 55 L 72 55 L 58 48" fill={`url(#kit-${type})`} />
            <ellipse cx="75" cy="52" rx="6" ry="7" fill="#22c55e" /> {/* Glove */}
          </g>
          
          {/* Legs */}
          <rect x="30" y="70" width="8" height="25" fill="#333" />
          <rect x="42" y="70" width="8" height="25" fill="#333" />
          
          {/* Boots */}
          <ellipse cx="34" cy="97" rx="6" ry="4" fill={keeper.color} />
          <ellipse cx="46" cy="97" rx="6" ry="4" fill={keeper.color} />
        </g>
      </svg>
      
      {/* Keeper name tag */}
      <div 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold text-white whitespace-nowrap"
        style={{ backgroundColor: keeper.color }}
      >
        {keeper.emoji} {keeper.name}
      </div>
    </div>
  );
};

// Goal Component
const Goal = ({ children }) => (
  <div className="relative w-full" style={{ aspectRatio: '3/1' }}>
    {/* Net */}
    <div 
      className="absolute inset-0 rounded bg-black/80"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '12px 12px'
      }}
    />
    
    {/* Posts */}
    <div className="absolute -top-2 -left-2 -right-2 h-4 bg-gradient-to-b from-white to-gray-300 rounded-t-lg" />
    <div className="absolute -top-2 -left-2 w-4 h-[calc(100%+8px)] bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-l-lg" />
    <div className="absolute -top-2 -right-2 w-4 h-[calc(100%+8px)] bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-r-lg" />
    
    {/* Content (keeper, ball) */}
    <div className="absolute inset-0 flex items-end justify-center pb-2">
      {children}
    </div>
  </div>
);

// Ball Component
const Ball = ({ x, y, visible, character, animating }) => {
  const char = CHARACTERS[character];
  
  if (!visible) return null;
  
  return (
    <div 
      className={`absolute w-10 h-10 transition-all ${animating ? 'duration-500' : 'duration-0'}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: `radial-gradient(circle at 30% 30%, white, ${char?.bgColor || '#666'})`,
          border: `2px solid ${char?.bgColor || '#333'}`
        }}
      >
        <span className="text-lg">{char?.emoji || '⚽'}</span>
      </div>
    </div>
  );
};

// Swipe Zone Component
const SwipeZone = ({ onSwipe, disabled }) => {
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeEnd, setSwipeEnd] = useState(null);
  const [swiping, setSwiping] = useState(false);
  
  const handleTouchStart = (e) => {
    if (disabled) return;
    const touch = e.touches[0];
    setSwipeStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
    setSwipeEnd({ x: touch.clientX, y: touch.clientY });
    setSwiping(true);
  };
  
  const handleTouchMove = (e) => {
    if (!swiping || disabled) return;
    const touch = e.touches[0];
    setSwipeEnd({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = () => {
    if (!swiping || !swipeStart || !swipeEnd || disabled) {
      setSwiping(false);
      return;
    }
    
    const dx = swipeEnd.x - swipeStart.x;
    const dy = swipeEnd.y - swipeStart.y;
    const duration = Date.now() - swipeStart.time;
    const speed = Math.sqrt(dx * dx + dy * dy) / duration;
    
    // Normalize direction (-1 to 1 for x, 0 to 1 for y where 1 is up)
    const dirX = Math.max(-1, Math.min(1, dx / 150));
    const dirY = Math.max(0, Math.min(1, -dy / 200)); // Negative because up is negative Y
    
    // Power based on swipe speed (0 to 1)
    const power = Math.min(1, speed * 2);
    
    onSwipe({ dirX, dirY, power });
    
    setSwiping(false);
    setSwipeStart(null);
    setSwipeEnd(null);
  };
  
  return (
    <div 
      className="absolute inset-0 z-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe trail visualization */}
      {swiping && swipeStart && swipeEnd && (
        <svg className="absolute inset-0 pointer-events-none">
          <line 
            x1={swipeStart.x} 
            y1={swipeStart.y} 
            x2={swipeEnd.x} 
            y2={swipeEnd.y}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8,4"
          />
          <circle cx={swipeStart.x} cy={swipeStart.y} r="20" fill="rgba(255,255,255,0.2)" />
        </svg>
      )}
      
      {/* Instruction */}
      {!disabled && !swiping && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full">
          <p className="text-white text-sm font-bold">👆 SWIPE TO SHOOT</p>
        </div>
      )}
    </div>
  );
};

// Character Card Mini
const CharacterCardMini = ({ character, selected, onClick }) => {
  const char = CHARACTERS[character];
  const rarity = RARITIES[char.rarity];
  const power = POWERS[char.power];
  
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl p-2 transition-all ${selected ? 'ring-2 ring-yellow-400 scale-105' : ''}`}
      style={{ background: rarity.gradient }}
    >
      <div className="w-16 h-20 rounded-lg bg-black/30 flex flex-col items-center justify-center">
        {CHARACTER_IMAGES[character] ? (
          <img 
            src={CHARACTER_IMAGES[character]} 
            alt={char.name}
            className="w-12 h-12 rounded-full object-cover border-2"
            style={{ borderColor: rarity.color }}
          />
        ) : (
          <span className="text-3xl">{char.emoji}</span>
        )}
        <span className="text-xs font-bold text-white mt-1 truncate w-full text-center px-1">
          {char.name.split(' ').pop()}
        </span>
      </div>
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-xs"
        style={{ backgroundColor: power.color }}
      >
        {power.emoji}
      </div>
    </button>
  );
};

// ============================================
// MAIN GAME COMPONENT
// ============================================

const BrainRotFC = () => {
  const navigate = useNavigate();
  
  // Game state
  const [screen, setScreen] = useState('journey'); // journey, select-character, match, result
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState('brrbrr');
  
  // Progress state
  const [coins, setCoins] = useState(100);
  const [stars, setStars] = useState(0);
  const [leagueProgress, setLeagueProgress] = useState({
    gata: { unlocked: true, completed: false, matchStars: [] },
    div3: { unlocked: false, completed: false, matchStars: [] },
    elite: { unlocked: false, completed: false, matchStars: [] },
    ucl: { unlocked: false, completed: false, matchStars: [] },
    wc: { unlocked: false, completed: false, matchStars: [] },
  });
  const [unlockedCharacters, setUnlockedCharacters] = useState(['brrbrr', 'lirili']);
  
  // Match state
  const [currentPenalty, setCurrentPenalty] = useState(0);
  const [goals, setGoals] = useState(0);
  const [currentKeeper, setCurrentKeeper] = useState(null);
  const [keeperState, setKeeperState] = useState('ready');
  const [keeperPosition, setKeeperPosition] = useState(0);
  const [keeperStunned, setKeeperStunned] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 85 });
  const [ballAnimating, setBallAnimating] = useState(false);
  const [shotResult, setShotResult] = useState(null); // 'goal', 'saved', 'miss'
  const [usedSecondChance, setUsedSecondChance] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCoins(data.coins || 100);
      setStars(data.stars || 0);
      setLeagueProgress(data.leagueProgress || leagueProgress);
      setUnlockedCharacters(data.unlockedCharacters || ['brrbrr', 'lirili']);
      setSelectedCharacter(data.selectedCharacter || 'brrbrr');
    }
  }, []);
  
  // Save progress
  const saveProgress = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      coins,
      stars,
      leagueProgress,
      unlockedCharacters,
      selectedCharacter,
    }));
  }, [coins, stars, leagueProgress, unlockedCharacters, selectedCharacter]);
  
  useEffect(() => {
    saveProgress();
  }, [saveProgress]);
  
  // Start a match
  const startMatch = (league) => {
    setSelectedLeague(league);
    setScreen('select-character');
  };
  
  const confirmCharacterAndStart = () => {
    const league = LEAGUES.find(l => l.id === selectedLeague);
    const keeperType = league.keepers[Math.floor(Math.random() * league.keepers.length)];
    
    setCurrentKeeper(keeperType);
    setCurrentPenalty(0);
    setGoals(0);
    setUsedSecondChance(false);
    setBallPosition({ x: 50, y: 85 });
    setBallVisible(true);
    setKeeperState('ready');
    setKeeperPosition(0);
    setKeeperStunned(false);
    setShotResult(null);
    setShowResult(false);
    setScreen('match');
  };
  
  // Handle swipe shot
  const handleSwipe = ({ dirX, dirY, power }) => {
    if (shotResult) return;
    
    const char = CHARACTERS[selectedCharacter];
    const keeper = KEEPERS[currentKeeper];
    const charPower = char.power;
    
    // Apply STUN power
    if (charPower === 'STUN') {
      setKeeperStunned(true);
      setTimeout(() => setKeeperStunned(false), 500);
    }
    
    // Apply CURL power (exaggerate direction)
    let finalDirX = dirX;
    if (charPower === 'CURL') {
      finalDirX = dirX * 1.5;
    }
    
    // Apply DISGUISE power (keeper can't track)
    const canTrack = charPower !== 'DISGUISE';
    
    // Apply KNUCKLE power (add randomness)
    if (charPower === 'KNUCKLE') {
      finalDirX += (Math.random() - 0.5) * 0.4;
    }
    
    // Calculate ball target position
    const targetX = 50 + finalDirX * 40; // -40 to 90
    const targetY = 20 + (1 - dirY) * 20; // Higher swipe = lower in goal
    
    // Determine if shot is on target
    const isOnTarget = targetX > 10 && targetX < 90 && power > 0.2;
    
    // Apply ROCKET power (faster, harder to save)
    const shotSpeed = charPower === 'ROCKET' ? 300 : 500;
    
    // Animate ball
    setBallAnimating(true);
    
    if (!isOnTarget) {
      // Miss - ball goes wide or over
      setBallPosition({ x: targetX, y: power < 0.2 ? 85 : -20 });
      setTimeout(() => {
        handleShotResult('miss');
      }, shotSpeed);
      return;
    }
    
    // Ball going toward goal
    setBallPosition({ x: targetX, y: targetY });
    
    // Keeper behavior
    let keeperTargetX = 0;
    let keeperDelay = 0;
    
    switch (keeper.behavior) {
      case 'early':
        // Dives early to random side
        keeperTargetX = (Math.random() > 0.5 ? 1 : -1) * 60;
        keeperDelay = 0;
        break;
      case 'commit':
        // Commits to likely side
        keeperTargetX = (dirX > 0 ? 1 : -1) * 60 * (Math.random() > 0.3 ? 1 : -1);
        keeperDelay = 100;
        break;
      case 'react':
        // Waits and reacts
        keeperTargetX = finalDirX * 60;
        keeperDelay = keeperStunned ? 400 : 200;
        break;
      case 'track':
        // Tracks aim if possible
        keeperTargetX = canTrack ? finalDirX * 70 : (Math.random() - 0.5) * 60;
        keeperDelay = 150;
        break;
      case 'chaos':
        // Random
        keeperTargetX = (Math.random() - 0.5) * 100;
        keeperDelay = Math.random() * 200;
        break;
      default:
        keeperTargetX = finalDirX * 50;
        keeperDelay = 200;
    }
    
    // Keeper dive
    setTimeout(() => {
      setKeeperPosition(keeperTargetX);
      setKeeperState(keeperTargetX < 0 ? 'diving-left' : 'diving-right');
    }, keeperDelay);
    
    // Check if saved
    setTimeout(() => {
      const keeperReach = 35 * keeper.size * keeper.speed;
      const ballX = targetX - 50; // Relative to center
      const saved = Math.abs(ballX - keeperTargetX) < keeperReach && !keeperStunned;
      
      if (saved) {
        setKeeperState('saved');
        handleShotResult('saved');
      } else {
        setKeeperState('beaten');
        handleShotResult('goal');
      }
    }, shotSpeed);
  };
  
  // Handle shot result
  const handleShotResult = (result) => {
    const char = CHARACTERS[selectedCharacter];
    
    // Check SECOND_CHANCE power
    if ((result === 'saved' || result === 'miss') && char.power === 'SECOND_CHANCE' && !usedSecondChance) {
      setUsedSecondChance(true);
      setShotResult(null);
      setBallPosition({ x: 50, y: 85 });
      setBallAnimating(false);
      setKeeperState('ready');
      setKeeperPosition(0);
      // Show "SECOND CHANCE" message
      setTimeout(() => {
        setBallVisible(true);
      }, 500);
      return;
    }
    
    setShotResult(result);
    
    if (result === 'goal') {
      setGoals(g => g + 1);
      setCoins(c => c + 20);
    }
    
    // Next penalty or end match
    setTimeout(() => {
      const league = LEAGUES.find(l => l.id === selectedLeague);
      const nextPenalty = currentPenalty + 1;
      
      if (nextPenalty >= 5) {
        // Match over
        endMatch();
      } else {
        // Next penalty
        setCurrentPenalty(nextPenalty);
        setShotResult(null);
        setBallPosition({ x: 50, y: 85 });
        setBallAnimating(false);
        setBallVisible(true);
        setKeeperState('ready');
        setKeeperPosition(0);
        
        // Maybe change keeper
        if (Math.random() > 0.5) {
          const newKeeper = league.keepers[Math.floor(Math.random() * league.keepers.length)];
          setCurrentKeeper(newKeeper);
        }
      }
    }, 1500);
  };
  
  // End match
  const endMatch = () => {
    const matchStars = goals >= 5 ? 3 : goals >= 4 ? 2 : goals >= 3 ? 1 : 0;
    const won = matchStars > 0;
    
    // Update progress
    if (won) {
      setLeagueProgress(prev => {
        const updated = { ...prev };
        const leagueData = updated[selectedLeague];
        
        // Update match stars
        if (!leagueData.matchStars[selectedMatch] || leagueData.matchStars[selectedMatch] < matchStars) {
          leagueData.matchStars[selectedMatch] = matchStars;
        }
        
        // Check if league completed
        const league = LEAGUES.find(l => l.id === selectedLeague);
        if (leagueData.matchStars.filter(s => s > 0).length >= league.matches) {
          leagueData.completed = true;
          
          // Unlock next league
          const leagueIndex = LEAGUES.findIndex(l => l.id === selectedLeague);
          if (leagueIndex < LEAGUES.length - 1) {
            const nextLeague = LEAGUES[leagueIndex + 1];
            updated[nextLeague.id].unlocked = true;
          }
        }
        
        return updated;
      });
      
      setStars(s => s + matchStars);
      setCoins(c => c + (won ? 50 : 0) + (matchStars === 3 ? 100 : 0));
    }
    
    setShowResult(true);
    setScreen('result');
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  // Journey Map Screen
  if (screen === 'journey') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gray-900/90 backdrop-blur border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-400 text-sm"
            >
              ← Tilbake
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="font-bold">{stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🪙</span>
                <span className="font-bold text-yellow-400">{coins}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-black">BRAIN ROT FC</h1>
          <p className="text-gray-400 mt-1">Veien til VM 🏆</p>
        </div>
        
        {/* Journey Path */}
        <div className="px-4 pb-8">
          {/* Vertical line */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 via-blue-500 to-gray-600" />
            
            {/* Leagues */}
            <div className="space-y-4">
              {[...LEAGUES].reverse().map((league, index) => {
                const progress = leagueProgress[league.id];
                const isUnlocked = progress.unlocked;
                const isCompleted = progress.completed;
                const totalStars = progress.matchStars.reduce((a, b) => a + (b || 0), 0);
                const maxStars = league.matches * 3;
                
                return (
                  <div 
                    key={league.id}
                    className={`relative pl-20 ${!isUnlocked ? 'opacity-40' : ''}`}
                  >
                    {/* Node */}
                    <div 
                      className={`absolute left-4 w-9 h-9 rounded-full flex items-center justify-center text-xl
                        ${isCompleted ? 'bg-green-500' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'}
                      `}
                    >
                      {isCompleted ? '✓' : league.emoji}
                    </div>
                    
                    {/* Card */}
                    <button
                      onClick={() => isUnlocked && startMatch(league.id)}
                      disabled={!isUnlocked}
                      className={`w-full text-left rounded-2xl p-4 transition-all
                        ${isUnlocked ? 'active:scale-98' : ''}
                      `}
                      style={{ 
                        background: isUnlocked 
                          ? `linear-gradient(135deg, ${league.colors.primary}, ${league.colors.secondary})`
                          : '#374151'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-black text-lg">{league.name}</h3>
                          <p className="text-sm opacity-70">{league.subtitle}</p>
                        </div>
                        {isUnlocked && (
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">
                              ⭐ {totalStars}/{maxStars}
                            </div>
                            <div className="text-xs opacity-70">
                              {progress.matchStars.filter(s => s > 0).length}/{league.matches} kamper
                            </div>
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="text-2xl">🔒</div>
                        )}
                      </div>
                      
                      {/* Match dots */}
                      {isUnlocked && (
                        <div className="flex gap-2 mt-3">
                          {[...Array(league.matches)].map((_, i) => {
                            const matchStar = progress.matchStars[i] || 0;
                            return (
                              <div 
                                key={i}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                  ${matchStar > 0 ? 'bg-yellow-500 text-black' : 'bg-black/30 text-white/50'}
                                `}
                              >
                                {matchStar > 0 ? `${matchStar}⭐` : i + 1}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Character Select Screen
  if (screen === 'select-character') {
    const league = LEAGUES.find(l => l.id === selectedLeague);
    
    return (
      <div 
        className="min-h-screen text-white"
        style={{ background: `linear-gradient(135deg, ${league.colors.primary}, ${league.colors.secondary})` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-black/30 backdrop-blur px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setScreen('journey')}
              className="text-white/70 text-sm"
            >
              ← Tilbake
            </button>
            <div className="text-center">
              <div className="font-bold">{league.name}</div>
              <div className="text-xs opacity-70">{league.subtitle}</div>
            </div>
            <div className="w-16" />
          </div>
        </div>
        
        {/* Selected Character */}
        <div className="p-6 text-center">
          <p className="text-sm opacity-70 mb-2">VALGT SPILLER</p>
          <div className="flex justify-center">
            <div 
              className="w-32 h-40 rounded-2xl flex flex-col items-center justify-center"
              style={{ background: RARITIES[CHARACTERS[selectedCharacter].rarity].gradient }}
            >
              {CHARACTER_IMAGES[selectedCharacter] ? (
                <img 
                  src={CHARACTER_IMAGES[selectedCharacter]} 
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
                />
              ) : (
                <span className="text-5xl">{CHARACTERS[selectedCharacter].emoji}</span>
              )}
              <span className="font-bold mt-2">{CHARACTERS[selectedCharacter].name.split(' ').pop()}</span>
            </div>
          </div>
          
          {/* Power */}
          <div 
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: POWERS[CHARACTERS[selectedCharacter].power].color }}
          >
            <span className="text-xl">{POWERS[CHARACTERS[selectedCharacter].power].emoji}</span>
            <span className="font-bold">{POWERS[CHARACTERS[selectedCharacter].power].name}</span>
          </div>
          <p className="text-sm opacity-70 mt-2">
            {POWERS[CHARACTERS[selectedCharacter].power].desc}
          </p>
        </div>
        
        {/* Character Grid */}
        <div className="px-4 pb-4">
          <p className="text-sm opacity-70 mb-2">DINE SPILLERE</p>
          <div className="grid grid-cols-4 gap-2">
            {unlockedCharacters.map(charId => (
              <CharacterCardMini 
                key={charId}
                character={charId}
                selected={selectedCharacter === charId}
                onClick={() => setSelectedCharacter(charId)}
              />
            ))}
          </div>
        </div>
        
        {/* Keepers Info */}
        <div className="px-4 pb-4">
          <p className="text-sm opacity-70 mb-2">KEEPERE I DENNE LIGAEN</p>
          <div className="flex gap-2">
            {league.keepers.map(keeperId => {
              const keeper = KEEPERS[keeperId];
              return (
                <div 
                  key={keeperId}
                  className="flex-1 rounded-xl p-3 text-center"
                  style={{ backgroundColor: keeper.color + '30' }}
                >
                  <div className="text-2xl">{keeper.emoji}</div>
                  <div className="text-xs font-bold">{keeper.name}</div>
                  <div className="text-xs opacity-70">{keeper.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Start Button */}
        <div className="p-4">
          <button
            onClick={confirmCharacterAndStart}
            className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-xl active:scale-98 transition-transform"
          >
            ⚽ START KAMP
          </button>
        </div>
      </div>
    );
  }
  
  // Match Screen
  if (screen === 'match') {
    const league = LEAGUES.find(l => l.id === selectedLeague);
    const keeper = KEEPERS[currentKeeper];
    
    return (
      <div className="fixed inset-0 overflow-hidden">
        {/* Stadium Background */}
        <Stadium league={selectedLeague} />
        
        {/* HUD */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs">{league.name}</div>
              <div className="text-white font-bold">
                Straffe {currentPenalty + 1}/5
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">{goals}</div>
              <div className="text-white/70 text-xs">MÅL</div>
            </div>
            <div className="text-right">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < goals ? 'bg-green-500' : i < currentPenalty ? 'bg-red-500' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Goal Area */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%]">
          <Goal>
            <KeeperSVG 
              type={currentKeeper}
              state={keeperState}
              position={keeperPosition}
              stunned={keeperStunned}
            />
          </Goal>
        </div>
        
        {/* Ball */}
        <Ball 
          x={ballPosition.x}
          y={ballPosition.y}
          visible={ballVisible}
          character={selectedCharacter}
          animating={ballAnimating}
        />
        
        {/* Shot Result Overlay */}
        {shotResult && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
            <div className={`text-6xl font-black animate-bounce
              ${shotResult === 'goal' ? 'text-green-500' : 'text-red-500'}
            `}>
              {shotResult === 'goal' ? 'MÅL! 🎉' : shotResult === 'saved' ? 'REDDET! 😤' : 'UTENFOR! 😭'}
            </div>
          </div>
        )}
        
        {/* Swipe Zone */}
        <SwipeZone 
          onSwipe={handleSwipe}
          disabled={shotResult !== null}
        />
        
        {/* Character Power Indicator */}
        <div className="absolute bottom-4 left-4 z-20">
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ backgroundColor: POWERS[CHARACTERS[selectedCharacter].power].color }}
          >
            <span>{POWERS[CHARACTERS[selectedCharacter].power].emoji}</span>
            <span className="text-sm font-bold">{POWERS[CHARACTERS[selectedCharacter].power].name}</span>
          </div>
        </div>
        
        {/* Exit Button */}
        <button
          onClick={() => setScreen('journey')}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    );
  }
  
  // Result Screen
  if (screen === 'result') {
    const league = LEAGUES.find(l => l.id === selectedLeague);
    const matchStars = goals >= 5 ? 3 : goals >= 4 ? 2 : goals >= 3 ? 1 : 0;
    const won = matchStars > 0;
    
    return (
      <div 
        className="min-h-screen text-white flex flex-col items-center justify-center p-6"
        style={{ background: `linear-gradient(135deg, ${league.colors.primary}, ${league.colors.secondary})` }}
      >
        {/* Result */}
        <div className="text-6xl mb-4">
          {won ? '🎉' : '😢'}
        </div>
        <h1 className="text-3xl font-black mb-2">
          {won ? 'SEIER!' : 'TAPET'}
        </h1>
        <p className="text-xl opacity-70 mb-6">
          {goals} av 5 mål
        </p>
        
        {/* Stars */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`text-4xl transition-all duration-500 ${i <= matchStars ? 'scale-100' : 'scale-75 opacity-30'}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              ⭐
            </div>
          ))}
        </div>
        
        {/* Rewards */}
        {won && (
          <div className="bg-black/30 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm opacity-70 mb-2">BELØNNING</p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <span className="text-2xl">🪙</span>
                <span className="font-bold ml-1">+{50 + (matchStars === 3 ? 100 : 0)}</span>
              </div>
              <div>
                <span className="text-2xl">⭐</span>
                <span className="font-bold ml-1">+{matchStars}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => {
              setScreen('journey');
              setShowResult(false);
            }}
            className="w-full py-4 rounded-2xl bg-white text-black font-black text-lg active:scale-98 transition-transform"
          >
            FORTSETT
          </button>
          {!won && (
            <button
              onClick={confirmCharacterAndStart}
              className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-black text-lg active:scale-98 transition-transform"
            >
              🔄 PRØV IGJEN
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return null;
};

export default BrainRotFC;
