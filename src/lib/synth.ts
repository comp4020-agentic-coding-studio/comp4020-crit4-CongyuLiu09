export type Waveform = "sine" | "triangle" | "sawtooth" | "square";

export interface Voice {
  ctx: AudioContext;
  osc: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

const MIN_FREQUENCY = 110; // A2
const MAX_FREQUENCY = 880; // A5, three octaves up
const MIN_CUTOFF = 500;
const MAX_CUTOFF = 8000;
const MIN_GAIN = 0.04;
const MAX_GAIN = 0.22;
const RAMP_SECONDS = 0.05;
const ENGAGE_TIME_CONSTANT = 0.03;
const DISENGAGE_TIME_CONSTANT = 0.12;

/** x=0..1 (left..right) -> frequency, exponential so it reads as pitch, not Hz. */
export function mapXToFrequency(x: number): number {
  const clamped = Math.min(1, Math.max(0, x));
  return MIN_FREQUENCY * (MAX_FREQUENCY / MIN_FREQUENCY) ** clamped;
}

/** y=0..1 (top..bottom) -> filter cutoff. Top (y=0) is brightest. */
export function mapYToCutoff(y: number): number {
  const clamped = Math.min(1, Math.max(0, y));
  return MAX_CUTOFF * (MIN_CUTOFF / MAX_CUTOFF) ** clamped;
}

/** y=0..1 (top..bottom) -> gain level. Top (y=0) is loudest. */
export function mapYToGain(y: number): number {
  const clamped = Math.min(1, Math.max(0, y));
  return MAX_GAIN - clamped * (MAX_GAIN - MIN_GAIN);
}

/** Builds the persistent audio graph. The oscillator starts immediately at
 * silent gain and is never stopped --- recreating nodes per note is what
 * causes clicks in a continuously-played instrument like this one. */
export function createVoice(ctx: AudioContext): Voice {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = mapXToFrequency(0.5);
  filter.type = "lowpass";
  filter.frequency.value = mapYToCutoff(0.5);
  gain.gain.value = 0;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();

  return { ctx, osc, filter, gain };
}

/** Ramp the voice's pitch and timbre toward the given normalized position. */
export function updateVoice(voice: Voice, x: number, y: number): void {
  const now = voice.ctx.currentTime;
  voice.osc.frequency.linearRampToValueAtTime(mapXToFrequency(x), now + RAMP_SECONDS);
  voice.filter.frequency.linearRampToValueAtTime(mapYToCutoff(y), now + RAMP_SECONDS);
  if (voice.gain.gain.value > 0) {
    voice.gain.gain.setTargetAtTime(mapYToGain(y), now, ENGAGE_TIME_CONSTANT);
  }
}

/** Fade the voice in (on=true) or out (on=false). Always a ramp, never a
 * hard set, so starting and releasing a note never clicks. */
export function setEngaged(voice: Voice, on: boolean, y: number): void {
  const now = voice.ctx.currentTime;
  const target = on ? mapYToGain(y) : 0;
  const timeConstant = on ? ENGAGE_TIME_CONSTANT : DISENGAGE_TIME_CONSTANT;
  voice.gain.gain.setTargetAtTime(target, now, timeConstant);
}

export function setWaveform(voice: Voice, type: Waveform): void {
  voice.osc.type = type;
}
