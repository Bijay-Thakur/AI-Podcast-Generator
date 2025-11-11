import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock3,
  HeartPulse,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TherapistChatWindow } from "./TherapistChatWindow";
import { TherapistProfile } from "../lib/therapist-ai";
import { openTherapistCallPopup } from "../lib/call-popup";

interface TherapistSupportProps {
  onBack: () => void;
}

const FEMALE_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_FEMALE;
const MALE_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_MALE;

interface TherapistCard extends TherapistProfile {
  status: string;
  gradient: string;
  vibe: string;
}

const therapists: TherapistCard[] = [
  {
    id: "dr-aisha-ray",
    name: "Dr. Aisha Ray",
    focus: "Mindfulness & Performance",
    provider: "openai",
    status: "Available now",
    gradient: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    vibe: "Soothing presence, breath rituals, quiet focus resets.",
    tone: "soothing and deliberate",
    voiceGender: "female",
    voiceId: FEMALE_VOICE_ID,
  },
  {
    id: "noah-carter",
    name: "Noah Carter",
    focus: "Creative Burnout Recovery",
    provider: "gemini",
    status: "Responds in under 5 min",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    vibe: "High-energy encouragement, structured grounding drills.",
    tone: "energetic and structured",
    voiceGender: "male",
    voiceId: MALE_VOICE_ID,
  },
];

export function TherapistSupport({ onBack }: TherapistSupportProps) {
  const [activeTherapist, setActiveTherapist] = useState<TherapistCard | null>(
    null
  );

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-100 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to studio
        </button>

        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl text-white shadow-2xl">
          <CardHeader>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-widest text-purple-50">
              <Sparkles className="w-4 h-4" />
              Humans + AI working for you
            </div>
            <CardTitle className="text-4xl md:text-5xl font-semibold mt-6">
              Choose your vibe to connect.
            </CardTitle>
            <CardDescription className="text-purple-100/80 text-lg">
              Decide how you want to reach out: a grounding call, a gentle chat, or a quick energy reset with therapists who understand creators.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/15 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent p-6">
                <p className="text-xl font-semibold">Soothing Chat</p>
                <p className="text-sm text-purple-100/70 mt-2">
                  Share what’s on your mind in a guided flow with breathing cues, micro-break reminders, and grounding prompts.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-gradient-to-r from-fuchsia-500/15 via-purple-500/10 to-transparent p-6">
                <p className="text-xl font-semibold">Grounding Call</p>
                <p className="text-sm text-purple-100/70 mt-2">
                  Jump into a 15-minute session focused on calming your nervous system before you hit record.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-purple-100/90 text-sm border border-white/10 rounded-2xl p-5 bg-white/5">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-pink-300" />
                  Trauma-informed specialists
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-300" />
                  Private & end-to-end encrypted
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-amber-300" />
                  Avg response: 90 seconds
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {therapists.map((t) => (
                <Card
                  key={t.id}
                  className="border border-white/15 bg-white/8 hover:bg-white/12 transition-colors duration-300 cursor-pointer backdrop-blur-2xl text-white shadow-lg"
                >
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div>
                      <p className="text-2xl font-semibold">{t.name}</p>
                      <p className="text-sm text-purple-100/80">{t.focus}</p>
                    </div>
                    <div className={`rounded-xl border border-white/10 bg-gradient-to-r ${t.gradient} p-4`}>
                      <p className="text-sm text-white/80">{t.vibe}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                        {t.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setActiveTherapist(t)}
                          className="bg-white/20 text-white hover:bg-white/30"
                        >
                          Connect
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/10 gap-1"
                          onClick={() => openTherapistCallPopup(t)}
                          title={`Call ${t.name}`}
                        >
                          <span className="relative inline-flex">
                            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                          </span>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {activeTherapist && (
          <TherapistChatWindow
            therapist={activeTherapist}
            onClose={() => setActiveTherapist(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

