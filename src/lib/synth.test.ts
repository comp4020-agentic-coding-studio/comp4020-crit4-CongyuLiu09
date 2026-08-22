import { describe, expect, it } from "vitest";
import { mapXToFrequency, mapYToCutoff, mapYToGain } from "./synth";

describe("mapXToFrequency", () => {
  it("maps the left edge to the lowest pitch", () => {
    expect(mapXToFrequency(0)).toBeCloseTo(110);
  });

  it("maps the right edge to the highest pitch", () => {
    expect(mapXToFrequency(1)).toBeCloseTo(880);
  });

  it("is monotonically increasing", () => {
    expect(mapXToFrequency(0.25)).toBeLessThan(mapXToFrequency(0.75));
  });

  it("clamps out-of-range input", () => {
    expect(mapXToFrequency(-1)).toBeCloseTo(mapXToFrequency(0));
    expect(mapXToFrequency(2)).toBeCloseTo(mapXToFrequency(1));
  });
});

describe("mapYToCutoff", () => {
  it("is brightest at the top (y=0)", () => {
    expect(mapYToCutoff(0)).toBeGreaterThan(mapYToCutoff(1));
  });

  it("stays within the configured range", () => {
    for (const y of [0, 0.25, 0.5, 0.75, 1]) {
      expect(mapYToCutoff(y)).toBeGreaterThanOrEqual(500);
      expect(mapYToCutoff(y)).toBeLessThanOrEqual(8000);
    }
  });
});

describe("mapYToGain", () => {
  it("is loudest at the top (y=0)", () => {
    expect(mapYToGain(0)).toBeGreaterThan(mapYToGain(1));
  });

  it("never reaches zero, so a held note stays audible", () => {
    expect(mapYToGain(1)).toBeGreaterThan(0);
  });
});
