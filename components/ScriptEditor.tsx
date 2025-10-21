import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FileText, Wand2, Copy, Download, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ScriptEditorProps {
  script: string;
  setScript: (script: string) => void;
  topic: string;
  onNext: () => void;
}

export function ScriptEditor({ script, setScript, topic, onNext }: ScriptEditorProps) {
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [duration, setDuration] = useState("5-10");
  
  const scriptTemplates = {
    intro: `[INTRODUCTION]
Host: Welcome to [Your Podcast Name]! I'm [Your Name], and today we're diving into an fascinating topic: ${topic || "[Your Topic]"}

This episode will explore...
[Add your introduction here]`,
    
    main: `[MAIN CONTENT]
Segment 1: Background
[Introduce the topic and provide context]

Segment 2: Key Points
[Discuss main arguments or findings]

Segment 3: Real-World Examples
[Share stories, case studies, or examples]

Segment 4: Different Perspectives
[Explore various viewpoints]`,
    
    outro: `[CONCLUSION]
Host: That wraps up today's episode on ${topic || "[Your Topic]"}. 

Key Takeaways:
- [Point 1]
- [Point 2]
- [Point 3]

Thank you for listening! Don't forget to subscribe and share your thoughts.
[OUTRO MUSIC]`
  };

  const generateAIPrompt = () => {
    const prompt = `Generate a podcast script for a college student about: ${topic}
Duration: ${duration} minutes
Include: Introduction, main content segments, examples, and conclusion
Tone: Conversational and engaging`;
    
    toast.success("AI Prompt copied to clipboard!");
    navigator.clipboard.writeText(prompt);
  };

  const insertTemplate = (templateKey: keyof typeof scriptTemplates) => {
    const template = scriptTemplates[templateKey];
    setScript(script + (script ? "\n\n" : "") + template);
    toast.success("Template inserted!");
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard!");
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `podcast-script-${Date.now()}.txt`;
    a.click();
    toast.success("Script downloaded!");
  };

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
            Script Your Podcast
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            Write your podcast script or use our templates to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Episode Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="episode-title" className="text-purple-200 mb-2 block">
                Episode Title
              </Label>
              <Input
                id="episode-title"
                placeholder="e.g., The Ethics of AI in 2025"
                value={episodeTitle}
                onChange={(e) => setEpisodeTitle(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 backdrop-blur-sm"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-purple-200 mb-2 block">
                Target Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="text"
                placeholder="e.g., 5-10"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* AI Prompt Generator */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/8 border border-white/15 backdrop-blur-sm overflow-hidden relative hover:bg-white/12 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-50" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                        <Wand2 className="w-5 h-5 text-purple-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">AI Script Generator</h3>
                    </div>
                    <p className="text-base text-white/90 leading-relaxed">
                      Click to copy an AI prompt you can use with ChatGPT, Gemini, or other AI tools to generate your script
                    </p>
                  </div>
                  <Button 
                    onClick={generateAIPrompt} 
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Script Templates */}
          <div>
            <Label className="text-purple-200 mb-3 block">Quick Templates</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: "intro", label: "Introduction", desc: "Opening & hook", gradient: "from-purple-500 to-pink-500" },
                { key: "main", label: "Main Content", desc: "Segments & structure", gradient: "from-pink-500 to-rose-500" },
                { key: "outro", label: "Conclusion", desc: "Wrap-up & CTA", gradient: "from-cyan-500 to-blue-500" }
              ].map((template) => (
                <motion.div
                  key={template.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => insertTemplate(template.key as any)}
                    className="h-auto py-4 flex flex-col items-start w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    <div className={`w-8 h-1 mb-2 rounded-full bg-gradient-to-r ${template.gradient}`} />
                    <span className="text-white">{template.label}</span>
                    <span className="text-xs text-purple-300/70 mt-1">{template.desc}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Script Editor */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label htmlFor="script" className="text-purple-200">Your Script</Label>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={copyScript} 
                  disabled={!script}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm h-8"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  size="sm" 
                  onClick={downloadScript} 
                  disabled={!script}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm h-8"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              id="script"
              placeholder="Start writing your podcast script here, or insert a template above..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="min-h-[400px] font-mono text-sm bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 backdrop-blur-sm"
            />
            <div className="flex gap-4 mt-2 text-sm text-purple-300/70">
              <span>Word count: {script.split(/\s+/).filter(Boolean).length}</span>
              <span>•</span>
              <span>Estimated read time: ~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} minutes</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8"
          >
            <Button 
              onClick={onNext} 
              className="w-full h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-pink-500/50 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background effect */}
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
                  Continue to Starter Pack
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
