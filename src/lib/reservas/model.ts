import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";

/**
 * The model behind translations and "what's nearby": Claude Haiku 4.5 through Anthropic's own API
 * (billed on WeCare's Anthropic account; set ANTHROPIC_API_KEY in the Vercel project).
 *
 * `CACHE_MODEL_TAG` goes into the storage keys of everything the model produced (see durable.ts).
 * It is deliberately NOT the provider's model id: it still reads "anthropic/claude-haiku-4.5" from
 * when this ran through Vercel's AI Gateway, so switching provider did not invalidate (and re-bill)
 * the ~US$ 4 of results already stored. Change it only when you want everything redone.
 */
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
