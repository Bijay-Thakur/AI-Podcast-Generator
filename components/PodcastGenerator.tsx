import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Mic2, 
  Download, 
  Sparkles,
  Music,
  Settings,
  FileAudio,
  Volume2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface PodcastGeneratorProps {
  script: string;
  topic: string;
}

export function PodcastGenerator({ script, topic }: PodcastGeneratorProps) {
  const [voice, setVoice] = useState("professional");
  const [musicStyle, setMusicStyle] = useState("upbeat");
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeOutro, setIncludeOutro] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (!script) {
      toast.error("Please write a script first!");
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast.success("Podcast preview generated successfully!");
    }, 3000);
  };

  const exportInstructions = [
    {
      step: "1. Generate your script",
      tool: "Use ChatGPT or Google Gemini",
      status: script ? "complete" : "pending"
    },
    {
      step: "2. Convert to audio",
      tool: "Use ElevenLabs or Speechify",
      status: isGenerated ? "complete" : "pending"
    },
    {
      step: "3. Add music",
      tool: "Use Suno or Udio",
      status: "pending"
    },
    {
      step: "4. Edit & polish",
      tool: "Use Descript or Audacity",
      status: "pending"
    }
  ];

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
            Configure your podcast settings and export your creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Podcast Summary */}
          {script && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/8 border border-white/15 backdrop-blur-sm overflow-hidden relative hover:bg-white/12 transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-50" />
                <CardContent className="p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl shadow-lg border border-purple-400/30">
                      <FileAudio className="w-6 h-6 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-white">Your Podcast</h3>
                      <p className="text-base text-white/90 mb-4">{topic || "AI-Themed Podcast"}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="font-medium">{script.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-400" />
                          <span className="font-medium">~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Generation Settings */}
          <div className="space-y-5">
            <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10">
              <Label className="flex items-center gap-2 mb-3 text-purple-200">
                <Volume2 className="w-4 h-4" />
                Voice Style
              </Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  <SelectItem value="professional">Professional & Clear</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="energetic">Energetic & Dynamic</SelectItem>
                  <SelectItem value="calm">Calm & Soothing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10">
              <Label className="flex items-center gap-2 mb-3 text-purple-200">
                <Music className="w-4 h-4" />
                Music Style
              </Label>
              <Select value={musicStyle} onValueChange={setMusicStyle}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  <SelectItem value="upbeat">Upbeat & Modern</SelectItem>
                  <SelectItem value="ambient">Ambient & Atmospheric</SelectItem>
                  <SelectItem value="minimal">Minimal & Clean</SelectItem>
                  <SelectItem value="none">No Music</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white/10" />

            <div className="backdrop-blur-sm bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
              <Label className="flex items-center gap-2 text-purple-200">
                <Settings className="w-4 h-4" />
                Additional Options
              </Label>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Checkbox 
                  id="intro" 
                  checked={includeIntro}
                  onCheckedChange={(checked) => setIncludeIntro(checked as boolean)}
                  className="border-purple-300"
                />
                <label
                  htmlFor="intro"
                  className="text-sm leading-none text-purple-100 cursor-pointer flex-1"
                >
                  Include intro music and greeting
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Checkbox 
                  id="outro" 
                  checked={includeOutro}
                  onCheckedChange={(checked) => setIncludeOutro(checked as boolean)}
                  className="border-purple-300"
                />
                <label
                  htmlFor="outro"
                  className="text-sm leading-none text-purple-100 cursor-pointer flex-1"
                >
                  Include outro music and call-to-action
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !script}
              className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 disabled:opacity-50 text-lg font-semibold transition-all duration-300 relative overflow-hidden group disabled:hover:scale-100"
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20"
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
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Generating Preview...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
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
                      Generate Preview Settings
                    </motion.span>
                  </>
                )}
              </span>
            </Button>
          </motion.div>

          {/* Success Message */}
          {isGenerated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-100">
                  Your podcast settings are ready! Follow the export workflow below to create your final podcast using the AI tools.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Separator className="bg-white/10" />

          {/* Export Workflow */}
          <div className="space-y-4">
            <h3 className="text-white">Production Workflow</h3>
            <p className="text-sm text-purple-200/80">
              Follow these steps to create your final podcast using the AI tools from the Starter Pack
            </p>

            <div className="space-y-3">
              {exportInstructions.map((instruction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`backdrop-blur-sm border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                    instruction.status === "complete" 
                      ? "bg-gradient-to-r from-green-500/15 to-emerald-500/15 border-green-400/30 hover:from-green-500/20 hover:to-emerald-500/20" 
                      : "bg-white/8 hover:bg-white/12 border-white/15"
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${
                          instruction.status === "complete" 
                            ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50" 
                            : "bg-white/10 text-purple-300 border border-white/20"
                        }`}>
                          {instruction.status === "complete" ? "✓" : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 text-base font-semibold text-white">{instruction.step}</p>
                          <p className="text-sm text-white/80">{instruction.tool}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Download Script Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
          >
            <Card className="bg-white/8 border border-white/15 backdrop-blur-sm overflow-hidden relative hover:bg-white/12 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-50" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white">Export Script</h3>
                    <p className="text-base text-white/90">
                      Download your script to use with AI voice generation tools
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      const blob = new Blob([script], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `podcast-script-${Date.now()}.txt`;
                      a.click();
                      toast.success("Script downloaded!");
                    }}
                    disabled={!script}
                    className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
