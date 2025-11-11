import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TopicSelector } from "./TopicSelector";
import { ScriptEditor } from "./ScriptEditor";
import { StarterPack } from "./StarterPack";
import { PodcastGenerator } from "./PodcastGenerator";
import { Mic2, FileText, Sparkles, Rocket, Radio } from "lucide-react";

interface PodcastAssistantProps {
  onTherapistNavigate?: () => void;
}

export function PodcastAssistant({ onTherapistNavigate }: PodcastAssistantProps) {
  const [activeTab, setActiveTab] = useState("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [script, setScript] = useState("");

  // Calculate progress based on completion
  const calculateProgress = () => {
    let progress = 0;
    if (selectedTopic) progress += 25;
    if (script.length > 100) progress += 25;
    return progress;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header with animation */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Icon with glow effect */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50" />
            <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-4 rounded-2xl">
              <Radio className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          AI Podcast Studio
        </motion.h1>
        
        <motion.p 
          className="text-lg text-purple-100/80 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Create stunning podcasts with the power of AI. Script, edit, and produce
          professional-quality audio content in minutes.
        </motion.p>
        
        {/* Progress Bar with glassmorphism */}
        <motion.div 
          className="max-w-md mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
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
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl h-auto">
            <TabsTrigger 
              value="topic" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl py-3 text-purple-200 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Topic</span>
            </TabsTrigger>
            <TabsTrigger 
              value="script" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl py-3 text-purple-200 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Script</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-xl py-3 text-purple-200 transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger 
              value="generate" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-3 text-purple-200 transition-all"
            >
              <Mic2 className="w-4 h-4" />
              <span className="hidden sm:inline">Generate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="mt-0">
            <TopicSelector 
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              onNext={() => setActiveTab("script")}
              onOpenTherapist={onTherapistNavigate}
            />
          </TabsContent>

          <TabsContent value="script" className="mt-0">
            <ScriptEditor 
              script={script}
              setScript={setScript}
              topic={selectedTopic}
              onNext={() => setActiveTab("tools")}
            />
          </TabsContent>

          <TabsContent value="tools" className="mt-0">
            <StarterPack onNext={() => setActiveTab("generate")} />
          </TabsContent>

          <TabsContent value="generate" className="mt-0">
            <PodcastGenerator script={script} topic={selectedTopic} />
          </TabsContent>
        </Tabs>
      </motion.div>
      
    </div>
  );
}
