import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Mic2, Play, Pause, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { generatePodcastAudio, getVoiceId } from "../lib/podcast-api";

interface PodcastGeneratorProps {
  script: string;
  topic: string;
  onAudioGenerated?: () => void;
}

// Podcast speakers image component with glowing borders
function PodcastSpeakers({ hostGender, isPlaying, currentSpeaker }: { hostGender: "male" | "female"; isPlaying: boolean; currentSpeaker: 1 | 2 | null }) {
  // hostGender determines Person 1 (Host), Guest (Person 2) is opposite gender
  const person1Gender = hostGender;
  const person2Gender = hostGender === "male" ? "female" : "male";
  
  const person1Speaking = isPlaying && currentSpeaker === 1;
  const person2Speaking = isPlaying && currentSpeaker === 2;
  
  // Import images
  const maleImage = new URL("../lib/male.jpg", import.meta.url).href;
  const femaleImage = new URL("../lib/female.jpg", import.meta.url).href;
  
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-4 sm:py-6 md:py-8">
      {/* Person 1 (Host) */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className={`relative rounded-2xl p-2 transition-all duration-300 ${
            person1Speaking
              ? person1Gender === "male"
                ? "shadow-[0_0_30px_rgba(168,85,247,0.8),0_0_60px_rgba(168,85,247,0.5)]"
                : "shadow-[0_0_30px_rgba(236,72,153,0.8),0_0_60px_rgba(236,72,153,0.5)]"
              : ""
          }`}
        >
          <motion.div
            className={`rounded-xl overflow-hidden ${
              person1Speaking
                ? person1Gender === "male"
                  ? "ring-4 ring-purple-400 ring-opacity-80"
                  : "ring-4 ring-pink-400 ring-opacity-80"
                : "ring-2 ring-white/20"
            }`}
            animate={{
              scale: person1Speaking ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: person1Speaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <img
              src={person1Gender === "male" ? maleImage : femaleImage}
              alt={person1Gender === "male" ? "Male speaker" : "Female speaker"}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain bg-gray-900/30"
              style={{ imageRendering: 'auto' }}
            />
          </motion.div>
          {person1Speaking && (
            <motion.div
              className={`absolute -inset-1 rounded-xl ${
                person1Gender === "male"
                  ? "bg-gradient-to-r from-purple-500/50 via-purple-400/50 to-purple-500/50"
                  : "bg-gradient-to-r from-pink-500/50 via-pink-400/50 to-pink-500/50"
              } blur-xl -z-10`}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
        <p className="text-xs sm:text-sm md:text-base font-semibold text-purple-200 mt-2 sm:mt-3 md:mt-4">
          {person1Speaking ? "Speaking..." : "Host"}
        </p>
      </motion.div>

      {/* Person 2 (Guest) */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className={`relative rounded-2xl p-2 transition-all duration-300 ${
            person2Speaking
              ? person2Gender === "male"
                ? "shadow-[0_0_30px_rgba(168,85,247,0.8),0_0_60px_rgba(168,85,247,0.5)]"
                : "shadow-[0_0_30px_rgba(236,72,153,0.8),0_0_60px_rgba(236,72,153,0.5)]"
              : ""
          }`}
        >
          <motion.div
            className={`rounded-xl overflow-hidden ${
              person2Speaking
                ? person2Gender === "male"
                  ? "ring-4 ring-purple-400 ring-opacity-80"
                  : "ring-4 ring-pink-400 ring-opacity-80"
                : "ring-2 ring-white/20"
            }`}
            animate={{
              scale: person2Speaking ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: person2Speaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <img
              src={person2Gender === "male" ? maleImage : femaleImage}
              alt={person2Gender === "male" ? "Male speaker" : "Female speaker"}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain bg-gray-900/30"
              style={{ imageRendering: 'auto' }}
            />
          </motion.div>
          {person2Speaking && (
            <motion.div
              className={`absolute -inset-1 rounded-xl ${
                person2Gender === "male"
                  ? "bg-gradient-to-r from-purple-500/50 via-purple-400/50 to-purple-500/50"
                  : "bg-gradient-to-r from-pink-500/50 via-pink-400/50 to-pink-500/50"
              } blur-xl -z-10`}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
        <p className="text-xs sm:text-sm md:text-base font-semibold text-purple-200 mt-2 sm:mt-3 md:mt-4">
          {person2Speaking ? "Speaking..." : "Guest"}
        </p>
      </motion.div>
    </div>
  );
}

// Helper function to format time as MM:SS
function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PodcastGenerator({ script, topic, onAudioGenerated }: PodcastGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<1 | 2 | null>(null);
  const speakerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeakerRef = useRef<1 | 2 | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Get voice genders from localStorage (set by ScriptEditor)
  const person1Gender = (localStorage.getItem("podcast_voice_person1") || "male") as "male" | "female";
  const person2Gender = (localStorage.getItem("podcast_voice_person2") || "female") as "male" | "female";

  const person1VoiceId = getVoiceId(person1Gender);
  const person2VoiceId = getVoiceId(person2Gender);

  useEffect(() => {
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    // Handle audio playback state and track speaking
    if (audioRef.current) {
      const audio = audioRef.current;
      const handlePlay = () => {
        setIsPlaying(true);
        // Reset speaker tracking when starting playback
        lastSpeakerRef.current = null;
        setCurrentSpeaker(null);
        
        // Log timing data on play for debugging
        const timingDataStr = sessionStorage.getItem('podcast_timing_data');
        if (timingDataStr) {
          try {
            const timingData = JSON.parse(timingDataStr);
            console.log('🎵 Playback started. Timing data:', timingData);
            console.log(`Total segments: ${timingData.segments.length}`);
            console.log(`Speakers: ${timingData.segments.map((s: any) => s.speaker).join(', ')}`);
          } catch (e) {
            console.error('Error parsing timing data:', e);
          }
        }
      };
      const handlePause = () => {
        setIsPlaying(false);
        setCurrentSpeaker(null);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentSpeaker(null);
        setCurrentTime(0);
      };
      const handleLoadedMetadata = () => {
        if (audio.duration) {
          setDuration(audio.duration);
        }
      };
      const handleTimeUpdate = () => {
        // Update current time for progress bar
        if (audio.currentTime) {
          setCurrentTime(audio.currentTime);
        }
        if (audio.duration && !duration) {
          setDuration(audio.duration);
        }
        // Use stored timing data for accurate synchronization
        if (audio.duration) {
          try {
            const timingDataStr = sessionStorage.getItem('podcast_timing_data');
            if (timingDataStr) {
              const timingData = JSON.parse(timingDataStr);
              const currentTime = audio.currentTime;
              
              // Find which segment is currently playing based on actual timing
              let currentSegment = null;
              
              // Simple and reliable approach: find the segment whose time range contains currentTime
              for (let i = 0; i < timingData.segments.length; i++) {
                const segment = timingData.segments[i];
                const segmentStart = segment.startTime;
                const segmentEnd = segment.startTime + segment.duration;
                
                // Check if currentTime falls within this segment's range
                // Use >= for start and <= for end (inclusive end to catch transitions)
                if (currentTime >= segmentStart && currentTime <= segmentEnd) {
                  currentSegment = segment;
                  break;
                }
              }
              
              // If no segment found (edge cases), find the closest one
              if (!currentSegment && timingData.segments.length > 0) {
                // Find the segment that should be playing based on start time
                // Find the last segment that has started
                for (let i = timingData.segments.length - 1; i >= 0; i--) {
                  if (currentTime >= timingData.segments[i].startTime) {
                    currentSegment = timingData.segments[i];
                    break;
                  }
                }
                
                // If still no segment (before first), use first one
                if (!currentSegment) {
                  currentSegment = timingData.segments[0];
                }
              }
              
              // Debug logging every 2 seconds
              if (Math.floor(currentTime) % 2 === 0 && Math.floor(currentTime) !== Math.floor(audio.currentTime - 0.1)) {
                console.log(`⏱️ Time: ${currentTime.toFixed(2)}s, Current segment: ${currentSegment ? `Speaker ${currentSegment.speaker} (${currentSegment.speaker === 1 ? 'Host' : 'Guest'}), range: ${currentSegment.startTime.toFixed(2)}s - ${(currentSegment.startTime + currentSegment.duration).toFixed(2)}s` : 'None'}`);
              }
              
              if (currentSegment) {
                const newSpeaker = currentSegment.speaker as 1 | 2;
                
                // Always update if speaker changed OR if this is the first time
                if (newSpeaker !== lastSpeakerRef.current || lastSpeakerRef.current === null) {
                  if (speakerTimerRef.current) {
                    clearTimeout(speakerTimerRef.current);
                  }
                  
                  // Update immediately for better synchronization
                  setCurrentSpeaker(newSpeaker);
                  const wasNull = lastSpeakerRef.current === null;
                  lastSpeakerRef.current = newSpeaker;
                  
                  if (wasNull) {
                    console.log(`🎤 Initial speaker: ${newSpeaker === 1 ? 'Host (1)' : 'Guest (2)'} at ${currentTime.toFixed(2)}s`);
                  } else {
                    console.log(`🎤 Speaker changed to: ${newSpeaker === 1 ? 'Host (1)' : 'Guest (2)'} at ${currentTime.toFixed(2)}s (segment start: ${currentSegment.startTime.toFixed(2)}s, duration: ${currentSegment.duration.toFixed(2)}s, end: ${(currentSegment.startTime + currentSegment.duration).toFixed(2)}s)`);
                  }
                }
              } else {
                // Debug: log when no segment is found
                if (Math.floor(currentTime) % 2 === 0) { // Log every 2 seconds to avoid spam
                  console.warn(`⚠️ No segment found for current time ${currentTime.toFixed(2)}s. Total segments: ${timingData.segments.length}`);
                }
              }
            } else {
              // Fallback: parse script for speaker names
              if (script) {
                const lines = script.split("\n").filter(line => line.trim());
                const namePattern = /^([A-Z][a-z]+):\s*/;
                const foundNames: string[] = [];
                
                for (const line of lines) {
                  const match = line.trim().match(namePattern);
                  if (match && !foundNames.includes(match[1])) {
                    foundNames.push(match[1]);
                    if (foundNames.length === 2) break;
                  }
                }
                
                if (foundNames.length >= 2) {
                  const hostName = foundNames[0];
                  const guestName = foundNames[1];
                  const speakerSequence: (1 | 2)[] = [];
                  
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.match(new RegExp(`^${hostName}\\s*[:\-]`, "i"))) {
                      speakerSequence.push(1);
                    } else if (trimmed.match(new RegExp(`^${guestName}\\s*[:\-]`, "i"))) {
                      speakerSequence.push(2);
                    }
                  }
                  
                  if (speakerSequence.length > 0) {
                    const progress = audio.currentTime / audio.duration;
                    const segmentIndex = Math.floor(progress * speakerSequence.length);
                    const clampedIndex = Math.min(segmentIndex, speakerSequence.length - 1);
                    const newSpeaker = speakerSequence[clampedIndex];
                    
                    if (newSpeaker !== lastSpeakerRef.current) {
                      setCurrentSpeaker(newSpeaker);
                      lastSpeakerRef.current = newSpeaker;
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error parsing timing data:", error);
          }
        }
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        if (speakerTimerRef.current) {
          clearTimeout(speakerTimerRef.current);
        }
      };
    }
  }, [audioUrl, duration]);

  const handleGenerate = async () => {
    if (!script) {
      toast.error("Please generate a script first!");
      return;
    }

    if (!person1VoiceId || !person2VoiceId) {
      toast.error("Voice IDs not configured. Please check your environment variables.");
      return;
    }

    setIsGenerating(true);
    setIsGenerated(false);
    setIsPlaying(false);
    setCurrentSpeaker(null);
    setShowSuccess(false);
    setCurrentTime(0);
    setDuration(0);

    try {
      const url = await generatePodcastAudio({
        script,
        person1VoiceId,
        person2VoiceId,
      });
      setAudioUrl(url);
      setIsGenerated(true);
      setShowSuccess(true);
      // Notify parent component that audio is generated
      if (onAudioGenerated) {
        onAudioGenerated();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate audio. Please check your API keys.");
      console.error("Audio generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Playback error:", error);
        toast.error("Failed to play audio");
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleStartPodcast = () => {
    setShowSuccess(false);
    handlePlayPause();
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            Generate Your Podcast
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            Generate audio for your podcast script
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Generate Button (shown when not generated) */}
          {!isGenerated && (
            <motion.div
              className="flex flex-col items-center gap-4 py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !script}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 relative overflow-hidden group disabled:hover:scale-100"
                  style={{ willChange: 'transform' }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-pink-400/30 to-purple-400/30"
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </>
                  ) : (
                    <Mic2 className="w-8 h-8 sm:w-10 sm:h-10" />
                  )}
                </Button>
              </motion.div>
              <p className="text-sm text-purple-200 font-medium">
                {isGenerating ? "Generating..." : "Generate Audio"}
              </p>
            </motion.div>
          )}

          {/* Podcast Speakers Image (shown only when playing) */}
          {isPlaying && isGenerated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="py-8"
            >
              <PodcastSpeakers 
                hostGender={person1Gender}
                isPlaying={isPlaying}
                currentSpeaker={currentSpeaker}
              />
            </motion.div>
          )}

          {/* Audio Element (hidden) */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="auto"
              className="hidden"
            />
          )}

          {/* Success Popup */}
          <AnimatePresence>
            {showSuccess && isGenerated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="backdrop-blur-sm bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 border-2 border-green-400/30 rounded-2xl p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50" />
                    <CheckCircle2 className="w-16 h-16 text-green-400 relative" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Audio Generated Successfully!</h3>
                <p className="text-purple-200/90 mb-6">
                  Your podcast audio is ready. Click the button below to start listening.
                </p>
                <Button
                  onClick={handleStartPodcast}
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 hover:from-green-600 hover:via-emerald-600 hover:to-cyan-600 text-white border-0 shadow-xl shadow-green-500/50 text-lg font-semibold px-8 py-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Podcast
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play/Pause Controls with Progress Bar (shown after generation) */}
          {isGenerated && !showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 pt-4 w-full max-w-2xl mx-auto"
            >
              {/* Play/Pause Button */}
              <Button
                onClick={handlePlayPause}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 hover:from-green-600 hover:via-emerald-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-green-500/50 font-semibold transition-all duration-300 relative overflow-hidden group"
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-green-400/30 to-emerald-400/30"
                  animate={{
                    rotate: isPlaying ? 360 : 0,
                  }}
                  transition={{
                    duration: 20,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "linear",
                  }}
                />
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 relative z-10" />
                )}
              </Button>

              {/* Progress Bar and Time Display */}
              <div className="w-full space-y-3 px-2">
                {/* Progress Bar */}
                <div
                  onClick={handleProgressClick}
                  className="w-full h-2 bg-white/10 rounded-full cursor-pointer hover:h-3 transition-all duration-200 relative group backdrop-blur-sm"
                >
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full transition-all duration-100 relative shadow-lg shadow-green-500/30"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    {/* Progress indicator dot - always visible but more prominent on hover */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 opacity-60 group-hover:opacity-100 group-hover:w-4 group-hover:h-4 transition-all duration-200" />
                  </div>
                  {/* Hover indicator line */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                    <div className="h-full w-px bg-white/50" style={{ marginLeft: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-mono font-semibold text-purple-200">
                    {formatTime(currentTime)}
                  </span>
                  <span className="font-mono font-semibold text-purple-200/70">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Status Text */}
              <p className="text-xs sm:text-sm text-purple-200 font-medium">
                {isPlaying ? "Playing" : "Paused"}
              </p>
            </motion.div>
          )}

          {/* Script Preview */}
          {script && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Your Podcast Script</h3>
              <p className="text-sm text-purple-200/80 mb-2">
                <span className="font-medium">Topic:</span> {topic || "No topic selected"}
              </p>
              <p className="text-sm text-purple-200/80">
                <span className="font-medium">Length:</span> ~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} minutes
              </p>
            </motion.div>
          )}

          {/* Regenerate Button */}
          {isGenerated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                className="bg-white/5 hover:bg-white/10 border-white/20 text-white backdrop-blur-sm"
              >
                <Loader2 className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate Audio
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
