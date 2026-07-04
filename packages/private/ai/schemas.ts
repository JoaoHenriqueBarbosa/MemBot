import { z } from "zod";

/**
 * Canonical category labels. These strings are a contract shared with:
 *  - the Postgres schema (init.sql: `category`, per-category tables)
 *  - the frontend badge (`category.replace(/\s/g, "-")` + i18n key lookup)
 * so they must not drift. `Category` in ../utils/types.ts mirrors this list.
 */
export const CATEGORIES = [
  "financial",
  "health and well-being",
  "relationships",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Structured output for the classify node — replaces free-text prompt parsing. */
export const ClassificationSchema = z.object({
  category: z
    .enum(CATEGORIES)
    .nullable()
    .describe(
      "The single category that best fits the journal entry, or null if none of them apply.",
    ),
});

/** Per-category entity schemas. `withStructuredOutput` enforces these — no more trimJSON(). */
export const FinancialSchema = z.object({
  description: z.string().nullable().describe("Short description of the transaction."),
  amount: z.number().nullable().describe("Monetary amount as a number."),
  direction: z.enum(["in", "out"]).nullable().describe("Money coming in or going out."),
  payment_method: z.string().nullable().describe("e.g. cash, credit card, pix."),
});

export const HealthWellbeingSchema = z.object({
  activity_type: z.enum(["exercise", "meditation", "other"]).nullable(),
  duration: z.string().nullable().describe('Human-readable duration, e.g. "30 minutes".'),
  intensity: z.enum(["low", "medium", "high"]).nullable(),
  emotion_description: z.string().nullable(),
  emotion_intensity: z
    .number()
    .int()
    .min(1)
    .max(10)
    .nullable()
    .describe("Subjective emotional intensity from 1 to 10, if expressed."),
});

export const RelationshipsSchema = z.object({
  person: z.string().nullable(),
  interaction_type: z.enum(["conversation", "activity", "other"]).nullable(),
  feelings: z.string().nullable(),
});

const SCHEMA_BY_CATEGORY = {
  financial: FinancialSchema,
  "health and well-being": HealthWellbeingSchema,
  relationships: RelationshipsSchema,
} satisfies Record<Category, z.ZodTypeAny>;

export function entitySchemaFor(category: Category): z.ZodTypeAny {
  return SCHEMA_BY_CATEGORY[category];
}
