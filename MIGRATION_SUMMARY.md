# Security Refactoring - Migration Summary

## Overview
This refactoring moves all AI API calls from the frontend to a secure backend layer, preventing API keys from being exposed in the browser.

## Files Created

### Backend API Routes (`/api/`)
- `api/health.ts` - Health check endpoint for debugging
- `api/generate-script.ts` - Script generation using Gemini/OpenAI
- `api/refine-script.ts` - Script refinement
- `api/generate-voice.ts` - ElevenLabs TTS generation
- `api/get-voice-ids.ts` - Voice ID retrieval

### Frontend Changes
- `lib/backendApi.ts` - New backend API client (single source of truth)
- `vercel.json` - Vercel serverless function configuration

## Files Modified

### Core API Layer
- `lib/podcast-api.ts` - Refactored to use backend API instead of direct calls
  - Removed: `callGemini()`, `callOpenAI()`, `generateElevenLabsAudio()`
  - Updated: `generateScript()`, `refineScript()`, `getVoiceId()` (now async)
  - Kept: `generatePodcastAudio()` logic (script parsing, audio concatenation)

### Components
- `components/PodcastGenerator.tsx` - Updated to handle async `getVoiceId()`
- `components/ScriptEditor.tsx` - Removed voice ID checks (now handled at generation time)

### Configuration
- `vite-env.d.ts` - Removed all `VITE_*` API key types
- `README.md` - Updated with new deployment instructions
- `package.json` - Added `@vercel/node` and `@types/node` dev dependencies

## Environment Variables

### ❌ REMOVED (No longer needed in frontend)
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_OPENAI_MODEL`
- `VITE_ELEVENLABS_API_KEY`
- `VITE_ELEVENLABS_VOICE_MALE`
- `VITE_ELEVENLABS_VOICE_FEMALE`

### ✅ NEW (Server-side only)
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, defaults to gpt-4o-mini)
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_MALE`
- `ELEVENLABS_VOICE_FEMALE`

### Optional (Frontend)
- `VITE_BACKEND_BASE_URL` - Only needed if backend is on different domain

## Security Improvements

1. ✅ **No API keys in frontend** - All keys stored server-side
2. ✅ **Input validation** - All requests validated server-side
3. ✅ **Request size limits** - Prevents abuse
4. ✅ **Timeouts** - 60s for script generation, 30s for TTS
5. ✅ **Error handling** - Safe error messages without exposing secrets
6. ✅ **CORS headers** - Properly configured for cross-origin requests

## Breaking Changes

### API Function Signatures
- `getVoiceId()` is now **async** - returns `Promise<string>` instead of `string`
  - Updated in: `PodcastGenerator.tsx`

### Environment Variables
- All `VITE_*` variables removed from frontend
- Must set server-side variables in Vercel dashboard

## Testing Checklist

- [x] Script generation with Gemini
- [x] Script generation with OpenAI
- [x] Script refinement
- [x] Voice generation (male)
- [x] Voice generation (female)
- [x] Audio concatenation
- [x] Error handling
- [x] Health check endpoint

## Deployment Steps

1. **Set environment variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all server-side variables (GEMINI_API_KEY, etc.)
   - Set for Production, Preview, and Development

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Verify**:
   - Visit `/api/health` - should show env var status
   - Test script generation
   - Test audio generation

## Rollback Plan

If issues occur:

1. **Quick rollback**: Vercel dashboard → Deployments → Previous deployment → Promote
2. **Check env vars**: Verify all server-side variables are set
3. **Check health**: Visit `/api/health` endpoint
4. **Local test**: Run `vercel dev` to test locally

## Notes

- Frontend functionality remains **identical** - no UI/UX changes
- All existing features work the same way
- Audio playback unchanged
- Mobile compatibility maintained

