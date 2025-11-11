import { callTherapist, TherapistChatMessage, TherapistProfile } from "./therapist-ai";

interface CallTurnOptions {
  initial?: boolean;
}

export interface TherapistCallResult {
  reply: string;
  audioBase64?: string | null;
}

export async function generateTherapistCallTurn(
  history: TherapistChatMessage[],
  therapist: TherapistProfile,
  options: CallTurnOptions = {}
): Promise<TherapistCallResult> {
  const workingHistory = [...history];

  if (options.initial) {
    workingHistory.push({
      id: "initial-call-prompt",
      role: "user",
      content:
        "The user has just joined a live audio session. Offer a short, grounding welcome and ask how you can support them.",
      createdAt: Date.now(),
    });
  }

  const prompt = buildPrompt(workingHistory, therapist);
  const reply = await callTherapist(prompt);

  return { reply, audioBase64: null };
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

