import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Phone, Send, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { callTherapist, TherapistChatMessage, TherapistProfile } from "../lib/therapist-ai";
import { toast } from "sonner";
import { openTherapistCallPopup } from "../lib/call-popup";

interface TherapistChatWindowProps {
  therapist: TherapistProfile;
  onClose: () => void;
}

export function TherapistChatWindow({ therapist, onClose }: TherapistChatWindowProps) {
  const [messages, setMessages] = useState<TherapistChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: `Hi, I’m ${therapist.name}. Let’s take a grounding breath together. Tell me what’s on your mind and we’ll move gently from there.`,
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: TherapistChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const transcript = buildPrompt([...messages, userMessage], therapist);
      const reply = await callTherapist(transcript, { therapist });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach the therapist right now. Check your API keys and network.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl bg-gradient-to-br from-purple-950/70 via-indigo-900/70 to-cyan-900/60 border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 text-white">
          <div>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Chat with {therapist.name}
            </p>
            <p className="text-sm text-white/70">{therapist.focus}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="relative text-white hover:bg-white/10"
              onClick={() => openTherapistCallPopup(therapist)}
              title={`Start a call with ${therapist.name}`}
            >
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-2xl rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto bg-white/15 text-white border border-white/10"
                  : "bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-purple-50 border border-white/5"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isSending && (
            <div className="flex items-center gap-2 text-purple-100/70 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking with {therapist.name}...
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-6 bg-black/30">
          <div className="flex gap-3 items-end">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what’s present for you..."
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[88px]"
            />
            <Button
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
              className="h-14 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-purple-500/40 disabled:opacity-60"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function buildPrompt(history: TherapistChatMessage[], therapist: TherapistProfile) {
  const therapistName = therapist.name ?? "Aurora";

  return history
    .map((message) =>
      message.role === "user"
        ? `User: ${message.content}`
        : `${therapistName}: ${message.content}`
    )
    .join("\n\n");
}

