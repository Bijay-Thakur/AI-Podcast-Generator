# 🚀 Running Instructions - Quick Reference

## ⚠️ Important URLs

- **Frontend (Your App)**: `http://localhost:5173` ← **USE THIS ONE!**
- **Backend API**: `http://localhost:3000` ← Only for API calls, not for browsing

## ✅ How to Run

### Step 1: Start Everything
```bash
npm run dev:full
```

This starts:
- ✅ Backend API on `http://localhost:3000`
- ✅ Frontend on `http://localhost:5173`

### Step 2: Open the Frontend
**Go to:** `http://localhost:5173` (NOT localhost:3000!)

The frontend will automatically proxy API calls to the backend.

---

## 🔍 Testing

### Test Backend is Working:
Visit: `http://localhost:3000/api/health`
- Should show JSON with environment variable status
- If you see "Cannot GET /" at root, that's normal - use `/api/health`

### Test Frontend is Working:
Visit: `http://localhost:5173`
- Should show the VoxGen app interface
- Try generating a script

---

## ❌ Common Mistakes

1. **Opening `localhost:3000` instead of `localhost:5173`**
   - ❌ Wrong: `http://localhost:3000` (this is just the API)
   - ✅ Right: `http://localhost:5173` (this is your app)

2. **Backend not running**
   - Make sure you see "🚀 Local API server running" in terminal
   - If not, run `npm run dev:local` in a separate terminal

3. **API calls failing**
   - Check backend is running: `http://localhost:3000/api/health`
   - Check `.env` file has correct variables (no `VITE_` prefix)

---

## 📋 Quick Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] `.env` file exists with API keys
- [ ] Opening `http://localhost:5173` (not 3000!)
- [ ] `/api/health` endpoint works

---

## 🎯 Summary

**Always open:** `http://localhost:5173` (frontend)

The backend at `localhost:3000` is just for API calls - you don't browse it directly!

