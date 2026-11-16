import test from 'node:test';
import assert from 'node:assert/strict';
import {PLAYERS,LEAGUES,PACK_PRICE,freshSave,randomPack,buyPack,resolveShot,rivalKick,settleMatch} from '../src/v2/game.js';

test('starter has two playable ballers and enough coins for one pack',()=>{
 const save=freshSave();
 assert.equal(save.owned.length,2);
 assert.ok(save.owned.includes(save.selected));
 assert.ok(save.coins>=PACK_PRICE);
 assert.equal(save.league,0);
});
test('pack always has exactly three real characters and a rare guarantee when other cards are common',()=>{
 for(let i=0;i<200;i++){
  let sequence=i;
  const cards=randomPack(()=>{sequence=(sequence*1664525+1013904223)>>>0;return sequence/4294967296;});
  assert.equal(cards.length,3);
  cards.forEach(p=>assert.ok(PLAYERS.some(q=>q.id===p.id)));
  assert.ok(cards.some(p=>p.rarity!=='common'));
 }
});
test('pack purchase deducts cost, grants cards and refunds duplicates',()=>{
 const save={...freshSave(),coins:2000};
 const cards=[PLAYERS[0],PLAYERS[2],PLAYERS[2]];
 const result=buyPack(save,cards);
 assert.equal(result.duplicates,2);
 assert.deepEqual(result.newPlayers,['cappuccino']);
 assert.equal(result.save.coins,2000-PACK_PRICE+240);
 assert.ok(result.save.owned.includes('cappuccino'));
 assert.equal(result.save.opened,1);
});
test('insufficient coins cannot buy a pack',()=>{
 const save={...freshSave(),coins:0};
 assert.deepEqual(buyPack(save,[PLAYERS[0]]).save,save);
});
test('perfect well-placed shot can score, out-of-bounds shots miss',()=>{
 const shooter=PLAYERS[4],league=LEAGUES[0];
 const perfect=resolveShot({x:.8,y:.22},.5,shooter,league,()=>.5);
 assert.equal(perfect.outcome,'GOAL');
 assert.equal(perfect.grade,'PERFECT');
 const wide=resolveShot({x:1,y:.4},0,shooter,league,()=>.99);
 assert.equal(wide.outcome,'MISS');
});
test('shots keep finite coordinates and valid outcomes',()=>{
 const player=PLAYERS[2];
 for(let i=0;i<100;i++){
   const random=Math.random;
   const s=resolveShot({x:Math.random(),y:Math.random()},Math.random(),player,LEAGUES[4],random);
   assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.y));
   assert.ok(['GOAL','MISS','SAVED'].includes(s.outcome));
 }
});
test('higher leagues have stronger keepers and rivals',()=>{
 for(let i=1;i<LEAGUES.length;i++){
  assert.ok(LEAGUES[i].keeper>LEAGUES[i-1].keeper);
  assert.ok(LEAGUES[i].rival>LEAGUES[i-1].rival);
 }
 assert.equal(rivalKick(LEAGUES[0],()=>0),true);
 assert.equal(rivalKick(LEAGUES[0],()=>.99),false);
});
test('winning advances the league only after reaching its target',()=>{
 let save=freshSave();
 for(let i=0;i<LEAGUES[0].wins;i++){
  const result=settleMatch(save,0,true,4,i+1);
  save=result.save;
  assert.equal(result.promoted,i===LEAGUES[0].wins-1);
 }
 assert.equal(save.league,1);
 assert.equal(save.wins[0],LEAGUES[0].wins);
 assert.equal(save.totalWins,LEAGUES[0].wins);
});
test('losing still earns coins but does not advance',()=>{
 const result=settleMatch(freshSave(),0,false,2,0);
 assert.equal(result.save.league,0);
 assert.equal(result.save.wins[0],0);
 assert.ok(result.coins>0);
 assert.equal(result.save.played,1);
});

test('freeze shots can immobilise the keeper',()=>{
  const freeze=PLAYERS.find(p=>p.style==='Freeze');
  const shot=resolveShot({x:.8,y:.35},.5,freeze,LEAGUES[4],()=>0);
  assert.equal(shot.frozen,true);
  assert.equal(shot.outcome,'GOAL');
});
test('chaos striker gives a coin bonus regardless of result',()=>{
  const normal=settleMatch(freshSave(),0,true,3,1);
  const chaos=settleMatch(freshSave(),0,true,3,1,'Chaos');
  assert.equal(chaos.coins-normal.coins,50);
});
