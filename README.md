# Brain Rot FC 🧠⚽

Italian meme football game - Ultimate Team style!

## Deploy to Vercel (Free)

### Step 1: Push to GitHub
1. Create new repo on GitHub called `brainrotfc`
2. Upload all these files to that repo

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New Project"
4. Import your `brainrotfc` repo
5. Click "Deploy" (settings are auto-detected)
6. Wait ~1 minute - done!

### Step 3: Add Custom Domain
1. In Vercel dashboard, click your project
2. Go to "Settings" → "Domains"
3. Add `brainrotfc.com`
4. Vercel will show you DNS records to add

### Step 4: Update DNS (at your domain registrar)
Add these records where you bought the domain:

**Option A - Vercel DNS (recommended):**
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**Wait 5-30 minutes for DNS to propagate**

## Local Development
```bash
npm install
npm run dev
```

## Tech Stack
- React 18
- Vite
- Vanilla CSS-in-JS
