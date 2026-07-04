import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type Provider = "google" | "ollama";

/**
 * Provider is chosen explicitly via LLM_PROVIDER, otherwise inferred:
 * a Google API key means cloud, its absence means a local Ollama.
 */
export function resolveProvider(): Provider {
  const p = process.env.LLM_PROVIDER?.toLowerCase();
  if (p === "google" || p === "ollama") return p;
  return process.env.GOOGLE_AI_API_KEY ? "google" : "ollama";
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

  return new ChatOllama({
    baseUrl: process.env.OLLAMA_HOST ?? "http://localhost:11434",
    model: ollamaModelName(),
    temperature,
  });
}
