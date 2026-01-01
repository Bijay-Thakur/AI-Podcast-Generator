// API functions for podcast generation
// NOTE: All API keys are now handled server-side. This file uses the backend API client.

import * as backendApi from './backendApi';

export interface ScriptGenerationParams {
  topic: string;
  provider: "gemini" | "chatgpt";
  length: string; // e.g., "5-10" or "15"
  person1Gender: "male" | "female";
  person2Gender: "male" | "female";
}

export async function generateScript(params: ScriptGenerationParams): Promise<string> {
  // Use backend API instead of direct calls
  return await backendApi.generateScript(params);
}

export async function refineScript(
  script: string,
  provider: "gemini" | "chatgpt",
  instruction?: string
): Promise<string> {
  // Use backend API instead of direct calls
  return await backendApi.refineScript({ script, provider, instruction });
}

// Removed: callGemini and callOpenAI - now handled by backend API

export interface AudioGenerationParams {
  script: string;
  person1VoiceId: string;
  person2VoiceId: string;
  onProgress?: (progress: number, current: number, total: number) => void;
}

export async function generatePodcastAudio(params: AudioGenerationParams): Promise<string> {
  const { script, person1VoiceId, person2VoiceId } = params;

  if (!person1VoiceId || !person2VoiceId) {
    throw new Error("Voice IDs are not set. Please check your backend environment variables.");
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
  
  // Report initial progress
  if (params.onProgress) {
    params.onProgress(0, 0, scriptSegments.length);
  }
  
  for (let i = 0; i < scriptSegments.length; i++) {
    const segment = scriptSegments[i];
    console.log(`Generating segment ${i + 1}/${scriptSegments.length} with voice ${segment.voiceId}, speaker: ${segment.speaker}`);
    
    // Report progress before generating this segment
    if (params.onProgress) {
      const progress = (i / scriptSegments.length) * 100;
      params.onProgress(progress, i, scriptSegments.length);
    }
    
    try {
      // Skip segments that are too short (less than 3 chars) - these are likely just interjections
      if (segment.text.trim().length < 3) {
        console.warn(`Segment ${i + 1} is too short (${segment.text.trim().length} chars), skipping`);
        continue;
      }
      
      // Use backend API for voice generation
      const audioBuffer = await backendApi.generateVoice({
        text: segment.text,
        voiceId: segment.voiceId,
      });
      
      // Add delay between requests to prevent rate limiting (except for last segment)
      if (i < scriptSegments.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay between requests
      }
      
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
        
        // Report progress after successfully generating this segment
        if (params.onProgress) {
          const progress = ((i + 1) / scriptSegments.length) * 100;
          params.onProgress(progress, i + 1, scriptSegments.length);
        }
      } else {
        console.warn(`Segment ${i + 1} generated invalid audio (${audioBuffer?.byteLength || 0} bytes), skipping`);
      }
    } catch (error: any) {
      // For short segments, skip instead of failing the entire generation
      if (error.message?.includes("too short")) {
        console.warn(`Segment ${i + 1} is too short, skipping: ${error.message}`);
        continue;
      }
      
      // Handle rate limit errors specifically
      if (error.code === 'RATE_LIMIT_EXCEEDED' || error.message?.includes('Rate limit')) {
        console.error(`Rate limit exceeded for segment ${i + 1}`);
        throw new Error(`Rate limit exceeded. Please wait a moment before trying again. You may have exceeded your ElevenLabs quota.`);
      }
      
      console.error(`Error generating audio for segment ${i + 1}:`, error);
      throw new Error(`Failed to generate audio for segment ${i + 1}: ${error.message}`);
    }
  }

  if (audioBuffers.length === 0) {
    throw new Error("No valid audio segments were generated. Please ensure your script has dialogue lines with sufficient content.");
  }
  
  console.log(`Successfully generated ${audioBuffers.length} out of ${scriptSegments.length} audio segments`);

  // Report progress for concatenation
  if (params.onProgress) {
    params.onProgress(95, scriptSegments.length, scriptSegments.length);
  }

  // Concatenate all audio buffers into a single audio file
  const concatenatedAudio = await concatenateAudioBuffers(audioBuffers);
  
  // Report completion
  if (params.onProgress) {
    params.onProgress(100, scriptSegments.length, scriptSegments.length);
  }
  
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

// Removed: generateElevenLabsAudio - now handled by backend API

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

// Cache voice IDs to avoid repeated API calls
let voiceIdsCache: { male: string; female: string } | null = null;

export async function getVoiceId(gender: "male" | "female"): Promise<string> {
  // Fetch voice IDs from backend if not cached
  if (!voiceIdsCache) {
    try {
      voiceIdsCache = await backendApi.getVoiceIds();
    } catch (error) {
      console.error("Failed to fetch voice IDs:", error);
      return ""; // Return empty string on error
    }
  }
  
  if (gender === "male") {
    return voiceIdsCache.male || "";
  } else {
    return voiceIdsCache.female || "";
  }
}

