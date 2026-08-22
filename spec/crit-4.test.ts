import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// This week's spec (crits/04-instrument): "the browser is the instrument ---
// sound is made live in the page by the player, not played back" and
// "playable with whatever is at hand --- mouse, keyboard or touch". Neither
// is fully checkable by a machine --- whether it's actually expressive is for
// the crit --- but both have a mechanical proxy worth asserting on the built
// site, so a regression shows up before the crit does.
const DIST = resolve("dist");

function files(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const shipped = files().map((path) => relative(DIST, path).split(sep).join("/"));
const htmlPaths = shipped.filter((name) => name.endsWith(".html"));
const jsPaths = shipped.filter((name) => name.endsWith(".js"));

// Every script that ships: inline <script> bodies from every page, plus every
// built .js file they might point at.
const shippedScript = [
  ...htmlPaths.flatMap((name) => {
    const doc = new JSDOM(readFileSync(join(DIST, name), "utf8")).window.document;
    return Array.from(doc.querySelectorAll("script:not([src])")).map((s) => s.textContent ?? "");
  }),
  ...jsPaths.map((name) => readFileSync(join(DIST, name), "utf8")),
].join("\n");

describe("crit 4 spec: the browser is the instrument", () => {
  it("uses the Web Audio API to make sound live, rather than shipping none", () => {
    expect(
      /\bAudioContext\b/.test(shippedScript),
      "no AudioContext reference found in the shipped script --- replace the starter with a live synth",
    ).toBe(true);
  });

  it("ships no pre-recorded playback element", () => {
    for (const name of htmlPaths) {
      const doc = new JSDOM(readFileSync(join(DIST, name), "utf8")).window.document;
      expect(
        doc.querySelector("audio, video"),
        `${name} ships an <audio>/<video> element --- the spec asks for sound made live by the player, not played back`,
      ).toBeNull();
    }
  });
});

describe("crit 4 spec: playable with whatever is at hand", () => {
  it("listens for keyboard input, not just pointer input", () => {
    expect(
      /\bkeydown\b|\bkeyup\b/.test(shippedScript),
      "no keydown/keyup listener found --- the spec asks for it to be playable by keyboard, not just mouse or touch",
    ).toBe(true);
  });

  it("listens for pointer or touch input, not just keyboard", () => {
    expect(
      /\bpointerdown\b|\bmousedown\b|\btouchstart\b|\bclick\b/.test(shippedScript),
      "no pointer/mouse/touch listener found --- the spec asks for it to be playable with a mouse or touch, not just keyboard",
    ).toBe(true);
  });
});
