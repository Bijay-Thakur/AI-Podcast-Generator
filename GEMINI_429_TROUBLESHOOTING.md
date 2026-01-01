# 🔍 Gemini 429 Error Troubleshooting

## Why You're Still Getting 429 Even With New API Key

### Possible Causes:

1. **Free Tier Limits**: Gemini free tier has strict rate limits
   - **Requests per minute**: Usually 15-60 requests/minute
   - **Daily quota**: Limited requests per day
   - **New keys start with same limits**

2. **IP-Based Rate Limiting**: Google may rate limit by IP address, not just API key
   - If you've made many requests from your IP, you might be temporarily blocked
   - Solution: Wait 5-10 minutes or use a different network

3. **Quota Exceeded**: Your API key might have hit its daily/monthly quota
   - Check: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Look for "Quota" or "Usage" section

4. **Billing Not Enabled**: Some Gemini features require billing
   - Free tier has very limited quotas
   - Solution: Enable billing in Google Cloud Console

## ✅ Solutions

### Solution 1: Wait and Retry
- Wait **5-10 minutes** before trying again
- The system now automatically retries with delays (up to 5 times)
- Each retry waits longer: 2s, 4s, 8s, 16s, 32s

### Solution 2: Check Your Quota
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on your API key
3. Check "Quota" section
4. See if you've exceeded limits

### Solution 3: Enable Billing (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing for your project
3. This increases your quota significantly

### Solution 4: Use OpenAI Instead
- Switch to OpenAI provider in the app
- OpenAI free tier is more generous
- Or use both (fallback option)

### Solution 5: Reduce Request Frequency
- Don't generate multiple scripts quickly
- Wait 30-60 seconds between requests
- The system now adds 1-second delay before Gemini requests

## 🔍 How to Check What's Happening

### Check Server Logs
When you make a request, check your terminal for:
- `📝 Script generation request received`
- `🤖 Using Gemini API...`
- `⏳ Rate limited, retrying...` (if retrying)
- `❌ Rate limit exceeded after X attempts` (if failed)

### Check Error Message
The error message will tell you:
- If it's from Gemini: "Gemini API rate limit exceeded..."
- If it's from our server: "Too many requests to our server..."
- If it's quota: "Gemini API quota exceeded..."

## 📊 Current Rate Limit Settings

- **Our Server**: 100 requests per 15 minutes (increased from 50)
- **Gemini Retries**: Up to 5 attempts with exponential backoff
- **Pre-request Delay**: 1 second before each Gemini call
- **Between Retries**: 2s, 4s, 8s, 16s, 32s delays

## 🎯 Quick Fixes

1. **Wait 5 minutes** - Most rate limits reset quickly
2. **Check quota** - Visit Google AI Studio dashboard
3. **Enable billing** - Increases quota significantly
4. **Use OpenAI** - Switch provider in the app
5. **Reduce usage** - Generate scripts less frequently

## 💡 Prevention

- The system now automatically:
  - Adds delays between requests
  - Retries with exponential backoff
  - Shows clear error messages
  - Logs detailed information

If you still get 429 after waiting, it's likely a quota/billing issue with Google, not our code.

