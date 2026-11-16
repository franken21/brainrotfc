import React,{useEffect,useMemo,useRef,useState} from 'react';
import {CLUBS,DIVISIONS,DIVISION_CONFIG,MAX_SQUAD,ROLES,TACTICS,startingChoices,resolveOffseason,SAVE_KEY,VERSION,freshState,startCareer,lineup,profile,teamRating,nextFixture,standings,signPlayer,scoutPlayer,chooseTactic,kickoff,finishMatch,quickSim,dismissReport,chapterChoice,advanceSeason,archiveCareer,seasonSummary,formatCash,ordinal,validState,transferPreview,passMarket,migrateState,clubBoost,growthWatch,sellPlayer,tacticalMatchup} from './engine.js';
import './road-to-glory.css';

function loadGame(){
 try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const s=migrateState(JSON.parse(raw));if(validState(s))return s;}}
 catch(e){console.warn('Road to Glory save could not be loaded',e);}
 return freshState();
}
const MENU=[['home','⌂','Clubhouse'],['squad','▦','Squad'],['market','↗','Transfers'],['league','≡','League'],['almanac','★','Almanac']];
const FORMATION=[[50,86],[12,67],[37,67],[63,67],[88,67],[35,47],[65,47],[50,36],[14,21],[50,17],[86,21]];
const stageLabels=['MAKE YOUR MARK','FIND YOUR FEET','BUILD MOMENTUM','CHASE THE TOP','THE RUN-IN','THE FINAL PUSH'];

function Badge({club,size=''}){const letters=(club?.name||'FC').split(' ').map(x=>x[0]).join('').slice(0,3);return <span className={'rtg-crest rtg-crest-custom '+size} style={{'--crest-a':club?.colors?.[0]||'#d8fe73','--crest-b':club?.colors?.[1]||'#234c39'}}><span className="rtg-crest-mark">{club?.crest||'✦'}</span><span className="rtg-crest-letters">{letters}</span></span>}
function RivalBadge({rival}){const letters=(rival?.name||'FC').split(' ').map(x=>x[0]).join('').slice(0,2);return <span className={'rtg-rivalbadge rtg-rivalbadge-painted rtg-rival-'+(rival?.style||'balanced')} style={{'--rival-ink':rival?.color||'#9cb7a4'}}><b>{letters}</b><small>{rival?.style==='press'?'↗':rival?.style==='counter'?'↯':'◆'}</small></span>}
function DivisionBanner({c,compact=false}){const d=DIVISION_CONFIG[c.tier];return <div className={'rtg-stage-banner '+(compact?'compact':'')}><div className="rtg-stage-seal">{d.icon}</div><div><span>DIVISION {c.tier+1} / 3 · SEASON {c.season}</span><strong>{DIVISIONS[c.tier]}</strong><small>{d.subtitle} · {d.description}</small></div><div className="rtg-stage-meter">{DIVISION_CONFIG.map((o,i)=><span key={o.key} className={i<=c.tier?'lit':''}>{o.icon}</span>)}</div></div>}
function Pill({children,tone=''}){return <span className={'rtg-pill '+tone}>{children}</span>}
function Cash({n}){return <span>{formatCash(n)}</span>}
function DotStat({label,value,small}){return <div className="rtg-stat"><span>{label}</span><strong className={small?'rtg-stat-small':''}>{value}</strong></div>}
function SectionHead({eyebrow,title,right}){return <div className="rtg-sectionhead"><div><span className="rtg-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{right}</div>}
function PlayerTag({p,muted=false}){return <div className={'rtg-playername '+(muted?'muted':'')}><span className="rtg-role">{p.role}</span><div><strong>{p.name}</strong><small>{p.age} yrs · POT {p.potential} · +{p.growth||0} grown</small></div><b className="rtg-rating">{p.ovr}</b></div>}
function Pitch({eleven,compact=false,club}){
 return <div className={'rtg-pitch '+(compact?'compact':'')}><div className="rtg-pitch-markings"><div className="rtg-midline"/><div className="rtg-circle"/><div className="rtg-box rtg-box-top"/><div className="rtg-box rtg-box-bottom"/></div>
  <div className="rtg-pitch-header">{compact?'STARTING XI':'THE STARTING ELEVEN'} <span>4 · 3 · 3</span></div>
  {eleven.map((p,i)=><div key={p?.id||i} className="rtg-pitch-player" style={{left:FORMATION[i][0]+'%',top:FORMATION[i][1]+'%'}} title={p?.name+' · '+p?.ovr+' OVR'}>
    <span className="rtg-pitch-token" style={{'--player-accent':club.colors[0]}}>{p?.ovr||'?'}</span><small>{p?.name?.split(' ').slice(-1)[0]}</small>
  </div>)}
  <span className="rtg-pitch-bottom">NORTH END · HOME</span>
 </div>;
}
function TrophyCabinet({trophies=[],mini=false,go}){const shown=trophies.slice().reverse();return <section className={'rtg-cabinet '+(mini?'mini':'')}><div className="rtg-cabinet-title"><div><span className="rtg-eyebrow">THE TROPHY CABINET</span><strong>{shown.length?shown.length+' pieces of silverware':'The shelves are waiting'}</strong></div>{go&&<button type="button" className="rtg-textbutton" onClick={()=>go('almanac')}>OPEN CABINET →</button>}</div><div className="rtg-cabinet-shelf">{shown.length?shown.slice(0,mini?4:24).map((t,i)=><div className={'rtg-trophy rtg-trophy-tier-'+t.tier} key={t.id}><span className="rtg-trophy-icon">{t.icon||'🏆'}</span><div><strong>{t.label}</strong><small>{t.club} · Season {t.season}</small></div></div>):[0,1,2].map(i=><div className="rtg-trophy empty" key={i}><span className="rtg-trophy-icon">{i===2?'♕':'♧'}</span><div><strong>{['Coastal','National','Premier'][i]} title</strong><small>Not won yet</small></div></div>)}</div></section>}
function Landing({legacy,onStart,onImport}){
 const [selection,setSelection]=useState(null),[seed]=useState(()=>Date.now()),[choiceRound,setChoiceRound]=useState(0),importRef=useRef(null);
 const offered=startingChoices(seed,choiceRound);
 async function restoreBackup(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
   const saved=migrateState(JSON.parse(await file.text()));
   if(!validState(saved))throw Error('Not a valid Road to Glory save');
   onImport(saved);
  }catch(error){window.alert('Unable to import career: '+error.message);}
  event.target.value='';
 }
 return <div className="rtg-landing">
  <div className="rtg-landing-top"><a href="/" className="rtg-backlink">← BRAINROT FC</a><span>ROAD TO GLORY / POCKET EDITION</span></div>
  <div className="rtg-landing-inner">
   <div className="rtg-landing-lockup"><div className="rtg-mark">RTG<span>✦</span></div><Pill tone="lime">SINGLE PLAYER · NO ACCOUNT</Pill></div>
   <div className="rtg-landing-hero"><span className="rtg-eyebrow">SMALL CLUB. BIG DREAMS.</span><h1>FIVE SEASONS.<br/><em>ONE SHOT AT GLORY.</em></h1><p>Find a diamond in the rough. Make the signing that changes everything. Watch your unknowns become legends. Then do it all again.</p></div>
   <div className="rtg-landing-title"><div><span className="rtg-eyebrow">YOUR STORY STARTS HERE</span><h2>Choose your underdog.</h2></div><button type="button" className="rtg-button secondary" onClick={()=>{setChoiceRound(n=>n+1);setSelection(null);}}>↻ THREE DIFFERENT CLUBS</button></div>
   <div className="rtg-clubgrid">{offered.map(club=><button type="button" key={club.id} className={'rtg-clubchoice '+(selection===club.id?'selected':'')} onClick={()=>setSelection(club.id)}>
     <div className="rtg-clubchoice-top"><Badge club={club}/><span className="rtg-club-index">{club.tag}</span></div>
     <h3>{club.name}</h3><p>{club.weak}</p>
     <div className="rtg-clubchoice-bottom"><span>STARTING FUNDS <b>{formatCash(club.budget)}</b></span><span className="rtg-select-dot">{selection===club.id?'✓':'↗'}</span></div>
    </button>)}</div>
   <div className="rtg-landing-actions"><button type="button" className="rtg-button primary xl" disabled={!selection} onClick={()=>onStart(selection)}>BEGIN YOUR CAREER <span>→</span></button><button type="button" className="rtg-button secondary xl" onClick={()=>importRef.current?.click()}>↑ CONTINUE FROM SAVE</button><input ref={importRef} hidden type="file" accept=".json,application/json" onChange={restoreBackup}/><small>Stored in your browser. No account needed.</small></div>
   {legacy.runs.length>0&&<div className="rtg-returning"><span className="rtg-eyebrow">YOUR FOOTBALL LEGACY</span><strong>{legacy.runs.length} completed career{legacy.runs.length===1?'':'s'} · {legacy.legends.length} players immortalised</strong><p>Your history stays with you across new runs.</p></div>}
  </div>
 </div>;
}
function Dashboard({c,go}){
 const f=nextFixture(c),club=CLUBS.find(x=>x.id===c.id),p=profile(c),position=standings(c).findIndex(x=>x.id==='you')+1;
 const next=c.report?'result':c.checkpoint?'checkpoint':c.seasonComplete?'season':c.match?'match':null;
 const marketOpen=!c.signed&&!c.windowPassed&&!c.seasonComplete&&c.roster.length<MAX_SQUAD;
 const youth=growthWatch(c)[0];
 const todo=[
  {done:!marketOpen,title:marketOpen?'Transfer window open':'Transfers settled for this chapter',detail:marketOpen?'Five players to consider. One signing allowed.':c.signed?'Signed '+c.lastSigning?.name+'.':c.roster.length>=MAX_SQUAD?'Squad full. Consider next chapter.':'No more transfers until the next chapter.',target:marketOpen?'market':'squad',cta:marketOpen?'OPEN SCOUTING':'VIEW TEAM'},
  {done:!!youth,title:'Future stars',detail:youth?youth.name+' · '+youth.age+' yrs · '+youth.ovr+' OVR (+'+(youth.growth||0)+')':'Watch the academy for young talent.',target:'squad',cta:'YOUTH WATCH'},
  {done:true,title:'Next opponent',detail:f?f.opp.name+' · '+f.opp.style.toUpperCase()+' · '+f.opp.trait:'Season finished. See the table.',target:f?'prematch':'season',cta:'MATCH PREVIEW'}
 ];
 return <div className="rtg-flow rtg-dashboard">
  <DivisionBanner c={c} compact/>
  <div className="rtg-hero"><div className="rtg-hero-copy">
   <span className="rtg-eyebrow">SEASON {c.season} · ROUND {Math.min(18,c.round+1)}/18</span>
   <h1>{c.round===0?'The opening whistle.':c.momentum>=65?'The town believes.':c.momentum<36?'Time to fight back.':'The next match awaits.'}<br/><em>{c.club}.</em></h1>
   <div className="rtg-hero-actions"><button className="rtg-button primary" onClick={()=>go(next||'prematch')}>{next?'CONTINUE SEASON':'PREPARE FOR MATCH'} <span>→</span></button>
   {marketOpen&&<button className="rtg-button secondary" onClick={()=>go('market')}>OPEN TRANSFERS</button>}</div>
  </div><div className="rtg-hero-art"><span className="rtg-huge-crest">{club.crest}</span></div></div>
  <div className="rtg-metrics rtg-metrics-six"><DotStat label="LEAGUE" value={ordinal(position)}/><DotStat label="XI STRENGTH" value={p.overall+' OVR'}/><DotStat label="FUNDS" value={formatCash(c.budget)}/><DotStat label="SUPPORTERS" value={c.supporters.toLocaleString('en-GB')}/><DotStat label="FORM" value={c.momentum+'/100'}/><DotStat label="REPUTATION" value={c.reputation+'/100'}/></div>
  <div className="rtg-dashboard-grid rtg-matchday-grid">
   <section className="rtg-panel fixture"><div className="rtg-panel-top"><span className="rtg-eyebrow">{f?'ROUND '+f.round+' · '+(f.home?'HOME':'AWAY'):'SEASON COMPLETE'}</span><Pill>{f?.opp.style?.toUpperCase()||'RESULTS'}</Pill></div>
    {f?<><div className="rtg-fixture"><div><Badge club={club}/><strong>{c.club}</strong><small>OVR {p.overall}</small></div><span className="rtg-vs">VS</span><div><RivalBadge rival={f.opp}/><strong>{f.opp.name}</strong><small>OVR {Math.round(f.opp.strength)}</small></div></div>
      <div className="rtg-rival-brief"><strong>{f.opp.trait}</strong><small>{tacticalMatchup(c.tactic,f.opp.style).label}</small></div>
      </>:<p className="rtg-empty">All 18 fixtures played. Your season review is ready.</p>}
    <button className="rtg-button primary rtg-dashboard-next" onClick={()=>go(next||'prematch')}>{next?'CONTINUE':'PRE-MATCH SCOUTING'} →</button>
   </section>
   <section className="rtg-panel rtg-prep-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">MANAGER'S NOTES</span><Pill>3 QUICK CHECKS</Pill></div>
    <div className="rtg-prep-list">{todo.map((a,k)=><button key={k} className={'rtg-prep-item '+(a.done?'done':'')} disabled={!!next} onClick={()=>go(a.target)}>
      <span className="rtg-prep-check">{a.done?'✓':k+1}</span><span className="rtg-prep-copy"><strong>{a.title}</strong><small>{a.detail}</small></span><span className="rtg-prep-arrow">{a.cta} ↗</span></button>)}</div>
   </section>
  </div>
  <div className="rtg-dashboard-foot">
   <TrophyCabinet trophies={c.trophies||[]} mini go={go}/>
   <button className="rtg-youth-shortcut" type="button" onClick={()=>go('squad')}><span>✦ YOUTH WATCH</span><strong>{youth?youth.name:'Find the next club legend'}</strong><small>{youth?'AGE '+youth.age+' · '+youth.ovr+' OVR · '+(youth.growth||0)+' GROWN':'The reserves train between fixtures'}</small><b>VIEW SQUAD →</b></button>
  </div>
 </div>;
}
function Squad({c,act,go}){
 const club=CLUBS.find(x=>x.id===c.id),eleven=lineup(c),ids=new Set(eleven.map(x=>x?.id));
 const bench=[...c.roster].filter(x=>!ids.has(x.id)).sort((a,b)=>b.ovr-a.ovr);
 const youth=growthWatch(c);
 return <div className="rtg-flow"><SectionHead eyebrow="THE DRESSING ROOM" title="First team & future stars" right={<Pill tone="lime">{c.roster.length}/{MAX_SQUAD} PLACES</Pill>}/>
  <div className="rtg-squad-layout"><Pitch eleven={eleven} club={club}/><div className="rtg-panel rtg-squadlist"><div className="rtg-panel-top"><span className="rtg-eyebrow">STARTING XI</span><span className="rtg-small">BEST PLAYER AUTO-STARTS IN EACH ROLE</span></div>{eleven.map((p,i)=><PlayerTag key={p?.id||i} p={p}/>)}</div></div>
  <section className="rtg-panel rtg-youth-desk"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE NEXT GENERATION</span><Pill tone="lime">AUTOMATIC DEVELOPMENT</Pill></div>
   <h3>Your future first-team stars</h3><p className="rtg-subcopy">Youth players keep training even on the bench. When one surpasses a starter in his position, he gets picked automatically.</p>
   <div className="rtg-youth-grid">{youth.length?youth.map(p=><div className="rtg-youth-card" key={p.id}><div className="rtg-youth-top"><span>{p.role} · AGE {p.age}</span><span>OVR {p.ovr}</span></div><strong>{p.name}</strong><div className="rtg-youth-potential"><span>NOW {p.ovr}</span><div><i style={{width:(Math.round(p.ovr/Math.max(1,p.potential)*100))+'%'}}/></div><span>POT {p.potential}</span></div><small>+{p.growth||0} career growth · {p.age<=20?'Fast-track training':'Reserve development'}</small></div>):<div className="rtg-empty">No reserve prospects waiting right now. Watch the academy or scouting market.</div>}</div>
  </section>
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE BENCH</span><span className="rtg-small">{bench.length} AVAILABLE</span></div><div className="rtg-bench">{bench.map(p=><PlayerTag key={p.id} p={p} muted/>)}</div><div className="rtg-notebox">Maximum {MAX_SQUAD} players. Fringe reserves are automatically cleared after Round 18. Bids for starters only appear in your annual review.</div></section>
 </div>;
}
function Market({c,act,go}){
 const canBuy=!c.signed&&!c.windowPassed&&!c.match&&!c.report&&!c.checkpoint&&!c.seasonComplete&&c.roster.length<MAX_SQUAD;
 const p=profile(c);
 const descriptors=[
  {style:'THE LONG GAME',sub:'Could become a star. Will need minutes.',risk:'BUILD FOR THE FUTURE'},
  {style:'THE STATEMENT SIGNING',sub:'A major boost right now. Little growth left.',risk:'WIN THIS SEASON'},
  {style:'THE CREATIVE SPARK',sub:'An immediate option with room to improve.',risk:'THE MIDDLE GROUND'},
  {style:'THE SAFE PAIR OF HANDS',sub:'Experienced, reliable and ready for pressure.',risk:'BUY EXPERIENCE'},
  {style:'THE BREAKOUT BET',sub:'Young, improving and not yet the finished player.',risk:'GROW YOUR OWN STAR'}
 ];
 return <div className="rtg-flow"><SectionHead eyebrow={'RECRUITMENT OFFICE · CHAPTER '+(Math.floor(c.round/3)+1)} title="Transfer shortlist" right={<div className="rtg-budget">CLUB FUNDS <strong>{formatCash(c.budget)}</strong></div>}/>
  <div className="rtg-market-intro rtg-window-brief"><span className="rtg-market-icon">⌁</span><div><strong>The manager can make one signing.</strong><p>Do we spend big to win now, back a teenager for later, or strengthen another position? You can scout one player for free before deciding. Squad {c.roster.length}/{MAX_SQUAD} · ATT {p.attack} · DEF {p.defence}.</p></div></div>
  {c.roster.length>=MAX_SQUAD&&<div className="rtg-market-closed"><span>!</span><div><strong>FULL DRESSING ROOM</strong><p>The squad has reached {MAX_SQUAD} players. Clear-out happens at the end of the season.</p></div><button className="rtg-button secondary" onClick={()=>go('squad')}>VIEW SQUAD →</button></div>}
  {c.signed&&<div className="rtg-market-closed"><span>✓</span><div><strong>TRANSFER COMPLETED</strong><p>{c.lastSigning?.name} has joined {c.club}. The transfer window reopens after the next three matches.</p></div><button type="button" className="rtg-button primary" onClick={()=>go('signing')}>SEE THE SIGNING →</button></div>}
  {c.windowPassed&&<div className="rtg-market-closed"><span>£</span><div><strong>FUNDS HELD BACK</strong><p>You've kept {formatCash(c.budget)} for the next transfer window.</p></div></div>}
  {canBuy?<div className="rtg-market-grid">{c.market.map((candidate,i)=>{
   const a=transferPreview(c,candidate),desc=descriptors[i],scouted=c.scoutedId===candidate.id;
   const affordable=c.budget>=candidate.fee;
   const field=a.defence>a.attack?'DEFENCE':a.attack>a.defence?'ATTACK':'TEAM';
   const points=field==='DEFENCE'?a.defence:field==='ATTACK'?a.attack:a.overall;
   return <article className={'rtg-target rtg-target-'+i+(affordable?'':' unaffordable')} key={candidate.id}>
    <div className="rtg-target-top"><span className="rtg-target-number">OPTION 0{i+1}</span><span className="rtg-target-type">{desc.style}</span></div>
    <div className="rtg-transfer-identity"><div className="rtg-age-punch"><strong>{candidate.age}</strong><span>YEARS</span></div><div className="rtg-transfer-person"><span className="rtg-eyebrow">{candidate.role} · {a.ageGroup}</span><h3>{candidate.name}</h3><p>{desc.sub}</p></div></div>
    <div className="rtg-tradeoff-row"><span className={'rtg-strategy-tag strategy-'+i}>{desc.risk}</span><span>{candidate.age<=21?'HIGH GROWTH':candidate.age>=27?'EXPERIENCED':'IN THEIR PRIME'}</span></div>
    <div className="rtg-target-ratings"><div><span>RATING TODAY</span><strong>{candidate.ovr}</strong></div>
      <div><span>{points>0?field+' BOOST':'XI BOOST'}</span><strong className={points>0?'rtg-positive':'rtg-muted-number'}>{points>0?'+'+points:'0'}</strong></div>
      <div><span>{scouted?'SCOUTED CEILING':'GROWTH ROOM'}</span><strong className={scouted?'rtg-positive':'rtg-growth-hint'}>{scouted?candidate.potential:a.upside}</strong></div></div>
    <div className="rtg-vs-player">Current {candidate.role}: <b>{a.oldName}</b> ({a.oldRating} OVR){a.upgrade>0?<span> · +{a.upgrade} player upgrade</span>:<span> · future squad depth</span>}</div>
    <div className="rtg-target-bottom"><div className="rtg-target-fee"><span>ASKING PRICE</span><strong>{formatCash(candidate.fee)}</strong></div>
     <div className="rtg-target-actions">{!c.scouted&&canBuy&&<button type="button" className="rtg-button ghost small" onClick={()=>act(s=>scoutPlayer(s,candidate.id))}>SCOUT FIRST</button>}
      {scouted&&<Pill tone="win">CEILING CONFIRMED</Pill>}
      <button type="button" className="rtg-button primary small" disabled={!canBuy||!affordable} onClick={()=>{act(s=>signPlayer(s,candidate.id));go('signing');}}>{!affordable?'CAN’T AFFORD':c.roster.length>=MAX_SQUAD?'SQUAD FULL':!canBuy?'WINDOW CLOSED':'SIGN FOR '+formatCash(candidate.fee)+' →'}</button>
     </div></div>
   </article>;
  })}</div>:<div className="rtg-market-closed rtg-window-finished"><span>✓</span><div><strong>NO ACTION REQUIRED</strong><p>Your current transfer business is settled. Scouting reopens after the next three matches.</p></div><button className="rtg-button primary" onClick={()=>go('home')}>CLUBHOUSE →</button></div>}
  <div className="rtg-notebox"><span>{canBuy?'One deal only. There will be another shortlist after three matches.':'Your transfer decision is locked in for this chapter.'}</span>{canBuy&&<button type="button" className="rtg-button secondary" onClick={()=>{act(passMarket);go('home');}}>KEEP THE CASH →</button>}<button type="button" className="rtg-textbutton" onClick={()=>go('home')}>BACK TO CLUBHOUSE →</button></div>
 </div>;
}
function League({c}){
 const sorted=standings(c);
 return <div className="rtg-flow"><DivisionBanner c={c}/><SectionHead eyebrow="THE ROAD TO THE TOP" title={DIVISIONS[c.tier]+'.'} right={<Pill>SEASON {c.season} · ROUND {c.round}/18</Pill>}/>
  <div className="rtg-panel rtg-tablepanel"><div className="rtg-table-wrap"><table className="rtg-leaguetable"><thead><tr><th>POS</th><th>CLUB</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>PTS</th></tr></thead><tbody>{sorted.map((row,i)=><tr key={row.id} className={(row.id==='you'?'is-you ':'')+(i<2?'promote ':'')+(i>=8?'danger':'')}><td>{String(i+1).padStart(2,'0')}</td><td>{row.id==='you'?'✦ '+c.club:<><span className="rtg-league-rival-icon" style={{color:c.rivals.find(r=>r.id===row.id)?.color}}>◈</span> {row.name}</>}</td><td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td><td>{row.gf-row.ga>0?'+':''}{row.gf-row.ga}</td><td><strong>{row.pts}</strong></td></tr>)}</tbody></table></div>
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
  try{const parsed=migrateState(JSON.parse(await f.text()));if(!validState(parsed))throw Error('Invalid Road to Glory save');onImport(parsed);}
  catch(err){window.alert('Could not import save: '+err.message);}e.target.value='';
 }
 return <div className="rtg-flow"><SectionHead eyebrow="THE STORY YOU LEAVE BEHIND" title="The football almanac." right={<Pill tone="lime">{game.legacy.runs.length} COMPLETED RUNS</Pill>}/>
  <TrophyCabinet trophies={[...(game.legacy.trophies||[]),...(c?.trophies||[])]}/>
  <div className="rtg-metrics rtg-almanac-metrics"><DotStat label="CAREERS FINISHED" value={game.legacy.runs.length}/><DotStat label="HALL OF FAMERS" value={game.legacy.legends.length}/><DotStat label="LEGACY POINTS" value={game.legacy.points}/></div>
  {c&&<section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE CURRENT GENERATION</span><Pill>SEASON {c.season}</Pill></div><div className="rtg-legend-grid">{current.map(p=><div className="rtg-legend-player" key={p.id}><div className="rtg-legend-avatar">★</div><div><strong>{p.name}</strong><small>{p.role} · {p.stats.goals} goals · {p.stats.apps} appearances</small></div><span>{p.ovr}</span></div>)}</div></section>}
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE HALL OF FAME</span><span className="rtg-small">NEVER FORGOTTEN</span></div>{game.legacy.legends.length?<div className="rtg-legend-grid">{game.legacy.legends.slice(0,16).map(p=><div className="rtg-legend-player" key={p.id}><div className="rtg-legend-avatar">★</div><div><strong>{p.name}</strong><small>{p.club} · {p.goals} goals · Career {p.run}</small></div><span>{p.ovr}</span></div>)}</div>:<p className="rtg-empty">No legends yet. A player's greatest chapter may still be ahead of them.</p>}</section>
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">COMPLETED CAREERS</span></div>{game.legacy.runs.length?game.legacy.runs.map(r=><div className="rtg-career-history" key={r.id}><strong>Career #{r.id} · {r.club}</strong><span>BEST FINISH: {ordinal(r.bestFinish)} · {r.finalDivision}</span></div>):<p className="rtg-empty">Five seasons makes a career. Finish one to earn your place in history.</p>}</section>
  <div className="rtg-savebox"><div><strong>Your save belongs to you.</strong><p>Everything saves automatically in this browser. Export a backup to move it to another device. No login, no server, no tracking.</p></div><div className="rtg-save-actions"><button type="button" className="rtg-button secondary" onClick={exportSave}>↓ EXPORT SAVE</button><button type="button" className="rtg-button secondary" onClick={()=>fileRef.current?.click()}>↑ IMPORT SAVE</button><input ref={fileRef} type="file" accept=".json,application/json" onChange={importSave} hidden/></div></div>
 </div>;
}
function Prematch({c,onStart,onTactic,go}){
 const f=nextFixture(c),club=CLUBS.find(x=>x.id===c.id),stats=profile(c),boost=clubBoost(c,f?.home),youth=growthWatch(c)[0];
 if(!f)return null;
 const styles=[
  {id:'balanced',icon:'◆',title:'Balanced',effect:'Solid control'},
  {id:'press',icon:'↗',title:'High Press',effect:'Attacking intent'},
  {id:'counter',icon:'↯',title:'Counter',effect:'Stay compact'}
 ];
 const rivalStyle=f.opp.style||'balanced',matchup=tacticalMatchup(c.tactic,rivalStyle);
 const best=styles.map(st=>({style:st,...tacticalMatchup(st.id,rivalStyle)})).sort((a,b)=>b.advantage-a.advantage)[0];
 return <div className="rtg-flow rtg-prematch">
  <DivisionBanner c={c} compact/>
  <div className="rtg-prematch-heading"><span className="rtg-eyebrow">ROUND {f.round} / 18 · {f.home?'AT HOME':'AWAY AT '+(f.opp.venue||'THE STADIUM').toUpperCase()}</span><h1>{f.opp.nickname||'The next challenge'}.</h1><p>{DIVISION_CONFIG[c.tier].description}</p><div className="rtg-matchday-bonuses"><span>◆ FORM {boost.confidence>=0?'+':''}{boost.confidence}</span><span>♬ CROWD +{boost.crowd}</span><span>★ REP {c.reputation}</span></div></div>
  <div className="rtg-matchscore rtg-matchscore-before"><div><Badge club={club}/><strong>{c.club}</strong><small>ATT {stats.attack} / DEF {stats.defence}</small></div><span>VS</span><div><RivalBadge rival={f.opp}/><strong>{f.opp.name}</strong><small>{Math.round(f.opp.strength)} OVR · {rivalStyle.toUpperCase()}</small></div></div>
  <div className="rtg-opponent-scout">
   <div className="rtg-opponent-mark" style={{'--rival-ink':f.opp.color||'#9eaeaa'}}>◈</div>
   <div><span className="rtg-eyebrow">SCOUTING REPORT · {f.opp.name.toUpperCase()}</span><h2>{f.opp.trait||'Tough opposition'}</h2><p>{rivalStyle==='press'?'They hunt the ball high up the pitch. There is space behind them.':rivalStyle==='counter'?'They sit deep and explode forward when you lose possession.':'A well-drilled side that makes you work for every chance.'}</p></div>
   <div className="rtg-scout-tip"><small>YOUR {TACTICS[c.tactic].label.toUpperCase()} STYLE</small><strong className={matchup.advantage>0?'rtg-positive':matchup.advantage<0?'rtg-negative':''}>{matchup.label}</strong><span>{best.style.id!==c.tactic?'Opportunity: '+best.style.title+' would counter their approach.':'Your usual approach suits this opponent.'}</span></div>
  </div>
  <section className="rtg-panel rtg-prematch-plan"><div className="rtg-panel-top"><span className="rtg-eyebrow">YOUR CLUB IDENTITY</span><Pill tone="lime">{TACTICS[c.tactic].label.toUpperCase()} · SAVED</Pill></div>
   <p className="rtg-subcopy">Your style carries into every match. Keep it unless the scouting report gives you a reason to switch.</p>
   <div className="rtg-plan-cards">{styles.map(st=>{const edge=tacticalMatchup(st.id,rivalStyle);return <button type="button" className={'rtg-plan-card '+(c.tactic===st.id?'selected':'')} key={st.id} onClick={()=>onTactic(st.id)}>
    <span className="rtg-plan-icon">{st.icon}</span><strong>{st.title}</strong><b className={edge.advantage>0?'rtg-positive':edge.advantage<0?'rtg-negative':''}>{edge.advantage>0?'+':''}{edge.advantage} MATCHUP ATT</b><small>{st.effect}</small>{c.tactic===st.id&&<span className="rtg-plan-selected">✓ YOUR STYLE</span>}</button>})}</div>
  </section>
  <div className="rtg-ready-kickoff"><div><span className="rtg-eyebrow">THE MANAGER HAS SPOKEN</span><strong>Everything is decided before kickoff.</strong><p>{youth?youth.name+' is developing with the reserves while your first team chases three points.':'The first team is ready for 90 minutes.'} No halftime interruptions.</p></div><div className="rtg-kickoff-actions"><button type="button" className="rtg-button primary xl" onClick={onStart}>▶ PLAY FULL MATCH →</button></div></div>
  <button type="button" className="rtg-textbutton rtg-prematch-back" onClick={()=>go('home')}>← BACK TO CLUBHOUSE</button>
 </div>;
}
function Match({c,onFinish}){
 const m=c.match,f=m.fixture,club=CLUBS.find(x=>x.id===c.id),ours=m.first.filter(e=>e.goal&&e.side==='you').length,theirs=m.first.filter(e=>e.goal&&e.side!=='you').length;
 const situation=ours>theirs?'YOU HAVE THE LEAD.':ours<theirs?'YOU NEED A RESPONSE.':'IT IS ALL TO PLAY FOR.';
 return <div className="rtg-flow rtg-matchview">
  <div className="rtg-halftime-top"><div><span className="rtg-eyebrow">ROUND {f.round} · 45 MINUTES PLAYED</span><h1>Half-time.</h1></div><Pill tone="lime">45′ / 90′ · DECISION REQUIRED</Pill></div>
  <div className="rtg-matchscore rtg-matchscore-half"><div><Badge club={club}/><strong>{c.club}</strong></div><span>{ours} <small>–</small> {theirs}</span><div><span className="rtg-rivalbadge">⚑</span><strong>{f.opp.name}</strong></div></div>
  <section className="rtg-half-action">
   <div className="rtg-half-action-heading"><div><span className="rtg-eyebrow">YOUR HALF-TIME TEAM TALK</span><h2>{situation}</h2></div><p>Pick one. Your call changes the second-half chances.</p></div>
   <div className="rtg-half-action-grid">
    <button type="button" onClick={()=>onFinish('push')}><span>↗ GO FOR THE WIN</span><strong>PUSH FORWARD</strong><p>More shots and more goals — but leave gaps for a counter.</p><b>ATT +10 · DEF −9 <i>→</i></b></button>
    <button type="button" onClick={()=>onFinish('hold')}><span>◆ STICK WITH IT</span><strong>TRUST YOUR PLAN</strong><p>Keep playing your way. Balanced risk and reward.</p><b>NO CHANGE <i>→</i></b></button>
    <button type="button" onClick={()=>onFinish('protect')}><span>▣ SEE IT OUT</span><strong>SHUT THE DOOR</strong><p>Defend your box, cut out danger and play for the result.</p><b>DEF +9 · ATT −5 <i>→</i></b></button>
   </div>
  </section>
  <div className="rtg-firsthalf-summary"><span>FIRST HALF · PLAYED</span><div className="rtg-commentary">{m.first.map((e,i)=><div key={i} className={'rtg-event '+(e.goal?'goal':'')}><span>{e.minute}'</span><p>{e.goal?(e.side==='you'?'⚽ '+e.name+' scores!':'⚑ Goal for '+f.opp.name):e.name}</p></div>)}</div></div>
 </div>;
}
function Report({c,onContinue}){
 const r=c.report,club=CLUBS.find(x=>x.id===c.id);
 const positive=r.result==='WIN';
 const resultText=positive?'THREE POINTS!':r.result==='DRAW'?'POINT EARNED.':'WE GO AGAIN.';
 const developments=[...(r.promotions||[]),...(r.youth||[]),...(r.growth||[])];
 return <div className="rtg-flow rtg-reportview rtg-reportcompact">
  <div className="rtg-result-header"><div><span className="rtg-eyebrow">FULL TIME · MATCH {r.fixture.round}/18</span><h1 className={positive?'wintext':r.result==='LOSS'?'losstext':''}>{resultText}</h1></div>
   <button type="button" className="rtg-button primary rtg-report-top-action" onClick={onContinue}>{c.seasonComplete?'END OF SEASON':c.checkpoint?'CHAPTER REWARD':'CONTINUE'} →</button>
  </div>
  <div className="rtg-matchscore result"><div><Badge club={club}/><strong>{c.club}</strong></div><span>{r.ours} <small>–</small> {r.theirs}</span><div><RivalBadge rival={r.fixture.opp}/><strong>{r.fixture.opp.name}</strong></div></div>
  {c.currentTrophy&&<div className="rtg-match-honour"><span>{c.currentTrophy.icon}</span><strong>CHAMPIONS! {c.currentTrophy.label.toUpperCase()} · TROPHY ADDED TO CABINET</strong></div>}
  <div className={'rtg-crowd-pulse '+(positive?'celebrate':'')}><div className="rtg-crowd-icon">♬ <span>◉</span> ♬</div><div><span className="rtg-eyebrow">FROM THE TERRACES</span><h2>{positive?'THE TOWN IS ROARING.':r.result==='DRAW'?'THE SUPPORTERS STAND WITH YOU.':'TIME TO BOUNCE BACK.'}</h2><p>{positive?'Your supporters and club form have grown.':r.result==='DRAW'?'A point on the board, and more to come.':'The next match is a chance to turn it around.'}</p></div></div>
  <div className="rtg-result-stats rtg-fulltime-stats">
   <div><span>LEAGUE</span><strong>{ordinal(r.tablePosition)}</strong></div>
   <div><span>SUPPORTERS</span><strong>{c.supporters.toLocaleString('en-GB')}</strong><em className={r.supportersChange>=0?'rtg-positive':'rtg-negative'}>{r.supportersChange>0?'+':''}{r.supportersChange}</em></div>
   <div><span>CLUB FORM</span><strong>{c.momentum}</strong><em className={r.momentumChange>=0?'rtg-positive':'rtg-negative'}>{r.momentumChange>0?'+':''}{r.momentumChange}</em></div>
   <div><span>REPUTATION</span><strong>{c.reputation}</strong><em className={r.reputationChange>=0?'rtg-positive':'rtg-negative'}>{r.reputationChange>0?'+':''}{r.reputationChange}</em></div>
   <div><span>INCOME</span><strong>{formatCash(r.earned)}</strong></div>
   <div><span>MATCH HERO</span><strong className="rtg-stat-small">{r.topScorer||'The Team'}</strong></div>
  </div>
  {developments.length>0&&<div className="rtg-postmatch-develop"><span>✦ PLAYER DEVELOPMENT</span><strong>{developments.slice(0,4).join(' · ')}</strong>{developments.length>4&&<small>+{developments.length-4} others</small>}</div>}
  <details className="rtg-match-details"><summary>90' MATCH HIGHLIGHTS <span>⌄</span></summary><div className="rtg-commentary report">{r.events.filter(e=>e.goal).length?r.events.filter(e=>e.goal).map((e,i)=><div key={i} className="rtg-event goal"><span>{e.minute}'</span><p>{e.side==='you'?'⚽ '+e.name+' scores!':'⚑ '+r.fixture.opp.name+' score.'}</p></div>):<p className="rtg-empty">Neither side found the net.</p>}</div></details>
 </div>;
}

function SigningReveal({c,go}){
 const s=c.lastSigning;if(!s)return null;
 const gains=[{label:'ATTACK',n:s.attack},{label:'DEFENCE',n:s.defence},{label:'TEAM OVR',n:s.overall}];
 return <div className="rtg-flow rtg-signing-scene"><Pill tone="lime">TRANSFER CONFIRMED · {c.club.toUpperCase()}</Pill>
  <div className="rtg-signed-banner"><span>✓ DEAL COMPLETED</span><h1>WELCOME TO<br/><em>{c.club.toUpperCase()}.</em></h1><p>Contract signed. Medical passed. The supporters have a new name to sing.</p></div>
  <div className="rtg-signing-reveal-card"><div className="rtg-signing-player-avatar">{s.name[0]}</div><div><span className="rtg-eyebrow">{s.role} · {s.age} YEARS OLD · {s.ovr} OVERALL</span><h2>{s.name}</h2><p>{s.upgrade>0?'Takes the starting spot from '+s.oldName+'.':s.age<=22?'One for the future — keep an eye on his development.':'Adds depth and competition for places.'}</p></div><div className="rtg-signing-ovr">{s.ovr}<small>OVR</small></div></div>
  <div className="rtg-signing-payoff"><div><span>PREVIOUS {s.role}</span><strong>{s.oldRating}</strong><small>{s.oldName}</small></div><div className="rtg-signing-arrow">→</div><div className="after"><span>NEW {s.role}</span><strong>{s.ovr}</strong><small>{s.upgrade>0?'+'+s.upgrade+' AT THE POSITION':'FUTURE POTENTIAL '+s.potential}</small></div></div>
  <div className="rtg-match-rewards rtg-signing-rewards">{gains.map(g=><div key={g.label}><span>{g.label} IMPACT</span><strong className={g.n>0?'rtg-positive':''}>{g.n>0?'+'+g.n:'0'}</strong></div>)}</div>
  <div className="rtg-notebox"><span>✦ Supporters +{s.supportersChange} · {formatCash(s.budget)} remains in the transfer budget. This chapter's transfer window is now closed.</span></div>
  <div className="rtg-signing-actions"><button className="rtg-button secondary" onClick={()=>go('squad')}>VIEW YOUR NEW XI</button><button className="rtg-button primary xl" onClick={()=>go('prematch')}>PREPARE FOR THE NEXT MATCH →</button></div>
 </div>;
}
function Checkpoint({c,onPick}){
 const best=(positions)=>[...c.roster].filter(p=>positions.includes(p.role)).sort((a,b)=>b.ovr-a.ovr).slice(0,2);
 const attacking=best(['ST','LW','RW','CAM']),defending=best(['GK','CB','LB','RB']);
 const boost=(xs)=>xs.map((x,i)=>x?Math.min(x.potential-x.ovr,i===0?5:3):0);
 const atk=boost(attacking),def=boost(defending),space=c.roster.length<MAX_SQUAD;
 return <div className="rtg-flow rtg-checkpoint"><DivisionBanner c={c} compact/><Pill tone="lime">CHAPTER {c.round/3} · BOARD MEETING</Pill>
  <h1>Where do we<br/><em>invest next?</em></h1><p>Three matches down. The coaches can deliver one intensive training block, or the academy can bring up a youngster. Choose your next move.</p>
  <div className="rtg-decision-grid">
   <button type="button" onClick={()=>onPick('attack')}><span>01 / ATTACK TRAINING</span><div>⚡</div><h3>Find more goals.</h3><p><strong>{attacking[0]?.name}: +{atk[0]||0} OVR</strong>{attacking[1]&&<><br/>{attacking[1].name}: +{atk[1]||0} OVR</>}</p><small>Immediate improvement, capped by potential.</small><b>TRAIN THE ATTACK →</b></button>
   <button type="button" onClick={()=>onPick('defence')}><span>02 / DEFENSIVE DRILLS</span><div>▣</div><h3>Stop conceding.</h3><p><strong>{defending[0]?.name}: +{def[0]||0} OVR</strong>{defending[1]&&<><br/>{defending[1].name}: +{def[1]||0} OVR</>}</p><small>Strengthen your back line for the next three games.</small><b>TRAIN THE DEFENCE →</b></button>
   <button type="button" disabled={!space} onClick={()=>onPick('academy')}><span>03 / YOUTH ACADEMY</span><div>★</div><h3>Take a chance.</h3><p><strong>{space?'One new academy player':'Squad full — 20/20'}</strong><br/>Aged 16–18 · Trains automatically on the bench</p><small>{space?'A future starter could emerge in a few matches.':'Pick training now or accept an outgoing bid next chapter.'}</small><b>{space?'PROMOTE A YOUNGSTER →':'NO SPACE AVAILABLE'}</b></button>
  </div>
 </div>;
}
function SaleReveal({c,go}){
 const p=c.lastSale;if(!p)return null;
 return <div className="rtg-flow rtg-signing-scene"><Pill tone="lime">TRANSFER OUT · CONFIRMED</Pill>
 <div className="rtg-signed-banner"><span>DEAL DONE · {p.buyer.toUpperCase()}</span><h1>FAREWELL,<br/><em>{p.name.toUpperCase()}.</em></h1><p>{p.wasStarter?'A first-team favourite has departed. Now it is time for somebody else to step up.':'A squad player moves on to find more football.'}</p></div>
 <div className="rtg-signing-payoff"><div><span>PLAYER SOLD</span><strong>{p.ovr}</strong><small>{p.role} · {p.age} YEARS</small></div><div className="rtg-signing-arrow">→</div><div className="after"><span>TRANSFER MONEY</span><strong>{formatCash(p.fee)}</strong><small>ADDED TO YOUR CLUB BUDGET</small></div></div>
 <div className="rtg-notebox"><strong>{p.teamChange<0?p.teamChange+' team OVR · Can you replace him?':'Your overall team rating is unchanged.'}</strong><span>{p.fansChange>=0?'+':''}{p.fansChange} supporters · {c.roster.length}/{MAX_SQUAD} squad places filled.</span></div>
 <div className="rtg-signing-actions"><button className="rtg-button secondary" onClick={()=>go('squad')}>VIEW SQUAD</button><button className="rtg-button primary xl" onClick={()=>go('market')}>REBUILD WITH THE MONEY →</button></div>
 </div>;
}

function ChapterReward({c,go}){
 const choice=c.lastChoice;
 if(!choice)return null;
 const label=choice.type==='academy'?'ACADEMY INTAKE':'COACHING REPORT';
 return <div className="rtg-flow rtg-chapter-reward"><Pill tone="lime">CHAPTER COMPLETED · CLUB IMPROVED</Pill><h1>{choice.type==='academy'?'A new face in the squad.':choice.type==='attack'?'Ready to score.':'Ready to defend.'}</h1>
  <div className="rtg-chapter-reward-box"><span>✦ {label}</span><strong>{choice.message}</strong><p>The players return to training, and the scouts have filed five new reports. The next chapter begins now.</p></div>
  <div className="rtg-reward-next"><div><span className="rtg-eyebrow">UP NEXT · ROUND {c.round+1}</span><h3>{nextFixture(c)?.opp.name}</h3><small>Transfer window reopened · {formatCash(c.budget)} available</small></div><button type="button" className="rtg-button primary xl" onClick={()=>go('home')}>BACK TO CLUBHOUSE →</button></div>
 </div>;
}

function DivisionIntro({c,go}){
 const d=DIVISION_CONFIG[c.tier],r=c.careerResults?.[c.careerResults.length-1],promoted=r?.promoted;
 return <div className="rtg-flow rtg-division-intro">
  <div className="rtg-division-intro-hero"><span className="rtg-eyebrow">SEASON {c.season} BEGINS · NEW FIXTURES</span><div className="rtg-division-intro-icon">{d.icon}</div>
   <h1>{promoted?'WELCOME TO THE':r?.relegated?'A CHANCE TO REBUILD IN':'ANOTHER SHOT AT THE'}<br/><em>{DIVISIONS[c.tier].toUpperCase()}.</em></h1>
   <p>{d.description}</p><div className="rtg-division-intro-stats"><span>NEW SEASON: {c.season}/5</span><span>18 MATCHES</span><span>TRANSFER FUNDS {formatCash(c.budget)}</span></div>
  </div>
  <section className="rtg-panel"><div className="rtg-panel-top"><span className="rtg-eyebrow">THE TEAMS WAITING FOR YOU</span><Pill>FRESH OPPOSITION</Pill></div>
   <div className="rtg-new-rivals">{c.rivals.slice(0,3).map(rival=><div key={rival.id}><RivalBadge rival={rival}/><strong>{rival.name}</strong><small>{rival.nickname} · {rival.style.toUpperCase()}</small></div>)}</div>
  </section>
  <button type="button" className="rtg-button primary xl" onClick={()=>go('home')}>ENTER THE NEW SEASON →</button>
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
 const advance=()=>{act(advanceSeason);go('division-intro');};
 const finish=choice=>{act(s=>finishMatch(s,choice));go('result');};
 const continueReport=()=>{const next=c.seasonComplete?'season':c.checkpoint?'checkpoint':'home';act(dismissReport);go(next);};
 const choose=choice=>{act(s=>chapterChoice(s,choice));go('chapter-reward');};
 const startFirstHalf=()=>{act(quickSim);go('result');};
 const quickMatch=()=>{act(quickSim);go('result');};
 const archive=()=>{act(archiveCareer);go('home');};
 const importGame=s=>{setGame(s);go('home');setNotice('Save imported successfully.');};
 if(!c)return <Landing legacy={game.legacy} onStart={start} onImport={importGame}/>;
 const club=CLUBS.find(x=>x.id===c.id);
 let activeView=c.report&&view==='result'?'result':c.match&&view==='match'?'match':view;
 if(!['home','market','squad','league','almanac','result','match','prematch','signing','sale','division-intro','checkpoint','chapter-reward','season'].includes(activeView))activeView='home';
 if(activeView==='result'&&!c.report)activeView='home';
 if(activeView==='match'&&!c.match)activeView='home';
 if(activeView==='prematch'&&(c.match||c.report||c.checkpoint||c.seasonComplete))activeView='home';
 if(activeView==='signing'&&!c.lastSigning)activeView='home';
 if(activeView==='sale'&&!c.lastSale)activeView='home';
 if(activeView==='division-intro'&&c.season<=1)activeView='home';
 if(activeView==='chapter-reward'&&!c.lastChoice)activeView='home';
 if(activeView==='checkpoint'&&!c.checkpoint)activeView='home';
 if(activeView==='season'&&!c.seasonComplete)activeView='home';
 const special=['prematch','result','match','checkpoint','chapter-reward','signing','sale','division-intro','season'].includes(activeView);
 return <div className={'rtg-app rtg-division-'+DIVISION_CONFIG[c.tier].key}><aside className="rtg-sidebar">
    <a className="rtg-brand" href="/"><span className="rtg-brand-symbol">R<span>✦</span></span><div><strong>ROAD TO GLORY</strong><small>POCKET EDITION</small></div></a>
    <div className="rtg-sideclub"><Badge club={club}/><div><span>THE MANAGER OF</span><strong>{c.club}</strong><small>{DIVISIONS[c.tier]} · S{c.season}</small></div></div>
    <div className="rtg-sidelabel">THE CLUB</div><nav className="rtg-nav">{MENU.map(([id,icon,label])=><button type="button" key={id} className={view===id?'active':''} onClick={()=>go(id)}><span>{icon}</span>{label}{id==='market'&&!c.signed&&!c.checkpoint&&!c.report&&<i/>}</button>)}</nav>
    <div className="rtg-sidebar-bottom"><span>THE LONG ROAD</span><div className="rtg-season-dots">{Array.from({length:5},(_,i)=><i key={i} className={i<c.season?'passed':i===c.season-1?'active':''}/>)}</div><strong>Season {c.season} of 5</strong><small>Build something they'll remember.</small><a href="/" className="rtg-exit">← Back to Brainrot FC</a></div>
   </aside>
   <div className="rtg-shell"><header className="rtg-topbar"><div><span className="rtg-topbar-issue">THE FOOTBALL CHRONICLE</span><span className="rtg-topbar-title">S{c.season} · MATCHWEEK {Math.min(18,c.round+1)} / 18</span></div><div className="rtg-topbar-right"><span className="rtg-live-dot"/> <span className="rtg-topbar-save">AUTO SAVED</span> <span className="rtg-topbar-divider"/> <b className="rtg-topbar-fans">♬ {c.supporters.toLocaleString('en-GB')} FANS</b> <span className="rtg-topbar-divider"/> <b>{formatCash(c.budget)}</b></div></header>
    {notice&&<div className="rtg-notice" role="status">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
    <main className={'rtg-main '+(special?'rtg-main-special':'')}>
      {activeView==='home'&&<Dashboard c={c} go={go}/>}
      {activeView==='squad'&&<Squad c={c} act={act} go={go}/>}
      {activeView==='market'&&<Market c={c} act={act} go={go}/>}
      {activeView==='league'&&<League c={c}/>}
      {activeView==='almanac'&&<Almanac game={game} onImport={importGame}/>}
      {activeView==='prematch'&&<Prematch c={c} onStart={startFirstHalf} onTactic={id=>act(s=>chooseTactic(s,id))} go={go}/>}
      {activeView==='match'&&<Match c={c} onFinish={finish}/>}
      {activeView==='signing'&&<SigningReveal c={c} go={go}/>}
      {activeView==='sale'&&<SaleReveal c={c} go={go}/>}
      {activeView==='division-intro'&&<DivisionIntro c={c} go={go}/>}
      {activeView==='chapter-reward'&&<ChapterReward c={c} go={go}/>}
      {activeView==='result'&&<Report c={c} onContinue={continueReport}/>}
      {activeView==='checkpoint'&&<Checkpoint c={c} onPick={choose}/>}
      {activeView==='season'&&<SeasonEnd c={c} onAdvance={advance} onArchive={archive}/>}
      
    </main><footer className="rtg-footer">ROAD TO GLORY / A FOOTBALL-FIRST ARCADE CAREER <span>YOUR STORY. YOUR RULES.</span></footer>
   </div>
   <nav className="rtg-mobile-nav">{MENU.map(([id,icon,label])=><button key={id} type="button" className={view===id?'active':''} onClick={()=>go(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>
  </div>;
}
