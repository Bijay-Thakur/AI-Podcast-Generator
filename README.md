# 🎙️ VoxGen - AI Podcast Studio

<div align="center">

![VoxGen Logo](https://img.shields.io/badge/VoxGen-AI%20Podcast%20Studio-purple?style=for-the-badge)

**Create stunning, professional podcasts with the power of AI**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Keys](#-api-keys) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

- **🎯 Smart Topic Selection**: Choose from preset topics or create your own custom topic
- **🤖 AI-Powered Script Generation**: Generate professional podcast scripts using Google Gemini or OpenAI (GPT-4)
- **✍️ Script Refinement**: Edit and refine your script with AI assistance
- **🎤 Natural Voice Synthesis**: Create lifelike podcast audio with ElevenLabs' advanced text-to-speech
- **👥 Multi-Speaker Support**: Generate conversations between host and guest with different voice genders
- **🎨 Beautiful UI**: Modern, responsive interface with smooth animations
- **⏱️ Perfect Synchronization**: Real-time visual feedback showing which speaker is talking
- **🎵 Custom Podcast Length**: Control the duration of your podcast (2-30+ minutes)
- **💾 Local Storage**: Your preferences and progress are saved automatically

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- API keys for:
  - [Google Gemini](https://makersuite.google.com/app/apikey) OR [OpenAI](https://platform.openai.com/api-keys)
  - [ElevenLabs](https://elevenlabs.io/app/settings/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/voxgen-ai-podcast-studio.git
   cd voxgen-ai-podcast-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with server-side variables:
   ```bash
   # Create .env file
   touch .env
   ```
   
   Add your API keys (see [API Keys section](#-api-keys--environment-variables) above):
   ```env
   GEMINI_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ELEVENLABS_API_KEY=your_key_here
   ELEVENLABS_VOICE_MALE=your_voice_id
   ELEVENLABS_VOICE_FEMALE=your_voice_id
   ```
   
   > ⚠️ **Important**: Never commit your `.env` file to version control!

4. **Start the development server**
   
   **Option A: Run everything together (Recommended)**
   ```bash
   npm run dev:full
   ```
   This starts:
   - Backend API server on `http://localhost:3000`
   - Frontend dev server on `http://localhost:5173`
   - API keys are protected on the backend
   
   **Option B: Run separately (if Option A doesn't work)**
   
   Terminal 1 (Backend):
   ```bash
   npm run dev:local
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (frontend will proxy API calls to backend)
   
   **Verify it's working:**
   - Visit `http://localhost:3000/api/health` - should show env var status
   - Try generating a script in the app

## 🔑 API Keys & Environment Variables

### ⚠️ Security Update

**All API keys are now stored server-side for security.** The frontend no longer has access to API keys. This prevents keys from being exposed in the browser.

### Local Development Setup

For local development, you need to set up environment variables in **two places**:

#### 1. Backend Environment Variables (Server-side)

Create a `.env` file in the root directory with **server-side** variables (no `VITE_` prefix):

```env
# Choose ONE: Gemini OR OpenAI (or use both for flexibility)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini

# ElevenLabs (Required)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_MALE=your_male_voice_id_here
ELEVENLABS_VOICE_FEMALE=your_female_voice_id_here
```

> ⚠️ **Important**: These are server-side variables. They are **never** sent to the browser.

#### 2. Frontend Environment Variables (Optional)

Only needed if your backend is on a different domain:

```env
# Optional: Only if backend is on different domain
VITE_BACKEND_BASE_URL=https://your-backend-domain.com
```

If not set, the frontend will use relative `/api` routes (recommended for Vercel).

### Required API Keys

1. **Google Gemini** OR **OpenAI**
   - **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Used for generating podcast scripts

2. **ElevenLabs**
   - Get your API key from [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
   - Get voice IDs from [ElevenLabs Voices](https://elevenlabs.io/app/voices)
   - Used for text-to-speech audio generation

> ⚠️ **Important**: Never commit your `.env` file to version control! It's already included in `.gitignore`.

## 📖 Usage

### Step 1: Select a Topic

- Choose from preset topics (AI, Technology, Business, etc.)
- Or create your own custom topic
- Selected topics are highlighted with a glowing border effect

### Step 2: Generate Your Script

1. Select your AI provider (Gemini or ChatGPT)
2. Choose podcast length (e.g., 5-10 minutes, 15 minutes)
3. Select voice genders:
   - Host gender (Male or Female)
   - Guest gender (automatically set to opposite of host)
4. Click "Generate Script"
5. Watch the AI generate your script with a beautiful animation
6. Review and edit your script if needed
7. Optionally refine the script with AI assistance
8. Click "Confirm Script" when satisfied

### Step 3: Generate Podcast Audio

1. Review your script summary
2. Click "Generate" to create the audio
3. Wait for audio generation (this may take a few minutes)
4. Once complete, click "Play" to listen
5. Watch the visual feedback showing which speaker is talking
6. Enjoy your professional podcast!

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### AI & APIs
- **Google Gemini API** - Script generation
- **OpenAI GPT-4** - Alternative script generation
- **ElevenLabs API** - Voice synthesis
- **Web Audio API** - Audio processing and concatenation

### Features & Libraries
- **Sonner** - Toast notifications
- **Local Storage** - User preference persistence
- **Session Storage** - Audio timing data

## 📁 Project Structure

```
voxgen-ai-podcast-studio/
├── api/                 # Backend API routes (Vercel serverless functions)
│   ├── health.ts       # Health check endpoint
│   ├── generate-script.ts  # Script generation
│   ├── refine-script.ts     # Script refinement
│   ├── generate-voice.ts    # Voice synthesis
│   └── get-voice-ids.ts     # Voice ID retrieval
├── components/          # React components
│   ├── ui/             # Reusable UI components (Shadcn)
│   ├── PodcastAssistant.tsx
│   ├── PodcastGenerator.tsx
│   ├── ScriptEditor.tsx
│   ├── TopicSelector.tsx
│   └── WritingAnimation.tsx
├── lib/                # Core utilities
│   ├── backendApi.ts   # Backend API client (frontend)
│   ├── podcast-api.ts  # High-level API functions
│   └── utils.ts        # Helper functions
├── styles/             # Global styles
├── vercel.json         # Vercel configuration
├── .env                # Environment variables (server-side, not committed)
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
└── vite.config.ts      # Vite configuration
```

## 🎯 Key Features Explained

### Intelligent Script Generation
- Uses advanced AI models to create natural, conversational scripts
- Supports custom topics and themes
- Generates scripts with proper host/guest introductions
- Maintains consistent show branding ("VoxGen AI Podcast Studio")

### Multi-Speaker Audio Generation
- Generates separate audio for each speaker segment
- Uses different voice IDs for host and guest
- Concatenates audio segments seamlessly
- Tracks precise timing for visual synchronization

### Real-Time Synchronization
- Decodes audio to get accurate durations
- Maps audio playback time to script segments
- Shows visual feedback (glowing borders) for active speaker
- Smooth transitions between speakers

## 🔒 Security & Privacy

- **API Keys**: Stored server-side in environment variables (never exposed to browser)
- **Backend API**: All AI API calls go through secure serverless functions
- **Privacy-First**: Your scripts and audio are processed but not stored on external servers (except API calls)
- **Session Storage**: Timing data stored only in browser session
- **Input Validation**: All requests are validated server-side
- **Rate Limiting**: Basic rate limiting on API endpoints
- **Error Handling**: Safe error messages without exposing secrets

## 🚀 Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The production build will be in the `dist/` directory.

## 📦 Deployment to Vercel

### Step 1: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the project**:
   ```bash
   vercel
   ```
   
   Or connect your GitHub repo to Vercel for automatic deployments.

### Step 2: Set Environment Variables on Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

**Required Server-Side Variables** (these are used by API routes):
- `GEMINI_API_KEY` = your_gemini_api_key
- `OPENAI_API_KEY` = your_openai_api_key (optional if using Gemini)
- `OPENAI_MODEL` = gpt-4o-mini (optional, defaults to gpt-4o-mini)
- `ELEVENLABS_API_KEY` = your_elevenlabs_api_key
- `ELEVENLABS_VOICE_MALE` = your_male_voice_id
- `ELEVENLABS_VOICE_FEMALE` = your_female_voice_id

**Important Notes**:
- ✅ Set these for **Production**, **Preview**, and **Development** environments
- ❌ **DO NOT** set any `VITE_*` variables (they're no longer needed)
- 🔒 These variables are **never** exposed to the browser

### Step 3: Verify Deployment

1. Visit your deployed site
2. Check `/api/health` endpoint to verify environment variables are set
3. Test script generation
4. Test audio generation

### Local Testing with Vercel Dev

To test serverless functions locally:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Run Vercel dev (uses your .env file)
vercel dev
```

This will:
- Start the frontend dev server
- Run API routes locally
- Use environment variables from `.env` file

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io/) for incredible voice synthesis technology
- [Google Gemini](https://deepmind.google/technologies/gemini/) and [OpenAI](https://openai.com/) for powerful AI models
- [Shadcn UI](https://ui.shadcn.com/) for beautiful component designs
- [Vite](https://vitejs.dev/) for the amazing development experience

## 🧪 Testing Checklist

After deployment, verify these features work:

- [ ] **Health Check**: Visit `/api/health` - should show env var status
- [ ] **Script Generation**: Generate a script with Gemini or OpenAI
- [ ] **Script Refinement**: Refine an existing script
- [ ] **Voice Synthesis**: Generate audio with male voice
- [ ] **Voice Synthesis**: Generate audio with female voice
- [ ] **Error Handling**: Test with invalid input (should show user-friendly error)
- [ ] **Mobile Browser**: Test on mobile device - audio playback should work

## 🔄 Rollback Plan

If something breaks after deployment:

1. **Quick Rollback**: In Vercel dashboard, go to Deployments → Previous deployment → Promote to Production
2. **Check Environment Variables**: Verify all server-side env vars are set correctly
3. **Check API Routes**: Visit `/api/health` to verify backend is working
4. **Check Browser Console**: Look for CORS or network errors
5. **Local Testing**: Run `vercel dev` locally to test with same env vars

## 💬 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/voxgen-ai-podcast-studio/issues) page
2. Create a new issue if your problem isn't already addressed
3. Include relevant details (error messages, steps to reproduce, etc.)
4. Check `/api/health` endpoint to verify backend configuration

---

<div align="center">

**Made with ❤️ using AI**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#-voxgen---ai-podcast-studio)

</div>
