# 🚀 How to Run the Project

## ✅ Works Both Locally AND on Vercel!

The project now has **two backend options**:
1. **Local Express server** - Works on your machine without Vercel CLI
2. **Vercel serverless functions** - Works when deployed to Vercel

**API keys are protected in BOTH cases!** 🔒

---

## 🏠 Local Development (Your Machine)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create `.env` File
Create a `.env` file in the root directory with:

```env
GEMINI_API_KEY=your_actual_gemini_key
OPENAI_API_KEY=your_actual_openai_key
ELEVENLABS_API_KEY=your_actual_elevenlabs_key
ELEVENLABS_VOICE_MALE=your_male_voice_id
ELEVENLABS_VOICE_FEMALE=your_female_voice_id
```

**Important:** No `VITE_` prefix! These are server-side variables.

### Step 3: Run the App

**Easiest way (runs both frontend and backend):**
```bash
npm run dev:full
```

This will:
- ✅ Start backend API server on `http://localhost:3000`
- ✅ Start frontend on `http://localhost:5173`
- ✅ Proxy API calls automatically
- ✅ Protect your API keys (never sent to browser)

**Alternative (run separately):**

Terminal 1:
```bash
npm run dev:local
```

Terminal 2:
```bash
npm run dev
```

### Step 4: Open Browser
Go to `http://localhost:5173`

### Step 5: Test It Works
1. Visit `http://localhost:3000/api/health` - should show your env vars
2. Try generating a script in the app
3. If it works, you're all set! ✅

---

## ☁️ Deployment to Vercel

### Step 1: Deploy
```bash
vercel --prod
```

Or connect your GitHub repo to Vercel.

### Step 2: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_MALE`
- `ELEVENLABS_VOICE_FEMALE`

### Step 3: Done!
Vercel will automatically use the serverless functions in `/api` folder.

---

## 🔍 Troubleshooting

### "Cannot find module 'express'"
**Fix:** Run `npm install`

### Backend not starting
**Fix:** 
1. Check `.env` file exists
2. Check Node version: `node --version` (should be 18+)
3. Try running backend separately: `npm run dev:local`

### API calls return 404
**Fix:**
1. Make sure backend is running (`npm run dev:local`)
2. Check `http://localhost:3000/api/health` works
3. Make sure frontend is using proxy (check `vite.config.ts`)

### Environment variables not working
**Fix:**
1. `.env` file must be in root directory
2. Variable names must NOT have `VITE_` prefix
3. Restart the server after changing `.env`

---

## 📋 Quick Commands Reference

```bash
# Run everything (recommended)
npm run dev:full

# Run backend only
npm run dev:local

# Run frontend only
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## ✅ Security Check

Your API keys are protected if:
- ✅ `.env` file is in root directory
- ✅ Variables don't have `VITE_` prefix
- ✅ Backend server is running
- ✅ Browser console doesn't show API keys
- ✅ `/api/health` shows env vars are set (but not their values)

---

## 🎯 Summary

- **Local:** Use `npm run dev:full` - works without Vercel CLI
- **Vercel:** Deploy normally - uses serverless functions
- **Both:** API keys are protected server-side
- **No Vercel CLI needed** for local development!

