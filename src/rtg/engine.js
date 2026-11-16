// Road to Glory: Pocket Edition — browser-first, seeded single-player simulation.
// The v12 Python project is design inspiration; this is an independent arcade ruleset.
export const SAVE_KEY = 'rtg-pocket-v1';
export const VERSION = 1;
export const DIVISIONS = ['Coastal Division', 'National Division', 'Premier Division'];
export const MAX_SQUAD = 20;
export const DIVISION_CONFIG = [
 {key:'coastal',icon:'⚓',subtitle:'THE LOCAL CIRCUIT',description:'Rainy terraces, fierce derbies and grounds where everyone knows your name.',venue:'LOCAL GROUNDS',palette:['#d9fc77','#1e503a','#0b1714']},
 {key:'national',icon:'⚙',subtitle:'THE NATIONAL LEAGUE',description:'Packed away ends, industrial cities, bruising battles and higher stakes.',venue:'NATIONAL STADIUMS',palette:['#ffc082','#713c2c','#191512']},
 {key:'premier',icon:'✦',subtitle:'THE PREMIER STAGE',description:'Floodlights, superstar rivals and the whole country watching.',venue:'GRAND ARENAS',palette:['#e9bbff','#54347d','#140f27']}
];
export const ROLES = ['GK','LB','CB','CB','RB','CM','CM','CAM','LW','ST','RW'];
export const CLUBS = [
  {id:'northstar',name:'Northstar Rovers',city:'Northstar',crest:'✦',colors:['#dcfb72','#173c36'],budget:215000,base:52,bonus:{LW:5,ST:3},weak:'A shaky back line. Explosive wide players.',tag:'THE DREAMERS'},
  {id:'ironvale',name:'Ironvale Athletic',city:'Ironvale',crest:'◆',colors:['#ffb583','#66372d'],budget:185000,base:54,bonus:{CB:5,GK:4,ST:-7},weak:'Defensive grit. Desperate for goals.',tag:'THE UNDERDOGS'},
  {id:'seabrook',name:'Seabrook City',city:'Seabrook',crest:'≈',colors:['#9be8ff','#174c69'],budget:195000,base:53,bonus:{CM:3,CAM:4,GK:-5},weak:'Clever midfield. Young and unpredictable.',tag:'THE WILDCARDS'},
  {id:'bracken',name:'Bracken Vale',city:'Bracken',crest:'♧',colors:['#b8f2b3','#35634b'],budget:160000,base:53,bonus:{GK:6,CB:3,ST:-5},weak:'An iron defence, no reliable finisher.',tag:'THE KEEPERS'},
  {id:'copper',name:'Copperbridge FC',city:'Copperbridge',crest:'⚒',colors:['#ffe1a3','#9a4a26'],budget:225000,base:50,bonus:{ST:7,CAM:3,CB:-5},weak:'Goals galore. A defence full of holes.',tag:'THE FORGERS'},
  {id:'glacier',name:'Glacier United',city:'Glacier',crest:'❄',colors:['#d6f8ff','#27758a'],budget:175000,base:54,bonus:{GK:5,CM:3,RW:-6},weak:'Ice-cold midfield. No threat out wide.',tag:'THE ICE MEN'},
  {id:'amber',name:'Amberwick Town',city:'Amberwick',crest:'☼',colors:['#ffdb69','#8c4928'],budget:210000,base:51,bonus:{RW:7,LW:5,CB:-3},weak:'Electric wingers, fragile centre-backs.',tag:'THE FIRESTARTERS'},
  {id:'thistle',name:'Thistlemoor Athletic',city:'Thistlemoor',crest:'✿',colors:['#f6c6ec','#734771'],budget:190000,base:52,bonus:{CAM:8,ST:-7,LB:3},weak:'A creative number ten needs a striker.',tag:'THE CREATORS'},
  {id:'harrow',name:'Harrow Forge',city:'Harrow',crest:'⬡',colors:['#e1edf0','#4e637a'],budget:165000,base:55,bonus:{CB:6,CM:4,ST:-7},weak:'Built like a fortress. Short on goals.',tag:'THE BUILDERS'},
  {id:'willow',name:'Willowmere FC',city:'Willowmere',crest:'❦',colors:['#d8ffb4','#3f7547'],budget:205000,base:51,bonus:{ST:8,CM:-4,GK:-4},weak:'A natural finisher. A midfield in trouble.',tag:'THE HOPEFULS'},
  {id:'falcon',name:'Falconhurst Rovers',city:'Falconhurst',crest:'➤',colors:['#ffd8b2','#803b37'],budget:185000,base:53,bonus:{LW:7,RW:4,CB:-6},weak:'Flying wingers. Vulnerable to counters.',tag:'THE FALCONS'},
  {id:'moon',name:'Moonbay Wanderers',city:'Moonbay',crest:'☾',colors:['#d6caff','#39346c'],budget:200000,base:52,bonus:{CAM:7,CM:5,GK:-5},weak:'Pass masters looking for defensive security.',tag:'THE NIGHT OWLS'},
  {id:'oak',name:'Oakhearth City',city:'Oakhearth',crest:'♠',colors:['#ffe9a7','#73532e'],budget:175000,base:54,bonus:{CB:5,ST:3,LW:-8},weak:'Strong spine. A missing left wing.',tag:'THE OAKS'}
];
export function startingChoices(seed=1,offset=0){
 const pool=CLUBS.map(x=>x.id);
 let state=(((seed>>>0)^(Math.imul(offset+1,2654435761)))>>>0)||1;
 for(let i=pool.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,3).map(id=>CLUBS.find(c=>c.id===id));
}
const RIVAL_POOLS = [
 [
  ['Westhaven Rovers','press','Relentless pressing','#f28d75','The Red Wall','Westhaven Park'],
  ['Redcliff United','balanced','Organised and stubborn','#e2aa6a','The Cliffside Derby','Redcliff Lane'],
  ['Oldbridge Town','counter','Dangerous on the break','#b7a6df','The Bridge','Oldbridge Road'],
  ['Kingsport FC','press','High-tempo attackers','#efbe71','Port Storm','Kingsport End'],
  ['Ashfield Athletic','balanced','Hard to break down','#83bf9f','The Workhorses','Ashfield Recreation'],
  ['Riverton City','counter','Rapid wide breaks','#8ddce3','The River Rush','Riverton Quay'],
  ['Eastwick Albion','press','Hunts the ball','#f4a59a','Eastwick Fire','Eastwick Field'],
  ['Millgate FC','balanced','Disciplined midfield','#c2c7a9','The Millworkers','The Mill Ground'],
  ['Dunmere Wanderers','counter','Long balls and pace','#a5a9de','The Wanderers','Dunmere Heath']
 ],
 [
  ['Granite County','balanced','Defensive powerhouse','#a7b1ae','The Stonewall','Granite Bowl'],
  ['Copperford United','press','Ferocious home pressure','#f3a15c','The Furnaces','Copper Park'],
  ['Highmoor Wanderers','counter','Lightning breakaways','#a2bcdb','The Moor Riders','Highmoor Arena'],
  ['Southbridge FC','press','Technical pressing','#f58d81','The Red Engine','Southbridge Ground'],
  ['Port Meridian','balanced','Creative central play','#8abfc9','The Mariners','Meridian Stadium'],
  ['Dynamo Grove','press','High-energy football','#dcad7e','The Dynamos','Grove Arena'],
  ['Railway Athletic','counter','Direct football','#e5c38b','The Railmen','Railway Park'],
  ['Helmsford FC','balanced','Experienced veterans','#c9b0df','The Helm','Helmsford Arena'],
  ['Harbourside United','counter','Fast, disciplined counters','#7db0c6','Tidal Wave','Harbourside Stadium']
 ],
 [
  ['Royal Meridian','balanced','Superstar midfield','#d8b5ec','The Royals','Royal Arena'],
  ['Crown City','press','Fearless attacking press','#fdc97e','The Crown','Crown Coliseum'],
  ['Blackthorn FC','counter','Clinical finishing','#cdb0ee','The Blackthorns','Blackthorn Stadium'],
  ['Albion Imperium','balanced','World-class defence','#b5c2eb','The Imperials','Imperium Arena'],
  ['Silvergate United','press','Relentless elite attack','#d8d7ef','The Silver Army','Silvergate Dome'],
  ['Aurora Athletic','counter','Unstoppable transitions','#b8a7ed','The Northern Lights','Aurora Park'],
  ['Imperial Borough','balanced','Patient technical play','#f1a2c7','The Borough','Imperial Stadium'],
  ['Starlight FC','press','Explosive wings','#d3b2f4','The Stars','Starlight Arena'],
  ['Vanguard United','counter','Ruthless counterattacks','#a1baec','The Vanguard','Vanguard Palace']
 ]
];
const RIVAL_NAMES=RIVAL_POOLS[0].map(x=>x[0]);
const FIRST=['Leo','Milo','Ezra','Noah','Kai','Tariq','Oscar','Enzo','Arlo','Nico','Felix','Hugo','Luca','Ibrahim','Theo','Anton','Rafael','Idris','Jude','Mason','Elias','Alex','Mateo','Finn','Ruben','Ollie','Sami','Ben','Andre','Jasper'];
const LAST=['Varela','Hartmann','Nilsen','Santos','Morales','Reed','Almeida','Fischer','Berg','Okoro','Haddad','Silva','Bennett','Hughes','Costa','Marquez','Svensson','Khan','Cole','Adebayo','Moretti','Kovacs','Dahl','Romero','Torres','Solberg','Wright','Bishop','Fowler','Lind'];
const CANDIDATE_ROLES=['ST','CB','CAM','GK','RW','CM','LB','LW','RB'];
const TACTICS={
  balanced:{label:'Balanced',note:'Reliable in both boxes',attack:0,defence:0},
  press:{label:'High Press',note:'Create more chances; expose your defence',attack:8,defence:-6},
  counter:{label:'Counter',note:'Defend deep and break quickly',attack:2,defence:5}
};
export {TACTICS};

function rand(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
function int(c,min,max){return min+Math.floor(rand(c)*(max-min+1));}
function sample(c,a){return a[int(c,0,a.length-1)];}
function clamp(x,min,max){return Math.max(min,Math.min(max,x));}
function clone(v){return JSON.parse(JSON.stringify(v));}
function newId(c,prefix){c.serial++;return prefix+'-'+c.serial;}
function name(c){return sample(c,FIRST)+' '+sample(c,LAST);}
function player(c,role,ovr,age,potential,origin='club'){
 return {id:newId(c,'p'),name:name(c),role,ovr:clamp(ovr,36,98),potential:clamp(potential,ovr,99),age,origin,form:0,xp:0,stats:{apps:0,goals:0,assists:0},growth:0};
}
function fixtureList(){
 const ids=['you',...RIVAL_NAMES.map((_,i)=>'r'+i)];
 let ring=ids.slice(),out=[];
 for(let round=0;round<9;round++){
  const pairs=[];
  for(let k=0;k<5;k++){
   const a=ring[k],b=ring[9-k];
   pairs.push(round%2===0?[a,b]:[b,a]);
  }
  out.push(pairs);
  ring=[ring[0],ring[9],...ring.slice(1,9)];
 }
 return [...out,...out.map(pairs=>pairs.map(([h,a])=>[a,h]))];
}
export const FIXTURES=fixtureList();
function startTable(rivals){
 return [{id:'you',name:'Your club',p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0},...rivals.map(r=>({id:r.id,name:r.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}))];
}
function rivalsFor(c){
 return RIVAL_POOLS[c.tier].map(([name,style,trait,color,nickname,venue],i)=>({id:'r'+i,name,style,trait,color,nickname,venue,
  strength:clamp((c.tier===0?52:c.tier===1?65:78)+i*1.2+int(c,-5,5),45,93)}));
}
function generateMarket(c){
 const chapter=Math.floor(c.round/3),base=c.tier===0?58:c.tier===1?70:83;
 // Five distinct, role-specific decisions with genuinely different trade-offs.
 const roles=chapter===0?['ST','CB','CAM','GK','CM']:CANDIDATE_ROLES.slice();
 if(chapter!==0){
  for(let i=roles.length-1;i>0;i--){let j=int(c,0,i);[roles[i],roles[j]]=[roles[j],roles[i]];}
 }
 c.market=roles.slice(0,5).map((role,i)=>{
  const mode=i%5;
  const rating=clamp(base+[-3,7,2,5,0][mode]+int(c,-3,3),47,94);
  const age=[18,28,23,25,20][mode]+int(c,-1,2);
  const potential=clamp(rating+[18,3,11,6,16][mode]+int(c,-2,4),rating,98);
  const fee=Math.round(([52,132,84,103,66][mode]*(c.tier===0?1:c.tier===1?12:95)+int(c,-8,8)*(c.tier===0?1:c.tier===1?9:65))*1000/1000)*1000;
  const p=player(c,role,rating,age,potential,'market');
  return {...p,fee:Math.max(24000,fee),type:['High-upside kid','Instant upgrade','Creative gamble','Proven starter','Future star'][mode]};
 });
 c.signed=false;c.scouted=false;c.scoutedId=null;c.windowPassed=false;c.lastSigning=null;c.lastChoice=null;
 // Your team's identity persists between windows; scouting each opponent is optional.
 c.tacticChosen=true;
 c.sold=false;c.saleOffers=[];c.lastSale=null;
}
function buildSeason(c){
 c.rivals=rivalsFor(c);c.table=startTable(c.rivals);
 c.fixtures=FIXTURES;c.round=0;c.match=null;c.report=null;c.checkpoint=false;c.seasonComplete=false;
 c.seasonResults=[];c.tactic=c.tactic||'balanced';c.seasonGoals=0;c.offseason=null;c.currentTrophy=null;
 generateMarket(c);
}
export function freshState(){return {version:VERSION,legacy:{runs:[],legends:[],trophies:[],points:0},career:null};}
export function startCareer(input,clubId,seed=Date.now()){
 const s=clone(input&&input.version===VERSION?input:freshState());
 const club=CLUBS.find(x=>x.id===clubId);if(!club)throw Error('Choose a valid club');
 if(!Array.isArray(s.legacy.trophies))s.legacy.trophies=[];
 const c={id:club.id,club:club.name,crest:club.crest,colors:club.colors,season:1,tier:0,
  budget:club.budget,seed:(seed>>>0)||1,serial:0,roster:[],round:0,careerResults:[],memories:[],
  supporters:club.id==='northstar'?920:club.id==='ironvale'?780:1100,momentum:50,reputation:10,
  trophies:[],run:(s.legacy.runs.length+1)};
 c.roster=ROLES.map((role,i)=>{
  const ovr=clamp(club.base+int(c,-7,6)+(club.bonus[role]||0),42,69);
  return player(c,role,ovr,int(c,20,29),ovr+int(c,4,13));
 });
 ['GK','CB','CM','ST'].forEach(role=>{const ovr=club.base+int(c,-11,-4);c.roster.push(player(c,role,ovr,int(c,18,29),ovr+int(c,6,16)));});
 c.roster.forEach(p=>{if(p.age<=21)p.potential=clamp(p.potential+9,p.ovr,90);});
 buildSeason(c);s.career=c;return s;
}
export function lineup(c){
 const available=c.roster.slice();
 return ROLES.map(role=>{
  const exact=available.filter(p=>p.role===role).sort((a,b)=>b.ovr-a.ovr)[0];
  const chosen=exact||available.sort((a,b)=>b.ovr-a.ovr)[0];
  if(chosen)available.splice(available.indexOf(chosen),1);
  return chosen;
 });
}
export function starter(c,p){return lineup(c).some(x=>x?.id===p.id);}

export function transferPreview(c,p){
 const before=profile(c),roleStarters=lineup(c).filter(x=>x.role===p.role).sort((a,b)=>a.ovr-b.ovr);
 const old=roleStarters[0]||null;
 const modified={...c,roster:[...c.roster,{...p,origin:'transfer'}]};
 const after=profile(modified);
 const ageGroup=p.age<=19?'TEENAGE PROSPECT':p.age<=22?'BREAKOUT TALENT':p.age<=26?'ENTERING PRIME':'WIN-NOW VETERAN';
 const gap=p.potential-p.ovr;
 return {oldName:old?.name||'Open position',oldRating:old?.ovr||0,upgrade:Math.max(0,p.ovr-(old?.ovr||0)),
  attack:after.attack-before.attack,defence:after.defence-before.defence,overall:after.overall-before.overall,
  ageGroup,upside:gap>=17?'HIGH':gap>=10?'GOOD':'LIMITED',years:Math.max(0,Math.min(6,30-p.age))};
}
export function passMarket(input){
 const s=clone(input),c=s.career;
 if(!c||c.signed||c.windowPassed||c.match||c.report||c.checkpoint||c.seasonComplete)return s;
 c.windowPassed=true;c.memories.unshift('The manager kept '+formatCash(c.budget)+' in reserve instead of buying this chapter.');return s;
}
export function teamRating(c){return Math.round(lineup(c).reduce((sum,p)=>sum+(p?.ovr||45),0)/11);}
export function profile(c){
 const eleven=lineup(c),at=(role)=>eleven.filter(p=>p?.role===role);
 const avg=arr=>arr.length?arr.reduce((sum,p)=>sum+p.ovr,0)/arr.length:50;
 const attack=avg([...at('ST'),...at('ST'),...at('LW'),...at('RW'),...at('CAM')]);
 const defence=avg([...at('GK'),...at('CB'),...at('CB'),...at('LB'),...at('RB')]);
 const mid=avg([...at('CM'),...at('CAM')]);
 return {attack:Math.round(attack*.8+mid*.2),defence:Math.round(defence*.87+mid*.13),overall:teamRating(c)};
}
export function nextFixture(c){
 if(!c||c.round>=18)return null;
 const pair=c.fixtures[c.round].find(([home,away])=>home==='you'||away==='you');
 const home=pair[0]==='you',opp=c.rivals.find(r=>r.id===(home?pair[1]:pair[0]));
 return {round:c.round+1,home,opp};
}
function applyScore(table,home,away,hg,ag){
 const h=table.find(t=>t.id===home),a=table.find(t=>t.id===away);
 [h,a].forEach(t=>t.p++);
 h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;
 if(hg>ag){h.w++;h.pts+=3;a.l++;}
 else if(ag>hg){a.w++;a.pts+=3;h.l++;}
 else{h.d++;a.d++;h.pts++;a.pts++;}
}
export function standings(c){return [...c.table].sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);}
function saleable(c,p){
 if(c.roster.length<=11)return false;
 // Never leave the club without a goalkeeper, or without a player for a unique position.
 return c.roster.some(other=>other.id!==p.id&&other.role===p.role);
}
// Sales occur only after Round 18. Values are capped well below the cost of a
// top signing so the transfer market cannot become trivial.
const SALE_CAPS=[95000,850000,5900000];
const RESERVE_CAPS=[35000,270000,1800000];
function saleValue(c,p){
 const cap=SALE_CAPS[c.tier];
 const quality=clamp((p.ovr-(c.tier===0?46:c.tier===1?58:71))/29,.18,1);
 const future=clamp((p.potential-p.ovr)/25,0,1);
 return Math.round((cap*(.38+.35*quality+.17*future))/1000)*1000;
}
function offseasonOffers(c){
 // Choose two meaningful first-team sale candidates before clearing any reserves.
 // Keep their positional backups, so the manager can actually accept either bid.
 const originalXi=new Set(lineup(c).map(p=>p.id));
 const originals=c.roster.filter(p=>originalXi.has(p.id)&&saleable(c,p));
 const byRating=[...originals].sort((a,b)=>b.ovr-a.ovr||b.potential-a.potential);
 const byPotential=[...originals].sort((a,b)=>b.potential-a.potential||b.ovr-a.ovr);
 const picks=[];
 if(byRating[0])picks.push(byRating[0]);
 const other=byPotential.find(p=>p.id!==picks[0]?.id&&p.role!==picks[0]?.role)||
  byPotential.find(p=>p.id!==picks[0]?.id);
 if(other)picks.push(other);
 const reserved=new Set();
 for(const p of picks){
  const replacement=c.roster.filter(x=>!originalXi.has(x.id)&&x.role===p.role)
    .sort((a,b)=>b.ovr-a.ovr||b.potential-a.potential)[0];
  if(replacement)reserved.add(replacement.id);
 }
 const fringe=c.roster.filter(p=>!originalXi.has(p.id)&&!reserved.has(p.id)&&saleable(c,p))
  .filter(p=>p.age>=24||p.potential<=p.ovr+5)
  .sort((a,b)=>a.potential-b.potential||b.age-a.age);
 const fringeIds=fringe.map(p=>p.id);
 const bundle=fringe.length?Math.min(RESERVE_CAPS[c.tier],Math.round((RESERVE_CAPS[c.tier]*Math.min(1,fringe.length/5))/1000)*1000):0;
 c.roster=c.roster.filter(p=>!fringeIds.includes(p.id));
 c.budget+=bundle;
 if(fringe.length)c.memories.unshift('Group sale: '+fringe.length+' fringe reserves leave for '+formatCash(bundle)+'. Youth prospects retained.');
 const bidders=['Capital City FC','Royal Meridian','Granite County','Vanguard United','Copperford United'];
 const offers=picks.filter(p=>c.roster.some(x=>x.id===p.id)&&saleable(c,p))
  .map((p,k)=>({id:p.id,playerId:p.id,fee:saleValue(c,p),kind:k===0?'STAR PLAYER':'HIGH-POTENTIAL TALENT',
   buyer:bidders[(c.season*2+c.tier*3+k)%bidders.length],ovr:p.ovr,potential:p.potential,age:p.age,role:p.role,name:p.name}));
 return {reviewed:false,offers,fringe:{count:fringe.length,names:fringe.map(p=>p.name),fee:bundle},
  sale:null,startingBudget:c.budget,annualCap:SALE_CAPS[c.tier]};
}

export function resolveOffseason(input,playerId=null){
 const s=clone(input),c=s.career;
 if(!c||!c.seasonComplete||c.report||!c.offseason||c.offseason.reviewed)return s;
 if(playerId!==null){
  const o=c.offseason.offers.find(o=>o.playerId===playerId);
  const p=c.roster.find(p=>p.id===playerId);
  if(!o||!p||!saleable(c,p))return s;
  const before=teamRating(c);c.roster=c.roster.filter(x=>x.id!==p.id);
  c.budget+=o.fee;
  c.supporters=Math.max(200,c.supporters-90);
  c.offseason.sale={...o,teamChange:teamRating(c)-before};
  c.memories.unshift(p.name+' leaves for '+o.buyer+' (£'+Math.round(o.fee/1000)+'k). A new era begins.');
 }
 c.offseason.reviewed=true;
 return s;
}

export function growthWatch(c){
 const xi=new Set(lineup(c).map(p=>p.id));
 return c.roster.filter(p=>p.age<=23&&p.potential>p.ovr&&!xi.has(p.id))
  .sort((a,b)=>(b.potential-b.ovr)-(a.potential-a.ovr)||b.ovr-a.ovr).slice(0,3);
}
export function tacticalMatchup(ownStyle,rivalStyle){
 // Consistent club identity, with an optional one-match tactical edge when styles clash.
 if(!TACTICS[ownStyle]||!TACTICS[rivalStyle])return {advantage:0,label:'Unknown opponent'};
 if(ownStyle===rivalStyle)return {advantage:0,label:'Even tactical contest'};
 const wins={balanced:'counter',counter:'press',press:'balanced'};
 return wins[ownStyle]===rivalStyle
  ?{advantage:11,label:'TACTICAL EDGE · +11 ATTACK'}
  :{advantage:-7,label:'TOUGH MATCHUP · −7 ATTACK'};
}
export function signPlayer(input,id){
 const s=clone(input),c=s.career;
 if(!c||c.match||c.report||c.checkpoint||c.seasonComplete||c.signed||c.windowPassed) return s;
 const p=c.market.find(p=>p.id===id);
 if(!p||p.fee>c.budget)return s;
 const preview=transferPreview(c,p),reputationBefore=c.reputation;
 if(c.roster.length>=MAX_SQUAD)return input;
 c.roster.push({...p,origin:'transfer'});c.budget-=p.fee;c.signed=true;
 const excitement=preview.overall>0||preview.attack>0||preview.defence>0?75:20;
 c.supporters+=excitement;c.reputation=clamp(c.reputation+(preview.overall>0?1:0),0,100);
 c.lastSigning={id:p.id,name:p.name,role:p.role,age:p.age,ovr:p.ovr,potential:p.potential,fee:p.fee,
  oldName:preview.oldName,oldRating:preview.oldRating,upgrade:preview.upgrade,attack:preview.attack,defence:preview.defence,
  overall:preview.overall,budget:c.budget,supportersChange:excitement,reputationChange:c.reputation-reputationBefore};
 c.memories.unshift('NEW SIGNING: '+p.name+' arrives from the transfer market. '+(preview.upgrade>0?'+ '+preview.upgrade+' OVR over the previous '+p.role+'.':'An investment in the future.'));
 return s;
}
export function scoutPlayer(input,id){
 const s=clone(input),c=s.career;
 if(!c||c.scouted||c.signed||c.windowPassed||c.match||c.report||c.checkpoint||c.seasonComplete)return s;
 if(!c.market.some(p=>p.id===id))return s;
 c.scouted=true;c.scoutedId=id;return s;
}
export function chooseTactic(input,tactic){
 const s=clone(input),c=s.career;
 if(c&&!c.match&&!c.report&&!c.checkpoint&&!c.seasonComplete&&TACTICS[tactic]){c.tactic=tactic;c.tacticChosen=true;}
 return s;
}
function scorer(c){
 const players=lineup(c).filter(p=>['ST','LW','RW','CAM','CM'].includes(p.role));
 const weights=players.map(p=>(p.role==='ST'?5:p.role==='LW'||p.role==='RW'?3:p.role==='CAM'?2:1)*(p.ovr/65));
 const sum=weights.reduce((a,b)=>a+b,0);let x=rand(c)*sum;
 for(let i=0;i<players.length;i++){x-=weights[i];if(x<=0)return players[i];}
 return players[0];
}
export function clubBoost(c,home){
 return {confidence:Math.round((c.momentum-50)/7),crowd:home?clamp(Math.round((c.supporters-750)/250),0,7):0};
}
function half(c,match,second,choice='hold'){
 const p=profile(c),t=TACTICS[c.tactic],opp=match.fixture.opp;
 const choiceAttack=choice==='push'?10:choice==='protect'?-5:0;
 const choiceDef=choice==='protect'?9:choice==='push'?-9:0;
 const boost=clubBoost(c,match.fixture.home);
 const tactical=tacticalMatchup(c.tactic,opp.style||'balanced');
 const atk=p.attack+t.attack+choiceAttack+boost.confidence+boost.crowd+tactical.advantage;
 const def=p.defence+t.defence+choiceDef+Math.round(boost.confidence/2)+Math.round(boost.crowd/2);
 const rivalMods=TACTICS[opp.style||'balanced']||TACTICS.balanced;
 const rivalAttack=opp.strength+rivalMods.attack;
 const rivalDefence=opp.strength+rivalMods.defence;
 let events=[];
 for(let i=0;i<4;i++){
  const minute=(second?46:1)+i*11+int(c,2,10);
  const yours=rand(c)<clamp(.52+(atk-rivalDefence)*.009,.12,.88);
  const chance=yours?clamp(.37+(atk-rivalDefence)*.018+(match.fixture.home?.045:0),.09,.85)
    :clamp(.37+(rivalAttack-def)*.016-(match.fixture.home?.035:0),.09,.83);
  const goal=rand(c)<chance;
  const who=yours?'you':opp.id;
  if(goal){
   const guy=yours?scorer(c):null;
   events.push({minute,side:who,goal:true,scorer:guy?.id||null,name:guy?.name||sample(c,['A sharp counter','A corner kick','A loose ball','A thunderbolt'])});
  }else{
   events.push({minute,side:who,goal:false,name:yours?sample(c,['Chance goes begging','Shot flies just wide','Keeper makes the save']):sample(c,['A brave block','Your keeper saves','A shot misses the target'])});
  }
 }
 events.sort((a,b)=>a.minute-b.minute);return events;
}
export function kickoff(input){
 const s=clone(input),c=s.career;
 if(!c||c.match||c.report||c.checkpoint||c.seasonComplete)return s;
 const fixture=nextFixture(c);
 if(!fixture)return s;
 const match={fixture,tactic:c.tactic,first:[],second:[],phase:'half',choice:null};
 match.first=half(c,match,false);c.match=match;return s;
}
function opponentScore(c,home,away){
 const h=c.rivals.find(r=>r.id===home),a=c.rivals.find(r=>r.id===away);
 const diff=(h.strength-a.strength)*.025;
 const hGoals=int(c,0,2)+(rand(c)<clamp(.42+diff,.08,.84)?1:0);
 const aGoals=int(c,0,2)+(rand(c)<clamp(.28-diff,.08,.75)?1:0);
 return [hGoals,aGoals];
}
function growAfterMatch(c){
 const starters=lineup(c),xi=new Set(starters.map(p=>p.id));
 const growth=[],youth=[],promotions=[];
 starters.forEach(p=>{
  p.stats.apps++;p.xp=(p.xp||0)+1;
  if(p.age<=27&&p.xp>=3&&p.ovr<p.potential&&rand(c)<(p.age<=21?.48:.21)){
   p.ovr++;p.growth++;growth.push(p.name+' +1');p.xp=0;
  }else if(p.xp>=4)p.xp=2;
 });
 // Bench teenagers train with the senior team: minutes are no longer a prerequisite.
 // They improve automatically and are picked as soon as their OVR beats the starter.
 c.roster.filter(p=>!xi.has(p.id)&&p.age<=23&&p.ovr<p.potential).forEach(p=>{
  p.training=(p.training||0)+(p.age<=20?2:1);
  const threshold=p.age<=20?3:p.age<=22?3:5;
  if(p.training>=threshold){
   const gains=Math.min(p.potential-p.ovr,p.age<=19&&p.potential-p.ovr>=5?2:1);
   p.ovr+=gains;p.growth+=gains;p.training=0;
   youth.push(p.name+' +'+gains+' (training)');
  }
 });
 lineup(c).filter(p=>!xi.has(p.id)).forEach(p=>{
  promotions.push(p.name+' has earned a starting place at '+p.role+'!');
 });
 return {growth:growth.slice(0,4),youth:youth.slice(0,5),promotions:promotions.slice(0,3)};
}

export function finishMatch(input,choice='hold'){
 const s=clone(input),c=s.career;
 if(!c||!c.match||c.match.phase!=='half'||!['hold','push','protect'].includes(choice))return s;
 const m=c.match;m.choice=choice;m.second=half(c,m,true,choice);
 const events=[...m.first,...m.second],ours=events.filter(x=>x.goal&&x.side==='you').length,theirs=events.filter(x=>x.goal&&x.side!=='you').length;
 const pair=c.fixtures[c.round].find(([h,a])=>h==='you'||a==='you');
 applyScore(c.table,pair[0],pair[1],m.fixture.home?ours:theirs,m.fixture.home?theirs:ours);
 c.fixtures[c.round].filter(([h,a])=>h!=='you'&&a!=='you').forEach(([h,a])=>{
  const [hg,ag]=opponentScore(c,h,a);applyScore(c.table,h,a,hg,ag);
 });
 events.filter(x=>x.goal&&x.scorer).forEach(e=>{
  const p=c.roster.find(x=>x.id===e.scorer);if(p)p.stats.goals++;
 });
 const development=growAfterMatch(c),growth=development.growth;
 const baseIncome=ours>theirs?34000:ours===theirs?18000:9000;
 const reputationBonus=Math.round(c.reputation/10)*3000;
 const earned=baseIncome+reputationBonus;c.budget+=earned;
 const supportersBefore=c.supporters,momentumBefore=c.momentum,reputationBefore=c.reputation;
 const shock=m.fixture.opp.strength>teamRating(c)+5;
 const supportersChange=ours>theirs?(shock?280:180)+int(c,0,80):ours===theirs?40+int(c,0,30):-Math.min(c.supporters-200,45+int(c,0,45));
 c.supporters=Math.max(200,c.supporters+supportersChange);
 c.momentum=clamp(c.momentum+(ours>theirs?17:ours===theirs?3:-13),0,100);
 c.reputation=clamp(c.reputation+(ours>theirs?(shock?5:3):ours===theirs?1:-1),0,100);
 const report={fixture:m.fixture,events,ours,theirs,earned,growth,youth:development.youth,promotions:development.promotions,
  tactical:tacticalMatchup(c.tactic,m.fixture.opp.style||'balanced'),rivalStyle:m.fixture.opp.style||'balanced',choice,
  result:ours>theirs?'WIN':ours===theirs?'DRAW':'LOSS',tablePosition:0,
  supportersBefore,supportersChange,supportersAfter:c.supporters,reputationBonus,
  momentumBefore,momentumChange:c.momentum-momentumBefore,momentumAfter:c.momentum,
  reputationBefore,reputationChange:c.reputation-reputationBefore,reputationAfter:c.reputation,
  topScorer:(()=>{const scorers=events.filter(x=>x.goal&&x.side==='you');return scorers.length?scorers[0].name:null;})()};
 c.seasonGoals+=ours;c.round++;
 report.tablePosition=standings(c).findIndex(x=>x.id==='you')+1;
 c.seasonResults.push({round:c.round,opponent:m.fixture.opp.name,home:m.fixture.home,ours,theirs,result:report.result});
 c.report=report;c.match=null;
 if(c.round===18){
  c.seasonComplete=true;
  const finish=seasonSummary(c);
  if(finish.position===1){
   const name=c.tier===2?'Premier Crown':'Champion of '+DIVISIONS[c.tier];
   const cup={id:'run-'+c.run+'-season-'+c.season+'-title',icon:c.tier===2?'👑':'🏆',kind:'champion',
    label:name,division:DIVISIONS[c.tier],tier:c.tier,season:c.season,club:c.club,run:c.run};
   c.trophies.push(cup);c.currentTrophy=cup;
  }
  c.offseason=offseasonOffers(c);
 }
 else if(c.round%3===0)c.checkpoint=true;
 return s;
}
export function quickSim(input){
 const pre=kickoff(input);if(!pre.career?.match)return pre;
 return finishMatch(pre,'hold');
}
export function dismissReport(input){const s=clone(input);if(s.career)s.career.report=null;return s;}
export function chapterChoice(input,choice){
 const s=clone(input),c=s.career;
 if(!c||!c.checkpoint||c.report||!['attack','defence','academy'].includes(choice)||choice==='academy'&&c.roster.length>=MAX_SQUAD)return s;
 let result='';
 if(choice==='academy'){
  const role=sample(c,['ST','CAM','CB','GK','LW']);
  const rating=clamp(teamRating(c)+int(c,-6,3),45,88);
  const youth=player(c,role,rating,int(c,16,18),clamp(rating+int(c,16,23),rating,96),'academy');
  c.roster.push(youth);result='Academy surprise: '+youth.name+' ('+role+', '+rating+' OVR) joins with '+youth.potential+' potential.';
 }else{
  const roles=choice==='attack'?['ST','LW','RW','CAM']:['GK','CB','LB','RB'];
  const eligible=c.roster.filter(p=>roles.includes(p.role)).sort((a,b)=>b.ovr-a.ovr).slice(0,3);
  const target=eligible[0],secondary=eligible[1];
  const amount=target?Math.min(target.potential-target.ovr,5):0;
  if(target){target.ovr+=amount;target.growth+=amount;}
  let amount2=0;
  if(secondary){amount2=Math.min(secondary.potential-secondary.ovr,3);secondary.ovr+=amount2;secondary.growth+=amount2;}
  result=choice==='attack'?'Attacking masterclass: ':'Defensive overhaul: ';
  result+=(target?.name||'Nobody')+' +'+amount+(secondary?', '+secondary.name+' +'+amount2:'')+' OVR.';
 }
 c.memories.unshift(result);c.lastChoice={type:choice,message:result};c.checkpoint=false;generateMarket(c);c.lastChoice={type:choice,message:result};return s;
}
export function seasonSummary(c){
 const pos=standings(c).findIndex(x=>x.id==='you')+1;
 const promoted=pos<=2&&c.tier<2;
 const relegated=pos>=9&&c.tier>0;
 return {position:pos,promoted,relegated,points:c.table.find(t=>t.id==='you').pts,division:DIVISIONS[c.tier]};
}
export function advanceSeason(input){
 const s=clone(input),c=s.career;
 if(!c||!c.seasonComplete||c.report||c.season>=5||!c.offseason?.reviewed)return s;
 const summary=seasonSummary(c);
 c.careerResults.push({season:c.season,...summary});
 if(summary.promoted)c.tier++;
 else if(summary.relegated)c.tier--;
 c.season++;c.budget+=c.tier===0?180000:c.tier===1?1350000:9000000;
 c.supporters+=summary.promoted?900:summary.relegated?-250:150;
 c.reputation=clamp(c.reputation+(summary.promoted?12:summary.relegated?-6:3),0,100);c.momentum=50;
 c.roster.forEach(p=>{p.age++;p.form=0;});
 // Emergency cap only: normal fringe clear-out already happened in the season review.
 // Release only non-starting, low-ceiling players; never eject the last player in a role.
 const released=[];
 while(c.roster.length>18){
  const starting=new Set(lineup(c).map(p=>p.id));
  const fringe=c.roster.filter(p=>!starting.has(p.id)&&saleable(c,p))
    .sort((a,b)=>(a.potential+a.ovr)-(b.potential+b.ovr)||b.age-a.age);
  if(!fringe.length)break;
  c.roster=c.roster.filter(p=>p.id!==fringe[0].id);released.push(fringe[0].name);
 }
 if(released.length)c.memories.unshift('Contracts expired: '+released.join(', ')+'.');
 c.memories.unshift('Season '+(c.season-1)+' finished '+ordinal(summary.position)+'. '+(summary.promoted?'PROMOTED!':summary.relegated?'Relegated.':'Another chapter begins.'));
 buildSeason(c);return s;
}
export function archiveCareer(input){
 const s=clone(input),c=s.career;
 if(!c||!c.seasonComplete||c.report||c.season!==5||!c.offseason?.reviewed)return s;
 if(!Array.isArray(s.legacy.trophies))s.legacy.trophies=[];
 for(const trophy of c.trophies||[])if(!s.legacy.trophies.some(x=>x.id===trophy.id))s.legacy.trophies.push(trophy);
 const summary=seasonSummary(c);
 const results=[...c.careerResults,{season:c.season,...summary}];
 const top=[...c.roster].sort((a,b)=>b.ovr-a.ovr).slice(0,3);
 s.legacy.runs.unshift({id:c.run,club:c.club,finalDivision:DIVISIONS[c.tier],bestFinish:Math.min(...results.map(r=>r.position)),results,
   bestPlayer:top[0].name});
 const byGoals=[...c.roster].sort((a,b)=>b.stats.goals-a.stats.goals);
 [...top,byGoals[0]].filter(Boolean).forEach(p=>{
  if(!s.legacy.legends.some(x=>x.id===c.run+'-'+p.id)){
   s.legacy.legends.push({id:c.run+'-'+p.id,name:p.name,role:p.role,ovr:p.ovr,goals:p.stats.goals,apps:p.stats.apps,club:c.club,run:c.run});
  }
 });
 s.legacy.legends.sort((a,b)=>b.ovr-a.ovr||b.goals-a.goals);
 s.legacy.points+=Math.max(2,10-summary.position)+(summary.promoted?3:0);
 s.career=null;return s;
}
export function formatCash(amount){return '£'+(amount>=1000000?(amount/1000000).toFixed(2)+'m':Math.round(amount/1000)+'k');}
export function ordinal(n){return n+(n%10===1&&n!==11?'st':n%10===2&&n!==12?'nd':n%10===3&&n!==13?'rd':'th');}
export function migrateState(s){
 if(!s||s.version!==VERSION||!s.legacy)return s;
 if(!Array.isArray(s.legacy.trophies))s.legacy.trophies=[];
 const addHistoric=(target,run,club,results)=>{
  for(const result of results||[]){
   if(result.position!==1)continue;
   const tier=DIVISIONS.indexOf(result.division);
   if(tier<0||!Number.isInteger(result.season))continue;
   const award={id:'run-'+run+'-season-'+result.season+'-title',icon:tier===2?'👑':'🏆',
    kind:'champion',label:tier===2?'Premier Crown':'Champion of '+DIVISIONS[tier],
    division:DIVISIONS[tier],tier,season:result.season,club,run};
   if(!target.some(x=>x.id===award.id))target.push(award);
  }
 };
 // Reconstruct genuine first-place awards from old career-history ledgers.
 for(const run of s.legacy.runs||[])addHistoric(s.legacy.trophies,run.id,run.club,run.results);
 if(!s.career)return s;
 const c=s.career;
 if(!Array.isArray(c.trophies))c.trophies=[];
 addHistoric(c.trophies,c.run,c.club,c.careerResults);
 if(c.seasonComplete&&seasonSummary(c).position===1){
  addHistoric(c.trophies,c.run,c.club,[{position:1,season:c.season,division:DIVISIONS[c.tier]}]);
  c.currentTrophy=c.trophies.find(x=>x.season===c.season)||null;
 }
 // First prototype had no fan/reputation/matchday checklist fields.
 if(typeof c.supporters!=='number')c.supporters=c.id==='seabrook'?1100:c.id==='ironvale'?780:920;
 if(typeof c.momentum!=='number')c.momentum=50;
 if(typeof c.reputation!=='number')c.reputation=10;
 if(!Array.isArray(c.saleOffers))c.saleOffers=[];
 if(!Array.isArray(s.legacy.trophies))s.legacy.trophies=[];
 if(!Array.isArray(c.trophies))c.trophies=[];
 // Earlier preview careers carry over; old in-season sale offers are suppressed.
 if(!c.seasonComplete)c.saleOffers=[];
 if(c.seasonComplete&&!c.offseason)c.offseason=offseasonOffers(c);
 if(typeof c.sold!=='boolean')c.sold=false;
 if(!c.tactic||!TACTICS[c.tactic])c.tactic='balanced';
 (c.rivals||[]).forEach((r,i)=>{
  if(!r.style){const info=(RIVAL_POOLS[c.tier]||RIVAL_POOLS[0])[i];r.style=info?.[1]||'balanced';r.trait=info?.[2]||'Determined';r.color=info?.[3]||'#9abdb4';r.nickname=info?.[4]||'The Rivals';r.venue=info?.[5]||'The Stadium';}
 });
 c.tacticChosen=!!c.tacticChosen;
 c.windowPassed=!!c.windowPassed;
 if(c.signed&&!c.lastSigning){
  const p=[...c.roster].reverse().find(p=>p.origin==='transfer');
  if(p){
   const without={...c,roster:c.roster.filter(x=>x.id!==p.id)};
   const preview=transferPreview(without,p);
   c.lastSigning={id:p.id,name:p.name,role:p.role,age:p.age,ovr:p.ovr,
    potential:p.potential,fee:0,oldName:preview.oldName,oldRating:preview.oldRating,
    upgrade:preview.upgrade,attack:preview.attack,defence:preview.defence,
    overall:preview.overall,budget:c.budget,supportersChange:0,reputationChange:0};
  }
 }
 return s;
}

export function validState(s){
 if(!s||s.version!==VERSION||!s.legacy||!Array.isArray(s.legacy.runs))return false;
 const c=s.career;if(!c)return true;
 if(!CLUBS.some(x=>x.id===c.id)||c.round<0||c.round>18||c.roster.length<11||c.market.length!==5)return false;
 if(c.budget<0||new Set(c.roster.map(p=>p.id)).size!==c.roster.length)return false;
 if(!Number.isFinite(c.supporters)||c.supporters<200||!Number.isFinite(c.momentum)||c.momentum<0||c.momentum>100||!Number.isFinite(c.reputation)||c.reputation<0||c.reputation>100)return false;
 if(c.table.length!==10||c.table.some(x=>x.p!==c.round))return false;
 if(!Array.isArray(c.trophies)||!Array.isArray(s.legacy.trophies))return false;
 if(c.seasonComplete&&(!c.offseason||!Array.isArray(c.offseason.offers)||c.offseason.offers.length>2))return false;
 if(c.offseason&&c.offseason.fringe.fee>RESERVE_CAPS[c.tier])return false;
 if(!TACTICS[c.tactic]||!Array.isArray(c.saleOffers)||c.saleOffers.length>2)return false;
 if(c.roster.some(p=>p.ovr>p.potential||p.ovr<0||p.potential>99))return false;
 if(c.match&&c.report)return false;
 return true;
}
