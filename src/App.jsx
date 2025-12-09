import React, { useState, useEffect, useRef } from 'react';

// Premium color palette
const COLORS = {
  bg: { primary: '#0a0a0f', secondary: '#12121a', tertiary: '#1a1a2e' },
  gold: { primary: '#d4af37', secondary: '#f4d03f', dim: '#8b7355' },
  accent: { purple: '#6366f1', pink: '#ec4899', cyan: '#22d3ee', green: '#22c55e', red: '#ef4444' },
  text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)' }
};

// Rarity configurations with premium gradients
const RARITIES = {
  common: { 
    name: 'BRONZE', color: '#cd7f32', 
    gradient: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 50%, #cd7f32 100%)',
    glow: '0 0 30px rgba(205,127,50,0.4)', borderGradient: 'linear-gradient(135deg, #cd7f32, #8b4513)'
  },
  rare: { 
    name: 'SILVER', color: '#c0c0c0',
    gradient: 'linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 50%, #c0c0c0 100%)',
    glow: '0 0 30px rgba(192,192,192,0.5)', borderGradient: 'linear-gradient(135deg, #e8e8e8, #808080)'
  },
  epic: { 
    name: 'GOLD', color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #ffd700 100%)',
    glow: '0 0 40px rgba(255,215,0,0.5)', borderGradient: 'linear-gradient(135deg, #ffd700, #b8860b)'
  },
  legendary: { 
    name: 'SPECIAL', color: '#00ffff',
    gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 50%, #ff00ff 100%)',
    glow: '0 0 50px rgba(0,255,255,0.5)', borderGradient: 'linear-gradient(135deg, #00ffff, #ff00ff)'
  },
  goat: { 
    name: 'ICON', color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 25%, #6bcb77 50%, #4d96ff 75%, #ff6b6b 100%)',
    glow: '0 0 60px rgba(255,107,107,0.6)', borderGradient: 'linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77)',
    animated: true
  }
};

// Character emoji representations (fallback)
const CHARACTER_EMOJIS = {
  tralalero: '🦈',
  bombardiro: '🐊',
  tungtung: '🥁',
  cappuccino: '☕',
  ballerina: '🩰',
  brrbrr: '🌳',
  lirili: '🐘',
  haaland: '⚽',
  odegaard: '🎯',
  nusa: '⭐',
  bobb: '💫',
  messi: '🐐',
  ronaldo: '🏆',
  neymar: '🌈',
  mbappe: '⚡',
  haalandiro: '🦖',
  messirili: '✨'
};

// Brain Rot character images hosted on GitHub
const CHARACTER_IMAGES = {
  tralalero: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Tralalero-Tralala.jpeg',
  bombardiro: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Bombardiro-Crocodilo.jpeg',
  tungtung: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Tung-Tung-Tung-Sahur.jpeg',
  cappuccino: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Cappuccino-Assassino.jpeg',
  ballerina: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Ballerina-Cappuccina.jpeg',
  brrbrr: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Brr-Brr-Patapim.png',
  lirili: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Lirilii-Larilaa.jpeg',
  haalandiro: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Haalandiro-Crocodilo.jpeg',
  messirili: 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/Messirili-Tralala.jpeg'
};

// Character database with stats
const CHARACTERS = {
  // Brain Rot
  tralalero: { id: 'tralalero', name: 'Tralalero Tralala', rarity: 'epic', type: 'brainrot', position: 'ST', nation: '🇮🇹', stats: { pac: 78, sho: 82, pas: 65, dri: 88, def: 32, phy: 74 }, overall: 84, ability: 'TRICKSTER', abilityDesc: 'Curved shots', emoji: '🦈', bgColor: '#0ea5e9' },
  bombardiro: { id: 'bombardiro', name: 'Bombardiro', rarity: 'epic', type: 'brainrot', position: 'CF', nation: '🇮🇹', stats: { pac: 70, sho: 92, pas: 55, dri: 68, def: 45, phy: 90 }, overall: 86, ability: 'EXPLOSIVE', abilityDesc: 'Screen shake', emoji: '🐊', bgColor: '#65a30d' },
  tungtung: { id: 'tungtung', name: 'Tung Tung Sahur', rarity: 'legendary', type: 'brainrot', position: 'CM', nation: '🇮🇩', stats: { pac: 85, sho: 78, pas: 82, dri: 80, def: 75, phy: 88 }, overall: 88, ability: 'STUN', abilityDesc: 'Freezes keeper', emoji: '🥁', bgColor: '#92400e' },
  cappuccino: { id: 'cappuccino', name: 'Cappuccino Assassino', rarity: 'rare', type: 'brainrot', position: 'CAM', nation: '🇮🇹', stats: { pac: 92, sho: 75, pas: 78, dri: 85, def: 35, phy: 60 }, overall: 82, ability: 'CAFFEINE', abilityDesc: 'Speed boost', emoji: '☕', bgColor: '#78350f' },
  ballerina: { id: 'ballerina', name: 'Ballerina Cappuccina', rarity: 'rare', type: 'brainrot', position: 'LW', nation: '🇮🇹', stats: { pac: 88, sho: 72, pas: 80, dri: 90, def: 28, phy: 55 }, overall: 81, ability: 'GRACE', abilityDesc: 'Smooth aim', emoji: '🩰', bgColor: '#ec4899' },
  brrbrr: { id: 'brrbrr', name: 'Brr Brr Patapim', rarity: 'common', type: 'brainrot', position: 'CDM', nation: '🇮🇹', stats: { pac: 65, sho: 60, pas: 72, dri: 68, def: 78, phy: 82 }, overall: 76, ability: 'FREEZE', abilityDesc: 'Slow keeper', emoji: '🌳', bgColor: '#22c55e' },
  lirili: { id: 'lirili', name: 'Lirilì Larilà', rarity: 'common', type: 'brainrot', position: 'RW', nation: '🇮🇹', stats: { pac: 75, sho: 65, pas: 70, dri: 78, def: 40, phy: 58 }, overall: 74, ability: 'CHAOS', abilityDesc: 'Random bonus', emoji: '🐘', bgColor: '#a855f7' },
  
  // Norwegian Legends
  haaland: { id: 'haaland', name: 'Erling Haaland', rarity: 'goat', type: 'norwegian', position: 'ST', nation: '🇳🇴', stats: { pac: 89, sho: 94, pas: 72, dri: 82, def: 45, phy: 95 }, overall: 96, ability: 'BEAST', abilityDesc: 'Unstoppable', emoji: '👹', bgColor: '#6ee7b7', jerseyNum: 9 },
  odegaard: { id: 'odegaard', name: 'Martin Ødegaard', rarity: 'goat', type: 'norwegian', position: 'CAM', nation: '🇳🇴', stats: { pac: 78, sho: 82, pas: 92, dri: 90, def: 55, phy: 65 }, overall: 92, ability: 'VISION', abilityDesc: 'See keeper', emoji: '👁️', bgColor: '#dc2626', jerseyNum: 8 },
  nusa: { id: 'nusa', name: 'Antonio Nusa', rarity: 'legendary', type: 'norwegian', position: 'LW', nation: '🇳🇴', stats: { pac: 94, sho: 78, pas: 75, dri: 88, def: 32, phy: 62 }, overall: 86, ability: 'WONDERKID', abilityDesc: '2x coins', emoji: '⭐', bgColor: '#a21caf', jerseyNum: 19 },
  bobb: { id: 'bobb', name: 'Oscar Bobb', rarity: 'legendary', type: 'norwegian', position: 'RW', nation: '🇳🇴', stats: { pac: 92, sho: 76, pas: 80, dri: 90, def: 38, phy: 68 }, overall: 85, ability: 'SILKY', abilityDesc: 'Smaller GK', emoji: '💫', bgColor: '#6ee7b7', jerseyNum: 52 },
  
  // Football Icons
  messi: { id: 'messi', name: 'Lionel Messi', rarity: 'goat', type: 'icon', position: 'RW', nation: '🇦🇷', stats: { pac: 81, sho: 90, pas: 92, dri: 96, def: 35, phy: 68 }, overall: 95, ability: 'PRECISION', abilityDesc: 'Slow aim', emoji: '🐐', bgColor: '#75aadb', jerseyNum: 10 },
  ronaldo: { id: 'ronaldo', name: 'Cristiano Ronaldo', rarity: 'goat', type: 'icon', position: 'ST', nation: '🇵🇹', stats: { pac: 84, sho: 95, pas: 78, dri: 86, def: 40, phy: 85 }, overall: 94, ability: 'SIUUU', abilityDesc: '+100 bonus', emoji: '🏆', bgColor: '#065f46', jerseyNum: 7 },
  neymar: { id: 'neymar', name: 'Neymar Jr', rarity: 'epic', type: 'icon', position: 'LW', nation: '🇧🇷', stats: { pac: 90, sho: 85, pas: 86, dri: 94, def: 30, phy: 62 }, overall: 89, ability: 'RAINBOW', abilityDesc: 'Random power', emoji: '🌈', bgColor: '#fbbf24', jerseyNum: 10 },
  mbappe: { id: 'mbappe', name: 'Kylian Mbappé', rarity: 'legendary', type: 'icon', position: 'ST', nation: '🇫🇷', stats: { pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78 }, overall: 93, ability: 'SPEED', abilityDesc: 'Fast meter', emoji: '⚡', bgColor: '#1d4ed8', jerseyNum: 7 },
  
  // Mashups
  haalandiro: { id: 'haalandiro', name: 'Haalandiro Crocodilo', rarity: 'goat', type: 'mashup', position: 'ST', nation: '🌍', stats: { pac: 88, sho: 96, pas: 70, dri: 85, def: 50, phy: 98 }, overall: 97, ability: 'BEAST BOMB', abilityDesc: 'Both effects', emoji: '🦖', bgColor: '#dc2626', jerseyNum: 9 },
  messirili: { id: 'messirili', name: 'Messirili Tralala', rarity: 'goat', type: 'mashup', position: 'CAM', nation: '🌍', stats: { pac: 82, sho: 88, pas: 94, dri: 95, def: 38, phy: 65 }, overall: 95, ability: 'GOAT CHAOS', abilityDesc: 'Precision+', emoji: '✨', bgColor: '#a855f7', jerseyNum: 10 }
};

const PACKS = {
  bronze: { name: 'Bronze Pack', cost: 0, cards: 1, emoji: '🥉', weights: { common: 80, rare: 20 } },
  silver: { name: 'Silver Pack', cost: 100, cards: 2, emoji: '🥈', weights: { common: 30, rare: 50, epic: 20 } },
  gold: { name: 'Gold Pack', cost: 300, cards: 3, emoji: '🥇', weights: { rare: 20, epic: 50, legendary: 28, goat: 2 } },
  icon: { name: 'Icon Pack', cost: 500, cards: 3, emoji: '⭐', weights: { epic: 25, legendary: 55, goat: 20 } }
};

// Premium FUT-style Card Component
const PlayerCard = ({ char, size = 'medium', onClick, selected }) => {
  const rarity = RARITIES[char.rarity];
  const sizes = { small: { w: 100, h: 140 }, medium: { w: 140, h: 196 }, large: { w: 200, h: 280 } };
  const { w, h } = sizes[size];
  const scale = w / 140;

  return (
    <div onClick={onClick} style={{
      width: w, height: h,
      position: 'relative',
      cursor: onClick ? 'pointer' : 'default',
      transform: selected ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: selected ? 'brightness(1.1)' : 'brightness(1)'
    }}>
      {/* Card glow */}
      <div style={{
        position: 'absolute', inset: -4, borderRadius: 12,
        background: rarity.gradient, opacity: 0.6, filter: 'blur(8px)',
        animation: rarity.animated ? 'pulse 2s infinite' : 'none'
      }} />
      
      {/* Card body */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        background: `linear-gradient(160deg, ${COLORS.bg.tertiary} 0%, ${COLORS.bg.primary} 100%)`,
        borderRadius: 10, overflow: 'hidden',
        border: `2px solid transparent`,
        backgroundClip: 'padding-box',
        boxShadow: rarity.glow
      }}>
        {/* Border gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 10, padding: 2,
          background: rarity.gradient, mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude', WebkitMaskComposite: 'xor', pointerEvents: 'none'
        }} />
        
        {/* Top section - rating and position */}
        <div style={{ position: 'absolute', top: 8 * scale, left: 10 * scale, zIndex: 2 }}>
          <div style={{ fontSize: 28 * scale, fontWeight: 900, color: rarity.color, lineHeight: 1, fontFamily: 'system-ui', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {char.overall}
          </div>
          <div style={{ fontSize: 11 * scale, fontWeight: 700, color: rarity.color, marginTop: 2 }}>
            {char.position}
          </div>
          <div style={{ fontSize: 16 * scale, marginTop: 4 }}>{char.nation}</div>
        </div>
        
        {/* Character display area - image or emoji */}
        <div style={{
          position: 'absolute', top: '8%', left: '25%', right: '5%', bottom: '42%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'visible'
        }}>
          {/* Background circle with character color */}
          <div style={{
            width: h * 0.32,
            height: h * 0.32,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${char.bgColor || rarity.color}60, ${char.bgColor || rarity.color}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 20px ${char.bgColor || rarity.color}40`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {CHARACTER_IMAGES[char.id] ? (
              <img 
                src={CHARACTER_IMAGES[char.id]} 
                alt={char.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              />
            ) : (
              <span style={{ 
                fontSize: h * 0.22,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}>
                {char.emoji}
              </span>
            )}
            {/* Jersey number badge - inside the circle for footballers */}
            {char.jerseyNum && (
              <div style={{
                position: 'absolute',
                bottom: -4 * scale,
                right: -4 * scale,
                background: `linear-gradient(135deg, ${char.bgColor || '#333'}, ${char.bgColor || '#333'}dd)`,
                color: '#fff',
                fontSize: 9 * scale,
                fontWeight: 900,
                padding: `${2 * scale}px ${5 * scale}px`,
                borderRadius: 6 * scale,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.3)',
                minWidth: 18 * scale,
                textAlign: 'center'
              }}>
                {char.jerseyNum}
              </div>
            )}
          </div>
        </div>
        
        {/* Name plate */}
        <div style={{
          position: 'absolute', bottom: '35%', left: 0, right: 0,
          background: `linear-gradient(90deg, transparent, ${rarity.color}20, transparent)`,
          padding: `${4 * scale}px 0`, textAlign: 'center'
        }}>
          <div style={{ fontSize: 11 * scale, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {char.name.split(' ').pop()}
          </div>
        </div>
        
        {/* Stats grid */}
        <div style={{
          position: 'absolute', bottom: 8 * scale, left: 8 * scale, right: 8 * scale,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 * scale
        }}>
          {[
            { label: 'PAC', value: char.stats.pac },
            { label: 'SHO', value: char.stats.sho },
            { label: 'PAS', value: char.stats.pas },
            { label: 'DRI', value: char.stats.dri },
            { label: 'DEF', value: char.stats.def },
            { label: 'PHY', value: char.stats.phy }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12 * scale, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: 7 * scale, color: COLORS.text.muted, fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Ability badge */}
        <div style={{
          position: 'absolute', top: 8 * scale, right: 8 * scale,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          padding: `${3 * scale}px ${6 * scale}px`, borderRadius: 4,
          border: `1px solid ${rarity.color}40`
        }}>
          <div style={{ fontSize: 7 * scale, color: rarity.color, fontWeight: 700 }}>⚡{char.ability}</div>
        </div>
      </div>
    </div>
  );
};

// Glassmorphism button component
const GlassButton = ({ children, onClick, variant = 'primary', disabled, style = {} }) => {
  const variants = {
    primary: { bg: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))', border: 'rgba(99,102,241,0.5)' },
    gold: { bg: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(184,134,11,0.3))', border: 'rgba(212,175,55,0.5)' },
    success: { bg: 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(22,163,74,0.3))', border: 'rgba(34,197,94,0.5)' },
    danger: { bg: 'linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.3))', border: 'rgba(239,68,68,0.5)' }
  };
  const v = variants[variant];
  
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '16px 24px', borderRadius: 12, border: `1px solid ${v.border}`,
      background: v.bg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      color: '#fff', fontSize: 16, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)', ...style
    }}>
      {children}
    </button>
  );
};

// Main Game Component
const BrainRotFC = () => {
  const [screen, setScreen] = useState('title');
  const [gameState, setGameState] = useState('aiming');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [unlockedChars, setUnlockedChars] = useState(['brrbrr', 'lirili']);
  const [selectedChar, setSelectedChar] = useState('brrbrr');
  
  const [aimX, setAimX] = useState(50);
  const [aimDirection, setAimDirection] = useState(1);
  const [power, setPower] = useState(0);
  const [powerDirection, setPowerDirection] = useState(1);
  const [ballY, setBallY] = useState(0);
  const [keeperX, setKeeperX] = useState(50);
  const [keeperStunned, setKeeperStunned] = useState(false);
  const [resultText, setResultText] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [screenShake, setScreenShake] = useState(0);
  const [showGoalFlash, setShowGoalFlash] = useState(false);
  const [keeperHint, setKeeperHint] = useState(null);
  const [abilityText, setAbilityText] = useState('');
  const [abilityActive, setAbilityActive] = useState(false);
  
  // Pack opening state - enhanced with flip animation
  const [packOpening, setPackOpening] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);
  const [currentReveal, setCurrentReveal] = useState(-1);
  const [freePacks, setFreePacks] = useState(1);
  const [packStage, setPackStage] = useState('closed'); // 'closed', 'opening', 'cards'
  const [flippedCards, setFlippedCards] = useState([]);
  
  const keeperRef = useRef(50);
  const lockedAimRef = useRef(50);
  const powerRef = useRef(0);
  const char = CHARACTERS[selectedChar];
  
  // Game logic (same as before but cleaner)
  useEffect(() => {
    if (screen !== 'playing' || gameState === 'result' || gameState === 'shooting' || keeperStunned) return;
    let speed = 0.5 + (difficulty * 0.25);
    if (char?.ability === 'FREEZE') speed *= 0.6;
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      keeperRef.current = 50 + Math.sin(time * (0.8 + difficulty * 0.3)) * 35;
      setKeeperX(keeperRef.current);
      if (char?.ability === 'VISION') setKeeperHint(keeperRef.current > 50 ? 'RIGHT' : 'LEFT');
    }, 30);
    return () => clearInterval(interval);
  }, [screen, gameState, difficulty, char, keeperStunned]);

  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'aiming') return;
    let speed = char?.ability === 'PRECISION' || char?.ability === 'GRACE' ? 0.8 : char?.ability === 'SPEED' || char?.ability === 'CAFFEINE' ? 2.2 : 1.5;
    const interval = setInterval(() => {
      setAimX(prev => {
        let next = prev + aimDirection * speed;
        if (next >= 95 || next <= 5) setAimDirection(d => -d);
        return Math.max(5, Math.min(95, next));
      });
    }, 25);
    return () => clearInterval(interval);
  }, [screen, gameState, aimDirection, char]);

  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'power') return;
    let speed = char?.ability === 'CAFFEINE' || char?.ability === 'SPEED' ? 4.5 : 2.5;
    const interval = setInterval(() => {
      setPower(prev => {
        let next = prev + powerDirection * speed;
        if (next >= 100 || next <= 0) setPowerDirection(d => -d);
        powerRef.current = Math.max(0, Math.min(100, next));
        return powerRef.current;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [screen, gameState, powerDirection, char]);

  useEffect(() => {
    if (screen !== 'playing' || gameState !== 'shooting') return;
    let frame = 0;
    const animate = setInterval(() => {
      frame++;
      setBallY((frame / 30) * 100);
      if (frame >= 30) { clearInterval(animate); evaluateShot(); }
    }, 18);
    return () => clearInterval(animate);
  }, [gameState, screen]);

  const evaluateShot = () => {
    let shotX = lockedAimRef.current;
    const keeperPos = keeperRef.current;
    let shotPower = powerRef.current;
    
    const isBeast = char?.ability === 'BEAST' || char?.ability === 'BEAST BOMB';
    const isExplosive = char?.ability === 'EXPLOSIVE' || char?.ability === 'BEAST BOMB';
    
    // Show ability effects with big visible text
    if (char?.ability === 'TRICKSTER') {
      const curve = (Math.random() - 0.5) * 15;
      shotX += curve;
      setAbilityText(`🌀 CURVE ${curve > 0 ? 'RIGHT' : 'LEFT'}!`);
      setTimeout(() => setAbilityText(''), 1200);
    }
    if (char?.ability === 'CHAOS' || char?.ability === 'GOAT CHAOS') {
      if (Math.random() > 0.5) {
        shotPower = Math.min(90, shotPower + 20);
        setAbilityText('✨ CHAOS POWER BOOST!');
        setTimeout(() => setAbilityText(''), 1200);
      }
    }
    if (char?.ability === 'RAINBOW') {
      const change = Math.random() * 30 - 10;
      shotPower = Math.max(25, Math.min(90, shotPower + change));
      setAbilityText(`🌈 RAINBOW: ${change > 0 ? '+' : ''}${Math.round(change)} POWER!`);
      setTimeout(() => setAbilityText(''), 1200);
    }
    
    if (isExplosive) {
      setScreenShake(20);
      setTimeout(() => setScreenShake(0), 500);
      setAbilityText('💥 EXPLOSIVE SHOT!');
      setTimeout(() => setAbilityText(''), 1200);
    }
    
    if (isBeast) {
      setAbilityText('🦁 BEAST MODE - UNSTOPPABLE!');
      setTimeout(() => setAbilityText(''), 1200);
    }
    
    // POWER CHECK - too high = over the bar, too low = weak dribbler
    if (shotPower > 92 && !isBeast) { setResultText('BLAZED OVER! 🚀'); setStreak(0); setGameState('result'); return; }
    if (shotPower < 20 && !isBeast) { setResultText('WEAK! Easy save 😴'); setStreak(0); setGameState('result'); return; }
    
    // Wide shots
    if (shotX < 5 || shotX > 95) { setResultText('WIDE! 😭'); setStreak(0); setGameState('result'); return; }
    
    // Keeper save calculation - low power makes keeper's job easier
    let keeperWidth = char?.ability === 'SILKY' ? 14 : 20;
    if (char?.ability === 'SILKY') {
      setAbilityText('🎯 SILKY - KEEPER SHRUNK!');
      setTimeout(() => setAbilityText(''), 1000);
    }
    // Low power (20-40) gives keeper +5 reach, normal power no bonus
    const powerPenalty = shotPower < 40 ? 5 : 0;
    const effectiveKeeperWidth = keeperWidth + powerPenalty;
    const saved = shotX >= keeperPos - effectiveKeeperWidth/2 && shotX <= keeperPos + effectiveKeeperWidth/2 && !isBeast && !keeperStunned;
    
    if (saved) { setResultText(shotPower < 40 ? 'TOO WEAK! 🥱' : 'SAVED! 😤'); setStreak(0); setGameState('result'); return; }
    
    setShowGoalFlash(true); setTimeout(() => setShowGoalFlash(false), 500);
    
    const isCorner = shotX < 20 || shotX > 80;
    const isPerfectPower = shotPower >= 60 && shotPower <= 85; // Sweet spot
    const isTopBins = isCorner && isPerfectPower;
    let points = 100 + (isTopBins ? 100 : isCorner ? 50 : 0) + (isPerfectPower ? 25 : 0) + (char?.ability === 'SIUUU' ? 100 : 0);
    let coinMult = char?.ability === 'WONDERKID' ? 2 : 1;
    
    // Show wonderkid bonus
    if (char?.ability === 'WONDERKID') {
      setTimeout(() => { setAbilityText('💰 WONDERKID - 2X COINS!'); }, 300);
      setTimeout(() => setAbilityText(''), 1500);
    }
    
    setScore(s => s + Math.floor(points * (1 + streak * 0.15)));
    setCoins(c => c + Math.floor((10 + streak * 3) * coinMult));
    setStreak(s => s + 1);
    setDifficulty(d => Math.min(d + 0.2, 5));
    
    setResultText(char?.ability === 'SIUUU' ? 'SIUUUUU! 🐐 +100' : isTopBins ? 'TOP BINS! 🎯' : ['GOAL! 🔥', 'GOATED! 💀', 'SHEEEESH! 🔥'][Math.floor(Math.random() * 3)]);
    setGameState('result');
  };

  const startGame = () => {
    keeperRef.current = 50; setKeeperX(50); setScore(0); setStreak(0); setDifficulty(1);
    setBallY(0); setAimX(50); setPower(0); setKeeperHint(null); setKeeperStunned(false);
    setGameState('aiming'); setScreen('playing');
  };

  const handleTap = () => {
    if (screen !== 'playing') return;
    if (gameState === 'aiming') {
      lockedAimRef.current = aimX;
      if (char?.ability === 'STUN') {
        setKeeperStunned(true);
        setAbilityText('🥁 TUNG TUNG! KEEPER STUNNED!');
        setTimeout(() => {
          setKeeperStunned(false);
          setAbilityText('');
        }, 1500);
      }
      if (char?.ability === 'PRECISION' || char?.ability === 'GRACE' || char?.ability === 'GOAT CHAOS') {
        setAbilityText(char.ability === 'PRECISION' ? '🎯 PRECISION AIM ACTIVE' : char.ability === 'GRACE' ? '💃 GRACEFUL AIM' : '✨ GOAT MODE');
        setTimeout(() => setAbilityText(''), 800);
      }
      if (char?.ability === 'SPEED' || char?.ability === 'CAFFEINE') {
        setAbilityText(char.ability === 'SPEED' ? '⚡ SPEED MODE' : '☕ CAFFEINE RUSH');
        setTimeout(() => setAbilityText(''), 800);
      }
      setGameState('power');
    } else if (gameState === 'power') { powerRef.current = power; setGameState('shooting'); }
    else if (gameState === 'result') { setBallY(0); setAimX(50); setPower(0); setHighScore(h => Math.max(h, score)); setGameState('aiming'); }
  };

  const openPack = (packType) => {
    const pack = PACKS[packType];
    if (packType === 'bronze') { if (freePacks <= 0) return; setFreePacks(p => p - 1); }
    else { if (coins < pack.cost) return; setCoins(c => c - pack.cost); }
    
    const available = Object.values(CHARACTERS).filter(c => !unlockedChars.includes(c.id));
    if (available.length === 0) return;
    
    const cards = [];
    for (let i = 0; i < pack.cards && available.length > cards.length; i++) {
      const roll = Math.random() * 100;
      let cum = 0, rarity = 'common';
      for (const [r, w] of Object.entries(pack.weights)) { cum += w; if (roll < cum) { rarity = r; break; } }
      const candidates = available.filter(c => c.rarity === rarity && !cards.find(x => x.id === c.id));
      const pool = candidates.length ? candidates : available.filter(c => !cards.find(x => x.id === c.id));
      if (pool.length) cards.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    
    if (cards.length) {
      setPackOpening(packType);
      setRevealedCards(cards);
      setFlippedCards([]);
      setPackStage('closed');
      setCurrentReveal(-1);
    }
  };

  const flipCard = (index) => {
    if (flippedCards.includes(index)) return;
    setFlippedCards(prev => [...prev, index]);
    if (!unlockedChars.includes(revealedCards[index].id)) {
      setUnlockedChars(prev => [...prev, revealedCards[index].id]);
    }
  };

  const closePackOpening = () => {
    if (flippedCards.length < revealedCards.length) return; // Must flip all cards first
    setPackOpening(null);
    setRevealedCards([]);
    setFlippedCards([]);
    setPackStage('closed');
  };

  const toScreenX = x => 20 + (x / 100) * 60; // Maps 0-100 to goal width (20%-80%)
  const ballScreenY = 78 - (ballY / 100) * 46; // Ball travels from 78% to 32%

  // STYLES - iPad optimized
  const containerStyle = {
    width: '100%', height: '100vh', overflow: 'hidden',
    background: `radial-gradient(ellipse at 50% 0%, ${COLORS.bg.tertiary} 0%, ${COLORS.bg.primary} 100%)`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
  };

  // TITLE SCREEN
  if (screen === 'title') {
    return (
      <div onClick={() => setScreen('menu')} style={{ ...containerStyle, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Animated background particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.3 }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 4, height: 4, borderRadius: '50%',
              background: COLORS.gold.primary,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{
            fontSize: 56, fontWeight: 900, margin: 0, letterSpacing: -2,
            background: `linear-gradient(135deg, #fff 0%, ${COLORS.gold.primary} 50%, #fff 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(212,175,55,0.5)'
          }}>
            BRAIN ROT FC
          </h1>
          <p style={{ color: COLORS.gold.dim, fontSize: 14, marginTop: 8, letterSpacing: 4, textTransform: 'uppercase' }}>
            Ultimate Team
          </p>
          
          <div style={{
            marginTop: 60, padding: '16px 48px', borderRadius: 30,
            background: `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.secondary})`,
            color: COLORS.bg.primary, fontSize: 18, fontWeight: 800,
            boxShadow: '0 0 40px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}>
            TAP TO ENTER
          </div>
        </div>
        
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; } 50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; } }
          @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  // MENU SCREEN
  if (screen === 'menu') {
    return (
      <div style={{ ...containerStyle, padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
            padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <span style={{ color: COLORS.gold.primary, fontSize: 18, fontWeight: 700 }}>🪙 {coins}</span>
          </div>
          <div style={{ color: COLORS.text.secondary, fontSize: 12 }}>🏆 BEST: {highScore}</div>
        </div>

        {/* Selected player card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          borderRadius: 20, padding: 20, marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <PlayerCard char={char} size="medium" />
          <div style={{ flex: 1 }}>
            <div style={{ color: RARITIES[char.rarity].color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              {RARITIES[char.rarity].name}
            </div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{char.name}</div>
            <div style={{
              marginTop: 8, padding: '6px 12px', borderRadius: 6,
              background: `linear-gradient(90deg, ${RARITIES[char.rarity].color}20, transparent)`,
              display: 'inline-block'
            }}>
              <span style={{ color: COLORS.gold.primary, fontSize: 12, fontWeight: 600 }}>⚡ {char.ability}</span>
              <span style={{ color: COLORS.text.muted, fontSize: 11, marginLeft: 8 }}>{char.abilityDesc}</span>
            </div>
          </div>
        </div>

        {/* Menu buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <GlassButton onClick={() => setScreen('select')} variant="primary">
            👥 SELECT PLAYER
          </GlassButton>
          <GlassButton onClick={startGame} variant="success" style={{ padding: '20px 24px', fontSize: 18 }}>
            ⚽ PLAY MATCH
          </GlassButton>
          <GlassButton onClick={() => setScreen('packs')} variant="gold" style={{ position: 'relative' }}>
            🎁 OPEN PACKS
            {freePacks > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -8,
                background: COLORS.accent.red, padding: '4px 10px', borderRadius: 12,
                fontSize: 11, fontWeight: 700
              }}>{freePacks} FREE</span>
            )}
          </GlassButton>
          <GlassButton onClick={() => setScreen('collection')} variant="primary">
            📚 MY CLUB ({unlockedChars.length}/{Object.keys(CHARACTERS).length})
          </GlassButton>
        </div>
      </div>
    );
  }

  // SELECT SCREEN
  if (screen === 'select') {
    return (
      <div style={{ ...containerStyle, padding: 16, boxSizing: 'border-box', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => setScreen('menu')} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: 14
          }}>← Back</button>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>SELECT PLAYER</span>
          <div style={{ width: 70 }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Object.values(CHARACTERS).map(c => {
            const owned = unlockedChars.includes(c.id);
            return (
              <div key={c.id} style={{ opacity: owned ? 1 : 0.3 }} onClick={() => owned && setSelectedChar(c.id)}>
                {owned ? (
                  <PlayerCard char={c} size="small" selected={selectedChar === c.id} />
                ) : (
                  <div style={{
                    width: 100, height: 140, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 32 }}>🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // PACKS SCREEN
  if (screen === 'packs') {
    if (packOpening) {
      const allFlipped = flippedCards.length >= revealedCards.length;
      
      return (
        <div style={{ 
          ...containerStyle, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 20,
          touchAction: 'manipulation'
        }}>
          {/* Pack opening animation styles */}
          <style>{`
            @keyframes packShake {
              0%, 100% { transform: rotate(0deg) scale(1); }
              25% { transform: rotate(-5deg) scale(1.05); }
              75% { transform: rotate(5deg) scale(1.05); }
            }
            @keyframes packExplode {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.5); opacity: 0.8; }
              100% { transform: scale(0); opacity: 0; }
            }
            @keyframes cardFlip {
              0% { transform: perspective(1000px) rotateY(180deg); }
              100% { transform: perspective(1000px) rotateY(0deg); }
            }
            @keyframes cardGlow {
              0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.5); }
              50% { box-shadow: 0 0 40px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.5); }
            }
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
              50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }
            @keyframes floatUp {
              0% { transform: translateY(0) scale(1); opacity: 1; }
              100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
            }
            .card-container {
              perspective: 1000px;
              cursor: pointer;
            }
            .card-inner {
              position: relative;
              width: 100%;
              height: 100%;
              transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              transform-style: preserve-3d;
            }
            .card-inner.flipped {
              transform: rotateY(180deg);
            }
            .card-face {
              position: absolute;
              width: 100%;
              height: 100%;
              backface-visibility: hidden;
              border-radius: 12px;
              overflow: hidden;
            }
            .card-back {
              background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid rgba(212,175,55,0.5);
              animation: cardGlow 2s infinite;
            }
            .card-front {
              transform: rotateY(180deg);
            }
          `}</style>
          
          {/* Header */}
          <div style={{ 
            position: 'absolute', top: 20, left: 20, right: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ color: COLORS.gold.primary, fontSize: 24, fontWeight: 800 }}>
              {PACKS[packOpening].emoji} {PACKS[packOpening].name.toUpperCase()}
            </div>
            {allFlipped && (
              <button onClick={closePackOpening} style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none', borderRadius: 12, padding: '12px 24px',
                color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(34,197,94,0.4)'
              }}>
                DONE ✓
              </button>
            )}
          </div>
          
          {/* Instruction */}
          <div style={{
            position: 'absolute', top: 80,
            color: allFlipped ? COLORS.accent.green : COLORS.gold.primary,
            fontSize: 18, fontWeight: 600, textAlign: 'center'
          }}>
            {allFlipped ? '🎉 ALL PLAYERS REVEALED!' : '👆 TAP CARDS TO REVEAL'}
          </div>
          
          {/* Cards display - BIG CARDS */}
          <div style={{
            display: 'flex',
            gap: revealedCards.length > 2 ? 24 : 40,
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: '100%',
            marginTop: 20
          }}>
            {revealedCards.map((card, index) => {
              const isFlipped = flippedCards.includes(index);
              const rarity = RARITIES[card.rarity];
              // Use exact large PlayerCard dimensions
              const cardWidth = 200;
              const cardHeight = 280;
              
              return (
                <div
                  key={index}
                  className="card-container"
                  onClick={() => flipCard(index)}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    position: 'relative'
                  }}
                >
                  {/* Sparkles when flipped */}
                  {isFlipped && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          width: 20, height: 20,
                          background: rarity.color,
                          borderRadius: '50%',
                          animation: `floatUp 1s ease-out forwards`,
                          animationDelay: `${i * 0.1}s`,
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${50 + i * 10}px)`,
                          pointerEvents: 'none'
                        }} />
                      ))}
                    </>
                  )}
                  
                  <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                    {/* Card Back */}
                    <div className="card-back" style={{
                      position: 'absolute', width: '100%', height: '100%',
                      backfaceVisibility: 'hidden',
                      background: `linear-gradient(135deg, ${COLORS.bg.tertiary}, ${COLORS.bg.primary})`,
                      borderRadius: 12, border: `3px solid ${COLORS.gold.primary}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 30px ${COLORS.gold.primary}40`
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <div style={{ fontSize: 72 }}>⚽</div>
                        <div style={{ 
                          color: COLORS.gold.primary, 
                          fontSize: 16, 
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 3
                        }}>
                          TAP TO REVEAL
                        </div>
                        <div style={{
                          width: 80, height: 4, borderRadius: 2,
                          background: `linear-gradient(90deg, transparent, ${COLORS.gold.primary}, transparent)`
                        }} />
                      </div>
                    </div>
                    
                    {/* Card Front */}
                    <div className="card-front" style={{
                      position: 'absolute', width: '100%', height: '100%',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: 12
                    }}>
                      <PlayerCard char={card} size="large" />
                    </div>
                  </div>
                  {/* NEW badge */}
                  {isFlipped && (
                    <div style={{
                      position: 'absolute', top: -10, right: -10, zIndex: 10,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#fff', fontSize: 10, fontWeight: 800,
                      padding: '4px 8px', borderRadius: 8,
                      boxShadow: '0 2px 10px rgba(34,197,94,0.5)',
                      animation: 'pulse 1s infinite'
                    }}>
                      NEW!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Card info when flipped */}
          {flippedCards.length > 0 && (
            <div style={{
              position: 'absolute', bottom: 40, left: 20, right: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
            }}>
              {flippedCards.map(idx => {
                const card = revealedCards[idx];
                const rarity = RARITIES[card.rarity];
                return (
                  <div key={idx} style={{
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                    padding: '8px 20px', borderRadius: 12,
                    border: `1px solid ${rarity.color}40`,
                    display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <span style={{ color: rarity.color, fontWeight: 800 }}>{rarity.name}</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{card.name}</span>
                    <span style={{ color: COLORS.gold.primary, fontSize: 12 }}>⚡ {card.ability}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ ...containerStyle, padding: 20, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => setScreen('menu')} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            color: '#fff', padding: '8px 16px', cursor: 'pointer'
          }}>← Back</button>
          <span style={{ color: COLORS.gold.primary, fontSize: 18, fontWeight: 700 }}>🪙 {coins}</span>
        </div>
        
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>PACK STORE</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(PACKS).map(([key, pack]) => {
            const canAfford = key === 'bronze' ? freePacks > 0 : coins >= pack.cost;
            return (
              <div key={key} onClick={() => canAfford && openPack(key)} style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                borderRadius: 16, padding: 20, cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.5, border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: 48 }}>{pack.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{pack.name}</div>
                  <div style={{ color: COLORS.text.muted, fontSize: 13 }}>{pack.cards} player{pack.cards > 1 ? 's' : ''}</div>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: 10,
                  color: COLORS.gold.primary, fontWeight: 700
                }}>
                  {key === 'bronze' ? `${freePacks} FREE` : `🪙 ${pack.cost}`}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ color: COLORS.text.muted, fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          No duplicates - only new players!
        </p>
      </div>
    );
  }

  // COLLECTION SCREEN
  if (screen === 'collection') {
    return (
      <div style={{ ...containerStyle, padding: 16, boxSizing: 'border-box', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => setScreen('menu')} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            color: '#fff', padding: '8px 16px', cursor: 'pointer'
          }}>← Back</button>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{unlockedChars.length}/{Object.keys(CHARACTERS).length}</span>
        </div>
        
        {['goat', 'legendary', 'epic', 'rare', 'common'].map(rarity => {
          const chars = Object.values(CHARACTERS).filter(c => c.rarity === rarity);
          if (!chars.length) return null;
          return (
            <div key={rarity} style={{ marginBottom: 20 }}>
              <div style={{ color: RARITIES[rarity].color, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                {RARITIES[rarity].name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {chars.map(c => (
                  <div key={c.id} style={{ opacity: unlockedChars.includes(c.id) ? 1 : 0.25 }}>
                    {unlockedChars.includes(c.id) ? (
                      <PlayerCard char={c} size="small" />
                    ) : (
                      <div style={{
                        width: 100, height: 140, borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: 24 }}>?</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div onClick={handleTap} style={{
      ...containerStyle, cursor: 'pointer', userSelect: 'none',
      background: `linear-gradient(180deg, #0a0f1a 0%, #0d1f12 50%, #0a1a0a 100%)`,
      transform: screenShake ? `translateX(${Math.sin(Date.now()/50) * screenShake}px)` : 'none',
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent'
    }}>
      {/* Animation styles */}
      <style>{`
        @keyframes abilityPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
        }
        @keyframes abilityGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(212,175,55,0.5); }
          50% { box-shadow: 0 0 60px rgba(212,175,55,0.9), 0 0 100px rgba(212,175,55,0.4); }
        }
        @keyframes shakeIt {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes goalExplosion {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes floatEmoji {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
        }
        @keyframes stunWave {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      
      {/* Stadium atmosphere */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
      
      {/* Pitch */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '75%',
        background: 'linear-gradient(180deg, #1a4d2e 0%, #22663a 100%)'
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${i * 16.66}%`, left: 0, right: 0, height: '16.66%',
            background: i % 2 === 0 ? 'rgba(0,0,0,0.08)' : 'transparent'
          }} />
        ))}
      </div>

      {/* Goal with depth - smaller, more proportional */}
      <div style={{ position: 'absolute', top: '22%', left: '20%', width: '60%', height: '18%' }}>
        {/* Goal net background */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 4,
          background: 'rgba(0,0,0,0.8)',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '12px 12px'
        }} />
        {/* Crossbar */}
        <div style={{ position: 'absolute', top: -8, left: -8, right: -8, height: 16, background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)', borderRadius: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} />
        {/* Left post */}
        <div style={{ position: 'absolute', top: -8, left: -8, width: 16, height: 'calc(100% + 8px)', background: 'linear-gradient(90deg, #ccc 0%, #fff 50%, #ccc 100%)', borderRadius: 8 }} />
        {/* Right post */}
        <div style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 'calc(100% + 8px)', background: 'linear-gradient(90deg, #ccc 0%, #fff 50%, #ccc 100%)', borderRadius: 8 }} />
      </div>

      {/* CHARACTER CARD - Left side panel */}
      <div style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
      }}>
        <div style={{
          borderRadius: 12,
          boxShadow: `0 0 30px ${RARITIES[char.rarity].color}40`,
          border: `2px solid ${RARITIES[char.rarity].color}60`
        }}>
          <PlayerCard char={char} size="small" />
        </div>
        {/* Ability indicator */}
        <div style={{
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          padding: '6px 12px', borderRadius: 8,
          border: `1px solid ${RARITIES[char.rarity].color}40`,
          textAlign: 'center'
        }}>
          <div style={{ color: RARITIES[char.rarity].color, fontSize: 11, fontWeight: 800 }}>⚡ {char.ability}</div>
          <div style={{ color: COLORS.text.muted, fontSize: 9, marginTop: 2 }}>{char.abilityDesc}</div>
        </div>
      </div>

      {/* Keeper hint - bigger and more visible */}
      {keeperHint && (gameState === 'aiming' || gameState === 'power') && (
        <div style={{
          position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(184,134,11,0.95))',
          padding: '10px 24px', borderRadius: 24,
          color: '#000', fontWeight: 800, fontSize: 16, zIndex: 30,
          boxShadow: '0 4px 20px rgba(212,175,55,0.5)',
          animation: 'abilityPulse 1.5s ease-in-out infinite'
        }}>
          👁️ KEEPER GOING {keeperHint} {keeperHint === 'LEFT' ? '←' : '→'}
        </div>
      )}

      {/* BIG Ability text overlay - much more visible */}
      {abilityText && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 50, pointerEvents: 'none',
          animation: 'abilityPulse 0.5s ease-out'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
            padding: '20px 40px', borderRadius: 20,
            border: `3px solid ${COLORS.gold.primary}`,
            boxShadow: '0 0 60px rgba(212,175,55,0.6), 0 0 100px rgba(212,175,55,0.3)',
            animation: 'abilityGlow 1s ease-in-out infinite'
          }}>
            <span style={{ 
              color: COLORS.gold.primary, 
              fontSize: 32, 
              fontWeight: 900,
              textShadow: '0 0 20px rgba(212,175,55,0.8)'
            }}>{abilityText}</span>
          </div>
        </div>
      )}

      {/* Stun effect wave */}
      {keeperStunned && (
        <div style={{
          position: 'absolute', top: '32%', left: `${toScreenX(keeperX)}%`,
          transform: 'translate(-50%, -50%)', zIndex: 15, pointerEvents: 'none'
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 120, height: 120, borderRadius: '50%',
              border: '3px solid #fbbf24',
              animation: `stunWave 1s ease-out infinite`,
              animationDelay: `${i * 0.3}s`,
              transform: 'translate(-50%, -50%)'
            }} />
          ))}
        </div>
      )}

      {/* Goalkeeper - BIGGER and properly positioned */}
      <div style={{
        position: 'absolute', top: '24%', left: `${toScreenX(keeperX)}%`,
        transform: 'translateX(-50%)', transition: gameState === 'shooting' ? 'none' : 'left 0.03s',
        opacity: keeperStunned ? 0.4 : 1, zIndex: 10,
        filter: keeperStunned ? 'grayscale(0.5)' : 'none'
      }}>
        {/* Keeper shadow */}
        <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 110, height: 30, background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)' }} />
        {/* Premium Keeper SVG with realistic details */}
        <svg viewBox="0 0 120 160" style={{ width: 130, height: 173 }}>
          <defs>
            <linearGradient id="keeperJersey3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff8c00" />
              <stop offset="50%" stopColor="#ff6600" />
              <stop offset="100%" stopColor="#cc4400" />
            </linearGradient>
            <linearGradient id="keeperShorts" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5d0b0" />
              <stop offset="100%" stopColor="#e8b896" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a3728" />
              <stop offset="100%" stopColor="#2d1f14" />
            </linearGradient>
            <linearGradient id="gloveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb4a2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffb4a2" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Hair/Head back */}
          <ellipse cx="60" cy="24" rx="22" ry="20" fill="url(#hairGrad)" />
          
          {/* Face */}
          <ellipse cx="60" cy="28" rx="18" ry="17" fill="url(#skinTone)" />
          
          {/* Hair on top */}
          <path d="M42 20 Q50 8 60 10 Q70 8 78 20 Q75 15 60 14 Q45 15 42 20" fill="url(#hairGrad)" />
          
          {/* Ears */}
          <ellipse cx="42" cy="28" rx="4" ry="6" fill="url(#skinTone)" />
          <ellipse cx="78" cy="28" rx="4" ry="6" fill="url(#skinTone)" />
          
          {/* Eyebrows */}
          <path d="M48 22 Q52 20 56 22" stroke="#3d2914" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M64 22 Q68 20 72 22" stroke="#3d2914" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Eyes */}
          <ellipse cx="52" cy="27" rx="5" ry="4" fill="#fff" />
          <ellipse cx="68" cy="27" rx="5" ry="4" fill="#fff" />
          <circle cx="52" cy="27" r="2.5" fill="#3d2914" />
          <circle cx="68" cy="27" r="2.5" fill="#3d2914" />
          <circle cx="53" cy="26" r="1" fill="#fff" />
          <circle cx="69" cy="26" r="1" fill="#fff" />
          
          {/* Nose */}
          <path d="M58 30 Q60 35 62 30" stroke="#d4a574" strokeWidth="1.5" fill="none" />
          
          {/* Moustache - thick and curved */}
          <path d="M50 38 Q55 42 60 40 Q65 42 70 38 Q68 40 60 42 Q52 40 50 38" fill="#3d2914" />
          <path d="M48 37 Q52 35 56 37 Q54 39 48 37" fill="#3d2914" />
          <path d="M72 37 Q68 35 64 37 Q66 39 72 37" fill="#3d2914" />
          
          {/* Cheek blush */}
          <circle cx="45" cy="32" r="5" fill="url(#cheekBlush)" />
          <circle cx="75" cy="32" r="5" fill="url(#cheekBlush)" />
          
          {/* Mouth/Chin */}
          <path d="M55 44 Q60 46 65 44" stroke="#c9967a" strokeWidth="1" fill="none" />
          
          {/* Neck */}
          <rect x="52" y="44" width="16" height="10" fill="url(#skinTone)" />
          
          {/* Jersey Body - main torso */}
          <path d="M30 55 L40 52 L60 50 L80 52 L90 55 L92 95 L75 98 L60 100 L45 98 L28 95 Z" fill="url(#keeperJersey3)" />
          
          {/* Jersey collar */}
          <path d="M48 52 Q60 48 72 52 Q68 56 60 54 Q52 56 48 52" fill="#cc4400" />
          
          {/* Arms spread wide */}
          <path d="M30 55 L8 50 L5 70 L28 80 Z" fill="url(#keeperJersey3)" />
          <path d="M90 55 L112 50 L115 70 L92 80 Z" fill="url(#keeperJersey3)" />
          
          {/* Jersey details - stripes */}
          <rect x="45" y="60" width="30" height="3" fill="#cc4400" opacity="0.5" />
          <rect x="45" y="75" width="30" height="3" fill="#cc4400" opacity="0.5" />
          
          {/* Number 1 */}
          <text x="60" y="88" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900" fontFamily="Arial Black, sans-serif" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>1</text>
          
          {/* Gloves - big and detailed */}
          <ellipse cx="5" cy="65" rx="12" ry="14" fill="url(#gloveGrad)" />
          <ellipse cx="115" cy="65" rx="12" ry="14" fill="url(#gloveGrad)" />
          {/* Glove fingers */}
          <circle cx="0" cy="58" r="5" fill="url(#gloveGrad)" />
          <circle cx="3" cy="52" r="4" fill="url(#gloveGrad)" />
          <circle cx="10" cy="50" r="4" fill="url(#gloveGrad)" />
          <circle cx="120" cy="58" r="5" fill="url(#gloveGrad)" />
          <circle cx="117" cy="52" r="4" fill="url(#gloveGrad)" />
          <circle cx="110" cy="50" r="4" fill="url(#gloveGrad)" />
          {/* Glove palm texture */}
          <ellipse cx="5" cy="68" rx="6" ry="4" fill="#15803d" opacity="0.5" />
          <ellipse cx="115" cy="68" rx="6" ry="4" fill="#15803d" opacity="0.5" />
          
          {/* Shorts */}
          <path d="M42 95 L45 120 L55 120 L60 98 L65 120 L75 120 L78 95 Z" fill="url(#keeperShorts)" />
          
          {/* Legs with socks */}
          <rect x="46" y="118" width="10" height="25" rx="3" fill="#ff6600" />
          <rect x="64" y="118" width="10" height="25" rx="3" fill="#ff6600" />
          
          {/* Boots */}
          <path d="M44 140 L44 150 L58 150 L58 143 L48 143 L48 140 Z" fill="#111" />
          <path d="M62 140 L62 150 L76 150 L76 143 L72 143 L72 140 Z" fill="#111" />
          {/* Boot details */}
          <rect x="44" y="148" width="14" height="2" fill="#333" />
          <rect x="62" y="148" width="14" height="2" fill="#333" />
        </svg>
        {keeperStunned && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontSize: 52 }}>😵</div>}
      </div>

      {/* Aim */}
      {(gameState === 'aiming' || gameState === 'power') && (
        <>
          <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            <defs>
              <linearGradient id="aimGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={COLORS.gold.primary} stopOpacity="0.8" />
                <stop offset="100%" stopColor={COLORS.gold.primary} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line x1="50%" y1="78%" x2={`${toScreenX(aimX)}%`} y2="32%" stroke="url(#aimGrad)" strokeWidth="3" strokeDasharray="10,8" />
          </svg>
          <div style={{
            position: 'absolute', top: '30%', left: `${toScreenX(aimX)}%`, transform: 'translate(-50%, -50%)', zIndex: 15
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: `3px solid ${COLORS.gold.primary}`,
              boxShadow: `0 0 20px ${COLORS.gold.primary}80`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.gold.primary }} />
            </div>
          </div>
        </>
      )}

      {/* Ball */}
      <div style={{
        position: 'absolute',
        left: `${gameState === 'shooting' ? toScreenX(lockedAimRef.current) : '50'}%`,
        top: `${ballScreenY}%`,
        transform: `translate(-50%, -50%) scale(${1 - ballY / 100 * 0.5})`,
        zIndex: ballY > 50 ? 5 : 20
      }}>
        <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 50, height: 15, background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)' }} />
        <div style={{
          width: 55, height: 55, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, #fff 0%, #e5e5e5 40%, ${RARITIES[char.rarity].color}40 100%)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset -3px -3px 10px rgba(0,0,0,0.1)',
          border: `2px solid ${RARITIES[char.rarity].color}60`
        }} />
      </div>

      {/* Power meter - bigger and clearer */}
      {gameState === 'power' && (
        <div style={{
          position: 'absolute', right: 20, top: '15%', height: '55%', width: 36,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          borderRadius: 18, border: '3px solid rgba(255,255,255,0.2)', overflow: 'hidden',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
          {/* Power zones labels */}
          <div style={{ position: 'absolute', top: 2, left: -50, width: 45, textAlign: 'right', color: '#ef4444', fontSize: 10, fontWeight: 700 }}>TOO HIGH</div>
          <div style={{ position: 'absolute', top: '22%', left: -50, width: 45, textAlign: 'right', color: '#22c55e', fontSize: 10, fontWeight: 700 }}>PERFECT</div>
          <div style={{ position: 'absolute', bottom: '15%', left: -50, width: 45, textAlign: 'right', color: '#fbbf24', fontSize: 10, fontWeight: 700 }}>OK</div>
          <div style={{ position: 'absolute', bottom: 2, left: -50, width: 45, textAlign: 'right', color: '#ef4444', fontSize: 10, fontWeight: 700 }}>TOO LOW</div>
          
          {/* Power fill */}
          <div style={{
            position: 'absolute', bottom: 0, width: '100%', height: `${power}%`,
            background: power > 92 ? '#ef4444' : power < 20 ? '#ef4444' : power >= 60 && power <= 85 ? '#22c55e' : '#fbbf24',
            transition: 'background 0.1s',
            boxShadow: `inset 0 0 20px ${power > 92 || power < 20 ? 'rgba(239,68,68,0.5)' : power >= 60 && power <= 85 ? 'rgba(34,197,94,0.5)' : 'rgba(251,191,36,0.5)'}`
          }} />
          
          {/* Danger zone top */}
          <div style={{ position: 'absolute', top: 0, width: '100%', height: '8%', background: 'rgba(239,68,68,0.3)', borderBottom: '2px solid #ef4444' }} />
          {/* Sweet spot zone */}
          <div style={{ position: 'absolute', top: '15%', width: '100%', height: '25%', borderTop: '2px solid rgba(34,197,94,0.8)', borderBottom: '2px solid rgba(34,197,94,0.8)', background: 'rgba(34,197,94,0.15)' }} />
          {/* Danger zone bottom */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '20%', background: 'rgba(239,68,68,0.2)', borderTop: '2px solid rgba(239,68,68,0.6)' }} />
          
          {/* Current power indicator */}
          <div style={{
            position: 'absolute', bottom: `${power}%`, left: '50%', transform: 'translate(-50%, 50%)',
            width: 12, height: 12, borderRadius: '50%', background: '#fff',
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }} />
        </div>
      )}

      {/* HUD - Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '10px 16px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 25
      }}>
        <div /> {/* Spacer since card is now on left */}
        <div style={{ color: '#fff', fontSize: 42, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{score}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: COLORS.gold.primary, fontSize: 16, fontWeight: 600 }}>🪙 {coins}</div>
          <div style={{ color: '#f97316', fontSize: 16, fontWeight: 600 }}>🔥 {streak}</div>
        </div>
      </div>

      {/* Goal flash */}
      {showGoalFlash && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 30%, rgba(34,197,94,0.6) 0%, transparent 50%)'
        }}>
          {/* Floating emojis */}
          {['⚽', '🔥', '💥', '⭐'].map((emoji, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '40%', left: `${30 + i * 15}%`,
              fontSize: 40,
              animation: 'floatEmoji 1s ease-out forwards',
              animationDelay: `${i * 0.1}s`
            }}>{emoji}</div>
          ))}
        </div>
      )}

      {/* Result overlay */}
      {gameState === 'result' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            fontSize: 48, fontWeight: 900,
            color: resultText.includes('SAVED') || resultText.includes('WIDE') || resultText.includes('BLAZED') || resultText.includes('WEAK') ? '#ef4444' : '#22c55e',
            textShadow: `0 0 40px ${resultText.includes('SAVED') || resultText.includes('WIDE') || resultText.includes('BLAZED') || resultText.includes('WEAK') ? '#ef444480' : '#22c55e80'}`,
            textAlign: 'center',
            padding: '0 20px'
          }}>
            {resultText}
          </div>
          <p style={{ color: COLORS.text.muted, marginTop: 40, fontSize: 16 }}>TAP TO CONTINUE</p>
          <button onClick={e => { e.stopPropagation(); setScreen('menu'); }} style={{
            marginTop: 30, padding: '14px 32px', borderRadius: 12,
            background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600
          }}>EXIT TO MENU</button>
        </div>
      )}

      {/* Instructions - bigger touch target */}
      {(gameState === 'aiming' || gameState === 'power') && (
        <div style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', zIndex: 20 }}>
          <div style={{
            display: 'inline-block', padding: '14px 32px', borderRadius: 30,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 18, fontWeight: 700
          }}>
            {gameState === 'aiming' ? '👆 TAP TO SET AIM' : '👆 TAP FOR POWER'}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainRotFC;
