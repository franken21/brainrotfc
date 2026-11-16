import React,{useState,useEffect,useRef,useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {PLAYERS,LEAGUES,RARITY,IMAGE_ROOT,PACK_PRICE,loadSave,SAVE_KEY,playerById,randomPack,buyPack,resolveShot,rivalKick,settleMatch} from './game';
import './brainrot-v2.css';

function Sound({type='tap',enabled=true}){
  if(!enabled)return;
  try{
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)return;
    const ctx=new AudioContext();
    const notes=type==='goal'?[523,659,784]:type==='pack'?[392,523,659,1047]:type==='miss'?[220,180]:[410];
    notes.forEach((n,i)=>{
      const oscillator=ctx.createOscillator(),gain=ctx.createGain();
      oscillator.type=type==='goal'?'triangle':'sine';
      oscillator.frequency.setValueAtTime(n,ctx.currentTime+i*.085);
      gain.gain.setValueAtTime(0.0001,ctx.currentTime+i*.085);
      gain.gain.exponentialRampToValueAtTime(.075,ctx.currentTime+i*.085+.014);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.085+.16);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(ctx.currentTime+i*.085);
      oscillator.stop(ctx.currentTime+i*.085+.18);
    });
    setTimeout(()=>ctx.close().catch(()=>{}),1200);
  }catch{}
}
function Ball({className='',style={}}){
 return <svg className={'v2-ball '+className} style={style} viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="50" r="47" fill="#f8f5e9" stroke="#172025" strokeWidth="4"/>
  <path d="M50 24 69 39 62 62 38 62 31 39Z" fill="#172025"/>
  <path d="M50 24 50 5M69 39 91 30M62 62 73 86M38 62 27 86M31 39 9 30" stroke="#172025" strokeWidth="5"/>
  <path d="M38 62 26 79M62 62 75 78" stroke="#172025" strokeWidth="3" opacity=".3"/>
 </svg>;
}
function Keeper({x=0.5,y=0.65,dive=false,league=0}){
 return <div className={'v2-keeper '+(dive?'v2-keeper-dive':'')} style={{left:(x*100)+'%', bottom:(dive?Math.max(0,(.65-y)*100):0)+'%', '--dive-angle':(x<.4?'-28deg':x>.6?'28deg':'0deg')}} aria-hidden="true">
   <svg viewBox="0 0 120 140">
     <ellipse cx="60" cy="134" rx="42" ry="6" fill="#051e18" opacity=".18"/>
     <path d="M40 82 35 118 49 122 61 90 74 123 89 120 79 82Z" fill="#202a3c"/>
     <path d="M34 117 32 128 50 131 51 121M74 121 76 131 94 128 89 117" fill="#fcf8ed"/>
     <path d="M33 43 12 62 2 58 4 47 28 28 42 33M85 34 108 16 119 24 116 34 92 54 86 53" fill="#f3bb90"/>
     <path d="M4 46 0 48 0 65 15 67 18 57Z" fill="#e9ff79" stroke="#172025" strokeWidth="2"/>
     <path d="M105 12 110 5 120 10 120 29 111 31Z" fill="#e9ff79" stroke="#172025" strokeWidth="2"/>
     <path d="M33 30 Q60 24 86 30 L94 84 Q63 101 26 84Z" fill={league>2?'#ff7b92':'#e0ff68'} stroke="#162128" strokeWidth="3"/>
     <path d="M50 46 H70 V79 H50Z" fill="#14252c" opacity=".16"/>
     <text x="60" y="73" textAnchor="middle" fontSize="29" fill="#1b2931" fontWeight="900">{league+1}</text>
     <rect x="48" y="21" width="24" height="17" rx="7" fill="#e7a67f"/>
     <circle cx="60" cy="19" r="20" fill="#f3bb90" stroke="#172025" strokeWidth="2.5"/>
     <path d="M39 17 Q35 -5 58 -3 Q81 -4 82 18 Q70 9 61 8 Q49 18 39 17" fill="#262b30"/>
     <circle cx="53" cy="22" r="2.4" fill="#172025"/><circle cx="69" cy="22" r="2.4" fill="#172025"/>
     <path d="M54 30 Q60 34 67 29" stroke="#8f5d4f" strokeWidth="2" fill="none" strokeLinecap="round"/>
   </svg>
 </div>;
}
function PlayerPortrait({player,size='large'}){
 return <div className={'v2-portrait v2-portrait-'+size} style={{'--player-color':player.color}}>
   <span className="v2-portrait-emoji">{player.emoji}</span>
   <img src={IMAGE_ROOT+player.image} alt="" loading="lazy" onError={e=>e.currentTarget.style.opacity=0}/>
 </div>;
}
function PlayerCard({player,owned=false,active=false,onClick,compact=false}){
 return <button type="button" onClick={onClick} disabled={!owned||!onClick} className={'v2-player-card '+(compact?'compact ':'')+(active?'active ':'')+(!owned?'locked ':'')} style={{'--card-accent':player.color}}>
   <div className="v2-player-head"><span className={'v2-rarity v2-rarity-'+player.rarity}>{RARITY[player.rarity].label}</span><strong>{player.power+player.control>>1}</strong></div>
   <PlayerPortrait player={player} size={compact?'small':'large'}/>
   <div className="v2-player-info"><strong>{player.name}</strong><small>{player.tag}</small></div>
   <div className="v2-card-stats"><span>POW <b>{player.power}</b></span><span>ACC <b>{player.control}</b></span></div>
   {active&&<span className="v2-card-selected">✓ YOUR STRIKER</span>}
   {!owned&&<span className="v2-locked">🔒 NOT FOUND</span>}
 </button>;
}
function NavButton({id,icon,title,active,onClick,detail}){
 return <button className={'v2-nav-btn '+(active?'active':'')} onClick={()=>onClick(id)} type="button"><span className="v2-nav-ico">{icon}</span><span className="v2-nav-copy"><strong>{title}</strong><small>{detail}</small></span><span className="v2-nav-chevron">›</span></button>;
}
function GoalScene({aim,setAim,setAimLocked,aimLocked,league,flight,phase,player}){
 const goalRef=useRef();
 const point=e=>{
  if(phase!=='ready'||!goalRef.current)return;
  const r=goalRef.current.getBoundingClientRect();
  setAim({x:Math.max(.05,Math.min(.95,(e.clientX-r.left)/r.width)),y:Math.max(.07,Math.min(.93,(e.clientY-r.top)/r.height))});
  setAimLocked(true);
 };
 const shot=flight?.shot;
 const left=shot?shot.x:aim.x,top=shot?shot.y:aim.y;
 return <div className={'v2-scene v2-scene-'+league.id+(phase==='flight'?' is-flight':'')} style={{'--league-glow':league.theme}}>
   <div className="v2-sky"><span className="v2-sky-stars">✦&nbsp; ✧&nbsp; · &nbsp; ✦</span></div>
   <div className="v2-floodlight light-left"/><div className="v2-floodlight light-right"/>
   <div className="v2-stand stand-left"/><div className="v2-stand stand-right"/>
   <div className="v2-banners"><span>BRAINROT!</span><span>⚡ NO FEAR · ALL FOOTBALL ⚡</span><span>FC FOREVER</span></div>
   <div className="v2-ground"><div className="v2-penalty-arc"/><div className="v2-penalty-line"/></div>
   <div className="v2-net-shadow"/>
   <div className="v2-goal" ref={goalRef} onPointerDown={point} role="group" aria-label="Aim at a spot in the goal">
     <div className="v2-goal-net"/>
     <div className="v2-goal-top"/>
     {phase==='ready'&&aimLocked&&<div className="v2-aim-target" style={{left:(aim.x*100)+'%',top:(aim.y*100)+'%'}}><div className="v2-target-ring"/><div className="v2-target-dot"/></div>}
     {phase==='ready'&&!aimLocked&&<div className="v2-aim-callout">🎯<strong>CLICK A CORNER TO AIM</strong><small>Your target stays right where you put it.</small></div>}
     <Keeper x={phase==='flight'||phase==='result'?(shot?.frozen ? 0.5 : (shot?.keeperX ?? 0.5)):.5} y={phase==='flight'||phase==='result'?shot?.keeperY??.65:.65} dive={(phase==='flight'||phase==='result')&&!shot?.frozen} league={LEAGUES.indexOf(league)}/>
     <div className="v2-goal-hint">{phase==='ready'?(aimLocked?'TARGET LOCKED · CLICK TO RE-AIM':'CHOOSE YOUR SPOT'):' '}</div>
   </div>
   <div className="v2-spot"/>
   {phase==='flight'&&<Ball className="v2-flying-ball" style={{'--shot-x':left,'--shot-y':top,animationDuration:player.style==='Rocket'?'.58s':'.85s'}}/>}
   {phase!=='flight'&&<div className="v2-idle-ball"><Ball/></div>}
   <div className="v2-scenebottom"><span>◉ LIVE FROM {league.venue}</span><span className="v2-live-dot">● LIVE</span></div>
 </div>;
}
function MatchStrip({match}){
 const rounds=match?.shots?.length||0;
 const n=Math.max(5,rounds+1);
 return <div className="v2-match-strip">
   <div><span className="v2-team-symbol">🧠</span><strong>BFC</strong></div>
   <div className="v2-match-count">{match?match.shots.filter(x=>x.outcome==='GOAL').length:0}<span>–</span>{match?match.rivals.filter(Boolean).length:0}</div>
   <div><strong>RIVALS</strong><span className="v2-team-symbol">🛡️</span></div>
   <div className="v2-match-dots"><small>YOU</small>{Array.from({length:n},(_,i)=><span key={i} className={'v2-match-dot '+(match?.shots[i]?(match.shots[i].outcome==='GOAL'?'won':'lost'):'')}>{match?.shots[i]?(match.shots[i].outcome==='GOAL'?'✓':'×'):'·'}</span>)}</div>
   <div className="v2-match-dots"><small>THEM</small>{Array.from({length:n},(_,i)=><span key={i} className={'v2-match-dot '+(match?.rivals[i]===true?'won':match?.rivals[i]===false?'lost':'')}>{match?.rivals[i]===true?'✓':match?.rivals[i]===false?'×':'·'}</span>)}</div>
 </div>;
}
function App(){
 const navigate=useNavigate();
 const [save,setSave]=useState(loadSave);
 const [view,setView]=useState('play');
 const [match,setMatch]=useState(()=>({shots:[],rivals:[]}));
 const [phase,setPhase]=useState('ready');
 const [aimLocked,setAimLocked]=useState(false);
 const [aim,setAim]=useState({x:.74,y:.25});
 
 const timingRef=useRef(.5);
 const meterIndicatorRef=useRef(null);
 const timerRef=useRef(null);
 const [flight,setFlight]=useState(null);
 const [last,setLast]=useState(null);
 const [summary,setSummary]=useState(null);
 const [pack,setPack]=useState(null);
 const [packOpened,setPackOpened]=useState(false);
 const [sound,setSound]=useState(false);
 const [notice,setNotice]=useState('');
 const player=playerById(save.selected),league=LEAGUES[save.league];
 const acquired=save.owned.length;
 const showNotice=msg=>{setNotice(msg);setTimeout(()=>setNotice(''),2900);};
 useEffect(()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch{}},[save]);
 useEffect(()=>{
   if(phase!=='ready'||view!=='play')return;
   let frame;
   const start=performance.now();
   const move=now=>{
     const t=((now-start)/1050)%2;
     const value=t<=1?t:2-t;
     timingRef.current=value;if(meterIndicatorRef.current)meterIndicatorRef.current.style.left=(value*100)+'%';
     frame=requestAnimationFrame(move);
   };
   frame=requestAnimationFrame(move);
   return ()=>cancelAnimationFrame(frame);
 },[phase,view]);
 useEffect(()=>()=>clearTimeout(timerRef.current),[]);
 const startMatch=()=>{
   Sound({enabled:sound});
   setMatch({shots:[],rivals:[]});
   setSummary(null);setLast(null);setFlight(null);
   setPhase('ready');setView('play');
 };
 const shoot=useCallback(()=>{
   if(phase!=='ready'||!match||!aimLocked)return;
   const shot=resolveShot(aim,timingRef.current,player,league);
   const rival=rivalKick(league);
   Sound({type:shot.outcome==='GOAL'?'goal':'miss',enabled:sound});
   setFlight({shot,rival});setPhase('flight');
   timerRef.current=setTimeout(()=>{
     setMatch(prev=>({...prev,shots:[...prev.shots,shot],rivals:[...prev.rivals,rival]}));
     setLast(shot);setPhase('result');
   },900);
 },[phase,match,aim,aimLocked,player,league,sound]);
 const advance=()=>{
   if(!match||phase!=='result')return;
   const goals=match.shots.filter(s=>s.outcome==='GOAL').length;
   const opponent=match.rivals.filter(Boolean).length;
   const completed=match.shots.length>=5&&(goals!==opponent||match.shots.length>=8);
   if(completed){
     const won=goals>opponent;
     const streak=match.shots.reduce((a,s)=>s.outcome==='GOAL'?a+1:0,0);
     const outcome=settleMatch(save,save.league,won,goals,streak,player.style);
     setSave(outcome.save);
     setSummary({won,goals,opponent,...outcome});
     setPhase('finished');
     return;
   }
   setLast(null);setFlight(null);setPhase('ready');
 };
 useEffect(()=>{
    if(phase!=='result'||view!=='play')return;
    const next=setTimeout(()=>advance(),1850);
    return ()=>clearTimeout(next);
 },[phase,view,match]);
 useEffect(()=>{
  const handle=e=>{
   if(view!=='play'||e.target?.tagName==='INPUT')return;
   if(e.code==='Space'){if(phase==='ready'){e.preventDefault();shoot();}else if(phase==='result'){e.preventDefault();advance();}}
   const delta=.055;
   if(phase==='ready'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
      e.preventDefault();
      setAim(a=>({x:Math.max(.05,Math.min(.95,a.x+(e.key==='ArrowRight'?delta:e.key==='ArrowLeft'?-delta:0))),y:Math.max(.07,Math.min(.93,a.y+(e.key==='ArrowDown'?delta:e.key==='ArrowUp'?-delta:0)))}));
      setAimLocked(true);
   }
  };
  window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle);
 },[shoot,phase,view,match,save]);
 const openPack=()=>{
  if(save.coins<PACK_PRICE){showNotice('Not enough coins — win shootouts to earn more!');return;}
  const cards=randomPack();
  const previouslyOwned=new Set(save.owned);
  const isNew=cards.map(card=>{const fresh=!previouslyOwned.has(card.id);previouslyOwned.add(card.id);return fresh;});
  const result=buyPack(save,cards);
  setSave(result.save);setPack({cards,isNew,...result});setPackOpened(false);
  Sound({type:'pack',enabled:sound});
 };
 const changeView=id=>{
   if(phase==='flight')return;
   setView(id);Sound({enabled:sound});
 };
 const winProgress=save.wins[save.league];
 const stories=[
   'Nobody believes in Brainrot FC. Our squad is ridiculous, our pitch is a back alley, and the dream is to reach the world stage. It starts with one penalty.',
   'We survived the streets. Now the Sunday League has heard about us. The crowd is bigger, the keeper is quicker, and the dream is getting real.',
   'The joke team made it to the national league. Big crowds, serious rivals. They still think we are here by mistake. Prove them wrong.',
   'Floodlights. Noise. A proper stadium. Every shot is a chance to write the next chapter of the strangest football story ever told.',
   'From a backstreet goal to the biggest game in the world. One team of complete weirdos. One final shot at immortality.'
 ];
 return <div className={'v2-app v2-app-'+view}>
   <aside className="v2-side">
     <button className="v2-logo" onClick={()=>navigate('/')} aria-label="Go to home"><span className="v2-logo-mark">B<span>⚡</span></span><span>BRAINROT <b>FC</b><small>THE SHOOTOUT CLUB</small></span></button>
     <div className="v2-side-kicker">THE CLUBHOUSE</div>
     <nav className="v2-navigation" aria-label="Game sections">
       <NavButton id="play" icon="⚽" title="Play" detail="Back on the pitch" active={view==='play'} onClick={changeView}/>
       <NavButton id="club" icon="🎴" title="The Team" detail="Choose your striker" active={view==='club'} onClick={changeView}/>
       <NavButton id="packs" icon="🎁" title="Surprise Packs" detail="Find new teammates" active={view==='packs'} onClick={changeView}/>
       <NavButton id="journey" icon="🏆" title="Our Story" detail="Road to glory" active={view==='journey'} onClick={changeView}/>
     </nav>
     <div className="v2-sidebar-bottom">
       <div className="v2-mini-league"><span>YOUR CURRENT LEAGUE</span><strong>{league.icon} {league.name}</strong><div className="v2-progress"><i style={{width:(winProgress/league.wins*100)+'%'}}/></div><small>{winProgress} / {league.wins} wins to promotion</small></div>
       <button className="v2-sound" onClick={()=>setSound(x=>!x)}>{sound?'🔊 Sound on':'🔇 Sound off'}</button>
     </div>
   </aside>
   <div className="v2-main">
     <header className="v2-topbar">
       <span className="v2-version"><span className="v2-pulse"/> BRAINROT FC <em>ROAD TO GLORY</em></span>
       <div className="v2-header-actions"><span className="v2-top-stage">{league.icon} {league.name} · CHAPTER {save.league+1}</span></div>
     </header>
     <main className="v2-content">
       {view==='play'&&<>
         <div className="v2-story-heading">
           <div className="v2-story-kicker">CHAPTER {save.league+1} / {LEAGUES.length} &nbsp;·&nbsp; {league.name.toUpperCase()}</div>
           <h1>WE'RE NOT SUPPOSED <span>TO WIN.</span></h1>
           <p>{stories[save.league]}</p>
           <div className="v2-story-progress"><strong>{league.icon} {league.name} <span>·</span> {winProgress}/{league.wins} WINS</strong><div className="v2-progress"><i style={{width:(winProgress/league.wins*100)+'%'}}/></div><small>{league.wins-winProgress} {league.wins-winProgress===1?'win':'wins'} until the next chapter</small></div>
         </div>
         <div className="v2-game-grid">
           <section className="v2-arena-panel">
             <div className="v2-arena-top"><span><i className="v2-dot"/> {league.venue}</span><strong>{match.shots.length<5?'KICK '+(match.shots.length+1)+' OF 5':'SUDDEN DEATH'}</strong></div>
             <div className="v2-arena-body">
               {match&&<MatchStrip match={match}/>}
               <GoalScene aim={aim} setAim={setAim} setAimLocked={setAimLocked} aimLocked={aimLocked} league={league} flight={flight} phase={phase} player={player}/>
               {phase==='result'&&last&&<div className={'v2-shot-flash '+(last.outcome==='GOAL'?'scored':'not-scored')} role="status">
                 <span>{last.grade} TIMING</span><h2>{last.outcome==='GOAL'?'GOOOAL!':last.outcome==='SAVED'?'DENIED!':'SO CLOSE!'}</h2><small>{last.outcome==='GOAL'?'The crowd goes wild!':last.outcome==='SAVED'?'Try a different corner.':'Keep it between the posts.'}</small><button onClick={advance}>NEXT KICK →</button>
               </div>}
               {phase==='finished'&&summary&&<div className="v2-summary-overlay"><div className="v2-overlay-logo">{summary.won?'🏆':'💪'}</div><span>{summary.promoted?'A NEW CHAPTER BEGINS':'FULL TIME AT '+league.venue}</span><h2>{summary.promoted?'WE ARE GOING UP!':summary.won?"THAT'S OUR TEAM!":summary.goals===summary.opponent?'HEADS HELD HIGH':'WE GO AGAIN!'}</h2><p>{summary.goals}–{summary.opponent} against the rivals. {summary.won?'One step closer to the dream.':'The story isn’t over.'}</p>{summary.promoted&&<div className="v2-promoted">✨ WELCOME TO {LEAGUES[save.league].name.toUpperCase()}</div>}<div className="v2-summary-actions"><button className="v2-button-primary" onClick={startMatch}>BACK ON THE PITCH ⚽</button><button className="v2-button-ghost" onClick={()=>{setMatch({shots:[],rivals:[]});setPhase('ready');setView('packs');}}>MEET A NEW TEAMMATE 🎁</button></div></div>}
             </div>
             <div className="v2-arena-controls">
               <div className="v2-aim-copy"><strong>{aimLocked?'✓ AIM LOCKED':'1 · PICK YOUR SPOT'}</strong><span>Click a corner to lock your shot. Click again to change it.</span></div>
               <div className="v2-timing-controls"><div className="v2-meter-copy"><strong>2 · TIME YOUR SHOT</strong><span>Press SHOOT when the marker reaches green.</span></div><div className="v2-meter" aria-label="Moving timing indicator with green centre sweet spot"><div className="v2-meter-sweet"/><div className="v2-meter-perfect"/><div className="v2-meter-indicator" ref={meterIndicatorRef} style={{left:'50%'}}/></div><div className="v2-meter-labels"><span>EARLY</span><span>PERFECT</span><span>LATE</span></div></div>
               <button className="v2-shoot-btn" disabled={phase!=='ready'||!aimLocked} onClick={shoot}>⚽ <span>{aimLocked?'SHOOT!':'AIM FIRST'}</span><small>SPACE / TAP</small></button>
             </div>
           </section>
           <div className="v2-pitch-companions">
             <button className="v2-companion" onClick={()=>changeView('club')} title="Change your striker"><PlayerPortrait player={player} size="small"/><span><small>ON THE BALL</small><strong>{player.name}</strong><em>{player.style} · {player.perk}</em></span><b>CHANGE PLAYER ↗</b></button>
             <div className="v2-next-step"><span>🏆 THE DREAM</span><strong>From the backstreet goal to the world stage.</strong><button onClick={()=>changeView('journey')}>SEE THE JOURNEY →</button></div>
           </div>
         </div>
       </>}
       {view==='club'&&<><div className="v2-page-heading"><div><span className="v2-eyebrow">★ YOUR COLLECTION</span><h1>MEET THE <span>WEIRDOS.</span></h1><p>Collect outrageous players. Every baller changes how your shots feel.</p></div><div className="v2-big-number">{acquired}<small> / {PLAYERS.length} UNLOCKED</small></div></div><div className="v2-section-header"><strong>YOUR PLAYER CARDS</strong><span>Select any unlocked card to make them your striker</span></div><div className="v2-cards-grid">{PLAYERS.map(p=><PlayerCard key={p.id} player={p} owned={save.owned.includes(p.id)} active={save.selected===p.id} onClick={()=>{setSave(s=>({...s,selected:p.id}));showNotice(p.name+' is your new striker!');}}/>)}</div></>}
       {view==='packs'&&<><div className="v2-page-heading"><div><span className="v2-eyebrow">✦ THE CHANGING ROOM</span><h1>MEET YOUR <span>NEXT HERO.</span></h1><p>Every unlikely club needs unlikely heroes. Win games, earn a surprise pack, and see who wants to join the squad.</p></div><div className="v2-big-number">{save.opened}<small> PACKS OPENED</small></div></div><div className="v2-pack-layout"><div className="v2-pack-showcase"><div className="v2-pack-rays"/><div className="v2-pack-art"><div className="v2-pack-art-top">BRAINROT <b>FC</b></div><div className="v2-pack-art-ball">⚽</div><div className="v2-pack-art-sub">MYSTERY<br/>BALLERS</div><div className="v2-pack-art-bottom">★ ★ ★</div></div><div className="v2-pack-stars">✦ &nbsp; ✧ &nbsp; ✦</div></div><div className="v2-pack-details"><span className="v2-eyebrow">THE SURPRISE BOX</span><h2>THREE MYSTERY TEAMMATES.</h2><p>A new recruit could be a total disaster. Or the hero who takes you to the next league.</p><div className="v2-pack-features"><span>🎴 THREE SURPRISE CARDS</span><span>✨ SOME ARE RARER THAN OTHERS</span><span>🟡 {save.coins.toLocaleString()} MATCH COINS IN YOUR KIT BAG</span></div><button className="v2-button-primary v2-buy-btn" onClick={openPack} disabled={save.coins<PACK_PRICE}>OPEN A SURPRISE PACK · {PACK_PRICE} COINS <b>↗</b></button>{save.coins<PACK_PRICE&&<p className="v2-insufficient">Win a few shootouts to open another one!</p>}<small>All coins come from playing football. Nothing to buy with real money.</small></div></div></>}
       {view==='journey'&&<><div className="v2-page-heading"><div><span className="v2-eyebrow">🏆 ONE IMPOSSIBLE FOOTBALL STORY</span><h1>FROM CONCRETE <span>TO CONFETTI.</span></h1><p>You started with a ball, a goal, and a team nobody took seriously. Win your way through five leagues to the world stage.</p></div><div className="v2-big-number">{save.totalWins}<small> TOTAL WINS</small></div></div><div className="v2-journey">{LEAGUES.map((l,i)=><div key={l.id} className={'v2-journey-stop '+(i===save.league?'current':'')+(i<save.league?' completed':'')+(i>save.league?' upcoming':'')} style={{'--league-color':l.theme}}><div className="v2-journey-icon">{l.icon}</div><div className="v2-journey-content"><span>{String(i+1).padStart(2,'0')} / {l.tag}</span><h2>{l.name}</h2><small>{l.venue} · {l.wins} wins to clear</small><div className="v2-journey-progress"><i style={{width:((save.wins[i]||0)/l.wins*100)+'%'}}/></div><small>{save.wins[i]||0} / {l.wins} WINS</small></div><div className="v2-journey-status">{i<save.league?'✓ CLEARED':i===save.league?'● CURRENT':'🔒 LOCKED'}</div></div>)}</div></>}
     </main>
     <footer className="v2-footer"><span>© BRAINROT FC · MADE FOR THE LOVE OF THE GAME</span><span>LOCAL SAVE · NO ACCOUNT NEEDED</span></footer>
   </div>
   <nav className="v2-bottom-nav" aria-label="Mobile navigation">{[['play','⚽','PLAY'],['club','🎴','SQUAD'],['packs','🎁','PACKS'],['journey','🏆','LEAGUES']].map(([id,icon,label])=><button key={id} className={view===id?'active':''} onClick={()=>changeView(id)}><span>{icon}</span>{label}</button>)}</nav>
   {notice&&<div className="v2-toast" role="status">{notice}</div>}
   {pack&&<div className="v2-pack-modal" role="dialog" aria-modal="true" aria-label="Pack opening"><div className="v2-pack-modal-inner">{!packOpened?<><span className="v2-eyebrow">✦ SOMETHING WILD IS COMING</span><div className="v2-pack-art v2-modal-pack"><div className="v2-pack-art-top">BRAINROT <b>FC</b></div><div className="v2-pack-art-ball">⚽</div><div className="v2-pack-art-sub">MYSTERY<br/>BALLERS</div></div><h2>ARE YOU READY?</h2><button className="v2-button-primary" onClick={()=>{setPackOpened(true);Sound({type:'goal',enabled:sound});}}>✦ REVEAL MY PLAYERS ✦</button></>:<><span className="v2-eyebrow">YOUR NEW DROP</span><h2>PACK OPENED!</h2><div className="v2-reveal-grid">{pack.cards.map((p,i)=><div className="v2-reveal-item" key={i} style={{animationDelay:(i*.14)+'s'}}><PlayerPortrait player={p} size="small"/><span className={'v2-rarity v2-rarity-'+p.rarity}>{RARITY[p.rarity].label}</span><strong>{p.name}</strong><small>{pack.isNew[i]?'NEW PLAYER!':'DUPLICATE · +120 🟡'}</small></div>)}</div>{pack.refunds>0&&<p className="v2-refund">+{pack.refunds} coins returned for duplicates</p>}<button className="v2-button-primary" onClick={()=>{setPack(null);setView('club');}}>VIEW MY SQUAD ↗</button></>}</div></div>}
 </div>;
}
export default App;
