import { streamText, stepCountIs, type ModelMessage, type LanguageModelUsage } from "ai";
import { tutorModel, MAX_TUTOR_STEPS, MAX_OUTPUT_TOKENS } from "./model";
import { tutorTools } from "./tools";
import { lessonSystemPrompt, quizSystemPrompt, codeReviewSystemPrompt } from "./prompts";

interface TutorOptions {
  mode: "LESSON" | "QUIZ" | "CODE_REVIEW";
  messages: ModelMessage[];
  topicContext: {
    monthNum: number;
    monthTitle: string;
    weekNum: number;
    weekTitle: string;
    topicTitle: string;
    topicContent: string;
    topicType: string;
    resources: string[];
    completedTopics?: string[];
  };
  // Called once after streaming completes, with the final text + token usage.
  // The route uses this to persist the assistant message; errors are caught here.
  onComplete?: (result: {
    text: string;
    usage: LanguageModelUsage;
  }) => Promise<void> | void;
}

export function streamTutorResponse(options: TutorOptions) {
  const { mode, messages, topicContext, onComplete } = options;

  const systemPromptFn = {
    LESSON: lessonSystemPrompt,
    QUIZ: quizSystemPrompt,
    CODE_REVIEW: codeReviewSystemPrompt,
  }[mode];

  // Only the conversational lesson tutor gets tools. QUIZ emits a strict JSON
  // result block and CODE_REVIEW is self-contained — tools would muddy both.
  const tools = mode === "LESSON" ? tutorTools : undefined;

  return streamText({
    model: tutorModel,
    system: systemPromptFn(topicContext),
    messages,
    tools,
    stopWhen: stepCountIs(MAX_TUTOR_STEPS),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    onFinish: async ({ text, usage }) => {
      console.log(`[tutor:${mode}] tokens`, usage);
      try {
        await onComplete?.({ text, usage });
      } catch (err) {
        console.error(`[tutor:${mode}] onComplete failed`, err);
      }
    },
  });
}
