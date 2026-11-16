import test from 'node:test';
import assert from 'node:assert/strict';
import {
 freshState,startCareer,CLUBS,ROLES,FIXTURES,validState,lineup,teamRating,
 signPlayer,scoutPlayer,chooseTactic,transferPreview,passMarket,migrateState,clubBoost,MAX_SQUAD, DIVISION_CONFIG, growthWatch,tacticalMatchup,resolveOffseason,startingChoices,kickoff,finishMatch,quickSim,dismissReport,
 chapterChoice,advanceSeason,archiveCareer,standings,seasonSummary
} from '../src/rtg/engine.js';

test('thirteen clubs create complete and distinct valid careers',()=>{
 const values=CLUBS.map(club=>{
  const s=startCareer(freshState(),club.id,101);
  assert.ok(validState(s));assert.equal(s.career.roster.length,15);
  assert.equal(s.career.market.length,5);assert.equal(lineup(s.career).length,11);
  assert.equal(new Set(s.career.roster.map(p=>p.id)).size,15);
  assert.equal(s.career.table.length,10);
  return s.career.budget;
 });
 assert.equal(CLUBS.length,13);
 assert.ok(new Set(values).size>=7,'budgets have genuinely different levels');
});
test('five-target transfer shortlist has no phantom signings and respects budget',()=>{
 let s=startCareer(freshState(),'northstar',42);
 assert.equal(s.career.market.length,5);
 const offer=s.career.market.find(p=>p.fee<=s.career.budget);
 assert.ok(offer);
 const original=s.career.budget;
 s=scoutPlayer(s,offer.id);
 assert.equal(s.career.scoutedId,offer.id);
 const deniedScout=scoutPlayer(s,s.career.market.find(p=>p.id!==offer.id).id);
 assert.equal(deniedScout.career.scoutedId,offer.id);
 s=signPlayer(s,offer.id);
 assert.equal(s.career.budget,original-offer.fee);
 assert.equal(s.career.roster.length,16);
 assert.ok(validState(s));
 const after=signPlayer(s,offer.id);
 assert.deepEqual(after,s);
});
test('a full 18-match season, all rival fixtures and table points',()=>{
 let s=startCareer(freshState(),'ironvale',1300);
 for(let i=0;i<18;i++){
  if(s.career.checkpoint) s=chapterChoice(s,i%2?'defence':'academy');
  assert.ok(validState(s));
  s=chooseTactic(s,i%3===0?'press':'counter');
  s=kickoff(s);
  assert.equal(s.career.match.first.length,4);
  s=finishMatch(s,i%2?'push':'protect');
  assert.ok(s.career.report);
  s=dismissReport(s);
  assert.ok(validState(s));
  assert.equal(s.career.round,i+1);
 }
 assert.ok(s.career.seasonComplete);
 assert.equal(s.career.table.reduce((total,r)=>total+r.p,0),180);
 assert.equal(s.career.table.reduce((total,r)=>total+r.w,0),
              s.career.table.reduce((total,r)=>total+r.l,0));
 assert.equal(standings(s.career).length,10);
 const results=s.career.seasonResults;
 assert.equal(results.length,18);
 assert.equal(new Set(results.map(r=>r.opponent)).size,9);
});
test('deterministic run and full five-season archive survives JSON readback',()=>{
 function play(seed){
  let s=startCareer(freshState(),'seabrook',seed);
  for(let season=1;season<=5;season++){
   for(let round=1;round<=18;round++){
    if(s.career.checkpoint)s=chapterChoice(s,round%2 || s.career.roster.length>=MAX_SQUAD?'attack':'academy');
    if(s.career.market&&!s.career.signed&&s.career.budget>s.career.market[0].fee){
     s=signPlayer(s,s.career.market[0].id);
    }
    s=quickSim(s);
    assert.ok(s.career.report,'must create result');
    s=dismissReport(s);
    assert.ok(validState(s));
    assert.equal(s.career.table.reduce((a,r)=>a+r.p,0),s.career.round*10);
    s=JSON.parse(JSON.stringify(s));
    assert.ok(validState(s),'persisted state valid');
   }
   assert.equal(s.career.round,18);
   s=resolveOffseason(s,null);assert.ok(s.career.offseason.reviewed);
   if(season<5){s=advanceSeason(s);assert.equal(s.career.season,season+1);}
  }
  const end=seasonSummary(s.career);
  assert.ok(end.position>=1&&end.position<=10);
  s=archiveCareer(s);
  assert.equal(s.career,null);
  assert.equal(s.legacy.runs.length,1);
  assert.equal(s.legacy.runs[0].results.length,5);
  assert.ok(s.legacy.legends.length>0);
  assert.ok(validState(s));
  return s;
 }
 assert.deepEqual(play(1234),play(1234));
 assert.notDeepEqual(play(1234),play(5678));
});
test('a separate career starts without importing the previous squad',()=>{
 let s=startCareer(freshState(),'northstar',10);
 s=quickSim(s);s=dismissReport(s);
 const oldIds=new Set(s.career.roster.map(p=>p.id));
 const previous=s.career.club;
 s=startCareer(s,'ironvale',11);
 assert.notEqual(s.career.club,previous);
 assert.equal(s.career.round,0);
 assert.ok(validState(s));
 assert.equal(s.career.club,'Ironvale Athletic');
 assert.equal(s.legacy.runs.length,0);
});


test('market offers visibly different ages and actionable immediate/future tradeoffs',()=>{
 const s=startCareer(freshState(),'northstar',42),c=s.career;
 assert.equal(c.market.length,5);
 assert.ok(c.market[0].age<=20,'youth signing is actually young');
 assert.ok(c.market[1].age>=27,'instant upgrade is experienced');
 assert.ok(c.market[0].potential-c.market[0].ovr>c.market[1].potential-c.market[1].ovr,'prospect has greater upside');
 for(const p of c.market){
  const preview=transferPreview(c,p);
  assert.ok(Number.isFinite(preview.attack)&&Number.isFinite(preview.defence));
  assert.ok(['HIGH','GOOD','LIMITED'].includes(preview.upside));
 }
 const snapshot=JSON.stringify(c);transferPreview(c,c.market[1]);assert.equal(JSON.stringify(c),snapshot,'preview is pure');
});
test('signing creates meaningful readback-safe payoff and closes the window',()=>{
 let s=startCareer(freshState(),'ironvale',331);
 const original=s.career.budget,fanBase=s.career.supporters;
 const p=s.career.market.find(p=>p.fee<=original);
 const preview=transferPreview(s.career,p);
 s=signPlayer(s,p.id);
 assert.ok(s.career.lastSigning);
 assert.equal(s.career.lastSigning.name,p.name);
 assert.equal(s.career.lastSigning.overall,preview.overall);
 assert.equal(s.career.lastSigning.budget,original-p.fee);
 assert.equal(s.career.supporters,fanBase+s.career.lastSigning.supportersChange);
 assert.equal(s.career.signed,true);
 assert.equal(s.career.roster.length,16);
 assert.ok(validState(JSON.parse(JSON.stringify(s))));
 assert.deepEqual(passMarket(s),s,'cannot pass after signing');
});
test('passing a window, selecting a game plan and changing chapter resets the prep checklist',()=>{
 let s=startCareer(freshState(),'northstar',9999);
 assert.equal(s.career.tacticChosen,true);
 s=chooseTactic(s,'press');
 assert.equal(s.career.tacticChosen,true);
 assert.equal(s.career.tactic,'press');
 s=passMarket(s);assert.equal(s.career.windowPassed,true);
 assert.equal(s.career.signed,false);
 assert.deepEqual(signPlayer(s,s.career.market[0].id),s);
 for(let i=0;i<3;i++){s=quickSim(s);s=dismissReport(s);}
 assert.equal(s.career.checkpoint,true);
 s=chapterChoice(s,'attack');
 assert.equal(s.career.windowPassed,false);
 assert.equal(s.career.tacticChosen,true);
 assert.ok(s.career.lastChoice.message.includes('masterclass'));
 assert.equal(s.career.market.length,5);
 assert.ok(validState(s));
});
test('match results update supporters, club form and reputation, without financial underflow',()=>{
 let victories=0,defeats=0;
 for(let seed=11;seed<61;seed++){
  let s=startCareer(freshState(),'seabrook',seed),c=s.career;
  const fansBefore=c.supporters,momentumBefore=c.momentum,repBefore=c.reputation;
  s=kickoff(s);
  assert.equal(s.career.match.phase,'half');
  assert.equal(s.career.round,0,'the first half is still mid-match');
  s=finishMatch(s,seed%2?'push':'protect');
  const r=s.career.report;
  assert.equal(r.supportersBefore,fansBefore);
  assert.equal(r.supportersAfter,s.career.supporters);
  assert.equal(r.supportersAfter-r.supportersBefore,r.supportersChange);
  assert.equal(r.momentumAfter-momentumBefore,r.momentumChange);
  assert.equal(r.reputationAfter-repBefore,r.reputationChange);
  assert.ok(s.career.budget>=0);
  assert.ok(validState(s));
  if(r.result==='WIN'){victories++;assert.ok(r.supportersChange>0);assert.ok(r.momentumChange>=0);}
  if(r.result==='LOSS'){defeats++;assert.ok(r.supportersChange<=0);}
 }
 assert.ok(victories>0&&defeats>0,'test experiences both winning and losing outcomes');
});

test('existing V1 browser career and imported backup migrate safely',()=>{
 const previous=startCareer(freshState(),'northstar',1024);
 const old=JSON.parse(JSON.stringify(previous)),c=old.career;
 delete c.supporters;delete c.momentum;delete c.reputation;
 delete c.windowPassed;delete c.tacticChosen;delete c.lastSigning;
 assert.equal(validState(old),false);
 const restored=migrateState(old);
 assert.equal(validState(restored),true);
 assert.equal(restored.career.club,previous.career.club);
 assert.deepEqual(restored.career.roster,previous.career.roster);
 assert.equal(restored.career.supporters,920);
 assert.equal(restored.career.momentum,50);
 assert.equal(restored.career.reputation,10);
 const oldSigned=startCareer(freshState(),'ironvale',33);
 const target=oldSigned.career.market.find(p=>p.fee<=oldSigned.career.budget);
 const signed=signPlayer(oldSigned,target.id);
 delete signed.career.lastSigning;
 delete signed.career.supporters;
 delete signed.career.momentum;
 delete signed.career.reputation;
 const restoredSigned=migrateState(signed);
 assert.equal(restoredSigned.career.lastSigning.name,target.name);
 assert.equal(validState(restoredSigned),true);
});

test('winning momentum and a bigger home crowd improve actual match strength',()=>{
 const c=startCareer(freshState(),'northstar',91).career;
 const neutral=clubBoost(c,true);
 assert.equal(neutral.confidence,0);
 c.momentum=85;c.supporters=3500;
 const home=clubBoost(c,true),away=clubBoost(c,false);
 assert.ok(home.confidence>neutral.confidence);
 assert.ok(home.crowd>neutral.crowd);
 assert.equal(away.crowd,0);
 assert.equal(away.confidence,home.confidence);
});


test('each division has its own rivals, stadiums, colours and styles',()=>{
 let s=startCareer(freshState(),'northstar',913);
 const seen=[];
 for(let tier=0;tier<3;tier++){
  assert.equal(s.career.tier,tier);
  seen.push({division:DIVISION_CONFIG[tier].key,names:s.career.rivals.map(x=>x.name)});
  assert.equal(new Set(s.career.rivals.map(x=>x.name)).size,9);
  assert.ok(s.career.rivals.every(x=>x.venue&&x.nickname&&x.color&&['balanced','press','counter'].includes(x.style)));
  if(tier<2){
   for(let round=0;round<18;round++){
    if(s.career.checkpoint)s=chapterChoice(s,'defence');
    s=quickSim(s);s=dismissReport(s);
   }
   // Force a promotion standing in this isolated world-generation test;
   // match/standings authenticity is covered by the full-season test above.
   s.career.table.find(x=>x.id==='you').pts=100;
   s=resolveOffseason(s,null);s=advanceSeason(s);
  }
 }
 assert.equal(new Set(seen.map(x=>x.names.join(','))).size,3);
});

test('young bench player trains into first team without manual lineup changes',()=>{
 let s=startCareer(freshState(),'northstar',889);
 const starter=s.career.roster.find(p=>p.id===lineup(s.career).find(p=>p.role==='ST').id);
 starter.age=29;starter.potential=starter.ovr;
 const young={...starter,id:'youth-auto',name:'Rising Star',age:17,ovr:starter.ovr-2,
    potential:Math.min(99,starter.ovr+18),origin:'academy',xp:0,training:0,growth:0,
    stats:{apps:0,goals:0,assists:0}};
 s.career.roster.push(young);
 assert.ok(!lineup(s.career).some(p=>p.id===young.id));
 let promoted=false;
 for(let i=0;i<12;i++){
  if(s.career.checkpoint)s=chapterChoice(s,'defence');
  s=quickSim(s);
  if(s.career.report.promotions?.some(x=>x.includes(young.name)))promoted=true;
  s=dismissReport(s);
  if(promoted)break;
 }
 assert.ok(promoted,'academy graduate earns his place via automatic training');
 assert.ok(young.ovr<young.potential,'original fixture reference remains unmutated');
 const signed=s.career.roster.find(p=>p.id===young.id);
 assert.ok(signed.ovr>young.ovr&&signed.ovr<=signed.potential);
 assert.ok(lineup(s.career).some(p=>p.id===young.id));
 assert.ok(signed.stats.apps<=s.career.round);
 assert.ok(validState(s));
});
test('no in-season bids; capped annual star offers and automatic fringe group sale',()=>{
 let s=startCareer(freshState(),'ironvale',991);
 assert.equal(s.career.saleOffers.length,0,'there are no in-season sale offers');
 for(let round=0;round<18;round++){
  if(s.career.checkpoint)s=chapterChoice(s,'defence');
  s=quickSim(s);s=dismissReport(s);
  if(round<17)assert.equal(s.career.saleOffers.length,0);
 }
 assert.equal(s.career.seasonComplete,true);
 const o=s.career.offseason;
 assert.ok(o&&!o.reviewed);
 assert.ok(o.offers.length>=1&&o.offers.length<=2,'one or two real decisions');
 assert.ok(o.fringe.fee<=35000,'group clear-out revenue stays capped');
 assert.ok(o.offers.every(x=>x.fee<=95000&&x.fee>0));
 assert.ok(o.offers.every(x=>Number.isFinite(x.potential)&&Number.isFinite(x.ovr)));
 const before=s.career.budget,offer=o.offers[0],previous=s.career.roster.length;
 assert.deepEqual(advanceSeason(s),s,'cannot skip required year-end decision');
 s=resolveOffseason(s,offer.playerId);
 assert.equal(s.career.budget,before+offer.fee);
 assert.equal(s.career.roster.length,previous-1);
 assert.equal(s.career.offseason.sale.name,offer.name);
 assert.deepEqual(resolveOffseason(s,null),s,'cannot sell a second star');
 assert.ok(validState(s));
});
test('keeping your star is a genuine choice and clearing reserves keeps youth prospects',()=>{
 let s=startCareer(freshState(),'northstar',333);
 const young=s.career.roster.find(p=>p.age<=21);
 for(let i=0;i<18;i++){
  if(s.career.checkpoint)s=chapterChoice(s,'defence');
  s=quickSim(s);s=dismissReport(s);
 }
 const before=s.career.roster.length;
 const purse=s.career.budget;
 s=resolveOffseason(s,null);
 assert.equal(s.career.roster.length,before);
 assert.equal(s.career.budget,purse);
 assert.equal(s.career.offseason.sale,null);
 assert.ok(validState(s));
});
test('trophies unlock only for genuine league titles and survive a new career',()=>{
 let s=startCareer(freshState(),'northstar',804);
 for(let i=0;i<17;i++){
  if(s.career.checkpoint)s=chapterChoice(s,'defence');
  s=quickSim(s);s=dismissReport(s);
 }
 // Isolated title-award test: force table lead then play the actual final fixture.
 s.career.table.find(r=>r.id==='you').pts=100;
 s=quickSim(s);
 assert.equal(s.career.seasonComplete,true);
 assert.equal(s.career.currentTrophy?.kind,'champion');
 assert.equal(s.career.trophies.length,1);
 assert.equal(s.career.trophies[0].tier,0);
 s=dismissReport(s);s=resolveOffseason(s,null);
 s=advanceSeason(s);
 assert.equal(s.career.trophies.length,1,'club cabinet carries trophies between seasons');
 assert.equal(s.career.currentTrophy,null);
 assert.ok(validState(JSON.parse(JSON.stringify(s))));
});
test('starting shortlist rotates across 13 different club identities',()=>{
 const all=new Set();
 for(let n=0;n<12;n++){
  const short=startingChoices(51983,n);
  assert.equal(short.length,3);
  assert.equal(new Set(short.map(x=>x.id)).size,3);
  short.forEach(x=>{all.add(x.id);assert.ok(x.crest&&x.colors.length===2&&x.weak);});
 }
 assert.ok(all.size>=9,'the opening screen offers genuine variety');
 assert.deepEqual(startingChoices(51983,2),startingChoices(51983,2));
});

test('persistent club tactics and matchup advantages make scouting useful',()=>{
 let s=startCareer(freshState(),'northstar',98);
 s=chooseTactic(s,'counter');
 for(let i=0;i<3;i++){s=quickSim(s);s=dismissReport(s);}
 s=chapterChoice(s,'defence');
 assert.equal(s.career.tactic,'counter');
 assert.equal(s.career.tacticChosen,true);
 assert.equal(tacticalMatchup('counter','press').advantage,11);
 assert.equal(tacticalMatchup('balanced','press').advantage,-7);
 assert.equal(tacticalMatchup('press','press').advantage,0);
 assert.ok(validState(s));
});
test('full squad blocks new players without blocking actual match progression',()=>{
 let s=startCareer(freshState(),'seabrook',22);
 while(s.career.roster.length<MAX_SQUAD){
  const old=s.career.roster[s.career.roster.length-1];
  s.career.roster.push({...old,id:'reserve-'+s.career.roster.length,name:'Extra '+s.career.roster.length});
 }
 const p=s.career.market[0];
 assert.deepEqual(signPlayer(s,p.id),s);
 for(let i=0;i<3;i++){s=quickSim(s);s=dismissReport(s);}
 assert.equal(s.career.checkpoint,true);
 assert.deepEqual(chapterChoice(s,'academy'),s);
 s=chapterChoice(s,'defence');
 assert.ok(!s.career.checkpoint,'coaching path remains available');
 assert.ok(validState(s));
});
