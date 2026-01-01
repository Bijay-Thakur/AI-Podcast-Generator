# 🚀 Local Development Setup Guide

## Problem
After the security refactoring, API routes are now Vercel serverless functions. Running just `npm run dev` won't work because the `/api` routes need a serverless runtime.

## Solution: Two Options

### Option 1: Use Vercel Dev (Recommended) ✅

This runs both the frontend and API routes together.

**Step 1: Install Vercel CLI** (if not already installed)
```bash
npm i -g vercel
```

**Step 2: Create `.env` file** in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_MALE=your_male_voice_id
ELEVENLABS_VOICE_FEMALE=your_female_voice_id
```

**Step 3: Run Vercel Dev**
```bash
npm run dev:vercel
```

Or directly:
```bash
vercel dev
```

This will:
- Start the frontend on `http://localhost:5173` (or another port)
- Start API routes on `http://localhost:3000`
- Automatically proxy `/api` requests
- Use environment variables from `.env` file

**Step 4: Open your browser**
Navigate to the URL shown in terminal (usually `http://localhost:5173`)

---

### Option 2: Use Vite Dev with Separate API Server

If you prefer to run them separately:

**Terminal 1: Start API server**
```bash
vercel dev --listen 3000
```

**Terminal 2: Start frontend**
```bash
npm run dev
```

The Vite proxy will forward `/api` requests to `localhost:3000`.

---

## Troubleshooting

### Issue: "vercel: command not found"
**Solution**: Install Vercel CLI globally:
```bash
npm i -g vercel
```

### Issue: API routes return 404
**Solution**: Make sure you're using `vercel dev` or have the proxy configured. Check that:
1. `.env` file exists in root directory
2. Environment variables are set correctly
3. You're accessing the app through the Vite dev server URL

### Issue: "Cannot find module '@vercel/node'"
**Solution**: Install dependencies:
```bash
npm install
```

### Issue: Environment variables not working
**Solution**: 
1. Check `.env` file is in root directory (same level as `package.json`)
2. Make sure variable names don't have `VITE_` prefix
3. Restart the dev server after changing `.env`

### Issue: CORS errors
**Solution**: The API routes have CORS headers configured. If you see CORS errors:
1. Make sure you're using `vercel dev` (not just `npm run dev`)
2. Check that API_BASE_URL in `lib/backendApi.ts` is `/api` (relative path)

---

## Quick Test

1. **Check health endpoint**: Visit `http://localhost:5173/api/health`
   - Should return JSON with env var status
   - If 404, API routes aren't running

2. **Test in browser console**:
   ```javascript
   fetch('/api/health').then(r => r.json()).then(console.log)
   ```
   - Should show environment variable status

3. **Generate a script**: Try generating a script in the app
   - If it fails, check browser console for errors
   - Check terminal for API route errors

---

## Environment Variables Checklist

Make sure your `.env` file has (without `VITE_` prefix):
- ✅ `GEMINI_API_KEY` or `OPENAI_API_KEY` (at least one)
- ✅ `ELEVENLABS_API_KEY`
- ✅ `ELEVENLABS_VOICE_MALE`
- ✅ `ELEVENLABS_VOICE_FEMALE`

---

## Still Not Working?

1. **Check Vercel CLI version**:
   ```bash
   vercel --version
   ```
   Should be 28.0.0 or higher

2. **Check Node version**:
   ```bash
   node --version
   ```
   Should be 18.x or higher

3. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check `.env` file location**: Should be in root directory, same level as `package.json`

5. **Verify API routes exist**: Check that `api/` folder has these files:
   - `health.ts`
   - `generate-script.ts`
   - `refine-script.ts`
   - `generate-voice.ts`
   - `get-voice-ids.ts`

