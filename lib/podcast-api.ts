// API functions for podcast generation

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL ?? "gpt-4o-mini";
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_MALE = import.meta.env.VITE_ELEVENLABS_VOICE_MALE;
const ELEVENLABS_VOICE_FEMALE = import.meta.env.VITE_ELEVENLABS_VOICE_FEMALE;

export interface ScriptGenerationParams {
  topic: string;
  provider: "gemini" | "chatgpt";
  length: string; // e.g., "5-10" or "15"
  person1Gender: "male" | "female";
  person2Gender: "male" | "female";
}

export async function generateScript(params: ScriptGenerationParams): Promise<string> {
  const { topic, provider, length, person1Gender, person2Gender } = params;

  // Generate appropriate names based on gender
  const hostName = person1Gender === "male" ? "Alex" : "Sarah";
  const guestName = person2Gender === "male" ? "Michael" : "Emma";
  
  const prompt = `Create a professional podcast script for "VoxGen AI Podcast Studio" between two people discussing: ${topic}

Requirements:
- Duration: ${length} minutes
- Show Name: ALWAYS use "VoxGen AI Podcast Studio" - never change this name, never use any other show name
- Host: ${hostName} (${person1Gender}) - the host of the show
- Guest: ${guestName} (${person2Gender}) - the guest on the show
- Format: A conversation between ${hostName} (the host) and ${guestName} (the guest)
- Tone: Natural, warm, conversational - like a real podcast
- Structure: 
  1. Introduction where ${hostName} introduces the show "VoxGen AI Podcast Studio" and welcomes ${guestName}
  2. ${hostName} and ${guestName} introduce themselves (${hostName} as host, ${guestName} as guest)
  3. Main discussion about the topic
  4. Conclusion
- IMPORTANT: Format each line EXACTLY as "${hostName}: [dialogue]" or "${guestName}: [dialogue]" on separate lines
- Each person's dialogue should be on its own line starting with "${hostName}:" or "${guestName}:" followed by a colon and space
- NEVER use "Person 1" or "Person 2" - always use the actual names ${hostName} and ${guestName}
- Make it engaging, informative, and natural-sounding
- Target word count: approximately ${parseInt(length) * 150} words per minute
- Alternate between ${hostName} and ${guestName} for a natural conversation flow

Example format:
${hostName}: Welcome to VoxGen AI Podcast Studio. I'm ${hostName}, your host for today's show.
${guestName}: Thank you for having me, ${hostName}. I'm ${guestName}, and I'm excited to be here.
${hostName}: Absolutely. Let's dive right into today's topic...

Generate the complete script following this exact format:`;

  if (provider === "gemini") {
    return await callGemini(prompt);
  } else {
    return await callOpenAI(prompt);
  }
}

export async function refineScript(
  script: string,
  provider: "gemini" | "chatgpt",
  instruction?: string
): Promise<string> {
  const prompt = instruction
    ? `${instruction}\n\nCurrent script:\n${script}\n\nPlease refine and improve the script:`
    : `Please refine and improve this podcast script to make it more natural, engaging, and professional:\n\n${script}`;

  if (provider === "gemini") {
    return await callGemini(prompt);
  } else {
    return await callOpenAI(prompt);
  }
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  try {
    // Try gemini-1.5-pro first (more stable), fallback to gemini-pro if needed
    const models = ["gemini-1.5-flash", "gemini-2.5-flash"];
    
    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Gemini ${model} failed:`, response.status, errorText);
          if (model === models[models.length - 1]) {
            // Last model, throw error
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
          }
          continue; // Try next model
        }

        const data = await response.json();
        
        // Handle response structure
        if (data.error) {
          throw new Error(`Gemini API error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        const candidate = data?.candidates?.[0];
        if (!candidate) {
          throw new Error("No candidates returned from Gemini API");
        }

        // Extract text from parts
        const parts = candidate.content?.parts || [];
        const text = parts
          .map((part: { text?: string }) => part?.text)
          .filter(Boolean)
          .join("\n\n");

        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from Gemini API");
        }

        console.log(`✅ Successfully used Gemini model: ${model}`);
        return text.trim();
      } catch (error: any) {
        // If this is the last model or error is not about model availability, throw
        if (model === models[models.length - 1] || !error.message?.includes("404")) {
          throw error;
        }
        // Otherwise, try next model
        continue;
      }
    }
    
    throw new Error("All Gemini models failed");
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to generate script with Gemini: ${error.toString()}`);
  }
}

async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: "You are a professional podcast script writer. Create natural, engaging, and warm conversational scripts.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

export interface AudioGenerationParams {
  script: string;
  person1VoiceId: string;
  person2VoiceId: string;
}

export async function generatePodcastAudio(params: AudioGenerationParams): Promise<string> {
  const { script, person1VoiceId, person2VoiceId } = params;

  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set in environment variables");
  }

  if (!person1VoiceId || !person2VoiceId) {
    throw new Error("Voice IDs are not set. Please check your environment variables.");
  }

  // Extract names from script (first occurrence of name patterns)
  const namePattern = /^([A-Z][a-z]+):\s*/;
  const lines = script.split("\n");
  let hostName = "Alex";
  let guestName = "Emma";
  
  // Find the first two unique names in the script
  const foundNames: string[] = [];
  for (const line of lines) {
    const match = line.trim().match(namePattern);
    if (match && !foundNames.includes(match[1])) {
      foundNames.push(match[1]);
      if (foundNames.length === 2) break;
    }
  }
  
  if (foundNames.length >= 2) {
    hostName = foundNames[0];
    guestName = foundNames[1];
  }
  
  // Parse script to separate host and guest lines in order
  // Handle formats: "Name:", "Name -", etc.
  const scriptSegments: Array<{ text: string; voiceId: string; speaker: 1 | 2; duration?: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for host name patterns
    if (line.match(new RegExp(`^${hostName}\\s*[:\-]`, "i"))) {
      let text = line.replace(new RegExp(`^${hostName}\\s*[:\-]\\s*`, "i"), "").trim();
      
      // If the text continues on next lines (until next speaker marker), collect it
      if (!text || text.length < 10) {
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (!nextLine) {
            j++;
            continue;
          }
          // Stop if we hit another speaker
          if (nextLine.match(new RegExp(`^(${hostName}|${guestName})\\s*[:\-]`, "i"))) {
            break;
          }
          text += (text ? " " : "") + nextLine;
          j++;
        }
        i = j - 1;
      }
      
      if (text) {
        scriptSegments.push({ text, voiceId: person1VoiceId, speaker: 1 });
      }
    } 
    // Check for guest name patterns
    else if (line.match(new RegExp(`^${guestName}\\s*[:\-]`, "i"))) {
      let text = line.replace(new RegExp(`^${guestName}\\s*[:\-]\\s*`, "i"), "").trim();
      
      // If the text continues on next lines (until next speaker marker), collect it
      if (!text || text.length < 10) {
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (!nextLine) {
            j++;
            continue;
          }
          // Stop if we hit another speaker
          if (nextLine.match(new RegExp(`^(${hostName}|${guestName})\\s*[:\-]`, "i"))) {
            break;
          }
          text += (text ? " " : "") + nextLine;
          j++;
        }
        i = j - 1;
      }
      
      if (text) {
        scriptSegments.push({ text, voiceId: person2VoiceId, speaker: 2 });
      }
    }
    // Fallback: check for Person 1/2 patterns (for backwards compatibility)
    else if (line.match(/^Person\s+1\s*[:\-]/i) || line.match(/^P1\s*[:\-]/i)) {
      let text = line.replace(/^Person\s+1\s*[:\-]\s*/i, "").replace(/^P1\s*[:\-]\s*/i, "").trim();
      if (!text || text.length < 10) {
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().match(/^Person\s+[12]\s*[:\-]/i) && !lines[j].trim().match(/^P[12]\s*[:\-]/i)) {
          const nextLine = lines[j].trim();
          if (nextLine) {
            text += (text ? " " : "") + nextLine;
          }
          j++;
        }
        i = j - 1;
      }
      if (text) {
        scriptSegments.push({ text, voiceId: person1VoiceId, speaker: 1 });
      }
    }
    else if (line.match(/^Person\s+2\s*[:\-]/i) || line.match(/^P2\s*[:\-]/i)) {
      let text = line.replace(/^Person\s+2\s*[:\-]\s*/i, "").replace(/^P2\s*[:\-]\s*/i, "").trim();
      if (!text || text.length < 10) {
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().match(/^Person\s+[12]\s*[:\-]/i) && !lines[j].trim().match(/^P[12]\s*[:\-]/i)) {
          const nextLine = lines[j].trim();
          if (nextLine) {
            text += (text ? " " : "") + nextLine;
          }
          j++;
        }
        i = j - 1;
      }
      if (text) {
        scriptSegments.push({ text, voiceId: person2VoiceId, speaker: 2 });
      }
    }
  }

  // If no segments found, try to use the whole script
  if (scriptSegments.length === 0) {
    // Remove any Person markers and clean up
    const cleanedScript = script
      .replace(/^Person\s+[12]\s*[:\-]\s*/gmi, "")
      .replace(/\n+/g, " ")
      .trim();
    
    if (cleanedScript && cleanedScript.length > 20) {
      scriptSegments.push({ text: cleanedScript, voiceId: person1VoiceId, speaker: 1 });
    } else {
      throw new Error("No valid script content found. Please ensure your script has dialogue lines starting with 'Person 1:' or 'Person 2:'");
    }
  }

  console.log(`Generating audio for ${scriptSegments.length} segments`);

  // Generate audio for each segment separately with the appropriate voice
  // Track segment durations for synchronization
  const audioBuffers: ArrayBuffer[] = [];
  const segmentDurations: number[] = [];
  const generatedSegments: Array<{ speaker: 1 | 2; duration: number }> = []; // Track only successfully generated segments
  
  for (let i = 0; i < scriptSegments.length; i++) {
    const segment = scriptSegments[i];
    console.log(`Generating segment ${i + 1}/${scriptSegments.length} with voice ${segment.voiceId}, speaker: ${segment.speaker}`);
    
    try {
      // Skip segments that are too short (less than 3 chars) - these are likely just interjections
      if (segment.text.trim().length < 3) {
        console.warn(`Segment ${i + 1} is too short (${segment.text.trim().length} chars), skipping`);
        continue;
      }
      
      const audioBuffer = await generateElevenLabsAudio(segment.text, segment.voiceId);
      if (audioBuffer && audioBuffer.byteLength >= 500) {
        // Decode audio to get actual duration (more accurate than file size estimation)
        let actualDuration = 0;
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const decodedAudio = await audioContext.decodeAudioData(audioBuffer.slice(0));
          actualDuration = decodedAudio.duration;
          await audioContext.close();
        } catch (decodeError) {
          // Fallback to estimation if decoding fails
          console.warn(`Could not decode audio for segment ${i + 1}, using estimation:`, decodeError);
          // More accurate estimation: MP3 at typical bitrates is ~1KB per second
          actualDuration = (audioBuffer.byteLength / 1000) * 1.0;
        }
        
        audioBuffers.push(audioBuffer);
        segmentDurations.push(actualDuration);
        
        // Store the speaker info for this successfully generated segment
        generatedSegments.push({
          speaker: segment.speaker,
          duration: actualDuration
        });
        
        console.log(`✅ Generated segment ${audioBuffers.length}: speaker ${segment.speaker} (${segment.speaker === 1 ? 'Host' : 'Guest'}), duration ${actualDuration.toFixed(2)}s, size: ${audioBuffer.byteLength} bytes`);
      } else {
        console.warn(`Segment ${i + 1} generated invalid audio (${audioBuffer?.byteLength || 0} bytes), skipping`);
      }
    } catch (error: any) {
      // For short segments, skip instead of failing the entire generation
      if (error.message?.includes("too short")) {
        console.warn(`Segment ${i + 1} is too short, skipping: ${error.message}`);
        continue;
      }
      console.error(`Error generating audio for segment ${i + 1}:`, error);
      throw new Error(`Failed to generate audio for segment ${i + 1}: ${error.message}`);
    }
  }

  if (audioBuffers.length === 0) {
    throw new Error("No valid audio segments were generated. Please ensure your script has dialogue lines with sufficient content.");
  }
  
  console.log(`Successfully generated ${audioBuffers.length} out of ${scriptSegments.length} audio segments`);

  // Concatenate all audio buffers into a single audio file
  const concatenatedAudio = await concatenateAudioBuffers(audioBuffers);
  
  // Store segment timing information for synchronization
  // Calculate start times based on cumulative durations - use only successfully generated segments
  const timingData = {
    segments: generatedSegments.map((seg, idx) => {
      const startTime = segmentDurations.slice(0, idx).reduce((sum: number, d: number) => sum + d, 0);
      return {
        speaker: seg.speaker,
        startTime: startTime,
        duration: seg.duration
      };
    })
  };
  
  const audioUrl = URL.createObjectURL(new Blob([concatenatedAudio], { type: "audio/mpeg" }));
  
  // Store timing data in sessionStorage for synchronization
  sessionStorage.setItem('podcast_timing_data', JSON.stringify(timingData));
  
  console.log(`Successfully generated and concatenated ${audioBuffers.length} audio segments`);
  console.log('Timing data (full):', JSON.stringify(timingData, null, 2));
  console.log('Segment breakdown:');
  timingData.segments.forEach((seg, idx) => {
    console.log(`  Segment ${idx + 1}: Speaker ${seg.speaker} (${seg.speaker === 1 ? 'Host' : 'Guest'}), starts at ${seg.startTime.toFixed(2)}s, duration ${seg.duration.toFixed(2)}s, ends at ${(seg.startTime + seg.duration).toFixed(2)}s`);
  });
  return audioUrl;
}

async function generateElevenLabsAudio(text: string, voiceId: string): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set");
  }

  if (!voiceId) {
    throw new Error("Voice ID is not set. Please check your environment variables.");
  }

  // Clean and validate text
  let cleanText = text.trim();
  
  // Remove any remaining Person markers if any
  cleanText = cleanText.replace(/^Person\s+[12]\s*[:\-]\s*/gmi, "").trim();
  
  // Allow shorter segments (like "Yes", "Okay", "I see") - minimum 3 characters
  if (!cleanText || cleanText.length < 3) {
    throw new Error(`Text is too short (${cleanText.length} chars). Minimum 3 characters required.`);
  }

  // Limit text length to avoid API errors (ElevenLabs has limits)
  if (cleanText.length > 5000) {
    console.warn(`Text is very long (${cleanText.length} chars), truncating to 5000 characters`);
    cleanText = cleanText.substring(0, 5000);
  }

  console.log(`Calling ElevenLabs API with voice ID: ${voiceId}, text length: ${cleanText.length}`);

  try {
    // Use the stream endpoint for better reliability
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: cleanText,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
        model_id: "eleven_multilingual_v2",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        voiceId: voiceId,
        textLength: cleanText.length
      });
      throw new Error(`ElevenLabs API error (${response.status}): ${errorText || response.statusText}. Please verify your API key and voice ID are correct.`);
    }

    // Check if response is audio
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("audio")) {
      const errorText = await response.text();
      console.error("Non-audio response:", { contentType, errorText });
      throw new Error(`Unexpected response type: ${contentType}. Response: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    console.log(`Received audio data: ${arrayBuffer.byteLength} bytes`);
    
    // Validate we got actual audio data (MP3 files should be at least a few KB)
    if (arrayBuffer.byteLength < 1000) {
      throw new Error(`Audio response is too short (${arrayBuffer.byteLength} bytes). This usually means the API key or voice ID is incorrect, or the text couldn't be processed.`);
    }

    return arrayBuffer;
  } catch (error: any) {
    console.error("ElevenLabs API error:", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to generate audio: ${error.toString()}`);
  }
}

async function concatenateAudioBuffers(audioBuffers: ArrayBuffer[]): Promise<ArrayBuffer> {
  // Convert MP3 buffers to AudioBuffers, concatenate them, then export back to MP3
  // For simplicity, we'll concatenate the raw MP3 data (this works but may have slight gaps)
  // A more robust solution would decode, concatenate, and re-encode, but that's more complex
  
  const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const concatenated = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const buffer of audioBuffers) {
    concatenated.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }
  
  return concatenated.buffer;
}

export function getVoiceId(gender: "male" | "female"): string {
  if (gender === "male") {
    return ELEVENLABS_VOICE_MALE || "";
  } else {
    return ELEVENLABS_VOICE_FEMALE || "";
  }
}

