import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Sparkles, Brain, Rocket, Shield, Lightbulb, ArrowRight, Zap } from "lucide-react";

interface TopicSelectorProps {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  onNext: () => void;
  onOpenTherapist?: () => void;
}

export function TopicSelector({ selectedTopic, setSelectedTopic, onNext, onOpenTherapist }: TopicSelectorProps) {
  const [topicMode, setTopicMode] = useState<"preset" | "custom">("preset");
  const [customTopic, setCustomTopic] = useState("");

  const presetTopics = [
    {
      id: "ai-ethics",
      title: "Ethics in AI",
      description: "Exploring the moral implications of artificial intelligence",
      icon: Shield,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "ai-future",
      title: "Future of AI",
      description: "What's next for artificial intelligence and society",
      icon: Rocket,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/20 to-rose-500/20",
    },
    {
      id: "ai-education",
      title: "AI in Education",
      description: "How AI is transforming learning and teaching",
      icon: Brain,
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      id: "ai-creativity",
      title: "AI & Creativity",
      description: "Can machines be truly creative?",
      icon: Lightbulb,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  const handlePresetSelect = (topic: any) => {
    setSelectedTopic(topic.title + ": " + topic.description);
    setTopicMode("preset");
  };

  const handleNext = () => {
    if (selectedTopic || customTopic) {
      if (customTopic && topicMode === "custom") {
        setSelectedTopic(customTopic);
      }
      onNext();
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 blur-xl" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Choose Your Podcast Topic
          </CardTitle>
          <CardDescription className="text-purple-200/80">
            Select a preset AI-themed topic or create your own custom topic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Topic Mode Selection */}
          <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Your Topic Style</h3>
            <RadioGroup value={topicMode} onValueChange={(value: any) => setTopicMode(value)}>
              <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                topicMode === "preset" 
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25" 
                  : "hover:bg-white/10 border border-white/20 hover:border-purple-400/50"
              }`}>
                <RadioGroupItem 
                  value="preset" 
                  id="preset" 
                  className={`w-5 h-5 border-2 transition-all duration-300 ${
                    topicMode === "preset" 
                      ? "border-purple-400 bg-purple-500" 
                      : "border-purple-300 hover:border-purple-400"
                  }`} 
                />
                <Label htmlFor="preset" className="text-white cursor-pointer flex-1 text-base font-medium">
                  Choose from preset topics
                </Label>
                {topicMode === "preset" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                )}
              </div>
              <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                topicMode === "custom" 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25" 
                  : "hover:bg-white/10 border border-white/20 hover:border-cyan-400/50"
              }`}>
                <RadioGroupItem 
                  value="custom" 
                  id="custom" 
                  className={`w-5 h-5 border-2 transition-all duration-300 ${
                    topicMode === "custom" 
                      ? "border-cyan-400 bg-cyan-500" 
                      : "border-purple-300 hover:border-cyan-400"
                  }`} 
                />
                <Label htmlFor="custom" className="text-white cursor-pointer flex-1 text-base font-medium">
                  Create my own topic
                </Label>
                {topicMode === "custom" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                )}
              </div>
            </RadioGroup>
            {onOpenTherapist && (
              <motion.button
                type="button"
                onClick={onOpenTherapist}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center gap-4 p-5 rounded-2xl border-2 border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-600/40 via-purple-600/40 to-cyan-500/40 shadow-[0_20px_60px_-15px_rgba(195,65,255,0.6)] backdrop-blur-xl transition-all duration-500"
              >
                <div className="flex-1">
                  <p className="text-white text-lg font-semibold flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <Zap className="w-4 h-4 text-white" />
                    </span>
                    Talk with a therapist
                  </p>
                  <p className="text-sm text-white/80 mt-1">
                    Feeling overwhelmed? Connect with a certified wellness guide for a calming chat or a focused call.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium tracking-wide">
                    Chat or Call
                  </div>
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white/30 text-purple-900"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.button>
            )}
          </div>

          {/* Preset Topics */}
          {topicMode === "preset" && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {presetTopics.map((topic, index) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic.includes(topic.title);
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all h-full backdrop-blur-sm border-white/20 hover:border-white/40 ${
                        isSelected 
                          ? `bg-gradient-to-br ${topic.bgGradient} border-2 border-white/30 shadow-lg shadow-purple-500/25` 
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      onClick={() => handlePresetSelect(topic)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-gradient-to-br ${topic.gradient} rounded-xl shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`mb-2 font-semibold ${
                              isSelected ? "text-white" : "text-white"
                            }`}>{topic.title}</h3>
                            <p className={`text-sm ${
                              isSelected ? "text-white/90" : "text-purple-200/80"
                            }`}>{topic.description}</p>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-3 flex items-center gap-2 text-sm text-cyan-300 font-medium"
                              >
                                <Zap className="w-4 h-4" />
                                Selected
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Custom Topic */}
          {topicMode === "custom" && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Create Your Custom Topic</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-topic" className="text-white mb-3 block text-base font-medium">
                      Your Custom Topic
                    </Label>
                    <Input
                      id="custom-topic"
                      placeholder="e.g., AI in Healthcare, Machine Learning Ethics, Future of Robotics..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="h-12 bg-white/10 border-2 border-white/20 text-white text-base placeholder:text-purple-300/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic-description" className="text-white mb-3 block text-base font-medium">
                      Topic Description (Optional)
                    </Label>
                    <Textarea
                      id="topic-description"
                      placeholder="Describe what you want to discuss in your podcast... What specific aspects would you like to explore?"
                      className="min-h-[120px] bg-white/10 border-2 border-white/20 text-white text-base placeholder:text-purple-300/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Selected Topic Display */}
          {selectedTopic && (
            <motion.div 
              className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-green-100">
                <span className="opacity-80">Selected Topic: </span>
                <span>{selectedTopic}</span>
              </p>
            </motion.div>
          )}

          {/* Next Button */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8"
          >
            <Button
              onClick={handleNext}
              disabled={!selectedTopic && !customTopic}
              className="w-full h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-all duration-300 disabled:hover:scale-100 relative overflow-hidden group"
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
                  Continue to Script
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
