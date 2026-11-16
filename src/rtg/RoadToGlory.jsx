import React,{useEffect,useMemo,useRef,useState} from 'react';
import {CLUBS,DIVISIONS,ROLES,TACTICS,SAVE_KEY,VERSION,freshState,startCareer,lineup,profile,teamRating,nextFixture,standings,signPlayer,scoutPlayer,chooseTactic,kickoff,finishMatch,quickSim,dismissReport,chapterChoice,advanceSeason,archiveCareer,seasonSummary,formatCash,ordinal,validState} from './engine.js';
import './road-to-glory.css';

function loadGame(){
 try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const s=JSON.parse(raw);if(validState(s))return s;}}
 catch(e){console.warn('Road to Glory save could not be loaded',e);}
 return freshState();
}
const MENU=[['home','⌂','Clubhouse'],['squad','▦','Squad'],['market','↗','Transfers'],['league','≡','League'],['almanac','★','Almanac']];
const FORMATION=[[50,86],[12,67],[37,67],[63,67],[88,67],[35,47],[65,47],[50,36],[14,21],[50,17],[86,21]];
const stageLabels=['MAKE YOUR MARK','FIND YOUR FEET','BUILD MOMENTUM','CHASE THE TOP','THE RUN-IN','THE FINAL PUSH'];

function Badge({club,size=''}){return <span className={'rtg-crest '+size} style={{'--crest-a':club?.colors?.[0]||'#d8fe73','--crest-b':club?.colors?.[1]||'#234c39'}}>{club?.crest||'✦'}</span>}
function Pill({children,tone=''}){return <span className={'rtg-pill '+tone}>{children}</span>}
function Cash({n}){return <span>{formatCash(n)}</span>}
function DotStat({label,value,small}){return <div className="rtg-stat"><span>{label}</span><strong className={small?'rtg-stat-small':''}>{value}</strong></div>}
function SectionHead({eyebrow,title,right}){return <div className="rtg-sectionhead"><div><span className="rtg-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{right}</div>}
function PlayerTag({p,muted=false}){return <div className={'rtg-playername '+(muted?'muted':'')}><span className="rtg-role">{p.role}</span><div><strong>{p.name}</strong><small>{p.age} yrs · POT {p.potential}</small></div><b className="rtg-rating">{p.ovr}</b></div>}
function Pitch({eleven,compact=false,club}){
 return <div className={'rtg-pitch '+(compact?'compact':'')}><div className="rtg-pitch-markings"><div className="rtg-midline"/><div className="rtg-circle"/><div className="rtg-box rtg-box-top"/><div className="rtg-box rtg-box-bottom"/></div>
  <div className="rtg-pitch-header">{compact?'STARTING XI':'THE STARTING ELEVEN'} <span>4 · 3 · 3</span></div>
  {eleven.map((p,i)=><div key={p?.id||i} className="rtg-pitch-player" style={{left:FORMATION[i][0]+'%',top:FORMATION[i][1]+'%'}} title={p?.name+' · '+p?.ovr+' OVR'}>
    <span className="rtg-pitch-token" style={{'--player-accent':club.colors[0]}}>{p?.ovr||'?'}</span><small>{p?.name?.split(' ').slice(-1)[0]}</small>
  </div>)}
  <span className="rtg-pitch-bottom">NORTH END · HOME</span>
 </div>;
}
function Landing({legacy,onStart}){
 const [selection,setSelection]=useState(null);
 return <div className="rtg-landing">
  <div className="rtg-landing-top"><a href="/" className="rtg-backlink">← BRAINROT FC</a><span>ROAD TO GLORY / POCKET EDITION</span></div>
  <div className="rtg-landing-inner">
   <div className="rtg-landing-lockup"><div className="rtg-mark">RTG<span>✦</span></div><Pill tone="lime">SINGLE PLAYER · NO ACCOUNT</Pill></div>
   <div className="rtg-landing-hero"><span className="rtg-eyebrow">SMALL CLUB. BIG DREAMS.</span><h1>FIVE SEASONS.<br/><em>ONE SHOT AT GLORY.</em></h1><p>Find a diamond in the rough. Make the signing that changes everything. Watch your unknowns become legends. Then do it all again.</p></div>
   <div className="rtg-landing-title"><div><span className="rtg-eyebrow">YOUR STORY STARTS HERE</span><h2>Choose your underdog.</h2></div><span>Three clubs. Three different problems.</span></div>
   <div className="rtg-clubgrid">{CLUBS.map(club=><button type="button" key={club.id} className={'rtg-clubchoice '+(selection===club.id?'selected':'')} onClick={()=>setSelection(club.id)}>
     <div className="rtg-clubchoice-top"><Badge club={club}/><span className="rtg-club-index">{club.tag}</span></div>
     <h3>{club.name}</h3><p>{club.weak}</p>
     <div className="rtg-clubchoice-bottom"><span>STARTING FUNDS <b>{formatCash(club.budget)}</b></span><span className="rtg-select-dot">{selection===club.id?'✓':'↗'}</span></div>
    </button>)}</div>
   <div className="rtg-landing-actions"><button type="button" className="rtg-button primary xl" disabled={!selection} onClick={()=>onStart(selection)}>BEGIN YOUR CAREER <span>→</span></button><small>Free. Local saves. Your club, your decisions.</small></div>
   {legacy.runs.length>0&&<div className="rtg-returning"><span className="rtg-eyebrow">YOUR FOOTBALL LEGACY</span><strong>{legacy.runs.length} completed career{legacy.runs.length===1?'':'s'} · {legacy.legends.length} players immortalised</strong><p>Your history stays with you across new runs.</p></div>}
  </div>
 </div>;
}
function Dashboard({c,go,act}){
 const f=nextFixture(c),club=CLUBS.find(x=>x.id===c.id),p=profile(c),position=standings(c).findIndex(x=>x.id==='you')+1;
 const next=c.report?'result':c.checkpoint?'checkpoint':c.seasonComplete?'season':c.match?'match':null;
 return <div className="rtg-flow">
  <div className="rtg-hero">
   <div className="rtg-hero-copy"><span className="rtg-eyebrow">SEASON {c.season} / CHAPTER {Math.min(6,Math.floor(c.round/3)+1)} <span className="rtg-bullet">●</span> {DIVISIONS[c.tier]}</span><h1>Every great team<br/><em>starts somewhere.</em></h1>
    <p>{c.memories[0]||'No superstar signings. No shortcuts. Just eleven players, one impossible dream, and a manager willing to take a chance.'}</p>
    <div className="rtg-hero-actions">{next?<button className="rtg-button primary" onClick={()=>go(next)}>CONTINUE YOUR STORY <span>→</span></button>:<button className="rtg-button primary" onClick={()=>{act(kickoff);go('match');}}>KICK OFF ROUND {c.round+1} <span>→</span></button>}
      {!next&&<button className="rtg-button secondary" onClick={()=>go('market')}>EXPLORE TRANSFERS</button>}
    </div>
   </div>
   <div className="rtg-hero-art"><span className="rtg-huge-crest">{club.crest}</span><span className="rtg-hero-ribbon">THE ROAD TO GLORY</span></div>
  </div>
  <div className="rtg-metrics"><DotStat label="LEAGUE POSITION" value={ordinal(position)}/><DotStat label="TEAM RATING" value={p.overall+' OVR'}/><DotStat label="TRANSFER FUNDS" value={formatCash(c.budget)}/><DotStat label="SEASON RECORD" value={c.table.find(x=>x.id==='you').w+'W · '+c.table.find(x=>x.id==='you').d+'D · '+c.table.find(x=>x.id==='you').l+'L'}/></div>
  <div className="rtg-dashboard-grid">
   <section className="rtg-panel fixture">
    <div className="rtg-panel-top"><span className="rtg-eyebrow">{f?'NEXT UP · ROUND '+f.round:'SEASON COMPLETE'}</span><Pill>18 MATCH SEASON</Pill></div>
    {f?<><div className="rtg-fixture"><div><Badge club={club}/><strong>{c.club}</strong><small>{f.home?'HOME':'AWAY'}</small></div><span className="rtg-vs">VS</span><div><span className="rtg-rivalbadge">⚑</span><strong>{f.opp.name}</strong><small>RATING {Math.round(f.opp.strength)}</small></div></div>
    <div className="rtg-fixture-bottom"><span>Your tactical edge starts before kickoff.</span><button className="rtg-textbutton" onClick={()=>go('squad')}>VIEW LINEUP →</button></div></>:<p className="rtg-empty">All fixtures played. Time to see what this season meant.</p>}
   </section>
   <section className="rtg-panel">
    <div className="rtg-panel-top"><span className="rtg-eyebrow">THE CHAPTER</span><span className="rtg-small">MATCH {c.round} OF 18</span></div>
    <h3>{stageLabels[Math.min(5,Math.floor(c.round/3))]}</h3><p className="rtg-subcopy">Three matches. Then one big club-building choice.</p>
    <div className="rtg-progress">{Array.from({length:18},(_,i)=><span key={i} className={i<c.round?'done':i===c.round?'current':''}/>)}</div>
    <div className="rtg-lastfive">{c.seasonResults.slice(-5).map((r,i)=><Pill key={i} tone={r.result==='WIN'?'win':r.result==='LOSS'?'loss':'draw'}>{r.result==='WIN'?'W':r.result==='LOSS'?'L':'D'}</Pill>)}{!c.seasonResults.length&&<span>First whistle still to come.</span>}</div>
   </section>
  </div>
  <div className="rtg-bottom-grid"><button type="button" className="rtg-featurelink" onClick={()=>go('market')}><span>↗ THE SCOUTING DESK</span><h3>Five players.<br/>One big decision.</h3><small>{c.signed?'Signing complete for this chapter.':'Your next hero might be waiting.'}</small><b>EXPLORE MARKET →</b></button><button type="button" className="rtg-featurelink academy" onClick={()=>go('squad')}><span>✦ INSIDE THE DRESSING ROOM</span><h3>Make them<br/>legends.</h3><small>See the players carrying your dream.</small><b>MEET YOUR SQUAD →</b></button></div>
 </div>;
}
function Squad({c}){
 const club=CLUBS.find(x=>x.id===c.id),eleven=lineup(c),ids=new Set(eleven.map(x=>x?.id)),bench=[...c.roster].filter(x=>!ids.has(x.id)).sort((a,b)=>b.ovr-a.ovr);
 return <div className="rtg-flow"><SectionHead eyebrow="YOUR PLAYERS" title="The dressing room." right={<Pill tone="lime">{teamRating(c)} TEAM OVR</Pill>}/>
  <div className="rtg-squad-layout"><Pitch eleven={eleven} club={club}/>
  <div className="rtg-panel rtg-squadlist"><div className="rtg-panel-top"><span className="rtg-eyebrow">FIRST TEAM</span><span className="rtg-small">AUTO-SELECTED BY POSITION</span></div>{eleven.map((p,i)=><PlayerTag key={p.id||i} p={p}/>)}</div></div>
  <div className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">SQUAD DEPTH</span><span className="rtg-small">{bench.length} AVAILABLE</span></div><div className="rtg-bench">{bench.map(p=><PlayerTag key={p.id} p={p} muted/>)}</div>
   <div className="rtg-notebox">Your strongest eligible player starts in each position. New signings automatically compete for the XI. No tedious lineup admin.</div>
  </div>
 </div>;
}
function Market({c,act,go}){
 const canBuy=!c.signed&&!c.match&&!c.report&&!c.checkpoint&&!c.seasonComplete;
 const starters=lineup(c);
 return <div className="rtg-flow"><SectionHead eyebrow="THE TRANSFER WINDOW" title="Five names. One move." right={<div className="rtg-budget">AVAILABLE <strong>{formatCash(c.budget)}</strong></div>}/>
  <div className="rtg-market-intro"><span className="rtg-market-icon">⌁</span><div><strong>No endless lists. No marginal upgrades.</strong><p>One signing per chapter. Find a missing piece, buy a future star, or save your money for a better window. Scout one prospect free to reveal their true ceiling.</p></div></div>
  <div className="rtg-market-grid">{c.market.map((p,i)=>{
   const same=starters.filter(x=>x.role===p.role).sort((a,b)=>a.ovr-b.ovr)[0];
   const delta=p.ovr-(same?.ovr||p.ovr),scouted=c.scoutedId===p.id;
   const affordable=c.budget>=p.fee;
   return <article className={'rtg-target '+(affordable?'':'unaffordable')} key={p.id}>
    <div className="rtg-target-top"><span className="rtg-target-number">TARGET 0{i+1}</span><span className="rtg-target-type">{p.type}</span></div>
    <div className="rtg-target-main"><div className="rtg-target-face">{p.name.slice(0,1)}</div><div><span className="rtg-eyebrow">{p.role} · {p.age} YEARS OLD</span><h3>{p.name}</h3></div></div>
    <div className="rtg-target-ratings"><div><span>OVERALL</span><strong>{p.ovr}</strong></div><div><span>VS STARTER</span><strong className={delta>0?'rtg-positive':delta<0?'rtg-negative':''}>{delta>0?'+':''}{delta}</strong></div><div><span>POTENTIAL</span><strong>{scouted?p.potential:'??'}</strong></div></div>
    <div className="rtg-target-bottom"><div className="rtg-target-fee"><span>TRANSFER FEE</span><strong>{formatCash(p.fee)}</strong></div>
     <div className="rtg-target-actions">{!c.scouted&&<button type="button" className="rtg-button ghost small" onClick={()=>act(s=>scoutPlayer(s,p.id))}>SCOUT</button>}
      {scouted&&<Pill tone="win">CEILING REVEALED</Pill>}
      <button type="button" className="rtg-button primary small" disabled={!canBuy||!affordable} onClick={()=>act(s=>signPlayer(s,p.id))}>{c.signed?'WINDOW CLOSED':!affordable?'TOO EXPENSIVE':'SIGN PLAYER →'}</button>
     </div></div>
   </article>;
  })}</div>
  <div className="rtg-notebox">{c.signed?'Signing completed. Play the next three matches to unlock a new market.':'You can leave the window without signing anyone. The cash stays in your club.'} <button type="button" className="rtg-textbutton" onClick={()=>go('home')}>BACK TO CLUBHOUSE →</button></div>
 </div>;
}
function League({c}){
 const sorted=standings(c);
 return <div className="rtg-flow"><SectionHead eyebrow="THE ROAD TO THE TOP" title={DIVISIONS[c.tier]+'.'} right={<Pill>SEASON {c.season} · ROUND {c.round}/18</Pill>}/>
  <div className="rtg-panel rtg-tablepanel"><div className="rtg-table-wrap"><table className="rtg-leaguetable"><thead><tr><th>POS</th><th>CLUB</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>PTS</th></tr></thead><tbody>{sorted.map((row,i)=><tr key={row.id} className={(row.id==='you'?'is-you ':'')+(i<2?'promote ':'')+(i>=8?'danger':'')}><td>{String(i+1).padStart(2,'0')}</td><td>{row.id==='you'?'✦ '+c.club:row.name}</td><td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td><td>{row.gf-row.ga>0?'+':''}{row.gf-row.ga}</td><td><strong>{row.pts}</strong></td></tr>)}</tbody></table></div>
   <div className="rtg-tablelegend"><span><i className="rtg-legend-green"/> TOP TWO: PROMOTION (UNTIL PREMIER)</span><span><i className="rtg-legend-red"/> BOTTOM TWO: RELEGATION (ABOVE COASTAL)</span></div>
  </div>
  <div className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">YOUR SEASON SO FAR</span><span className="rtg-small">{c.seasonResults.length} GAMES PLAYED</span></div><div className="rtg-results-grid">{c.seasonResults.length?c.seasonResults.map(r=><div key={r.round} className="rtg-mini-result"><span>R{r.round}</span><strong>{r.opponent}</strong><b className={r.result.toLowerCase()}>{r.ours} – {r.theirs}</b></div>):<div className="rtg-empty">Your road hasn't begun. The league table starts level.</div>}</div></div>
 </div>;
}
function Almanac({game,onImport}){
 const c=game.career;
 const current=c?[...c.roster].sort((a,b)=>b.stats.goals-a.stats.goals||b.ovr-a.ovr).slice(0,5):[];
 const fileRef=useRef(null);
 function exportSave(){
  const blob=new Blob([JSON.stringify(game,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='road-to-glory-save.json';a.click();URL.revokeObjectURL(url);
 }
 async function importSave(e){
  const f=e.target.files?.[0];if(!f)return;
  try{const parsed=JSON.parse(await f.text());if(!validState(parsed))throw Error('Invalid Road to Glory save');onImport(parsed);}
  catch(err){window.alert('Could not import save: '+err.message);}e.target.value='';
 }
 return <div className="rtg-flow"><SectionHead eyebrow="THE STORY YOU LEAVE BEHIND" title="The football almanac." right={<Pill tone="lime">{game.legacy.runs.length} COMPLETED RUNS</Pill>}/>
  <div className="rtg-metrics rtg-almanac-metrics"><DotStat label="CAREERS FINISHED" value={game.legacy.runs.length}/><DotStat label="HALL OF FAMERS" value={game.legacy.legends.length}/><DotStat label="LEGACY POINTS" value={game.legacy.points}/></div>
  {c&&<section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE CURRENT GENERATION</span><Pill>SEASON {c.season}</Pill></div><div className="rtg-legend-grid">{current.map(p=><div className="rtg-legend-player" key={p.id}><div className="rtg-legend-avatar">★</div><div><strong>{p.name}</strong><small>{p.role} · {p.stats.goals} goals · {p.stats.apps} appearances</small></div><span>{p.ovr}</span></div>)}</div></section>}
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE HALL OF FAME</span><span className="rtg-small">NEVER FORGOTTEN</span></div>{game.legacy.legends.length?<div className="rtg-legend-grid">{game.legacy.legends.slice(0,16).map(p=><div className="rtg-legend-player" key={p.id}><div className="rtg-legend-avatar">★</div><div><strong>{p.name}</strong><small>{p.club} · {p.goals} goals · Career {p.run}</small></div><span>{p.ovr}</span></div>)}</div>:<p className="rtg-empty">No legends yet. A player's greatest chapter may still be ahead of them.</p>}</section>
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">COMPLETED CAREERS</span></div>{game.legacy.runs.length?game.legacy.runs.map(r=><div className="rtg-career-history" key={r.id}><strong>Career #{r.id} · {r.club}</strong><span>BEST FINISH: {ordinal(r.bestFinish)} · {r.finalDivision}</span></div>):<p className="rtg-empty">Five seasons makes a career. Finish one to earn your place in history.</p>}</section>
  <div className="rtg-savebox"><div><strong>Your save belongs to you.</strong><p>Everything saves automatically in this browser. Export a backup to move it to another device. No login, no server, no tracking.</p></div><div className="rtg-save-actions"><button type="button" className="rtg-button secondary" onClick={exportSave}>↓ EXPORT SAVE</button><button type="button" className="rtg-button secondary" onClick={()=>fileRef.current?.click()}>↑ IMPORT SAVE</button><input ref={fileRef} type="file" accept=".json,application/json" onChange={importSave} hidden/></div></div>
 </div>;
}
function Match({c,onFinish}){
 const m=c.match,f=m.fixture,club=CLUBS.find(x=>x.id===c.id),ours=m.first.filter(e=>e.goal&&e.side==='you').length,theirs=m.first.filter(e=>e.goal&&e.side!=='you').length;
 return <div className="rtg-flow rtg-matchview"><SectionHead eyebrow={'ROUND '+f.round+' · HALFTIME'} title="The next 45 minutes." right={<Pill tone="lime">YOU'RE IN CHARGE</Pill>}/>
  <div className="rtg-matchscore"><div><Badge club={club}/><strong>{c.club}</strong></div><span>{ours} <small>–</small> {theirs}</span><div><span className="rtg-rivalbadge">⚑</span><strong>{f.opp.name}</strong></div></div>
  <div className="rtg-matchpitch"><div className="rtg-matchpitch-lines"><div/><i/><b/></div><span className="rtg-match-ball">⚽</span><div className="rtg-match-spark one"/><div className="rtg-match-spark two"/><span className="rtg-matchchip">45′ <i/> HALF TIME</span></div>
  <div className="rtg-match-lower"><div className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">FIRST-HALF HIGHLIGHTS</span></div><div className="rtg-commentary">{m.first.map((e,i)=><div key={i} className={'rtg-event '+(e.goal?'goal':'')}><span>{e.minute}'</span><p>{e.goal?(e.side==='you'?'⚽ GOAL! '+e.name:'⚑ Goal for '+f.opp.name):e.name}</p></div>)}</div></div>
   <div className="rtg-panel rtg-halfchoices"><span className="rtg-eyebrow">THE MANAGER'S CALL</span><h3>How do you finish?</h3><p className="rtg-subcopy">One big tactical choice. It changes the probabilities in the second half.</p>
    <button type="button" onClick={()=>onFinish('push')}><b>↗ PUSH FOR A WIN</b><small>More chances. More danger at the back.</small><span>→</span></button>
    <button type="button" onClick={()=>onFinish('hold')}><b>◆ TRUST THE PLAN</b><small>Keep your original style and stay composed.</small><span>→</span></button>
    <button type="button" onClick={()=>onFinish('protect')}><b>▣ SHUT THE DOOR</b><small>Stronger defending. Sacrifice some attack.</small><span>→</span></button>
   </div></div>
 </div>;
}
function Report({c,onContinue}){
 const r=c.report,club=CLUBS.find(x=>x.id===c.id);
 return <div className="rtg-flow rtg-reportview"><span className="rtg-eyebrow">FULL TIME · ROUND {r.fixture.round}</span>
  <h1 className={r.result==='WIN'?'wintext':r.result==='LOSS'?'losstext':''}>{r.result==='WIN'?'WHAT A RESULT.':r.result==='LOSS'?'WE GO AGAIN.':'POINT EARNED.'}</h1>
  <div className="rtg-matchscore result"><div><Badge club={club}/><strong>{c.club}</strong></div><span>{r.ours} <small>–</small> {r.theirs}</span><div><span className="rtg-rivalbadge">⚑</span><strong>{r.fixture.opp.name}</strong></div></div>
  <div className="rtg-result-stats"><div><span>RESULT</span><strong>{r.result}</strong></div><div><span>LEAGUE POSITION</span><strong>{ordinal(r.tablePosition)}</strong></div><div><span>CLUB EARNED</span><strong>{formatCash(r.earned)}</strong></div></div>
  <div className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">HOW IT UNFOLDED</span><span className="rtg-small">90 MINUTES</span></div><div className="rtg-commentary report">{r.events.filter(e=>e.goal).length?r.events.filter(e=>e.goal).map((e,i)=><div key={i} className="rtg-event goal"><span>{e.minute}'</span><p>{e.side==='you'?'⚽ '+e.name+' scores!':'⚑ '+r.fixture.opp.name+' score.'}</p></div>):<p className="rtg-empty">A hard-fought goalless contest.</p>}</div></div>
  {r.growth.length>0&&<div className="rtg-growthbox"><span>✦ ON THE UP</span>{r.growth.join(' · ')}</div>}
  <button type="button" className="rtg-button primary xl" onClick={onContinue}>{c.seasonComplete?'REVIEW SEASON':c.checkpoint?'YOUR NEXT CHAPTER':'BACK TO THE CLUBHOUSE'} <span>→</span></button>
 </div>;
}
function Checkpoint({c,onPick}){
 return <div className="rtg-flow rtg-checkpoint"><Pill tone="lime">CHAPTER {c.round/3} COMPLETE</Pill><h1>One decision.<br/><em>A real difference.</em></h1><p>Three matches down. Your club has momentum. Choose where to make your next big leap. The transfer market will then refresh with five new names.</p>
  <div className="rtg-decision-grid"><button type="button" onClick={()=>onPick('attack')}><span>01 / THE FINISHING SCHOOL</span><div>⚡</div><h3>Make a<br/>goal machine.</h3><p>Up to +5 OVR for a leading attacker and +3 for another. If they've reached their potential, growth is capped.</p><b>TRAIN ATTACK →</b></button>
   <button type="button" onClick={()=>onPick('defence')}><span>02 / THE STEEL WALL</span><div>▣</div><h3>Build an<br/>unbreakable backline.</h3><p>Up to +5 OVR for a leading defender and +3 for another. Protect those tight leads.</p><b>TRAIN DEFENCE →</b></button>
   <button type="button" onClick={()=>onPick('academy')}><span>03 / THE WILD CARD</span><div>★</div><h3>Find the<br/>next big thing.</h3><p>Promote one young academy talent with a high potential ceiling. Their position and ability are a surprise.</p><b>GIVE YOUTH A CHANCE →</b></button>
  </div>
 </div>;
}
function SeasonEnd({c,onAdvance,onArchive}){
 const s=seasonSummary(c);
 return <div className="rtg-flow rtg-seasonend"><Pill tone="lime">SEASON {c.season} COMPLETE</Pill><h1>{s.promoted?'WE ARE GOING UP.':s.relegated?'THE FIGHT IS ON.':s.position<=3?'SO CLOSE TO GLORY.':'A NEW CHAPTER AWAITS.'}</h1><p>{c.club} finish <strong>{ordinal(s.position)}</strong> in the {s.division} with <strong>{s.points} points</strong>. {s.promoted?'Promotion is yours. A bigger stage, a bigger budget, and fiercer rivals.':s.relegated?'Relegation hurts. But your story is not over.':'There is more to accomplish.'}</p>
  <div className="rtg-result-stats"><div><span>FINAL POSITION</span><strong>{ordinal(s.position)}</strong></div><div><span>POINTS</span><strong>{s.points}</strong></div><div><span>TEAM RATING</span><strong>{teamRating(c)}</strong></div></div>
  <div className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE SEASON'S BEST</span></div>{[...c.roster].sort((a,b)=>b.stats.goals-a.stats.goals).slice(0,3).map(p=><PlayerTag key={p.id} p={p}/>)}</div>
  {c.season<5?<button type="button" className="rtg-button primary xl" onClick={onAdvance}>BEGIN SEASON {c.season+1} <span>→</span></button>:<button type="button" className="rtg-button primary xl" onClick={onArchive}>WRITE YOUR LEGACY <span>→</span></button>}
 </div>;
}
export default function RoadToGlory(){
 const [game,setGame]=useState(loadGame),[view,setView]=useState('home'),[notice,setNotice]=useState('');
 const c=game.career;
 useEffect(()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch(e){console.warn('Unable to save career',e);setNotice('Browser storage is unavailable. Export your career in the Almanac.');}},[game]);
 const act=fn=>setGame(prev=>{const next=fn(prev);if(!validState(next)){console.error('Road to Glory rejected invalid state');setNotice('A save-integrity check prevented this action.');return prev;}return next;});
 const go=next=>{setView(next);window.scrollTo({top:0,behavior:'smooth'});};
 const start=id=>{act(s=>startCareer(s,id,Date.now()));go('home');};
 const advance=()=>{act(advanceSeason);go('home');};
 const finish=choice=>{act(s=>finishMatch(s,choice));go('result');};
 const continueReport=()=>{const next=c.seasonComplete?'season':c.checkpoint?'checkpoint':'home';act(dismissReport);go(next);};
 const choose=choice=>{act(s=>chapterChoice(s,choice));go('home');};
 const archive=()=>{act(archiveCareer);go('home');};
 const importGame=s=>{setGame(s);go('home');setNotice('Save imported successfully.');};
 if(!c)return <Landing legacy={game.legacy} onStart={start}/>;
 const club=CLUBS.find(x=>x.id===c.id);
 let activeView=c.report&&view==='result'?'result':c.match&&view==='match'?'match':view;
 if(!['home','market','squad','league','almanac','result','match','checkpoint','season'].includes(activeView))activeView='home';
 if(activeView==='result'&&!c.report)activeView='home';
 if(activeView==='match'&&!c.match)activeView='home';
 if(activeView==='checkpoint'&&!c.checkpoint)activeView='home';
 if(activeView==='season'&&!c.seasonComplete)activeView='home';
 const special=['result','match','checkpoint','season'].includes(activeView);
 return <div className="rtg-app"><aside className="rtg-sidebar">
    <a className="rtg-brand" href="/"><span className="rtg-brand-symbol">R<span>✦</span></span><div><strong>ROAD TO GLORY</strong><small>POCKET EDITION</small></div></a>
    <div className="rtg-sideclub"><Badge club={club}/><div><span>THE MANAGER OF</span><strong>{c.club}</strong><small>{DIVISIONS[c.tier]} · S{c.season}</small></div></div>
    <div className="rtg-sidelabel">THE CLUB</div><nav className="rtg-nav">{MENU.map(([id,icon,label])=><button type="button" key={id} className={view===id?'active':''} onClick={()=>go(id)}><span>{icon}</span>{label}{id==='market'&&!c.signed&&!c.checkpoint&&!c.report&&<i/>}</button>)}</nav>
    <div className="rtg-sidebar-bottom"><span>THE LONG ROAD</span><div className="rtg-season-dots">{Array.from({length:5},(_,i)=><i key={i} className={i<c.season?'passed':i===c.season-1?'active':''}/>)}</div><strong>Season {c.season} of 5</strong><small>Build something they'll remember.</small><a href="/" className="rtg-exit">← Back to Brainrot FC</a></div>
   </aside>
   <div className="rtg-shell"><header className="rtg-topbar"><div><span className="rtg-topbar-issue">THE FOOTBALL CHRONICLE</span><span className="rtg-topbar-title">S{c.season} · MATCHWEEK {Math.min(18,c.round+1)} / 18</span></div><div className="rtg-topbar-right"><span className="rtg-live-dot"/> ALL LOCAL · AUTO SAVED <span className="rtg-topbar-divider"/> <b>{formatCash(c.budget)}</b></div></header>
    {notice&&<div className="rtg-notice" role="status">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
    <main className={'rtg-main '+(special?'rtg-main-special':'')}>
      {activeView==='home'&&<Dashboard c={c} go={go} act={act}/>}
      {activeView==='squad'&&<Squad c={c}/>}
      {activeView==='market'&&<Market c={c} act={act} go={go}/>}
      {activeView==='league'&&<League c={c}/>}
      {activeView==='almanac'&&<Almanac game={game} onImport={importGame}/>}
      {activeView==='match'&&<Match c={c} onFinish={finish}/>}
      {activeView==='result'&&<Report c={c} onContinue={continueReport}/>}
      {activeView==='checkpoint'&&<Checkpoint c={c} onPick={choose}/>}
      {activeView==='season'&&<SeasonEnd c={c} onAdvance={advance} onArchive={archive}/>}
      {!special&&!c.match&&!c.report&&!c.checkpoint&&!c.seasonComplete&&<div className="rtg-tactics"><div><span className="rtg-eyebrow">MATCH PLAN</span><p>Pick your approach before kickoff.</p></div><div className="rtg-tacticbuttons">{Object.entries(TACTICS).map(([id,t])=><button type="button" key={id} className={c.tactic===id?'selected':''} onClick={()=>act(s=>chooseTactic(s,id))} title={t.note}>{t.label}</button>)}</div><button type="button" className="rtg-button secondary" onClick={()=>{act(quickSim);go('result');}}>QUICK SIM NEXT MATCH ↗</button></div>}
    </main><footer className="rtg-footer">ROAD TO GLORY / A FOOTBALL-FIRST ARCADE CAREER <span>YOUR STORY. YOUR RULES.</span></footer>
   </div>
   <nav className="rtg-mobile-nav">{MENU.map(([id,icon,label])=><button key={id} type="button" className={view===id?'active':''} onClick={()=>go(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>
  </div>;
}
