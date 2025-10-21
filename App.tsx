import { PodcastAssistant } from "./components/PodcastAssistant";
import { SoundWaves } from "./components/SoundWaves";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 animate-gradient-shift" />
      
      {/* Secondary gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-900/50 via-transparent to-fuchsia-900/50" />
      
      {/* Radial gradient spotlight */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Sound waves animation */}
      <SoundWaves />
      
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
      {/* Main content */}
      <div className="relative z-10">
        <PodcastAssistant />
      </div>
      
      <Toaster />
      
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
