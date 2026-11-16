import React,{useEffect,useMemo,useRef,useState} from 'react';
import {CLUBS,DIVISIONS,ROLES,TACTICS,SAVE_KEY,VERSION,freshState,startCareer,lineup,profile,teamRating,nextFixture,standings,signPlayer,scoutPlayer,chooseTactic,kickoff,finishMatch,quickSim,dismissReport,chapterChoice,advanceSeason,archiveCareer,seasonSummary,formatCash,ordinal,validState,transferPreview,passMarket} from './engine.js';
import './road-to-glory.css';

function loadGame(){
 try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const s=JSON.parse(raw);
   if(s.version===VERSION&&s.career){
    // Migrate prototype saves without wiping the manager's current career.
    const c=s.career;
    if(typeof c.supporters!=='number')c.supporters=900;
    if(typeof c.momentum!=='number')c.momentum=50;
    if(typeof c.reputation!=='number')c.reputation=10;
    c.tacticChosen=!!c.tacticChosen;c.windowPassed=!!c.windowPassed;
   }
   if(validState(s))return s;}}
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
 const prepared=[
  {done:c.scouted||c.signed||c.windowPassed,title:'Read the scouting report',detail:c.scouted?'Prospect ceiling revealed.':c.signed?'Transfer business settled.':c.windowPassed?'Market window passed.':'One free full scouting report this chapter.',cta:'SCOUT',target:'market'},
  {done:c.signed||c.windowPassed,title:'Decide on a signing',detail:c.signed?(c.lastSigning?.name||'New signing')+' is in the squad.':c.windowPassed?'Cash banked for a future window.':'One deal available. Or keep your cash.',cta:'TRANSFERS',target:'market'},
  {done:c.tacticChosen,title:'Choose your match plan',detail:c.tacticChosen?TACTICS[c.tactic].label+' selected.':'Balanced, High Press, or Counter.',cta:'SET TACTICS',target:'prematch'}
 ];
 const complete=prepared.filter(a=>a.done).length;
 return <div className="rtg-flow">
  <div className="rtg-hero">
   <div className="rtg-hero-copy"><span className="rtg-eyebrow">SEASON {c.season} / CHAPTER {Math.min(6,Math.floor(c.round/3)+1)} <span className="rtg-bullet">●</span> {DIVISIONS[c.tier]}</span>
    <h1>{c.round===0?'The season begins.':c.momentum>=65?'The town believes.':c.momentum<36?'Time to fight back.':'The next match awaits.'}<br/><em>{c.club}.</em></h1>
    <p>{c.memories[0]||'Your first match is coming. The transfer window is open and the fans are watching.'}</p>
    <div className="rtg-hero-actions">
     <button className="rtg-button primary" onClick={()=>go(next||'prematch')}>{next?'CONTINUE YOUR SEASON':'GO TO MATCHDAY'} <span>→</span></button>
     {!next&&<button className="rtg-button secondary" onClick={()=>go('market')}>TRANSFER WINDOW</button>}
    </div>
   </div>
   <div className="rtg-hero-art"><span className="rtg-huge-crest">{club.crest}</span><span className="rtg-hero-ribbon">THE ROAD TO GLORY</span></div>
  </div>
  <div className="rtg-metrics rtg-metrics-six">
   <DotStat label="LEAGUE POSITION" value={ordinal(position)}/>
   <DotStat label="TEAM RATING" value={p.overall+' OVR'}/>
   <DotStat label="TRANSFER FUNDS" value={formatCash(c.budget)}/>
   <DotStat label="SUPPORTERS" value={c.supporters.toLocaleString('en-GB')}/>
   <DotStat label="CLUB FORM" value={c.momentum+'/100'}/>
   <DotStat label="REPUTATION" value={c.reputation+'/100'}/>
  </div>
  <div className="rtg-dashboard-grid rtg-matchday-grid">
   <section className="rtg-panel fixture">
    <div className="rtg-panel-top"><span className="rtg-eyebrow">{f?'NEXT MATCH · ROUND '+f.round:'SEASON COMPLETE'}</span><Pill>{f?.home?'HOME MATCH':'AWAY MATCH'}</Pill></div>
    {f?<><div className="rtg-fixture"><div><Badge club={club}/><strong>{c.club}</strong><small>RATING {p.overall}</small></div><span className="rtg-vs">VS</span><div><span className="rtg-rivalbadge">⚑</span><strong>{f.opp.name}</strong><small>RATING {Math.round(f.opp.strength)}</small></div></div>
     <div className="rtg-fixture-bottom"><span>{p.overall>f.opp.strength+5?'You go in as favourites.':p.overall<f.opp.strength-5?'The visitors will be tough to beat.':'Expect a closely fought match.'}</span><button className="rtg-textbutton" onClick={()=>go(next||'prematch')}>MATCHDAY →</button></div></>:<p className="rtg-empty">Season complete. Your final table is ready.</p>}
   </section>
   <section className="rtg-panel rtg-prep-panel">
    <div className="rtg-panel-top"><span className="rtg-eyebrow">MANAGER'S MATCHDAY NOTES</span><Pill tone={complete>=2?'win':''}>{complete}/3 READY</Pill></div>
    <h3>Before the whistle</h3>
    <div className="rtg-prep-list">{prepared.map((a,i)=><button type="button" key={i} className={'rtg-prep-item '+(a.done?'done':'')} onClick={()=>go(a.target)} disabled={!!next}>
      <span className="rtg-prep-check">{a.done?'✓':i+1}</span><span className="rtg-prep-copy"><strong>{a.title}</strong><small>{a.detail}</small></span><span className="rtg-prep-arrow">{a.done?'DONE':a.cta+' ↗'}</span>
     </button>)}</div>
    <div className="rtg-prep-footer"><small>These are optional. You can always go straight to kickoff.</small><button type="button" className="rtg-button primary" onClick={()=>go(next||'prematch')}> {next?'CONTINUE':'PLAY NEXT MATCH'} →</button></div>
   </section>
  </div>
  <div className="rtg-bottom-grid">
   <button type="button" className="rtg-featurelink" onClick={()=>go('market')}><span>↗ TRANSFER WINDOW</span><h3>Who joins<br/>the XI?</h3><small>{c.signed?'New signing: '+c.lastSigning?.name:c.windowPassed?'Funds reserved for next chapter.':'Five players on the shortlist.'}</small><b>OPEN TRANSFER OFFICE →</b></button>
   <button type="button" className="rtg-featurelink academy" onClick={()=>go('squad')}><span>✦ THE DRESSING ROOM</span><h3>Meet your<br/>match winners.</h3><small>{c.roster.slice().sort((a,b)=>b.stats.goals-a.stats.goals)[0]?.name} leads the goals chart.</small><b>VIEW FIRST TEAM →</b></button>
  </div>
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
 const canBuy=!c.signed&&!c.windowPassed&&!c.match&&!c.report&&!c.checkpoint&&!c.seasonComplete;
 const p=profile(c);
 const descriptors=[
  {style:'THE LONG GAME',sub:'Could become a star. Will need minutes.',risk:'BUILD FOR THE FUTURE'},
  {style:'THE STATEMENT SIGNING',sub:'A major boost right now. Little growth left.',risk:'WIN THIS SEASON'},
  {style:'THE CREATIVE SPARK',sub:'An immediate option with room to improve.',risk:'THE MIDDLE GROUND'},
  {style:'THE SAFE PAIR OF HANDS',sub:'Experienced, reliable and ready for pressure.',risk:'BUY EXPERIENCE'},
  {style:'THE BREAKOUT BET',sub:'Young, improving and not yet the finished player.',risk:'GROW YOUR OWN STAR'}
 ];
 return <div className="rtg-flow"><SectionHead eyebrow={'RECRUITMENT OFFICE · CHAPTER '+(Math.floor(c.round/3)+1)} title="Transfer shortlist" right={<div className="rtg-budget">CLUB FUNDS <strong>{formatCash(c.budget)}</strong></div>}/>
  <div className="rtg-market-intro rtg-window-brief"><span className="rtg-market-icon">⌁</span><div><strong>The board has room for one signing.</strong><p>Do we spend big to win now, back a teenager for later, or strengthen another position? You can scout one player for free before deciding. Your current squad: ATT {p.attack} · DEF {p.defence}.</p></div></div>
  {c.signed&&<div className="rtg-market-closed"><span>✓</span><div><strong>TRANSFER COMPLETED</strong><p>{c.lastSigning?.name} has joined {c.club}. The transfer window reopens after the next three matches.</p></div><button type="button" className="rtg-button primary" onClick={()=>go('signing')}>SEE THE SIGNING →</button></div>}
  {c.windowPassed&&<div className="rtg-market-closed"><span>£</span><div><strong>FUNDS HELD BACK</strong><p>You've kept {formatCash(c.budget)} for the next transfer window.</p></div></div>}
  <div className="rtg-market-grid">{c.market.map((candidate,i)=>{
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
      <button type="button" className="rtg-button primary small" disabled={!canBuy||!affordable} onClick={()=>{act(s=>signPlayer(s,candidate.id));go('signing');}}>{!affordable?'CAN’T AFFORD':!canBuy?'WINDOW CLOSED':'SIGN FOR '+formatCash(candidate.fee)+' →'}</button>
     </div></div>
   </article>;
  })}</div>
  <div className="rtg-notebox"><span>{canBuy?'One deal only. There will be another shortlist after three matches.':'Your transfer decision is locked in for this chapter.'}</span>{canBuy&&<button type="button" className="rtg-button secondary" onClick={()=>{act(passMarket);go('home');}}>KEEP THE CASH →</button>}<button type="button" className="rtg-textbutton" onClick={()=>go('home')}>BACK TO CLUBHOUSE →</button></div>
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
function Prematch({c,onStart,onTactic,go}){
 const f=nextFixture(c),club=CLUBS.find(x=>x.id===c.id),stats=profile(c);
 if(!f)return null;
 const styles=[
  {id:'balanced',icon:'◆',title:'Balanced',effect:'Even in attack and defence',foot:'Trust the players'},
  {id:'press',icon:'↗',title:'High Press',effect:'ATT +8 · DEF −6',foot:'More chances. More space behind.'},
  {id:'counter',icon:'↯',title:'Counter',effect:'ATT +2 · DEF +5',foot:'Stay solid. Hit them on the break.'}
 ];
 return <div className="rtg-flow rtg-prematch">
  <div className="rtg-prematch-heading"><span className="rtg-eyebrow">MATCHDAY {f.round} / 18 · {f.home?'HOME':'AWAY'} · SEASON {c.season}</span><h1>It's matchday.</h1><p>The team is in. The fans are arriving. Pick your approach, then blow the whistle.</p></div>
  <div className="rtg-matchscore rtg-matchscore-before"><div><Badge club={club}/><strong>{c.club}</strong><small>ATT {stats.attack} / DEF {stats.defence}</small></div><span>VS</span><div><span className="rtg-rivalbadge">⚑</span><strong>{f.opp.name}</strong><small>TEAM {Math.round(f.opp.strength)}</small></div></div>
  <section className="rtg-panel rtg-prematch-plan"><div className="rtg-panel-top"><span className="rtg-eyebrow">01 / PICK A MATCH PLAN</span><Pill tone={c.tacticChosen?'win':''}>{c.tacticChosen?'PLAN SELECTED':'YOUR CALL'}</Pill></div>
    <div className="rtg-plan-cards">{styles.map(st=><button type="button" className={'rtg-plan-card '+(c.tactic===st.id?'selected':'')} key={st.id} onClick={()=>onTactic(st.id)}>
      <span className="rtg-plan-icon">{st.icon}</span><strong>{st.title}</strong><b>{st.effect}</b><small>{st.foot}</small>{c.tactic===st.id&&<span className="rtg-plan-selected">✓ SELECTED</span>}
    </button>)}</div>
   </section>
  <div className="rtg-ready-kickoff"><div><span className="rtg-eyebrow">02 / THE REFEREE IS READY</span><strong>First half: 0′ → 45′</strong><p>We'll play the first half, show you the score and chances, then you'll make a halftime decision.</p></div><button type="button" className="rtg-button primary xl" onClick={onStart}>▶ PLAY FIRST HALF →</button></div>
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
 const r=c.report,club=CLUBS.find(x=>x.id===c.id),supportersChange=r.supportersChange??0,formChange=r.momentumChange??0,repChange=r.reputationChange??0;
 const crowd=r.result==='WIN'?'THE TOWN IS ROARING.':r.result==='DRAW'?'THE FANS STAND WITH YOU.':'THE FANS EXPECT A RESPONSE.';
 return <div className="rtg-flow rtg-reportview">
  <div className="rtg-result-header"><span className="rtg-eyebrow">FULL TIME · ROUND {r.fixture.round}</span><h1 className={r.result==='WIN'?'wintext':r.result==='LOSS'?'losstext':''}>{r.result==='WIN'?'THREE POINTS!':r.result==='LOSS'?'BACK TO WORK.':'A HARD-FOUGHT POINT.'}</h1></div>
  <div className="rtg-matchscore result"><div><Badge club={club}/><strong>{c.club}</strong></div><span>{r.ours} <small>–</small> {r.theirs}</span><div><span className="rtg-rivalbadge">⚑</span><strong>{r.fixture.opp.name}</strong></div></div>
  <div className={'rtg-crowd-pulse '+(r.result==='WIN'?'celebrate':'')}><div className="rtg-crowd-icon">♬ <span>◉</span> ♬</div><div><span className="rtg-eyebrow">IN THE STANDS</span><h2>{crowd}</h2><p>{r.result==='WIN'?'Victory travels fast. More fans are turning up every week.':r.result==='DRAW'?'The supporters can see your team fighting.':'A tough afternoon. Turn it around next week.'}</p></div></div>
  <div className="rtg-result-stats rtg-match-rewards">
   <div><span>SUPPORTERS</span><strong>{c.supporters.toLocaleString('en-GB')}</strong><em className={supportersChange>=0?'rtg-positive':'rtg-negative'}>{supportersChange>=0?'+':''}{supportersChange} fans</em></div>
   <div><span>CLUB FORM</span><strong>{c.momentum}/100</strong><em className={formChange>=0?'rtg-positive':'rtg-negative'}>{formChange>=0?'+':''}{formChange} this match</em></div>
   <div><span>REPUTATION</span><strong>{c.reputation}/100</strong><em className={repChange>=0?'rtg-positive':'rtg-negative'}>{repChange>=0?'+':''}{repChange} standing</em></div>
  </div>
  <div className="rtg-result-stats"><div><span>LEAGUE POSITION</span><strong>{ordinal(r.tablePosition)}</strong></div><div><span>MATCHDAY INCOME</span><strong>{formatCash(r.earned)}</strong></div><div><span>MATCH HERO</span><strong className="rtg-stat-small">{r.topScorer||'The Team'}</strong></div></div>
  {r.growth.length>0&&<div className="rtg-growthbox"><span>✦ DEVELOPMENT REPORT</span><strong>{r.growth.join(' · ')}</strong><small>Your players are getting better with match experience.</small></div>}
  <div className="rtg-panel rtg-report-highlights"><div className="rtg-panel-top"><span className="rtg-eyebrow">MATCH HIGHLIGHTS</span><span className="rtg-small">90 MINUTES</span></div><div className="rtg-commentary report">{r.events.filter(e=>e.goal).length?r.events.filter(e=>e.goal).map((e,i)=><div key={i} className="rtg-event goal"><span>{e.minute}'</span><p>{e.side==='you'?'⚽ '+e.name+' scores!':'⚑ '+r.fixture.opp.name+' score.'}</p></div>):<p className="rtg-empty">Neither side found the net.</p>}</div></div>
  <button type="button" className="rtg-button primary xl rtg-report-continue" onClick={onContinue}>{c.seasonComplete?'SEE FINAL LEAGUE TABLE':c.checkpoint?'OPEN YOUR CHAPTER REWARD':'BACK TO CLUBHOUSE'} <span>→</span></button>
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
 const atk=boost(attacking),def=boost(defending);
 return <div className="rtg-flow rtg-checkpoint"><Pill tone="lime">CHAPTER {c.round/3} · BOARD MEETING</Pill>
  <h1>Where do we<br/><em>invest next?</em></h1><p>The next three fixtures are on the calendar. The coaches can deliver one intensive training block, or the academy can bring up a youngster. Choose your next move.</p>
  <div className="rtg-decision-grid">
   <button type="button" onClick={()=>onPick('attack')}><span>01 / ATTACK TRAINING</span><div>⚡</div><h3>Find more goals.</h3><p><strong>{attacking[0]?.name}: +{atk[0]||0} OVR</strong>{attacking[1]&&<><br/>{attacking[1].name}: +{atk[1]||0} OVR</>}</p><small>Immediate improvement. Limited by each player's potential.</small><b>TRAIN THE ATTACK →</b></button>
   <button type="button" onClick={()=>onPick('defence')}><span>02 / DEFENSIVE DRILLS</span><div>▣</div><h3>Stop conceding.</h3><p><strong>{defending[0]?.name}: +{def[0]||0} OVR</strong>{defending[1]&&<><br/>{defending[1].name}: +{def[1]||0} OVR</>}</p><small>Boost your back line before the next big match.</small><b>TRAIN THE DEFENCE →</b></button>
   <button type="button" onClick={()=>onPick('academy')}><span>03 / YOUTH ACADEMY</span><div>★</div><h3>Take a chance.</h3><p><strong>One new academy player</strong><br/>Aged 16–18 · High growth ceiling</p><small>Unknown position and current rating. Your next hero could be waiting.</small><b>PROMOTE A YOUNGSTER →</b></button>
  </div>
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
