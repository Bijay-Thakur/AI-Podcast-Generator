# 🚀 Quick Start - How to Run Locally

## The Problem
After the security refactoring, API routes are now serverless functions. You **cannot** just run `npm run dev` anymore - you need Vercel CLI to run the API routes.

## ✅ Solution: Install Vercel CLI and Run

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

**On Windows (PowerShell as Administrator):**
```powershell
npm install -g vercel
```

**Verify installation:**
```bash
vercel --version
```

### Step 2: Create `.env` File

Create a file named `.env` in the root directory (same folder as `package.json`) with:

```env
GEMINI_API_KEY=your_actual_gemini_key_here
OPENAI_API_KEY=your_actual_openai_key_here
ELEVENLABS_API_KEY=your_actual_elevenlabs_key_here
ELEVENLABS_VOICE_MALE=your_male_voice_id
ELEVENLABS_VOICE_FEMALE=your_female_voice_id
```

**Important:**
- ❌ NO `VITE_` prefix
- ✅ Use actual API keys (replace the placeholder text)
- ✅ File should be named exactly `.env` (not `.env.txt`)

### Step 3: Run the App

```bash
npm run dev:vercel
```

Or directly:
```bash
vercel dev
```

### Step 4: Open Browser

Vercel will show you a URL like:
```
➜ Local: http://localhost:3000
```

Open that URL in your browser.

---

## 🔍 Verify It's Working

1. **Check Health Endpoint**: Visit `http://localhost:3000/api/health`
   - Should show JSON with environment variable status
   - If you see 404, something is wrong

2. **Test in App**: 
   - Select a topic
   - Generate a script
   - If it works, you're good! ✅

---

## ❌ Common Issues

### "vercel: command not found"
**Fix**: Install Vercel CLI:
```bash
npm install -g vercel
```

### "Cannot find module '@vercel/node'"
**Fix**: Install dependencies:
```bash
npm install
```

### API calls fail / 404 errors
**Fix**: Make sure you're using `vercel dev`, not `npm run dev`

### Environment variables not working
**Fix**: 
1. Check `.env` file is in root directory
2. Check variable names don't have `VITE_` prefix
3. Restart `vercel dev` after changing `.env`

---

## 📝 Alternative: If You Can't Install Vercel CLI

If you absolutely cannot install Vercel CLI, you have two options:

### Option A: Deploy to Vercel (Free)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Use the deployed URL

### Option B: Temporary Workaround (Not Recommended)
You could temporarily revert to the old code, but this defeats the security purpose.

---

## 🎯 What Should Happen

When you run `vercel dev`:
1. ✅ Terminal shows "Vercel CLI" starting
2. ✅ Shows "Local: http://localhost:XXXX"
3. ✅ Frontend loads in browser
4. ✅ `/api/health` endpoint works
5. ✅ Script generation works
6. ✅ Audio generation works

If all of these work, you're set! 🎉

