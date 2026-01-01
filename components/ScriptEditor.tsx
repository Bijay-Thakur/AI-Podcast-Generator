import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileText, Wand2, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateScript, refineScript, getVoiceId } from "../lib/podcast-api";
import { WritingAnimation } from "./WritingAnimation";

interface ScriptEditorProps {
  script: string;
  setScript: (script: string) => void;
  topic: string;
  onNext: () => void;
}

export function ScriptEditor({ script, setScript, topic, onNext }: ScriptEditorProps) {
  const [provider, setProvider] = useState<"gemini" | "chatgpt">("gemini");
  const [person1Gender, setPerson1Gender] = useState<"male" | "female">("male");
  const [person2Gender, setPerson2Gender] = useState<"male" | "female">("female");
  const [length, setLength] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please select a topic first!");
      return;
    }

    setIsGenerating(true);
    setIsGenerated(false);

    try {
      const generatedScript = await generateScript({
        topic,
        provider,
        length,
        person1Gender,
        person2Gender,
      });
      setScript(generatedScript);
      setIsGenerated(true);
      
      // Store voice selections for PodcastGenerator
      localStorage.setItem("podcast_voice_person1", person1Gender);
      localStorage.setItem("podcast_voice_person2", person2Gender);
      
      toast.success("Script generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate script. Please check your API keys.");
      console.error("Script generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!script) {
      toast.error("Please generate a script first!");
      return;
    }

    setIsRefining(true);

    try {
      const refinedScript = await refineScript(script, provider);
      setScript(refinedScript);
      toast.success("Script refined successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to refine script. Please check your API keys.");
      console.error("Script refinement error:", error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleConfirm = () => {
    if (!script || script.trim().length < 100) {
      toast.error("Please generate and review your script before proceeding!");
      return;
    }
    onNext();
  };

  // Check if we have voice IDs
  const person1VoiceId = getVoiceId(person1Gender);
  const person2VoiceId = getVoiceId(person2Gender);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Create Your Podcast Script
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            Choose your AI provider, configure voices, and generate a professional script
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {!isGenerated && !isGenerating && (
            <>
              {/* AI Provider Selection */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                <Label className="text-lg font-semibold text-white mb-4 block">
                  Choose AI Provider
                </Label>
                <RadioGroup value={provider} onValueChange={(value: any) => setProvider(value)}>
                  <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer mb-3 ${
                    provider === "gemini" 
                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-400/50 shadow-lg shadow-blue-500/25" 
                      : "hover:bg-white/10 border border-white/20 hover:border-blue-400/50"
                  }`}>
                    <RadioGroupItem 
                      value="gemini" 
                      id="gemini" 
                      className={`w-5 h-5 border-2 transition-all duration-300 ${
                        provider === "gemini" 
                          ? "border-blue-400 bg-blue-500" 
                          : "border-blue-300 hover:border-blue-400"
                      }`} 
                    />
                    <Label htmlFor="gemini" className="text-white cursor-pointer flex-1 text-base font-medium">
                      Google Gemini
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    provider === "chatgpt" 
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 shadow-lg shadow-green-500/25" 
                      : "hover:bg-white/10 border border-white/20 hover:border-green-400/50"
                  }`}>
                    <RadioGroupItem 
                      value="chatgpt" 
                      id="chatgpt" 
                      className={`w-5 h-5 border-2 transition-all duration-300 ${
                        provider === "chatgpt" 
                          ? "border-green-400 bg-green-500" 
                          : "border-green-300 hover:border-green-400"
                      }`} 
                    />
                    <Label htmlFor="chatgpt" className="text-white cursor-pointer flex-1 text-base font-medium">
                      ChatGPT (OpenAI)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Voice Selection - Host and Guest */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                <Label className="text-lg font-semibold text-white mb-4 block">
                  Select Podcast Host and Guest Voices
                </Label>
                <p className="text-sm text-purple-200/70 mb-4">
                  Choose different genders for Host and Guest (Male-Female or Female-Male)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="person1" className="text-purple-200 mb-2 block">
                      Host (Person 1) Voice
                    </Label>
                    <Select 
                      value={person1Gender} 
                      onValueChange={(value: any) => {
                        setPerson1Gender(value);
                        // Automatically set opposite gender for Person 2
                        setPerson2Gender(value === "male" ? "female" : "male");
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20 text-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {!person1VoiceId && (
                      <p className="text-xs text-yellow-400 mt-1">
                        Voice ID not set in environment variables
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="person2" className="text-purple-200 mb-2 block">
                      Guest (Person 2) Voice
                    </Label>
                    <Select 
                      value={person2Gender} 
                      onValueChange={(value: any) => {
                        setPerson2Gender(value);
                        // Automatically set opposite gender for Person 1
                        setPerson1Gender(value === "male" ? "female" : "male");
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20 text-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {!person2VoiceId && (
                      <p className="text-xs text-yellow-400 mt-1">
                        Voice ID not set in environment variables
                      </p>
                    )}
                    <p className="text-xs text-purple-300/70 mt-2">
                      {person1Gender === "male" ? "Female" : "Male"} (opposite of Host)
                    </p>
                  </div>
                </div>
              </div>

              {/* Podcast Length */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                <Label htmlFor="length" className="text-lg font-semibold text-white mb-2 block">
                  Podcast Length (minutes)
                </Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="4"
                  value={length}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Limit to 4 minutes for testing
                    if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 4)) {
                      setLength(val);
                    }
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 backdrop-blur-sm"
                  min="1"
                  max="4"
                />
                <p className="text-sm text-purple-300/70 mt-2">
                  Testing mode: Maximum 4 minutes
                </p>
              </div>

              {/* Generate Button */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleGenerate}
                  disabled={!topic || !length}
                  className="w-full h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-all duration-300 relative overflow-hidden group disabled:hover:scale-100"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-purple-400/20"
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
                    <Wand2 className="w-5 h-5" />
                    Generate Script
                  </span>
                </Button>
              </motion.div>
            </>
          )}

          {/* Loading Animation */}
          {isGenerating && <WritingAnimation />}

          {/* Script Display and Editing */}
          {isGenerated && script && (
            <>
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold text-white">
                    Your Generated Script
                  </Label>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={handleRefine}
                      disabled={isRefining}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefining ? "animate-spin" : ""}`} />
                      Refine with {provider === "gemini" ? "Gemini" : "ChatGPT"}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="min-h-[400px] font-mono text-sm bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 backdrop-blur-sm"
                  placeholder="Your script will appear here..."
                />
                <div className="flex gap-4 mt-2 text-sm text-purple-300/70">
                  <span>Word count: {script.split(/\s+/).filter(Boolean).length}</span>
                  <span>•</span>
                  <span>Estimated duration: ~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} minutes</span>
                </div>
                <p className="text-sm text-purple-200/80 mt-4">
                  💡 Review and edit the script above if needed. You can also refine it using the button above.
                </p>
              </div>

              {/* Confirm Button */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  onClick={handleConfirm}
                  className="w-full h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 hover:from-green-600 hover:via-emerald-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-green-500/50 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-green-400/20 to-emerald-400/20"
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
                    <CheckCircle2 className="w-5 h-5" />
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
                      Confirm & Generate Podcast
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
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
