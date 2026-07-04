import type { Category } from "./schemas";

const LANG_NAME: Record<string, string> = {
  ptBR: "Brazilian Portuguese",
  en: "English",
};

function languageName(language: string): string {
  return LANG_NAME[language] ?? "the user's language";
}

export function classifyPrompt(_language: string): string {
  return [
    "You are the classification stage of a journaling assistant.",
    "Read the user's diary entry and decide which single category it belongs to:",
    "- financial: spending, income, payments, money.",
    "- health and well-being: exercise, meditation, sleep, mood, emotions.",
    "- relationships: interactions with other people.",
    "If the entry is small talk or fits none of them, return null.",
    "Return only the structured result.",
  ].join("\n");
}

export function extractPrompt(category: Category, _language: string): string {
  return [
    `You are the extraction stage of a journaling assistant, handling a "${category}" entry.`,
    "Pull the requested fields out of the entry.",
    "Use null for anything the user did not mention. Do not invent values.",
    "Return only the structured result.",
  ].join("\n");
}

export function systemPrompt(args: {
  language: string;
  stored: boolean;
  category: Category | null;
  entities: Record<string, unknown> | null;
}): string {
  const lines = [
    "You are MemBot, a warm, concise journaling companion.",
    `Always reply in ${languageName(args.language)}.`,
  ];

  if (args.stored && args.category) {
    lines.push(
      `The user's latest entry was saved under the "${args.category}" category with these details: ${JSON.stringify(
        args.entities ?? {},
      )}.`,
      "Acknowledge that it was recorded, reflect briefly and kindly on what they shared, and invite them to keep going.",
    );
  } else {
    lines.push(
      "Respond naturally to the user. Keep it supportive and brief.",
    );
  }

  return lines.join("\n");
}
