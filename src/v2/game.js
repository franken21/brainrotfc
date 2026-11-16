export const IMAGE_ROOT = 'https://raw.githubusercontent.com/franken21/brainrotfc-images/refs/heads/main/';
export const PLAYERS = [
  {id:'brrbrr',name:'Brr Brr Patapim',tag:'THE TREE TANK',rarity:'common',emoji:'🌳',image:'Brr-Brr-Patapim.png',color:'#86ce67',power:59,control:62,style:'Steady',perk:'Bigger perfect-timing window'},
  {id:'lirili',name:'Lirilì Larilà',tag:'THE ELEPHANT',rarity:'common',emoji:'🐘',image:'Lirilii-Larilaa.jpeg',color:'#a8a6ff',power:62,control:57,style:'Chaos',perk:'Wild shots, extra coin rewards'},
  {id:'cappuccino',name:'Cappuccino Assassino',tag:'ESPRESSO EXPRESS',rarity:'rare',emoji:'☕',image:'Cappuccino-Assassino.jpeg',color:'#f5af83',power:76,control:66,style:'Rocket',perk:'Faster shots beat keepers'},
  {id:'ballerina',name:'Ballerina Cappuccina',tag:'THE FINESSE QUEEN',rarity:'rare',emoji:'🩰',image:'Ballerina-Cappuccina.jpeg',color:'#fab9df',power:63,control:85,style:'Precision',perk:'More accurate placement'},
  {id:'tralalero',name:'Tralalero Tralala',tag:'THE SHARK',rarity:'epic',emoji:'🦈',image:'Tralalero-Tralala.jpeg',color:'#7bdfff',power:81,control:81,style:'Finesse',perk:'More shots sneak past keepers'},
  {id:'bombardiro',name:'Bombardiro Crocodilo',tag:'BOOM BOOM',rarity:'epic',emoji:'🐊',image:'Bombardiro-Crocodilo.jpeg',color:'#ffae58',power:93,control:59,style:'Rocket',perk:'Powerful shots are harder to save'},
  {id:'tungtung',name:'Tung Tung Sahur',tag:'MIDNIGHT MAYHEM',rarity:'legendary',emoji:'🥁',image:'Tung-Tung-Tung-Sahur.jpeg',color:'#ffe082',power:87,control:89,style:'Freeze',perk:'Occasionally freezes the keeper'},
  {id:'haalandiro',name:'Haalandiro Crocodilo',tag:'THE GOAL MACHINE',rarity:'icon',emoji:'🦖',image:'Haalandiro-Crocodilo.jpeg',color:'#b8ff82',power:98,control:79,style:'Rocket',perk:'Unstoppable power'},
  {id:'messirili',name:'Messirili Tralala',tag:'MAGIC FEET',rarity:'icon',emoji:'✨',image:'Messirili-Tralala.jpeg',color:'#f8a3ff',power:85,control:98,style:'Finesse',perk:'Laser-guided accuracy'},
  {id:'vegimite',name:'Vegimite Dinamite',tag:'THE WILD CARD',rarity:'icon',emoji:'🧨',image:'vegimite-dinamite.jpg',color:'#fe9a66',power:94,control:92,style:'Chaos',perk:'Unpredictable but brilliant'}
];
export const RARITY = {
  common:{label:'COMMON',color:'#c4cbd2'},
  rare:{label:'RARE',color:'#69cfff'},
  epic:{label:'EPIC',color:'#bb97ff'},
  legendary:{label:'LEGENDARY',color:'#ffc768'},
  icon:{label:'ICON',color:'#ff8eb9'}
};
export const LEAGUES = [
  {id:'streets',name:'The Streets',tag:'WHERE LEGENDS BEGIN',venue:'THE BACKSTREET COURT',theme:'#ffbe65',icon:'🏀',wins:3,keeper:0.20,rival:0.37,reward:220},
  {id:'sunday',name:'Sunday League',tag:'SUNDAYS GET SERIOUS',venue:'THE LOCAL GROUND',theme:'#98e8bd',icon:'🥅',wins:3,keeper:0.34,rival:0.46,reward:285},
  {id:'national',name:'National League',tag:'TIME TO GO PRO',venue:'THE CITY STADIUM',theme:'#9fc1ff',icon:'🏟️',wins:4,keeper:0.48,rival:0.57,reward:370},
  {id:'champions',name:'Champions Nights',tag:'UNDER THE LIGHTS',venue:'THE GRAND ARENA',theme:'#c7a5ff',icon:'⭐',wins:4,keeper:0.61,rival:0.67,reward:490},
  {id:'world',name:'World Stage',tag:'THE WHOLE WORLD WATCHES',venue:'THE WORLD FINAL',theme:'#ffdf84',icon:'🏆',wins:5,keeper:0.74,rival:0.76,reward:650}
];
export const PACK_PRICE = 650;
export const SAVE_KEY = 'brainrotfc-reimagined-v2';
export function freshSave(){
  return {version:2,coins:950,owned:['brrbrr','lirili'],selected:'brrbrr',league:0,wins:[0,0,0,0,0],totalWins:0,totalGoals:0,played:0,opened:0,bestStreak:0};
}
export function loadSave(){
  try {
    const raw=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!raw || raw.version!==2 || !Array.isArray(raw.owned)) return freshSave();
    const base=freshSave();
    const owned=[...new Set(raw.owned.filter(id=>PLAYERS.some(p=>p.id===id)))];
    if(!owned.length) owned.push('brrbrr');
    const league=Math.max(0,Math.min(LEAGUES.length-1,Number(raw.league)||0));
    const wins=base.wins.map((_,i)=>Math.max(0,Math.min(LEAGUES[i].wins,Number(raw.wins?.[i])||0)));
    return {...base,...raw,owned,selected:owned.includes(raw.selected)?raw.selected:owned[0],league,wins,coins:Math.max(0,Number(raw.coins)||0)};
  }catch {return freshSave();}
}
export function playerById(id){return PLAYERS.find(p=>p.id===id)||PLAYERS[0];}
export function randomPack(random=Math.random){
  const slots=[];
  for(let i=0;i<3;i++){
    let roll=random();
    let rarity=roll<0.49?'common':roll<0.77?'rare':roll<0.93?'epic':roll<0.988?'legendary':'icon';
    if(i===2 && slots.every(p=>p.rarity==='common')) rarity='rare';
    const pool=PLAYERS.filter(p=>p.rarity===rarity);
    slots.push(pool[Math.floor(random()*pool.length)]);
  }
  return slots;
}
export function buyPack(save,cards){
  if(save.coins<PACK_PRICE) return {save,duplicates:0,newPlayers:[]};
  const owned=[...save.owned],newPlayers=[];
  let duplicates=0;
  cards.forEach(p=>{if(owned.includes(p.id))duplicates++;else{owned.push(p.id);newPlayers.push(p.id);}});
  const refunds=duplicates*120;
  return {save:{...save,coins:save.coins-PACK_PRICE+refunds,owned,opened:save.opened+1},duplicates,newPlayers,refunds};
}
export function resolveShot(aim,timing,player,league,random=Math.random){
  const precision=Math.max(0,1-Math.abs(timing-0.5)*2);
  const help=player.style==='Steady'?0.09:0;
  const effectivePrecision=Math.min(1,precision+help);
  const wild=player.style==='Chaos'?1.24:1;
  const spread=(0.016+(1-effectivePrecision)*0.17)*(1-(player.control-50)/160)*wild;
  const x=aim.x+(random()*2-1)*spread;
  const y=aim.y+(random()*2-1)*spread*0.9;
  const onTarget=x>=0.025&&x<=0.975&&y>=0.025&&y<=0.97;
  const reading=random()<0.30+league.keeper*0.53;
  const keeperX=reading?(x<0.44?0.25:x>0.56?0.75:0.5):(random()<0.5?0.24:0.76);
  const keeperY=reading?Math.max(.17,Math.min(.72,y+(random()-.5)*.20)):.66;
  const distance=Math.hypot((x-keeperX)*1.25,(y-keeperY)*0.8);
  const reach=0.18+league.keeper*0.11;
  const saveDifficulty=(player.power-50)/200+(player.style==='Finesse'?0.08:0)+(player.style==='Freeze'?0.1:0);
  const saved=onTarget&&distance<reach&&random()<(0.48+league.keeper*0.36-saveDifficulty-(precision>0.88?0.12:0));
  const outcome=!onTarget?'MISS':saved?'SAVED':'GOAL';
  const grade=precision>0.89?'PERFECT':precision>0.68?'GREAT':precision>0.42?'GOOD':'LATE / EARLY';
  return {x,y,keeperX,keeperY,outcome,precision,grade,aimX:aim.x,aimY:aim.y};
}
export function rivalKick(league,random=Math.random){return random()<league.rival;}
export function settleMatch(save,leagueIndex,won,goals,streak){
  const league=LEAGUES[leagueIndex];
  const coins=(won?league.reward:85)+(goals*20);
  const wins=[...save.wins];
  let nextLeague=save.league,promoted=false;
  if(won){
    wins[leagueIndex]=Math.min(league.wins,wins[leagueIndex]+1);
    if(wins[leagueIndex]>=league.wins&&leagueIndex===save.league&&leagueIndex<LEAGUES.length-1){
      nextLeague+=1;promoted=true;
    }
  }
  return {save:{...save,wins,league:nextLeague,coins:save.coins+coins,totalWins:save.totalWins+(won?1:0),totalGoals:save.totalGoals+goals,played:save.played+1,bestStreak:Math.max(save.bestStreak,streak)},coins,promoted};
}
