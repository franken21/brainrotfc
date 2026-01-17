import React, { useState, useEffect, useRef } from 'react';

// ============================================
// MATCH SCREEN PROTOTYPE - GATA LEAGUE
// ============================================

const MatchPrototype = () => {
  // Game state
  const [phase, setPhase] = useState('aim'); // aim, timing, shooting, result
  const [selectedZone, setSelectedZone] = useState(null);
  const [timingRing, setTimingRing] = useState(100); // 100 = full size, 0 = center
  const [timingResult, setTimingResult] = useState(null); // 'perfect', 'good', 'ok', 'miss'
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 95 }); // percentage
  const [ballScale, setBallScale] = useState(1);
  const [keeperPosition, setKeeperPosition] = useState(50); // percentage from left
  const [keeperDiving, setKeeperDiving] = useState(null); // 'left', 'right', null
  const [shotResult, setShotResult] = useState(null); // 'goal', 'saved', 'miss'
  const [score, setScore] = useState(0);
  const [penalties, setPenalties] = useState(0);
  
  const timingRef = useRef(null);
  
  // Zone positions (percentage based)
  const zones = [
    { id: 1, x: 20, y: 30, label: '↖' }, // top-left
    { id: 2, x: 50, y: 25, label: '↑' },  // top-center
    { id: 3, x: 80, y: 30, label: '↗' }, // top-right
    { id: 4, x: 22, y: 65, label: '←' }, // bottom-left
    { id: 5, x: 50, y: 70, label: '•' },  // bottom-center
    { id: 6, x: 78, y: 65, label: '→' }, // bottom-right
  ];
  
  // Handle zone tap
  const handleZoneTap = (zone) => {
    if (phase !== 'aim') return;
    setSelectedZone(zone);
    setPhase('timing');
    setTimingRing(100);
    
    // Start timing ring animation
    timingRef.current = setInterval(() => {
      setTimingRing(prev => {
        if (prev <= 0) {
          // Ran out of time - auto miss
          clearInterval(timingRef.current);
          executeShot(zone, 'miss');
          return 0;
        }
        return prev - 2; // Speed of ring shrink
      });
    }, 30);
  };
  
  // Handle timing tap
  const handleTimingTap = () => {
    if (phase !== 'timing' || !selectedZone) return;
    clearInterval(timingRef.current);
    
    // Determine timing quality
    let quality;
    if (timingRing <= 25) quality = 'perfect';
    else if (timingRing <= 45) quality = 'good';
    else if (timingRing <= 70) quality = 'ok';
    else quality = 'miss';
    
    setTimingResult(quality);
    executeShot(selectedZone, quality);
  };
  
  // Execute the shot
  const executeShot = (zone, quality) => {
    setPhase('shooting');
    
    // Calculate actual ball target based on timing
    let targetX = zone.x;
    let targetY = zone.y;
    
    // Add drift based on timing quality
    if (quality === 'ok') {
      targetX += (50 - targetX) * 0.3; // Drift toward center
      targetY += (50 - targetY) * 0.2;
    } else if (quality === 'miss') {
      // Miss the goal entirely
      if (zone.y < 50) {
        targetY = -10; // Over the bar
      } else {
        targetX = zone.x < 50 ? -10 : 110; // Wide
      }
    }
    
    // Keeper AI - simple for prototype
    const keeperGuess = Math.random();
    let keeperTargetX;
    if (keeperGuess < 0.33) keeperTargetX = 25; // Dive left
    else if (keeperGuess < 0.66) keeperTargetX = 75; // Dive right
    else keeperTargetX = 50; // Stay center
    
    // Animate keeper dive
    setTimeout(() => {
      setKeeperPosition(keeperTargetX);
      setKeeperDiving(keeperTargetX < 40 ? 'left' : keeperTargetX > 60 ? 'right' : null);
    }, 200);
    
    // Animate ball
    setTimeout(() => {
      setBallPosition({ x: targetX, y: targetY });
      setBallScale(0.6); // Ball gets smaller as it goes toward goal
    }, 100);
    
    // Determine result
    setTimeout(() => {
      if (quality === 'miss') {
        setShotResult('miss');
      } else {
        // Check if keeper saved it
        const keeperReach = quality === 'perfect' ? 15 : quality === 'good' ? 20 : 25;
        const saved = Math.abs(targetX - keeperTargetX) < keeperReach && targetY > 10;
        
        if (saved) {
          setShotResult('saved');
        } else if (targetY > 10 && targetX > 5 && targetX < 95) {
          setShotResult('goal');
          setScore(s => s + 1);
        } else {
          setShotResult('miss');
        }
      }
      setPhase('result');
    }, 800);
  };
  
  // Reset for next penalty
  const nextPenalty = () => {
    if (penalties >= 4) {
      // Match over - would go to result screen
      alert(`Match over! Score: ${score}/5`);
      return;
    }
    
    setPhase('aim');
    setSelectedZone(null);
    setTimingRing(100);
    setTimingResult(null);
    setBallPosition({ x: 50, y: 95 });
    setBallScale(1);
    setKeeperPosition(50);
    setKeeperDiving(null);
    setShotResult(null);
    setPenalties(p => p + 1);
  };
  
  // Timing ring color
  const getTimingColor = () => {
    if (timingRing <= 25) return '#22c55e'; // Green - perfect
    if (timingRing <= 45) return '#84cc16'; // Light green - good
    if (timingRing <= 70) return '#eab308'; // Yellow - ok
    return '#ef4444'; // Red - bad
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-300 via-orange-200 to-amber-100 overflow-hidden">
      {/* Sky with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-orange-400 to-orange-300" />
      
      {/* Sun glow */}
      <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 blur-xl opacity-60" />
      
      {/* Distant city silhouette - simple shapes */}
      <div className="absolute bottom-[45%] left-0 right-0 h-16 flex items-end justify-around px-4 opacity-20">
        <div className="w-8 h-12 bg-slate-800" />
        <div className="w-6 h-8 bg-slate-800" />
        <div className="w-12 h-16 bg-slate-800" />
        <div className="w-4 h-6 bg-slate-800" />
        <div className="w-10 h-10 bg-slate-800" />
        <div className="w-6 h-14 bg-slate-800" />
        <div className="w-8 h-8 bg-slate-800" />
      </div>
      
      {/* ============ PITCH ============ */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-green-700 via-green-600 to-green-500">
        {/* Grass texture - subtle stripes */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0,0,0,0.1) 30px, rgba(0,0,0,0.1) 60px)'
          }}
        />
        
        {/* Penalty box */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[60%] border-2 border-white/40 border-t-0" />
        
        {/* Goal area (6-yard box) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[25%] border-2 border-white/40 border-t-0" />
        
        {/* Penalty spot */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60" />
        
        {/* Penalty arc hint */}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/20 border-b-0 rounded-t-full" />
      </div>
      
      {/* ============ GOAL ============ */}
      <div className="absolute top-[18%] left-[10%] right-[10%] h-[32%]">
        {/* Goal net - dark background with grid */}
        <div 
          className="absolute inset-[8px] rounded-sm bg-slate-900/80"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '15px 15px'
          }}
        />
        
        {/* Goal frame - crossbar */}
        <div className="absolute -top-1 -left-2 -right-2 h-4 bg-gradient-to-b from-white via-gray-100 to-gray-300 rounded-t-md shadow-lg" />
        
        {/* Goal frame - left post */}
        <div className="absolute -top-1 -left-2 w-4 h-[calc(100%+8px)] bg-gradient-to-r from-gray-300 via-white to-gray-200 rounded-l-md shadow-lg" />
        
        {/* Goal frame - right post */}
        <div className="absolute -top-1 -right-2 w-4 h-[calc(100%+8px)] bg-gradient-to-l from-gray-300 via-white to-gray-200 rounded-r-md shadow-lg" />
        
        {/* ============ TAP ZONES ============ */}
        {phase === 'aim' && (
          <div className="absolute inset-[12px]">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => handleZoneTap(zone)}
                className="absolute w-[30%] h-[45%] rounded-lg border-2 border-white/30 bg-white/10 active:bg-white/30 transition-all flex items-center justify-center"
                style={{
                  left: `${zone.x - 15}%`,
                  top: `${zone.y - 22}%`,
                }}
              >
                <span className="text-white/60 text-2xl font-bold">{zone.label}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* ============ TIMING RING ============ */}
        {phase === 'timing' && selectedZone && (
          <button
            onClick={handleTimingTap}
            className="absolute inset-[12px]"
          >
            {/* Target zone highlight */}
            <div 
              className="absolute w-[30%] h-[45%] rounded-lg border-4 flex items-center justify-center"
              style={{
                left: `${selectedZone.x - 15}%`,
                top: `${selectedZone.y - 22}%`,
                borderColor: getTimingColor(),
                boxShadow: `0 0 20px ${getTimingColor()}`,
              }}
            >
              {/* Shrinking ring */}
              <div 
                className="rounded-full border-4 transition-all duration-75"
                style={{
                  width: `${timingRing}%`,
                  height: `${timingRing}%`,
                  borderColor: getTimingColor(),
                  opacity: 0.8,
                }}
              />
              
              {/* Center target */}
              <div 
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: getTimingColor() }}
              />
            </div>
            
            {/* Tap instruction */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full">
              <span className="text-white font-bold">TAP!</span>
            </div>
          </button>
        )}
        
        {/* ============ KEEPER ============ */}
        <div 
          className="absolute bottom-2 transition-all duration-300 ease-out"
          style={{ 
            left: `${keeperPosition}%`,
            transform: `translateX(-50%) ${keeperDiving === 'left' ? 'rotate(-20deg) translateX(-20px)' : keeperDiving === 'right' ? 'rotate(20deg) translateX(20px)' : ''}`,
          }}
        >
          {/* Keeper body - simple but clear */}
          <div className="relative">
            {/* Jersey */}
            <div className="w-14 h-20 bg-gradient-to-b from-orange-500 to-orange-600 rounded-t-xl relative">
              {/* Number */}
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-black">1</span>
            </div>
            
            {/* Head */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full border-2 border-amber-400">
              {/* Face */}
              <div className="absolute inset-0 flex items-center justify-center text-lg">
                {shotResult === 'saved' ? '😤' : shotResult === 'goal' ? '😩' : keeperDiving ? '😠' : '😐'}
              </div>
            </div>
            
            {/* Gloves */}
            <div 
              className="absolute top-2 -left-6 w-6 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg transition-all duration-300"
              style={{ transform: keeperDiving === 'left' ? 'translateX(-10px) translateY(-15px)' : '' }}
            />
            <div 
              className="absolute top-2 -right-6 w-6 h-8 bg-gradient-to-bl from-green-400 to-green-600 rounded-lg transition-all duration-300"
              style={{ transform: keeperDiving === 'right' ? 'translateX(10px) translateY(-15px)' : '' }}
            />
          </div>
        </div>
      </div>
      
      {/* ============ BALL ============ */}
      <div 
        className="absolute transition-all duration-500 ease-out z-10"
        style={{
          left: `${ballPosition.x}%`,
          top: `${ballPosition.y}%`,
          transform: `translate(-50%, -50%) scale(${ballScale})`,
        }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 border-2 border-gray-400 shadow-lg flex items-center justify-center">
          <span className="text-2xl">⚽</span>
        </div>
      </div>
      
      {/* ============ HUD ============ */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs font-medium">GATA</div>
            <div className="text-white font-bold">Straffe {penalties + 1}/5</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-black text-white drop-shadow-lg">{score}</div>
            <div className="text-white/60 text-xs">MÅL</div>
          </div>
          
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < score ? 'bg-green-500' : 
                  i < penalties + (phase === 'result' ? 1 : 0) ? 'bg-red-500' : 
                  'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* ============ RESULT OVERLAY ============ */}
      {phase === 'result' && (
        <button 
          onClick={nextPenalty}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40"
        >
          <div className="text-center">
            <div className={`text-6xl font-black mb-2 ${
              shotResult === 'goal' ? 'text-green-400' : 'text-red-400'
            }`}>
              {shotResult === 'goal' ? 'MÅL!' : shotResult === 'saved' ? 'REDDET!' : 'BOM!'}
            </div>
            {timingResult && (
              <div className={`text-xl font-bold mb-4 ${
                timingResult === 'perfect' ? 'text-green-400' :
                timingResult === 'good' ? 'text-lime-400' :
                timingResult === 'ok' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {timingResult === 'perfect' ? '⭐ PERFEKT!' :
                 timingResult === 'good' ? '👍 BRA!' :
                 timingResult === 'ok' ? '😐 OK' :
                 '❌ FOR SENT!'}
              </div>
            )}
            <div className="text-white/70 text-sm">Tap for å fortsette</div>
          </div>
        </button>
      )}
      
      {/* ============ INSTRUCTION ============ */}
      {phase === 'aim' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-3 rounded-full">
          <span className="text-white font-bold">👆 VELG HVOR DU VIL SKYTE</span>
        </div>
      )}
    </div>
  );
};

export default MatchPrototype;
