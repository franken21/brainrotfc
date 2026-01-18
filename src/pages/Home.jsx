import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'messi-vs-ronaldo',
      title: 'MESSI vs RONALDO',
      emoji: '⚽',
      description: 'Lagvelger for fotballkamper',
      gradient: 'from-sky-500 via-purple-500 to-red-500',
      hoverGradient: 'from-sky-400 via-purple-400 to-red-400',
      borderColor: 'border-sky-400/50',
      shadowColor: 'shadow-sky-500/20',
      path: '/messi-vs-ronaldo',
      features: ['🎰 Roulette-hjul', '👥 Lagvelger', '📱 Mobiloptimalisert']
    },
    {
      id: 'brainrot-fc',
      title: 'BRAINROT FC',
      emoji: '🧠',
      description: 'Skyt mål, samle kort og lås opp spillere',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      hoverGradient: 'from-yellow-400 via-orange-400 to-red-400',
      borderColor: 'border-yellow-400/50',
      shadowColor: 'shadow-yellow-500/20',
      path: '/game',
      features: ['⚽ Straffespill', '🎴 Samlekort', '🏆 Highscore']
    },
    {
      id: 'prototype',
      title: 'STRAFFE PROTOTYPE',
      emoji: '🎯',
      description: 'Test ny straffespill-mekanikk',
      gradient: 'from-gray-500 via-gray-600 to-gray-700',
      hoverGradient: 'from-gray-400 via-gray-500 to-gray-600',
      borderColor: 'border-gray-500/30',
      shadowColor: 'shadow-gray-500/10',
      path: '/prototype',
      features: ['🎮 Grid-basert', '⏱️ Timing', '🧪 Beta']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating footballs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-bounce"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          >
            ⚽
          </div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Pitch lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="text-5xl md:text-6xl mb-4 animate-pulse">🎮</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
            VELG SPILL
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Hva vil du spille i dag?
          </p>
        </div>

        {/* Game Cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(game.path)}
              className={`
                group relative overflow-hidden rounded-2xl md:rounded-3xl
                bg-gradient-to-br from-gray-800/80 to-gray-900/80
                backdrop-blur-sm border-2 ${game.borderColor}
                p-6 md:p-8 text-left
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:shadow-2xl ${game.shadowColor}
                active:scale-[0.98]
              `}
            >
              {/* Gradient overlay on hover */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-20
                bg-gradient-to-br ${game.gradient}
                transition-opacity duration-300
              `} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Emoji and Title */}
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </span>
                  <h2 className={`
                    text-xl md:text-2xl font-black
                    bg-gradient-to-r ${game.gradient} bg-clip-text text-transparent
                  `}>
                    {game.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-5 leading-relaxed">
                  {game.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {game.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-full bg-white/10 text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Play button indicator */}
                <div className={`
                  absolute bottom-4 md:bottom-6 right-4 md:right-6
                  w-10 h-10 md:w-12 md:h-12 rounded-full
                  bg-gradient-to-br ${game.gradient}
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                  shadow-lg
                `}>
                  <span className="text-white text-lg md:text-xl">▶</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Coming Soon hint */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Flere spill kommer snart... 👀
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-4 text-center">
        <p className="text-gray-500/60 text-xs font-medium tracking-wide">
          Laget av Charlie ⚽
        </p>
      </div>
    </div>
  );
};

export default Home;
