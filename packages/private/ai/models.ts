import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import { ChatAnthropic } from "@langchain/anthropic";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type Provider = "google" | "anthropic" | "ollama";

/**
 * Provider is chosen explicitly via LLM_PROVIDER, otherwise inferred from
 * whichever cloud key is present; with no key, a local Ollama.
 */
export function resolveProvider(): Provider {
  const p = process.env.LLM_PROVIDER?.toLowerCase();
  if (p === "google" || p === "anthropic" || p === "ollama") return p;
  if (process.env.GOOGLE_AI_API_KEY) return "google";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "ollama";
}

export function ollamaModelName(): string {
  return process.env.MODEL_NAME ?? "gemma2";
}

/**
 * Single factory for every LLM call in the graph. Because both providers are
 * LangChain `BaseChatModel`s, the graph nodes are provider-agnostic: swapping
 * clouds is one env var, not a second code path.
 */
export function createChatModel(opts?: { temperature?: number }): BaseChatModel {
  const provider = resolveProvider();
  const temperature = opts?.temperature ?? 0.4;

  if (provider === "google") {
    return new ChatGoogleGenerativeAI({
      model: process.env.GOOGLE_MODEL ?? "gemini-2.0-flash",
      apiKey: process.env.GOOGLE_AI_API_KEY,
      temperature,
    });
  }

  if (provider === "anthropic") {
    return new ChatAnthropic({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      apiKey: process.env.ANTHROPIC_API_KEY,
      // Optional: point at an Anthropic-compatible proxy instead of the official API.
      anthropicApiUrl: process.env.ANTHROPIC_BASE_URL,
      temperature,
      // The client defaults top_p/top_k to -1 and always sends them; Claude 4.x
      // rejects those sentinels. Drop them so the server picks its own defaults.
      invocationKwargs: { top_p: undefined, top_k: undefined },
    });
  }

  return new ChatOllama({
    baseUrl: process.env.OLLAMA_HOST ?? "http://localhost:11434",
    model: ollamaModelName(),
    temperature,
  });
}
