import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TopicSelector } from "./TopicSelector";
import { ScriptEditor } from "./ScriptEditor";
import { PodcastGenerator } from "./PodcastGenerator";
import { Mic2, FileText, Sparkles } from "lucide-react";

export function PodcastAssistant() {
  const [activeTab, setActiveTab] = useState("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [script, setScript] = useState("");
  const [isAudioGenerated, setIsAudioGenerated] = useState(false);

  // Handle logo click - reset to home
  const handleLogoClick = () => {
    setActiveTab("topic");
    setSelectedTopic("");
    setScript("");
    setIsAudioGenerated(false);
  };

  // Calculate progress based on completion: 33% topic, 66% script, 100% audio
  const calculateProgress = () => {
    if (isAudioGenerated) return 100;
    if (script.length > 100) return 66;
    if (selectedTopic) return 33;
    return 0;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-7xl">
        {/* Header with animation */}
        <motion.div 
          className="text-center mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
        {/* Logo with enhanced glow effect and sound waves */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="relative">
            {/* Outer glow layers */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl opacity-60 animate-pulse" />
            <div className="absolute -inset-2 blur-xl bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-cyan-400/50 rounded-3xl opacity-40" />
            
            {/* Logo container with subtle background - overflow hidden to contain waves */}
            <div 
              className="relative bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-cyan-900/30 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden cursor-pointer group"
              onClick={handleLogoClick}
              style={{ willChange: 'transform' }}
            >
              {/* Sound waves emanating from logo border - contained within */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`logo-wave-${i}`}
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
                  style={{
                    border: `2px solid rgba(${168 + i * 15}, ${85 + i * 10}, ${247 - i * 15}, ${0.8 - i * 0.2})`,
                    boxShadow: `0 0 ${15 + i * 8}px rgba(${168 + i * 15}, ${85 + i * 10}, ${247 - i * 15}, ${0.6 - i * 0.15})`,
                    transformOrigin: 'center',
                    willChange: 'transform, opacity',
                  }}
                  initial={{ 
                    scale: 0.95, 
                    opacity: 0.8 - i * 0.2,
                  }}
                  animate={{
                    scale: [0.95, 1.05, 1.15, 1.25],
                    opacity: [0.8 - i * 0.2, 0.6 - i * 0.15, 0.3 - i * 0.1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              ))}
              
              {/* Logo image */}
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105" style={{ willChange: 'transform' }}>
                <img 
                  src={new URL("../lib/logo.png", import.meta.url).href}
                  alt="VoxGen Logo"
                  className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-cyan-500/10 rounded-3xl transition-all duration-300 pointer-events-none z-20" />
            </div>
          </div>
        </motion.div>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-purple-100/90 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          Create stunning podcasts with the power of AI. Script, edit, and produce
          professional-quality audio content in minutes.
        </motion.p>
        
        {/* Progress Bar with glassmorphism */}
        <motion.div 
          className="max-w-md mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mx-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-purple-200">Your Progress</span>
            <span className="text-sm text-cyan-300">{calculateProgress()}%</span>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content with glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 md:mb-8 bg-white/5 backdrop-blur-xl border border-white/10 p-1 sm:p-2 rounded-xl sm:rounded-2xl h-auto gap-1">
            <TabsTrigger 
              value="topic" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 text-purple-200 transition-all text-xs sm:text-sm"
              style={{ willChange: 'transform' }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Topic</span>
            </TabsTrigger>
            <TabsTrigger 
              value="script" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 text-purple-200 transition-all text-xs sm:text-sm"
              style={{ willChange: 'transform' }}
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Script</span>
            </TabsTrigger>
            <TabsTrigger 
              value="generate" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg sm:rounded-xl py-2 sm:py-3 text-purple-200 transition-all text-xs sm:text-sm"
              style={{ willChange: 'transform' }}
            >
              <Mic2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">Generate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="mt-0">
            <TopicSelector 
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              onNext={() => setActiveTab("script")}
            />
          </TabsContent>

          <TabsContent value="script" className="mt-0">
            <ScriptEditor 
              script={script}
              setScript={setScript}
              topic={selectedTopic}
              onNext={() => setActiveTab("generate")}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-0">
            <PodcastGenerator 
              script={script} 
              topic={selectedTopic} 
              onAudioGenerated={() => setIsAudioGenerated(true)}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
      
    </div>
  );
}
