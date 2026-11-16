# Brainrot FC — Reloaded V2 ⚽

A mobile-friendly, single-player penalty shootout game with collectible football oddballs, random three-player packs, five leagues, and skill-based shooting.

**Live:** https://www.brainrotfc.com/  
**Game:** https://www.brainrotfc.com/game  
**Stack:** React 18, Vite 5, plain CSS; hosted on Vercel.

## Playing

1. Enter **The Pitch** and start a shootout.
2. Tap/click the goal to aim. On desktop, the arrow keys also work.
3. Watch the timing bar and press **SHOOT** / Space when the white marker reaches the green sweet spot.
4. Score more than the rival over five kicks. Ties go into sudden death, capped at eight kicks.
5. Earn coins; unlock three random character cards in each pack; select your striker in **My Squad**.
6. Win the required number of shootouts to advance through five increasingly challenging leagues.

### Gameplay basics

- Aim dictates where the ball goes, modified by release precision and each striker's Control.
- Power, timing, striker type and keeper skill all affect save probabilities.
- Finesse, Rocket, Freeze, Steady, Precision and Chaos characters have different gameplay attributes.
- Duplicates from packs return 120 coins per duplicate.
- Save data lives in your browser's `localStorage`. No account, real-money transactions or remote leaderboard.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

`npm run build` executes the game-engine regression tests before generating production assets.

Game code: `src/v2/BrainrotV2.jsx`, `src/v2/game.js`, and `src/v2/brainrot-v2.css`.

**Legacy routes:** `/messi-vs-ronaldo` and `/prototype` are preserved but not part of the V2 game. The old V1 page is retained only as unused source.

## Release

GitHub is linked to the `brainrotfc` Vercel project. Feature branches deploy previews; `main` deploys production. Verify tests and preview before merging to `main`.

## Notes

V2 is deliberately a small, polished arcade game. The saved game is device-specific, and packs/coins are client-side-only; competitive leaderboards and cloud sync would require a backend and anti-cheat protection.
