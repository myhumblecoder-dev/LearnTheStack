import { anthropic } from "@ai-sdk/anthropic";

// Single source of truth for the tutor model.
// HAIKU ONLY — do not change to Opus/Sonnet without a deliberate cost decision.
// Haiku 4.5 pricing: $1 / 1M input tokens, $5 / 1M output tokens.
export const TUTOR_MODEL_ID = "claude-haiku-4-5" as const;
export const tutorModel = anthropic(TUTOR_MODEL_ID);

// Cost guardrails.
export const MAX_TUTOR_STEPS = 5; // bounds the tool-calling loop (each step re-sends context)
export const MAX_OUTPUT_TOKENS = 1500; // caps per-response output tokens (the expensive side)
