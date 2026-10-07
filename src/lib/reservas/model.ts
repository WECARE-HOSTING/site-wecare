import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";

export const CACHE_MODEL_TAG = "anthropic/claude-haiku-4.5";

const MODEL_ID = "claude-haiku-4-5-20251001";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not set: no new translations or nearby places can be generated (stored ones are still served)");
  }
}

export function aiModel() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new AiNotConfiguredError();
  return createAnthropic({ apiKey })(MODEL_ID);
}
