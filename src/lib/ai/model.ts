import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Anthropic path is HAIKU ONLY — do not change to Opus/Sonnet without a
// deliberate cost decision. Haiku 4.5 pricing: $1 / 1M input, $5 / 1M output.
export const TUTOR_MODEL_ID = "claude-haiku-4-5" as const;

// Provider is env-driven so you can iterate against a free, private, offline
// local model in dev and switch to Claude for production-quality answers +
// reliable tool use.
//
//   TUTOR_PROVIDER=ollama   -> local Ollama (uses OLLAMA_BASE_URL, OLLAMA_MODEL)
//   TUTOR_PROVIDER=anthropic -> Claude Haiku 4.5 (the default when unset)
export type TutorProvider = "anthropic" | "ollama";
export const TUTOR_PROVIDER: TutorProvider =
  process.env.TUTOR_PROVIDER === "ollama" ? "ollama" : "anthropic";

function buildTutorModel() {
  if (TUTOR_PROVIDER === "ollama") {
    const ollama = createOpenAICompatible({
      name: "ollama",
      baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
    });
    // Pick a tool-capable local model (e.g. qwen2.5, llama3.1) if you want the
    // tutor's tools to work; otherwise it just answers without them.
    return ollama(process.env.OLLAMA_MODEL ?? "qwen2.5:32b");
  }
  return anthropic(TUTOR_MODEL_ID);
}

export const tutorModel = buildTutorModel();

// Cost guardrails (matter on the Anthropic path; harmless on Ollama).
export const MAX_TUTOR_STEPS = 5; // bounds the tool-calling loop (each step re-sends context)
export const MAX_OUTPUT_TOKENS = 1500; // caps per-response output tokens (the expensive side)
