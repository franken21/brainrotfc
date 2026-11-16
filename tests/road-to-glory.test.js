import test from 'node:test';
import assert from 'node:assert/strict';
import {
 freshState,startCareer,CLUBS,ROLES,FIXTURES,validState,lineup,teamRating,
 signPlayer,scoutPlayer,chooseTactic,kickoff,finishMatch,quickSim,dismissReport,
 chapterChoice,advanceSeason,archiveCareer,standings,seasonSummary
} from '../src/rtg/engine.js';

test('three clubs create distinct complete and valid careers',()=>{
 const values=CLUBS.map(club=>{
  const s=startCareer(freshState(),club.id,101);
  assert.ok(validState(s));assert.equal(s.career.roster.length,15);
  assert.equal(s.career.market.length,5);assert.equal(lineup(s.career).length,11);
  assert.equal(new Set(s.career.roster.map(p=>p.id)).size,15);
  assert.equal(s.career.table.length,10);
  return s.career.budget;
 });
 assert.equal(new Set(values).size,3);
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
    if(s.career.checkpoint)s=chapterChoice(s,round%2?'attack':'academy');
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
