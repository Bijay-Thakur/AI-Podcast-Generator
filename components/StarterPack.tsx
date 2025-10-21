import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageSquare, 
  Mic, 
  Music, 
  ExternalLink, 
  Star,
  Zap,
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface StarterPackProps {
  onNext: () => void;
}

export function StarterPack({ onNext }: StarterPackProps) {
  const tools = {
    text: [
      {
        name: "ChatGPT",
        description: "Advanced AI for script writing, brainstorming, and content generation",
        url: "https://chat.openai.com",
        features: ["Script generation", "Topic ideas", "Editing assistance"],
        badge: "Popular",
        gradient: "from-green-500 to-emerald-500"
      },
      {
        name: "Google Gemini",
        description: "Google's AI for creative writing and research assistance",
        url: "https://gemini.google.com",
        features: ["Research help", "Content expansion", "Fact-checking"],
        badge: "Free",
        gradient: "from-blue-500 to-indigo-500"
      },
      {
        name: "Descript",
        description: "All-in-one audio/video editing with AI transcription",
        url: "https://www.descript.com",
        features: ["Transcription", "Audio editing", "Text-based editing"],
        badge: "Pro",
        gradient: "from-purple-500 to-pink-500"
      }
    ],
    voice: [
      {
        name: "ElevenLabs",
        description: "Realistic AI voice generation for professional podcast narration",
        url: "https://elevenlabs.io",
        features: ["Natural voices", "Voice cloning", "Multiple languages"],
        badge: "Premium",
        gradient: "from-orange-500 to-red-500"
      },
      {
        name: "Speechify",
        description: "Text-to-speech tool for converting scripts to audio",
        url: "https://speechify.com",
        features: ["Text-to-speech", "Speed control", "Natural reading"],
        badge: "Popular",
        gradient: "from-cyan-500 to-blue-500"
      }
    ],
    music: [
      {
        name: "Suno",
        description: "AI music generation for unique podcast intro/outro music",
        url: "https://suno.ai",
        features: ["Custom music", "Various genres", "Royalty-free"],
        badge: "New",
        gradient: "from-pink-500 to-rose-500"
      },
      {
        name: "Udio",
        description: "Create original music and sound effects with AI",
        url: "https://udio.com",
        features: ["Sound effects", "Background music", "Custom compositions"],
        badge: "Trending",
        gradient: "from-violet-500 to-purple-500"
      }
    ]
  };

  const ToolCard = ({ tool, index }: { tool: typeof tools.text[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <Card className="hover:shadow-2xl transition-all h-full backdrop-blur-sm bg-white/5 border-white/20 hover:border-white/40 relative overflow-hidden group cursor-pointer">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 bg-gradient-to-br ${tool.gradient} rounded-xl shadow-lg`}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <Badge className={`bg-gradient-to-r ${tool.gradient} text-white border-0`}>
              {tool.badge}
            </Badge>
          </div>
          
          <h3 className="mb-2 text-white">{tool.name}</h3>
          <p className="text-sm text-purple-200/80 mb-4">{tool.description}</p>
          
          <div className="space-y-2 mb-5">
            {tool.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-purple-100">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm" 
            asChild
          >
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit {tool.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-xl" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
              <Star className="w-5 h-5 text-white" />
            </div>
            AI Tools Starter Pack
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            Powerful AI tools to help you create professional podcasts
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl mb-6">
              <TabsTrigger 
                value="text" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg text-purple-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg text-purple-200"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg text-purple-200"
              >
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Music</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.text.map((tool, idx) => (
                  <ToolCard key={idx} tool={tool} index={idx} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="voice" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.voice.map((tool, idx) => (
                  <ToolCard key={idx} tool={tool} index={idx} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="music" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.music.map((tool, idx) => (
                  <ToolCard key={idx} tool={tool} index={idx} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mt-6 bg-white/8 border border-white/15 backdrop-blur-sm overflow-hidden relative hover:bg-white/12 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50" />
              <CardContent className="p-6 relative">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                    <Lightbulb className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Pro Tips</h3>
                    <ul className="space-y-3 text-base text-white/90">
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>Start with ChatGPT or Gemini to refine your script and generate ideas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>Use ElevenLabs or Speechify to convert your script to natural-sounding audio</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>Create unique intro/outro music with Suno or Udio to make your podcast stand out</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>Always review and edit AI-generated content for accuracy and your personal voice</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Button */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8"
          >
            <Button 
              onClick={onNext} 
              className="w-full h-16 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 shadow-2xl shadow-cyan-500/50 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              />
              <span className="flex items-center justify-center gap-3 relative z-10">
                <motion.span
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Continue to Generate
                </motion.span>
                <motion.div
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
