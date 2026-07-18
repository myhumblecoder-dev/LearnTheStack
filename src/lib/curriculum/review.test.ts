// @vitest-environment node
import { describe, it, expect } from "vitest";
import { intervalForStage } from "./review";

// Anchors the node-land logic test path against real app code (the
// spaced-repetition interval ladder). See docs/specs/spaced-repetition.md.
describe("intervalForStage", () => {
  it("returns the expanding interval for each ladder stage", () => {
    expect(intervalForStage(1)).toBe(3);
    expect(intervalForStage(2)).toBe(7);
    expect(intervalForStage(3)).toBe(21);
    expect(intervalForStage(4)).toBe(60);
    expect(intervalForStage(5)).toBe(120);
  });

  it("clamps below-ladder and beyond-max stages into range", () => {
    expect(intervalForStage(0)).toBe(3); // stage 0 → clamped up to stage 1
    expect(intervalForStage(99)).toBe(120); // beyond MAX_STAGE → capped at 5
  });
});
