import React, { useState, useEffect, useRef } from 'react';

// Premium color palette
const COLORS = {
  bg: { primary: '#0a0a0f', secondary: '#12121a', tertiary: '#1a1a2e' },
  gold: { primary: '#d4af37', secondary: '#f4d03f', dim: '#8b7355' },
  accent: { purple: '#6366f1', pink: '#ec4899', cyan: '#22d3ee', green: '#22c55e', red: '#ef4444' },
  text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)' }
};

// Rarity configurations
const RARITIES = {
  common: { name: 'BRONZE', color: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 50%, #cd7f32 100%)', glow: '0 0 30px rgba(205,127,50,0.4)' },
  rare: { name: 'SILVER', color: '#c0c0c0', gradient: 'linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 50%, #c0c0c0 100%)', glow: '0 0 30px rgba(192,192,192,0.5)' },
  epic: { name: 'GOLD', color: '#ffd700', gradient: 'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #ffd700 100%)', glow: '0 0 40px rgba(255,215,0,0.5)' },
  legendary: { name: 'SPECIAL', color: '#00ffff', gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 50%, #ff00ff 100%)', glow: '0 0 50px rgba(0,255,255,0.5)' },
  goat: { name: 'ICON', color: '#ff6b6b', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 25%, #6bcb77 50%, #4d96ff 75%, #ff6b6b 100%)', glow: '0 0 60px rgba(255,107,107,0.6)', animated: true },
  secret: { name: 'SECRET', color: '#ff00ff', gradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff00ff 75%, #00ffff 100%)', glow: '0 0 80px rgba(255,0,255,0.8)', animated: true }
};

// Character images
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

// Characters database with unique balls
const CHARACTERS = {
  tralalero: { id: 'tralalero', name: 'Tralalero Tralala', rarity: 'epic', type: 'brainrot', position: 'ST', nation: '🇮🇹', stats: { pac: 78, sho: 82, pas: 65, dri: 88, def: 32, phy: 74 }, overall: 84, ability: 'TRICKSTER', abilityDesc: 'Curved shots that bend around the keeper', emoji: '🦈', bgColor: '#0ea5e9', ballEmoji: '🦈', ballColor: '#0ea5e9' },
  bombardiro: { id: 'bombardiro', name: 'Bombardiro', rarity: 'epic', type: 'brainrot', position: 'CF', nation: '🇮🇹', stats: { pac: 70, sho: 92, pas: 55, dri: 68, def: 45, phy: 90 }, overall: 86, ability: 'EXPLOSIVE', abilityDesc: 'Massive screen shake on every shot', emoji: '🐊', bgColor: '#65a30d', ballEmoji: '💣', ballColor: '#1a1a1a' },
  tungtung: { id: 'tungtung', name: 'Tung Tung Sahur', rarity: 'legendary', type: 'brainrot', position: 'CM', nation: '🇮🇩', stats: { pac: 85, sho: 78, pas: 82, dri: 80, def: 75, phy: 88 }, overall: 88, ability: 'STUN', abilityDesc: 'Freezes the keeper when you lock aim', emoji: '🥁', bgColor: '#92400e', ballEmoji: '🥁', ballColor: '#92400e' },
  cappuccino: { id: 'cappuccino', name: 'Cappuccino Assassino', rarity: 'rare', type: 'brainrot', position: 'CAM', nation: '🇮🇹', stats: { pac: 92, sho: 75, pas: 78, dri: 85, def: 35, phy: 60 }, overall: 82, ability: 'CAFFEINE', abilityDesc: 'Super fast aim and power meters', emoji: '☕', bgColor: '#78350f', ballEmoji: '☕', ballColor: '#78350f' },
  ballerina: { id: 'ballerina', name: 'Ballerina Cappuccina', rarity: 'rare', type: 'brainrot', position: 'LW', nation: '🇮🇹', stats: { pac: 88, sho: 72, pas: 80, dri: 90, def: 28, phy: 55 }, overall: 81, ability: 'GRACE', abilityDesc: 'Smooth slow aim for perfect accuracy', emoji: '🩰', bgColor: '#ec4899', ballEmoji: '🩰', ballColor: '#ec4899' },
  brrbrr: { id: 'brrbrr', name: 'Brr Brr Patapim', rarity: 'common', type: 'brainrot', position: 'CDM', nation: '🇮🇹', stats: { pac: 65, sho: 60, pas: 72, dri: 68, def: 78, phy: 82 }, overall: 76, ability: 'FREEZE', abilityDesc: 'Slows down the goalkeeper movement', emoji: '🌳', bgColor: '#22c55e', ballEmoji: '❄️', ballColor: '#67e8f9' },
  lirili: { id: 'lirili', name: 'Lirilì Larilà', rarity: 'common', type: 'brainrot', position: 'RW', nation: '🇮🇹', stats: { pac: 75, sho: 65, pas: 70, dri: 78, def: 40, phy: 58 }, overall: 74, ability: 'CHAOS', abilityDesc: 'Random power boost on shots', emoji: '🐘', bgColor: '#a855f7', ballEmoji: '🎲', ballColor: '#a855f7' },
  skibidi: { id: 'skibidi', name: 'Skibidi Toilet', rarity: 'common', type: 'brainrot', position: 'GK', nation: '🚽', stats: { pac: 1, sho: 1, pas: 1, dri: 1, def: 1, phy: 1 }, overall: 1, ability: 'WHIFF', abilityDesc: 'Every shot instantly misses. Cannot score!', emoji: '🤡', bgColor: '#fbbf24', ballEmoji: '🚽', ballColor: '#fbbf24' },
  haaland: { id: 'haaland', name: 'Erling Haaland', rarity: 'goat', type: 'norwegian', position: 'ST', nation: '🇳🇴', stats: { pac: 89, sho: 94, pas: 72, dri: 82, def: 45, phy: 95 }, overall: 96, ability: 'BEAST', abilityDesc: 'Unstoppable shots - cannot be saved', emoji: '👹', bgColor: '#6ee7b7', jerseyNum: 9, ballEmoji: '👹', ballColor: '#6ee7b7' },
  odegaard: { id: 'odegaard', name: 'Martin Ødegaard', rarity: 'goat', type: 'norwegian', position: 'CAM', nation: '🇳🇴', stats: { pac: 78, sho: 82, pas: 92, dri: 90, def: 55, phy: 65 }, overall: 92, ability: 'VISION', abilityDesc: 'See which way the keeper will dive', emoji: '👁️', bgColor: '#dc2626', jerseyNum: 8, ballEmoji: '👁️', ballColor: '#dc2626' },
  nusa: { id: 'nusa', name: 'Antonio Nusa', rarity: 'legendary', type: 'norwegian', position: 'LW', nation: '🇳🇴', stats: { pac: 94, sho: 78, pas: 75, dri: 88, def: 32, phy: 62 }, overall: 86, ability: 'WONDERKID', abilityDesc: 'Earn 2x coins for every goal', emoji: '⭐', bgColor: '#a21caf', jerseyNum: 19, ballEmoji: '⭐', ballColor: '#fbbf24' },
  bobb: { id: 'bobb', name: 'Oscar Bobb', rarity: 'legendary', type: 'norwegian', position: 'RW', nation: '🇳🇴', stats: { pac: 92, sho: 76, pas: 80, dri: 90, def: 38, phy: 68 }, overall: 85, ability: 'SILKY', abilityDesc: 'Shrinks the goalkeeper hitbox', emoji: '💫', bgColor: '#6ee7b7', jerseyNum: 52, ballEmoji: '💫', ballColor: '#6ee7b7' },
  messi: { id: 'messi', name: 'Lionel Messi', rarity: 'goat', type: 'icon', position: 'RW', nation: '🇦🇷', stats: { pac: 81, sho: 90, pas: 92, dri: 96, def: 35, phy: 68 }, overall: 95, ability: 'PRECISION', abilityDesc: 'Extra slow aim for perfect placement', emoji: '🐐', bgColor: '#75aadb', jerseyNum: 10, ballEmoji: '🐐', ballColor: '#75aadb' },
  ronaldo: { id: 'ronaldo', name: 'Cristiano Ronaldo', rarity: 'goat', type: 'icon', position: 'ST', nation: '🇵🇹', stats: { pac: 84, sho: 95, pas: 78, dri: 86, def: 40, phy: 85 }, overall: 94, ability: 'SIUUU', abilityDesc: '+100 bonus points on every goal', emoji: '🏆', bgColor: '#065f46', jerseyNum: 7, ballEmoji: '🏆', ballColor: '#ffd700' },
  neymar: { id: 'neymar', name: 'Neymar Jr', rarity: 'epic', type: 'icon', position: 'LW', nation: '🇧🇷', stats: { pac: 90, sho: 85, pas: 86, dri: 94, def: 30, phy: 62 }, overall: 89, ability: 'RAINBOW', abilityDesc: 'Random power modifier each shot', emoji: '🌈', bgColor: '#fbbf24', jerseyNum: 10, ballEmoji: '🌈', ballColor: '#fbbf24' },
  mbappe: { id: 'mbappe', name: 'Kylian Mbappé', rarity: 'legendary', type: 'icon', position: 'ST', nation: '🇫🇷', stats: { pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78 }, overall: 93, ability: 'SPEED', abilityDesc: 'Lightning fast power meter', emoji: '⚡', bgColor: '#1d4ed8', jerseyNum: 7, ballEmoji: '⚡', ballColor: '#3b82f6' },
  haalandiro: { id: 'haalandiro', name: 'Haalandiro Crocodilo', rarity: 'goat', type: 'mashup', position: 'ST', nation: '🌍', stats: { pac: 88, sho: 96, pas: 70, dri: 85, def: 50, phy: 98 }, overall: 97, ability: 'BEAST BOMB', abilityDesc: 'Unstoppable + Screen shake combined', emoji: '🦖', bgColor: '#dc2626', jerseyNum: 9, ballEmoji: '🦖', ballColor: '#dc2626' },
  messirili: { id: 'messirili', name: 'Messirili Tralala', rarity: 'goat', type: 'mashup', position: 'CAM', nation: '🌍', stats: { pac: 82, sho: 88, pas: 94, dri: 95, def: 38, phy: 65 }, overall: 95, ability: 'GOAT CHAOS', abilityDesc: 'Precision aim + Random power boost', emoji: '✨', bgColor: '#a855f7', jerseyNum: 10, ballEmoji: '✨', ballColor: '#a855f7' },
  vegimite: { id: 'vegimite', name: 'Vegimite Dinamite', rarity: 'secret', type: 'secret', position: 'ST', nation: '🌍', stats: { pac: 99, sho: 99, pas: 99, dri: 99, def: 99, phy: 99 }, overall: 99, ability: 'DYNAMITE', abilityDesc: '1000 coins per goal - EXPLOSIVE REWARDS!', emoji: '🧨', bgColor: '#ff00ff', jerseyNum: 0, isSecret: true, ballEmoji: '🧨', ballColor: '#ff00ff' }
};

const REGULAR_CHAR_COUNT = Object.values(CHARACTERS).filter(c => !c.isSecret).length;

const PACKS = {
  bronze: { name: 'Bronze Pack', cost: 0, cards: 1, emoji: '🥉', weights: { common: 80, rare: 20 } },
  silver: { name: 'Silver Pack', cost: 100, cards: 2, emoji: '🥈', weights: { common: 30, rare: 50, epic: 20 } },
  gold: { name: 'Gold Pack', cost: 300, cards: 3, emoji: '🥇', weights: { rare: 20, epic: 50, legendary: 28, goat: 2 } },
  icon: { name: 'Icon Pack', cost: 500, cards: 3, emoji: '⭐', weights: { epic: 25, legendary: 55, goat: 20 } }
};

// Player Card Component
const PlayerCard = ({ char, size = 'medium', onClick, selected }) => {
  const rarity = RARITIES[char.rarity];
  const sizes = { small: { w: 100, h: 140 }, medium: { w: 140, h: 196 }, large: { w: 200, h: 280 }, xlarge: { w: 280, h: 392 } };
  const { w, h } = sizes[size];
  const scale = w / 140;

  return (
    <div onClick={onClick} style={{ width: w, height: h, position: 'relative', cursor: onClick ? 'pointer' : 'default', transform: selected ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s ease', filter: selected ? 'brightness(1.1)' : 'brightness(1)' }}>
      <div style={{ position: 'absolute', inset: -4, borderRadius: 12, background: rarity.gradient, opacity: 0.6, filter: 'blur(8px)', animation: rarity.animated ? 'pulse 2s infinite' : 'none' }} />
      <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(160deg, ${COLORS.bg.tertiary} 0%, ${COLORS.bg.primary} 100%)`, borderRadius: 10, overflow: 'hidden', boxShadow: rarity.glow }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 10, padding: 2, background: rarity.gradient, mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 8 * scale, left: 10 * scale, zIndex: 2 }}>
          <div style={{ fontSize: 28 * scale, fontWeight: 900, color: rarity.color, lineHeight: 1 }}>{char.overall}</div>
          <div style={{ fontSize: 11 * scale, fontWeight: 700, color: rarity.color, marginTop: 2 }}>{char.position}</div>
          <div style={{ fontSize: 16 * scale, marginTop: 4 }}>{char.nation}</div>
        </div>
        <div style={{ position: 'absolute', top: '8%', left: '25%', right: '5%', bottom: '42%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: h * 0.32, height: h * 0.32, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${char.bgColor || rarity.color}60, ${char.bgColor || rarity.color}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${char.bgColor || rarity.color}40`, position: 'relative', overflow: 'hidden' }}>
            {CHARACTER_IMAGES[char.id] ? (
              <img src={CHARACTER_IMAGES[char.id]} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <span style={{ fontSize: h * 0.22 }}>{char.emoji}</span>
            )}
            {char.jerseyNum !== undefined && (
              <div style={{ position: 'absolute', bottom: -4 * scale, right: -4 * scale, background: char.bgColor || '#333', color: '#fff', fontSize: 9 * scale, fontWeight: 900, padding: `${2 * scale}px ${5 * scale}px`, borderRadius: 6 * scale, minWidth: 18 * scale, textAlign: 'center' }}>{char.jerseyNum}</div>
            )}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '35%', left: 0, right: 0, background: `linear-gradient(90deg, transparent, ${rarity.color}20, transparent)`, padding: `${4 * scale}px 0`, textAlign: 'center' }}>
          <div style={{ fontSize: 11 * scale, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>{char.name.split(' ').pop()}</div>
        </div>
        <div style={{ position: 'absolute', bottom: 8 * scale, left: 8 * scale, right: 8 * scale, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 * scale }}>
          {[{ label: 'PAC', value: char.stats.pac }, { label: 'SHO', value: char.stats.sho }, { label: 'PAS', value: char.stats.pas }, { label: 'DRI', value: char.stats.dri }, { label: 'DEF', value: char.stats.def }, { label: 'PHY', value: char.stats.phy }].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12 * scale, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: 7 * scale, color: COLORS.text.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 8 * scale, right: 8 * scale, background: 'rgba(0,0,0,0.6)', padding: `${3 * scale}px ${6 * scale}px`, borderRadius: 4 }}>
          <div style={{ fontSize: 7 * scale, color: rarity.color, fontWeight: 700 }}>⚡{char.ability}</div>
        </div>
      </div>
    </div>
  );
};

// Ability Info Box
const AbilityBox = ({ char, size = 'normal' }) => {
  const rarity = RARITIES[char.rarity];
  const isLarge = size === 'large';
  return (
    <div style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.9), ${rarity.color}20)`, backdropFilter: 'blur(10px)', padding: isLarge ? '24px 28px' : '16px 20px', borderRadius: 16, border: `2px solid ${rarity.color}60`, boxShadow: `0 4px 30px ${rarity.color}30`, width: '100%', maxWidth: isLarge ? 400 : 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isLarge ? 16 : 12 }}>
        <span style={{ fontSize: isLarge ? 36 : 28 }}>⚡</span>
        <div>
          <div style={{ color: rarity.color, fontSize: isLarge ? 24 : 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>{char.ability}</div>
          <div style={{ color: COLORS.text.muted, fontSize: isLarge ? 12 : 10, textTransform: 'uppercase', letterSpacing: 2 }}>Special Power</div>
        </div>
      </div>
      <div style={{ color: COLORS.text.primary, fontSize: isLarge ? 18 : 14, lineHeight: 1.5, fontWeight: 500 }}>{char.abilityDesc}</div>
    </div>
  );
};

// Glass Button
const GlassButton = ({ children, onClick, variant = 'primary', disabled, style = {} }) => {
  const variants = {
    primary: { bg: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))', border: 'rgba(99,102,241,0.5)' },
    gold: { bg: 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(184,134,11,0.3))', border: 'rgba(212,175,55,0.5)' },
    success: { bg: 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(22,163,74,0.3))', border: 'rgba(34,197,94,0.5)' }
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '16px 24px', borderRadius: 12, border: `1px solid ${v.border}`, background: v.bg, backdropFilter: 'blur(12px)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'all 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', ...style }}>{children}</button>
  );
};

// Main Game Component
const BrainRotFC = () => {
  const [screen, setScreen] = useState('title');
  const [gameState, setGameState] = useState('aiming');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [coins, setCoins] = useState(100);
  const [unlockedChars, setUnlockedChars] = useState(['brrbrr', 'lirili']);
  const [selectedChar, setSelectedChar] = useState('brrbrr');
  const [previewChar, setPreviewChar] = useState('brrbrr');
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
  const [packOpening, setPackOpening] = useState(null);
  const [revealedCards, setRevealedCards] = useState([]);
  const [freePacks, setFreePacks] = useState(1);
  const [flippedCards, setFlippedCards] = useState([]);
  const [showSecretUnlock, setShowSecretUnlock] = useState(false);

  const keeperRef = useRef(50);
  const lockedAimRef = useRef(50);
  const powerRef = useRef(0);
  const char = CHARACTERS[selectedChar];

  // Check secret unlock
  useEffect(() => {
    const regularCharsUnlocked = unlockedChars.filter(id => !CHARACTERS[id]?.isSecret).length;
    if (regularCharsUnlocked >= REGULAR_CHAR_COUNT && !unlockedChars.includes('vegimite')) {
      setShowSecretUnlock(true);
    }
  }, [unlockedChars]);

  // Game effects
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
    const isDynamite = char?.ability === 'DYNAMITE';
    const isWhiff = char?.ability === 'WHIFF';

    // Skibidi Toilet WHIFF - always misses with funny messages
    if (isWhiff) {
      const whiffMessages = ['🚽 FLUSHED WIDE!', '🤡 CLOWN SHOT!', '🚽 DOWN THE DRAIN!', '🤡 SKIBIDI MISS!', '🚽 TOILET HUMOR!'];
      setAbilityText('🚽🤡 WHIFF!!!');
      setTimeout(() => setAbilityText(''), 1200);
      setResultText(whiffMessages[Math.floor(Math.random() * whiffMessages.length)]);
      setStreak(0);
      setGameState('result');
      return;
    }

    if (char?.ability === 'TRICKSTER') { shotX += (Math.random() - 0.5) * 15; setAbilityText('🌀 CURVED!'); setTimeout(() => setAbilityText(''), 1200); }
    if (char?.ability === 'CHAOS' || char?.ability === 'GOAT CHAOS') { if (Math.random() > 0.5) { shotPower = Math.min(90, shotPower + 20); setAbilityText('✨ CHAOS BOOST!'); setTimeout(() => setAbilityText(''), 1200); } }
    if (char?.ability === 'RAINBOW') { const change = Math.random() * 30 - 10; shotPower = Math.max(25, Math.min(90, shotPower + change)); setAbilityText(`🌈 ${change > 0 ? '+' : ''}${Math.round(change)} POWER`); setTimeout(() => setAbilityText(''), 1200); }
    if (isExplosive || isDynamite) { setScreenShake(20); setTimeout(() => setScreenShake(0), 500); setAbilityText(isDynamite ? '🧨 BOOM!' : '💥 EXPLOSIVE!'); setTimeout(() => setAbilityText(''), 1200); }
    if (isBeast) { setAbilityText('🦁 UNSTOPPABLE!'); setTimeout(() => setAbilityText(''), 1200); }

    if (shotPower > 92 && !isBeast && !isDynamite) { setResultText('BLAZED OVER! 🚀'); setStreak(0); setGameState('result'); return; }
    if (shotPower < 20 && !isBeast && !isDynamite) { setResultText('WEAK! 😴'); setStreak(0); setGameState('result'); return; }
    if (shotX < 5 || shotX > 95) { setResultText('WIDE! 😭'); setStreak(0); setGameState('result'); return; }

    let keeperWidth = char?.ability === 'SILKY' ? 14 : 20;
    const powerPenalty = shotPower < 40 ? 5 : 0;
    const saved = shotX >= keeperPos - (keeperWidth + powerPenalty) / 2 && shotX <= keeperPos + (keeperWidth + powerPenalty) / 2 && !isBeast && !keeperStunned && !isDynamite;

    if (saved) { setResultText('SAVED! 😤'); setStreak(0); setGameState('result'); return; }

    setShowGoalFlash(true); setTimeout(() => setShowGoalFlash(false), 500);
    const isCorner = shotX < 20 || shotX > 80;
    const isPerfectPower = shotPower >= 60 && shotPower <= 85;
    let points = 100 + (isCorner && isPerfectPower ? 100 : isCorner ? 50 : 0) + (isPerfectPower ? 25 : 0) + (char?.ability === 'SIUUU' ? 100 : 0);
    let coinReward = isDynamite ? 1000 : (10 + streak * 3);
    let coinMult = char?.ability === 'WONDERKID' ? 2 : 1;

    if (isDynamite) { setTimeout(() => setAbilityText('🧨💰 1000 COINS! 💰🧨'), 300); setTimeout(() => setAbilityText(''), 1500); }
    else if (char?.ability === 'WONDERKID') { setTimeout(() => setAbilityText('💰 2X COINS!'), 300); setTimeout(() => setAbilityText(''), 1500); }

    setScore(s => s + Math.floor(points * (1 + streak * 0.15)));
    setCoins(c => c + Math.floor(coinReward * coinMult));
    setStreak(s => s + 1);
    setDifficulty(d => Math.min(d + 0.2, 5));
    setResultText(isDynamite ? 'BOOM! 🧨' : char?.ability === 'SIUUU' ? 'SIUUU! 🐐' : isCorner && isPerfectPower ? 'TOP BINS! 🎯' : 'GOAL! 🔥');
    setGameState('result');
  };

  const startGame = () => { keeperRef.current = 50; setKeeperX(50); setScore(0); setStreak(0); setDifficulty(1); setBallY(0); setAimX(50); setPower(0); setKeeperHint(null); setKeeperStunned(false); setGameState('aiming'); setScreen('playing'); };

  const handleTap = () => {
    if (screen !== 'playing') return;
    if (gameState === 'aiming') {
      lockedAimRef.current = aimX;
      if (char?.ability === 'STUN') { setKeeperStunned(true); setAbilityText('🥁 STUNNED!'); setTimeout(() => { setKeeperStunned(false); setAbilityText(''); }, 1500); }
      setGameState('power');
    } else if (gameState === 'power') { powerRef.current = power; setGameState('shooting'); }
    else if (gameState === 'result') { setBallY(0); setAimX(50); setPower(0); setHighScore(h => Math.max(h, score)); setBestStreak(b => Math.max(b, streak)); setGameState('aiming'); }
  };

  const openPack = (packType) => {
    const pack = PACKS[packType];
    if (packType === 'bronze') { if (freePacks <= 0) return; setFreePacks(p => p - 1); }
    else { if (coins < pack.cost) return; setCoins(c => c - pack.cost); }
    const available = Object.values(CHARACTERS).filter(c => !unlockedChars.includes(c.id) && !c.isSecret);
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
    if (cards.length) { setPackOpening(packType); setRevealedCards(cards); setFlippedCards([]); }
  };

  const flipCard = (index) => {
    if (flippedCards.includes(index)) return;
    setFlippedCards(prev => [...prev, index]);
    if (!unlockedChars.includes(revealedCards[index].id)) setUnlockedChars(prev => [...prev, revealedCards[index].id]);
  };

  const closePackOpening = () => { if (flippedCards.length < revealedCards.length) return; setPackOpening(null); setRevealedCards([]); setFlippedCards([]); };
  const unlockSecretCharacter = () => { setUnlockedChars(prev => [...prev, 'vegimite']); setShowSecretUnlock(false); setSelectedChar('vegimite'); };

  const toScreenX = x => 20 + (x / 100) * 60;
  const ballScreenY = 78 - (ballY / 100) * 46;

  const containerStyle = { width: '100%', height: '100vh', overflow: 'hidden', background: `radial-gradient(ellipse at 50% 0%, ${COLORS.bg.tertiary} 0%, ${COLORS.bg.primary} 100%)`, fontFamily: 'system-ui, sans-serif', position: 'relative', touchAction: 'manipulation', userSelect: 'none' };

  // Secret unlock modal
  if (showSecretUnlock) {
    return (
      <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 50%, #2a0a2a 0%, #0a0a0f 100%)' }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ color: '#ff00ff', fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 10, textShadow: '0 0 30px #ff00ff' }}>SECRET UNLOCKED!</h1>
        <p style={{ color: COLORS.text.secondary, fontSize: 16, marginBottom: 30 }}>You collected all characters!</p>
        <div style={{ padding: 20, borderRadius: 20, border: '4px solid #ff00ff', boxShadow: '0 0 60px #ff00ff', marginBottom: 30 }}>
          <PlayerCard char={CHARACTERS.vegimite} size="large" />
        </div>
        <AbilityBox char={CHARACTERS.vegimite} size="large" />
        <button onClick={unlockSecretCharacter} style={{ marginTop: 30, padding: '20px 60px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#000', fontSize: 20, fontWeight: 900, cursor: 'pointer' }}>CLAIM!</button>
      </div>
    );
  }

  // Title screen
  if (screen === 'title') {
    return (
      <div onClick={() => setScreen('menu')} style={{ ...containerStyle, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
        <h1 style={{ fontSize: 56, fontWeight: 900, margin: 0, background: `linear-gradient(135deg, #fff 0%, ${COLORS.gold.primary} 50%, #fff 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BRAIN ROT FC</h1>
        <p style={{ color: COLORS.text.secondary, fontSize: 16, marginTop: 16, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>Score goals, earn coins and unlock all the characters!</p>
        <div style={{ marginTop: 60, padding: '16px 48px', borderRadius: 30, background: `linear-gradient(135deg, ${COLORS.gold.primary}, ${COLORS.gold.secondary})`, color: COLORS.bg.primary, fontSize: 18, fontWeight: 800 }}>TAP TO ENTER</div>
      </div>
    );
  }

  // Menu screen - split layout
  if (screen === 'menu') {
    const regularUnlocked = unlockedChars.filter(id => !CHARACTERS[id]?.isSecret).length;
    return (
      <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', padding: 20, boxSizing: 'border-box', gap: 20 }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 20 }}>
          <div style={{ color: COLORS.text.muted, fontSize: 12, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 3 }}>SELECTED PLAYER</div>
          <PlayerCard char={char} size="xlarge" />
          <div style={{ marginTop: 24 }}><AbilityBox char={char} size="large" /></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 10px' }}>
          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', marginBottom: 20, gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ color: COLORS.text.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Coins</div>
              <div style={{ color: COLORS.gold.primary, fontSize: 28, fontWeight: 800 }}>🪙 {coins}</div>
            </div>
          </div>
          
          {/* Best scores panel */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,134,11,0.1))', padding: '16px', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(212,175,55,0.4)' }}>
              <div style={{ color: COLORS.gold.primary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>🏆 Best Score</div>
              <div style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{highScore}</div>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1))', padding: '16px', borderRadius: 16, textAlign: 'center', border: '1px solid rgba(249,115,22,0.4)' }}>
              <div style={{ color: '#f97316', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>🔥 Best Streak</div>
              <div style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{bestStreak}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            <GlassButton onClick={() => setScreen('select')} variant="primary">👥 SELECT PLAYER ({regularUnlocked}/{REGULAR_CHAR_COUNT})</GlassButton>
            <GlassButton onClick={startGame} variant="success" style={{ padding: '24px', fontSize: 20 }}>⚽ PLAY MATCH</GlassButton>
            <GlassButton onClick={() => setScreen('packs')} variant="gold" style={{ position: 'relative' }}>🎁 OPEN PACKS{freePacks > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: COLORS.accent.red, padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{freePacks} FREE</span>}</GlassButton>
          </div>
          {regularUnlocked < REGULAR_CHAR_COUNT && (
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'rgba(255,0,255,0.1)', border: '1px solid rgba(255,0,255,0.3)' }}>
              <div style={{ color: '#ff00ff', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🔒 SECRET CHARACTER</div>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}><div style={{ width: `${(regularUnlocked / REGULAR_CHAR_COUNT) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ff00ff, #00ffff)' }} /></div>
              <div style={{ color: COLORS.text.muted, fontSize: 11, marginTop: 6 }}>Collect all {REGULAR_CHAR_COUNT} characters</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Select screen - split layout with rarity grouping
  if (screen === 'select') {
    const preview = CHARACTERS[previewChar];
    const regularUnlocked = unlockedChars.filter(id => !CHARACTERS[id]?.isSecret).length;
    return (
      <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', padding: 20, boxSizing: 'border-box', gap: 20 }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 20 }}>
          <div style={{ color: COLORS.text.muted, fontSize: 12, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 3 }}>PREVIEW</div>
          <PlayerCard char={preview} size="xlarge" />
          <div style={{ marginTop: 24 }}><AbilityBox char={preview} size="large" /></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setScreen('menu')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#fff', padding: '10px 20px', cursor: 'pointer', marginBottom: 20, alignSelf: 'flex-start' }}>← Back</button>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>SELECT PLAYER</div>
          <div style={{ color: COLORS.text.muted, fontSize: 14, marginBottom: 20, textAlign: 'center' }}>Collection: {regularUnlocked}/{REGULAR_CHAR_COUNT}</div>
          <div style={{ overflow: 'auto', flex: 1 }}>
            {['secret', 'goat', 'legendary', 'epic', 'rare', 'common'].map(rarity => {
              const chars = Object.values(CHARACTERS).filter(c => c.rarity === rarity);
              if (!chars.length) return null;
              const anyOwned = chars.some(c => unlockedChars.includes(c.id));
              if (rarity === 'secret' && !anyOwned) return null;
              const ownedInRarity = chars.filter(c => unlockedChars.includes(c.id)).length;
              return (
                <div key={rarity} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ color: RARITIES[rarity].color, fontSize: 14, fontWeight: 700 }}>{RARITIES[rarity].name}</div>
                    <div style={{ color: COLORS.text.muted, fontSize: 12 }}>({ownedInRarity}/{chars.length})</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {chars.map(c => {
                      const owned = unlockedChars.includes(c.id);
                      return (
                        <div key={c.id} style={{ opacity: owned ? 1 : 0.25, cursor: owned ? 'pointer' : 'default' }} onClick={() => { if (owned) { setPreviewChar(c.id); setSelectedChar(c.id); } }}>
                          {owned ? <PlayerCard char={c} size="small" selected={selectedChar === c.id} /> : <div style={{ width: 100, height: 140, borderRadius: 10, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 24 }}>🔒</span></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Packs screen
  if (screen === 'packs') {
    if (packOpening) {
      const allFlipped = flippedCards.length >= revealedCards.length;
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } } @keyframes cardGlow { 0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.5); } 50% { box-shadow: 0 0 40px rgba(255,215,0,0.9); } } .card-inner { transition: transform 0.8s; transform-style: preserve-3d; } .card-inner.flipped { transform: rotateY(180deg); }`}</style>
          <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: COLORS.gold.primary, fontSize: 24, fontWeight: 800 }}>{PACKS[packOpening].emoji} {PACKS[packOpening].name.toUpperCase()}</div>
            {allFlipped && <button onClick={closePackOpening} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>DONE ✓</button>}
          </div>
          <div style={{ position: 'absolute', top: 80, color: allFlipped ? COLORS.accent.green : COLORS.gold.primary, fontSize: 18, fontWeight: 600 }}>{allFlipped ? '🎉 ALL REVEALED!' : '👆 TAP TO REVEAL'}</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginTop: 40 }}>
            {revealedCards.map((card, index) => {
              const isFlipped = flippedCards.includes(index);
              const rarity = RARITIES[card.rarity];
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div onClick={() => flipCard(index)} style={{ width: 200, height: 280, position: 'relative', perspective: 1000, cursor: 'pointer' }}>
                    <div className={`card-inner ${isFlipped ? 'flipped' : ''}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: `linear-gradient(135deg, ${COLORS.bg.tertiary}, ${COLORS.bg.primary})`, borderRadius: 12, border: `3px solid ${COLORS.gold.primary}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'cardGlow 2s infinite' }}>
                        <div style={{ fontSize: 72 }}>⚽</div>
                        <div style={{ color: COLORS.gold.primary, fontSize: 16, fontWeight: 700, marginTop: 12 }}>TAP TO REVEAL</div>
                      </div>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 12 }}><PlayerCard char={card} size="large" /></div>
                    </div>
                    {isFlipped && <div style={{ position: 'absolute', top: -10, right: -10, zIndex: 10, background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 8 }}>NEW!</div>}
                  </div>
                  {isFlipped && (
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: 16, borderRadius: 12, border: `2px solid ${rarity.color}40`, maxWidth: 200, textAlign: 'center' }}>
                      <div style={{ color: rarity.color, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>⚡ {card.ability}</div>
                      <div style={{ color: COLORS.text.primary, fontSize: 14, lineHeight: 1.4 }}>{card.abilityDesc}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div style={{ ...containerStyle, padding: 20, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => setScreen('menu')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#fff', padding: '8px 16px', cursor: 'pointer' }}>← Back</button>
          <span style={{ color: COLORS.gold.primary, fontSize: 18, fontWeight: 700 }}>🪙 {coins}</span>
        </div>
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>PACK STORE</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(PACKS).map(([key, pack]) => {
            const canAfford = key === 'bronze' ? freePacks > 0 : coins >= pack.cost;
            return (
              <div key={key} onClick={() => canAfford && openPack(key)} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, cursor: canAfford ? 'pointer' : 'not-allowed', opacity: canAfford ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 48 }}>{pack.emoji}</div>
                <div style={{ flex: 1 }}><div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{pack.name}</div><div style={{ color: COLORS.text.muted, fontSize: 13 }}>{pack.cards} player{pack.cards > 1 ? 's' : ''}</div></div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: 10, color: COLORS.gold.primary, fontWeight: 700 }}>{key === 'bronze' ? `${freePacks} FREE` : `🪙 ${pack.cost}`}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div onClick={handleTap} style={{ ...containerStyle, cursor: 'pointer', background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1f12 50%, #0a1a0a 100%)', transform: screenShake ? `translateX(${Math.sin(Date.now() / 50) * screenShake}px)` : 'none', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: '100%' }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } } @keyframes floatEmoji { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-150px); opacity: 0; } } @keyframes stunWave { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }`}</style>
        
        {/* Pitch */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '75%', background: 'linear-gradient(180deg, #1a4d2e 0%, #22663a 100%)' }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ position: 'absolute', bottom: `${i * 16.66}%`, left: 0, right: 0, height: '16.66%', background: i % 2 === 0 ? 'rgba(0,0,0,0.08)' : 'transparent' }} />)}
        </div>

        {/* Goal with 3:1 aspect ratio */}
        <div style={{ position: 'absolute', top: '18%', left: '20%', width: '60%', aspectRatio: '3 / 1' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: 'rgba(0,0,0,0.8)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
          <div style={{ position: 'absolute', top: -8, left: -8, right: -8, height: 16, background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)', borderRadius: 8 }} />
          <div style={{ position: 'absolute', top: -8, left: -8, width: 16, height: 'calc(100% + 8px)', background: 'linear-gradient(90deg, #ccc 0%, #fff 50%, #ccc 100%)', borderRadius: 8 }} />
          <div style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 'calc(100% + 8px)', background: 'linear-gradient(90deg, #ccc 0%, #fff 50%, #ccc 100%)', borderRadius: 8 }} />
        </div>

        {/* Player card */}
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <PlayerCard char={char} size="small" />
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', maxWidth: 110 }}>
            <div style={{ color: RARITIES[char.rarity].color, fontSize: 12, fontWeight: 800 }}>⚡ {char.ability}</div>
            <div style={{ color: COLORS.text.secondary, fontSize: 9, marginTop: 4, lineHeight: 1.3 }}>{char.abilityDesc}</div>
          </div>
        </div>

        {/* Keeper hint */}
        {keeperHint && (gameState === 'aiming' || gameState === 'power') && (
          <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', background: COLORS.gold.primary, padding: '10px 24px', borderRadius: 24, color: '#000', fontWeight: 800, fontSize: 16, zIndex: 30 }}>👁️ KEEPER GOING {keeperHint}</div>
        )}

        {/* Ability text */}
        {abilityText && (
          <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 50, background: 'rgba(0,0,0,0.95)', padding: '20px 40px', borderRadius: 20, border: `3px solid ${COLORS.gold.primary}` }}>
            <span style={{ color: COLORS.gold.primary, fontSize: 24, fontWeight: 900 }}>{abilityText}</span>
          </div>
        )}

        {/* Stun effect */}
        {keeperStunned && (
          <div style={{ position: 'absolute', top: '28%', left: `${toScreenX(keeperX)}%`, transform: 'translate(-50%, -50%)', zIndex: 15 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', border: '3px solid #fbbf24', animation: `stunWave 1s ease-out infinite`, animationDelay: `${i * 0.3}s`, transform: 'translate(-50%, -50%)' }} />)}
          </div>
        )}

        {/* Goalkeeper */}
        <div style={{ position: 'absolute', top: '20%', left: `${toScreenX(keeperX)}%`, transform: 'translateX(-50%)', transition: gameState === 'shooting' ? 'none' : 'left 0.03s', opacity: keeperStunned ? 0.4 : 1, zIndex: 10 }}>
          <svg viewBox="0 0 120 160" style={{ width: 100, height: 133 }}>
            <defs>
              <linearGradient id="kj" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ff8c00" /><stop offset="100%" stopColor="#cc4400" /></linearGradient>
              <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f5d0b0" /><stop offset="100%" stopColor="#e8b896" /></linearGradient>
              <linearGradient id="glove" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#15803d" /></linearGradient>
            </defs>
            <ellipse cx="60" cy="24" rx="22" ry="20" fill="#3d2914" />
            <ellipse cx="60" cy="28" rx="18" ry="17" fill="url(#skin)" />
            <ellipse cx="52" cy="27" rx="5" ry="4" fill="#fff" /><ellipse cx="68" cy="27" rx="5" ry="4" fill="#fff" />
            <circle cx="52" cy="27" r="2.5" fill="#3d2914" /><circle cx="68" cy="27" r="2.5" fill="#3d2914" />
            <rect x="52" y="44" width="16" height="10" fill="url(#skin)" />
            <path d="M30 55 L40 52 L60 50 L80 52 L90 55 L92 95 L28 95 Z" fill="url(#kj)" />
            <path d="M30 55 L8 50 L5 70 L28 80 Z" fill="url(#kj)" />
            <path d="M90 55 L112 50 L115 70 L92 80 Z" fill="url(#kj)" />
            <text x="60" y="88" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">1</text>
            <ellipse cx="5" cy="65" rx="12" ry="14" fill="url(#glove)" />
            <ellipse cx="115" cy="65" rx="12" ry="14" fill="url(#glove)" />
            <path d="M42 95 L45 120 L55 120 L60 98 L65 120 L75 120 L78 95 Z" fill="#111" />
            <rect x="46" y="118" width="10" height="25" rx="3" fill="#ff6600" />
            <rect x="64" y="118" width="10" height="25" rx="3" fill="#ff6600" />
            <path d="M44 140 L44 150 L58 150 L58 143 L48 143 L48 140 Z" fill="#111" />
            <path d="M62 140 L62 150 L76 150 L76 143 L72 143 L72 140 Z" fill="#111" />
          </svg>
          {keeperStunned && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontSize: 40 }}>😵</div>}
        </div>

        {/* Aim target - no line, just the reticle */}
        {(gameState === 'aiming' || gameState === 'power') && (
          <div style={{ position: 'absolute', top: '30%', left: `${toScreenX(aimX)}%`, transform: 'translate(-50%, -50%)', zIndex: 15 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', border: `4px solid ${COLORS.gold.primary}`, boxShadow: `0 0 25px ${COLORS.gold.primary}80, inset 0 0 15px ${COLORS.gold.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.gold.primary, boxShadow: `0 0 10px ${COLORS.gold.primary}` }} />
            </div>
          </div>
        )}

        {/* Ball */}
        {/* Ball with character-specific emoji */}
        <div style={{ position: 'absolute', left: `${gameState === 'shooting' ? toScreenX(lockedAimRef.current) : 50}%`, top: `${ballScreenY}%`, transform: `translate(-50%, -50%) scale(${1 - ballY / 100 * 0.5})`, zIndex: ballY > 50 ? 5 : 20 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, #fff 0%, ${char.ballColor || '#e5e5e5'}60 60%, ${char.ballColor || RARITIES[char.rarity].color}90 100%)`, boxShadow: `0 4px 20px ${char.ballColor || 'rgba(0,0,0,0.4)'}80`, border: `3px solid ${char.ballColor || RARITIES[char.rarity].color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>{char.ballEmoji || '⚽'}</span>
          </div>
        </div>

        {/* Power meter */}
        {gameState === 'power' && (
          <div style={{ position: 'absolute', right: 20, top: '15%', height: '55%', width: 32, background: 'rgba(0,0,0,0.7)', borderRadius: 16, border: '3px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${power}%`, background: power > 92 || power < 20 ? '#ef4444' : power >= 60 && power <= 85 ? '#22c55e' : '#fbbf24' }} />
            <div style={{ position: 'absolute', top: 0, width: '100%', height: '8%', background: 'rgba(239,68,68,0.3)', borderBottom: '2px solid #ef4444' }} />
            <div style={{ position: 'absolute', top: '15%', width: '100%', height: '25%', background: 'rgba(34,197,94,0.15)', borderTop: '2px solid rgba(34,197,94,0.8)', borderBottom: '2px solid rgba(34,197,94,0.8)' }} />
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '20%', background: 'rgba(239,68,68,0.2)', borderTop: '2px solid rgba(239,68,68,0.6)' }} />
          </div>
        )}

        {/* HUD */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 25 }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: COLORS.text.muted, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>BEST</div>
            <div style={{ color: COLORS.gold.primary, fontSize: 20, fontWeight: 800 }}>🏆 {highScore}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: 56, fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{score}</div>
            <div style={{ color: COLORS.text.muted, fontSize: 12, marginTop: -4 }}>SCORE</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: COLORS.gold.primary, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🪙 {coins}</div>
            <div style={{ color: '#f97316', fontSize: 26, fontWeight: 800 }}>🔥 {streak}</div>
          </div>
        </div>

        {/* Goal flash */}
        {showGoalFlash && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', background: `radial-gradient(circle at 50% 30%, ${char.ballColor || 'rgba(34,197,94,0.6)'}90 0%, transparent 50%)` }}>
            {[char.ballEmoji || '⚽', '🔥', '💥', '⭐'].map((emoji, i) => <div key={i} style={{ position: 'absolute', top: '40%', left: `${30 + i * 15}%`, fontSize: 32, animation: 'floatEmoji 1s ease-out forwards', animationDelay: `${i * 0.1}s` }}>{emoji}</div>)}
          </div>
        )}

        {/* Result */}
        {gameState === 'result' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: resultText.includes('SAVED') || resultText.includes('WIDE') || resultText.includes('BLAZED') || resultText.includes('WEAK') || resultText.includes('FLUSHED') || resultText.includes('CLOWN') || resultText.includes('DRAIN') || resultText.includes('SKIBIDI') || resultText.includes('TOILET') ? '#ef4444' : '#22c55e', textAlign: 'center' }}>{resultText}</div>
            <p style={{ color: COLORS.text.muted, marginTop: 30, fontSize: 14 }}>TAP TO CONTINUE</p>
            <button onClick={e => { e.stopPropagation(); setScreen('menu'); }} style={{ marginTop: 20, padding: '12px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>EXIT</button>
          </div>
        )}

        {/* Instructions */}
        {(gameState === 'aiming' || gameState === 'power') && (
          <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center', zIndex: 20 }}>
            <div style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 30, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 16, fontWeight: 700 }}>{gameState === 'aiming' ? '👆 TAP TO AIM' : '👆 TAP FOR POWER'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainRotFC;
