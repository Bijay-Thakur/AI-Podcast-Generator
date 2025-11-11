import { TherapistChatMessage, TherapistProfile } from "./therapist-ai";
import { generateTherapistCallTurn } from "./therapist-call";
import "../styles/callPopup.css";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
  typeof window !== "undefined"
    ? (
        (window as Window & {
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }).SpeechRecognition ||
        (window as Window & {
          webkitSpeechRecognition?: SpeechRecognitionConstructor;
        }).webkitSpeechRecognition
      )
    : undefined;

const supportsSpeech = Boolean(SpeechRecognitionCtor);

let ringAudio: HTMLAudioElement | null = null;
let replyAudio: HTMLAudioElement | null = null;
let recognition: SpeechRecognition | null = null;

let isInCall = false;
let isProcessing = false;
let micAuthorized = !supportsSpeech;

let callPopup: HTMLDivElement | null = null;
let statusEl: HTMLElement | null = null;
let dialogEl: HTMLElement | null = null;
let manualInput: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;
let hangupBtn: HTMLButtonElement | null = null;
let micBtn: HTMLButtonElement | null = null;

let conversationLog: TherapistChatMessage[] = [];
let activeTherapist: TherapistProfile | null = null;

const phoneRingUrl =
  "https://storage.googleapis.com/audio-samples-public/mixkit-classic-doorbell-tone-115.mp3";

function resetCallState() {
  ringAudio = null;
  replyAudio = null;
  recognition = null;
  isInCall = false;
  isProcessing = false;
  micAuthorized = !supportsSpeech;
  callPopup = null;
  statusEl = null;
  dialogEl = null;
  manualInput = null;
  sendBtn = null;
  hangupBtn = null;
  micBtn = null;
  conversationLog = [];
  activeTherapist = null;
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function openTherapistCallPopup(therapist: TherapistProfile) {
  if (!therapist?.id || isInCall) return;

  activeTherapist = therapist;
  isInCall = true;
  conversationLog = [];

  callPopup = document.createElement("div");
  callPopup.className = "call-popup";
  callPopup.innerHTML = `
    <div class="call-popup-content">
      <div class="phone-icon-wrapper">
        <div class="phone-wave"></div><div class="phone-wave delay"></div>
        <div class="phone-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="none" stroke="#00ff95" stroke-width="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18A2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72a12.05 12.05 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45a12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
      </div>
      <div class="call-status">
        <h3>${escapeHtml(therapist.name)}</h3>
        <p id="callStatusText">Connecting…</p>
      </div>
      <div class="call-dialog" id="callDialog"></div>
      <div class="call-manual-entry ${supportsSpeech ? "hidden" : ""}">
        <textarea id="callTextInput" placeholder="Type your message…"></textarea>
        <button id="callSendBtn" class="call-send-btn">Send</button>
      </div>
      <p class="call-footnote">${
        supportsSpeech
          ? "Tap 🎙️ to talk or speak automatically."
          : "Allow microphone access in Chrome for hands-free use."
      }</p>
      <div class="call-controls">
        <button id="micBtn" class="mic-btn hidden" title="Talk">Speak</button>
        <button id="hangupBtn" class="hangup-btn">Hang Up</button>
      </div>
    </div>
  `;

  document.body.appendChild(callPopup);

  statusEl = callPopup.querySelector("#callStatusText");
  dialogEl = callPopup.querySelector("#callDialog");
  manualInput = callPopup.querySelector("#callTextInput");
  sendBtn = callPopup.querySelector("#callSendBtn");
  hangupBtn = callPopup.querySelector("#hangupBtn");
  micBtn = callPopup.querySelector("#micBtn");

  hangupBtn?.addEventListener("click", endCall);
  sendBtn?.addEventListener("click", () => {
    const text = manualInput?.value.trim();
    if (!text || isProcessing) return;
    manualInput.value = "";
    handleUserUtterance(text);
  });
  micBtn?.addEventListener("click", toggleMic);

  startRinging();
  setTimeout(connectCall, 1200);
}

function startRinging() {
  stopAudio(ringAudio);
  ringAudio = new Audio(phoneRingUrl);
  ringAudio.play().catch(() => {
    /* ignore autoplay failures */
  });
}

async function connectCall() {
  if (!isInCall) return;
  stopAudio(ringAudio);
  updateStatus("Connecting…");
  ensureRecognition();

  if (supportsSpeech && navigator.mediaDevices) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      micAuthorized = true;
      micBtn?.classList.remove("hidden");
    } catch (error) {
      console.warn("[call-popup] Microphone permission denied:", error);
      micAuthorized = false;
      manualInput?.classList.remove("hidden");
    }
  }

  sendUtterance("", { initial: true });
}

function ensureRecognition() {
  if (!supportsSpeech || !SpeechRecognitionCtor) return;
  if (recognition) {
    recognition.abort();
  }

  recognition = new SpeechRecognitionCtor();
  recognition.lang = "en-US";
  recognition.continuous = false;
  (recognition as any).interimResults = false;

  recognition.onstart = () => {
    micBtn?.classList.add("recording");
    updateStatus("Listening…");
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    updateStatus("Mic error. Tap again.");
    console.warn("[call-popup] Speech recognition error:", event.error);
    micBtn?.classList.remove("recording");
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript =
      event.results?.[0]?.[0]?.transcript?.trim() ??
      event.results?.item(0)?.item(0)?.transcript?.trim();
    if (transcript) {
      handleUserUtterance(transcript);
    }
  };

  recognition.onend = () => {
    micBtn?.classList.remove("recording");
    if (isInCall && !isProcessing) {
      setTimeout(() => {
        try {
          recognition?.start();
        } catch {
          /* ignore */
        }
      }, 600);
    }
  };
}

function toggleMic() {
  if (!recognition) return;
  try {
    recognition.start();
  } catch (error) {
    console.warn("[call-popup] Unable to start microphone:", error);
  }
}

function handleUserUtterance(text: string) {
  appendMessage("user", text);
  conversationLog.push({
    id: randomId(),
    role: "user",
    content: text,
    createdAt: Date.now(),
  });
  sendUtterance(text);
}

function sendUtterance(_text: string, options: { initial?: boolean } = {}) {
  if (!activeTherapist) return;

  isProcessing = true;
  updateStatus("Processing…");
  disableInput(true);

  generateTherapistCallTurn(conversationLog, activeTherapist, options)
    .then(({ reply, audioBase64 }) => {
      appendMessage("assistant", reply);
      conversationLog.push({
        id: randomId(),
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
      });
      if (audioBase64) {
        playReplyAudio(audioBase64);
      } else {
        updateStatus("Your turn to speak");
      }
    })
    .catch((error) => {
      console.error("[call-popup] Call error:", error);
      updateStatus("Connection issue. Try again in a moment.");
    })
    .finally(() => {
      disableInput(false);
      isProcessing = false;
    });
}

function disableInput(disabled: boolean) {
  if (sendBtn) sendBtn.disabled = disabled;
  if (manualInput) manualInput.disabled = disabled;
}

function appendMessage(role: "assistant" | "user", text: string) {
  if (!dialogEl) return;
  const div = document.createElement("div");
  div.className = `call-message ${role}`;
  div.innerHTML = `<div class="call-avatar">${
    role === "assistant" ? "🤖" : "🧑"
  }</div><div class="call-bubble">${escapeHtml(text)}</div>`;
  dialogEl.appendChild(div);
  dialogEl.scrollTop = dialogEl.scrollHeight;
}

function playReplyAudio(base64Audio: string) {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  stopAudio(replyAudio);
  replyAudio = new Audio(
    URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }))
  );

  updateStatus("Therapist speaking…");
  micBtn?.classList.remove("user-speaking");
  micBtn?.classList.add("persona-speaking");

  replyAudio
    .play()
    .then(() => {
      replyAudio?.addEventListener(
        "ended",
        () => {
          updateStatus("Your turn to speak");
          micBtn?.classList.remove("persona-speaking");
          micBtn?.classList.add("user-speaking");
        },
        { once: true }
      );
    })
    .catch((error) => {
      console.warn("[call-popup] Audio playback failed:", error);
      updateStatus("Your turn to speak");
      micBtn?.classList.remove("persona-speaking");
      micBtn?.classList.add("user-speaking");
    });
}

function stopAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    /* ignore */
  }
}

function updateStatus(message: string) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function endCall() {
  isInCall = false;
  stopAudio(ringAudio);
  stopAudio(replyAudio);
  if (recognition) {
    try {
      recognition.abort();
    } catch {
      /* ignore */
    }
  }
  callPopup?.classList.add("fade-out");
  setTimeout(() => {
    callPopup?.remove();
    resetCallState();
  }, 300);
}

function escapeHtml(value: string | undefined | null) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}


