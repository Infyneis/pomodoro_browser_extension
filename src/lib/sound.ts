// Base64 encoded notification sound (short pleasant chime)
const NOTIFICATION_SOUND = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYZNBHtNAAAAAAD/+9DEAAAGAAGn9AAAISYQMT0VgAAAAABn/+7DE/wAADSAAAAAA';

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

async function initAudio(): Promise<void> {
  if (audioContext) return;

  audioContext = new AudioContext();

  try {
    const response = await fetch(NOTIFICATION_SOUND);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch {
    // Fallback: generate a simple tone
    audioBuffer = createToneBuffer(audioContext);
  }
}

function createToneBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const duration = 0.3;
  const frequency = 880;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-3 * t);
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
  }

  return buffer;
}

export async function playNotificationSound(volume: number = 0.7): Promise<void> {
  await initAudio();

  if (!audioContext || !audioBuffer) return;

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  source.buffer = audioBuffer;
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start();
}

export function createBellSound(volume: number = 0.7): void {
  const ctx = new AudioContext();

  const frequencies = [523.25, 659.25, 783.99];
  const duration = 0.8;

  frequencies.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime + index * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration + index * 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + index * 0.1);
    oscillator.stop(ctx.currentTime + duration + index * 0.1);
  });

  setTimeout(() => ctx.close(), (duration + 0.5) * 1000);
}
