import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const game = readFileSync(new URL('../src/v2/BrainrotV2.jsx', import.meta.url), 'utf8');

test('match is already playable when the pitch first loads', () => {
  assert.match(game, /useState\(\(\)=>\(\{shots:\[\],rivals:\[\]\}\)\)/);
  assert.match(game, /\[phase,setPhase\]=useState\('ready'\)/);
  assert.doesNotMatch(game, /phase==='intro'&&/);
});
test('clicking the goal locks the aim without following pointer movement', () => {
  assert.match(game, /onPointerDown=\{point\}/);
  assert.match(game, /setAimLocked\(true\)/);
  assert.doesNotMatch(game, /onPointerMove=\{point\}/);
  assert.match(game, /disabled=\{phase!=='ready'\|\|!aimLocked\}/);
});
test('results move to the next shot automatically with an optional skip', () => {
  assert.match(game, /setTimeout\(\(\)=>advance\(\),1850\)/);
  assert.match(game, /onClick=\{advance\}>NEXT KICK/);
});
test('the pitch tells the football story before introducing the pack shop', () => {
  assert.match(game, /WE'RE NOT SUPPOSED/);
  assert.match(game, /const stories=\[/);
  assert.match(game, /Surprise Packs/);
  assert.doesNotMatch(game, /v2-header-pack/);
});
