# MemBot AI Core — Architecture (v2)

This document records the redesign of MemBot's AI core, which was the point of the
2.0 refactor. The rest of the app (auth, REST dashboards, Postgres schema, React UI)
kept its existing contracts; only the reasoning layer was rebuilt.

## Context — what v1 was

The original AI core (`handlers/aiHandler.ts`, one 230-line file) drove the LLM by hand:

- **Two duplicated provider branches.** Every call was written twice — once for the
  Google SDK, once for Ollama — with the model chosen by comparing `MODEL_NAME` to the
  literal `"gemini-1.5-flash"`.
- **Prompt-string parsing.** Categorization and entity extraction asked the model for
  free text, then a `trimJSON()` helper sliced between the first `{` and last `}` and
  hoped `JSON.parse` succeeded.
- **A cross-user state bug.** Conversation history lived in a single module-level
  `let chatHistory: Message[]` — shared across every WebSocket connection, so concurrent
  users leaked context into each other.

The original README even listed *"Implementation of LangChain for improved AI chat flow
and decision-making"* as an open TODO. This refactor delivers exactly that.

## Decision

Rebuild the core as a **LangGraph `StateGraph`** with **LangChain** models and
**Zod structured output**.

### The graph

```
        ┌──────────┐   category?    ┌─────────┐   ┌─────────┐   ┌─────────┐
START ─▶│ classify │───────yes─────▶│ extract │──▶│ persist │──▶│ respond │──▶ END
        └──────────┘                └─────────┘   └─────────┘   └─────────┘
              │                                                       ▲
              └──────────────────────── no ───────────────────────────┘
```

- **classify** — `model.withStructuredOutput(ClassificationSchema)` returns a typed
  category (`financial | health and well-being | relationships`) or `null`.
- **extract** — picks the per-category Zod schema and runs `withStructuredOutput`.
  This **deletes `trimJSON` entirely**: the schema is the contract, the model is
  constrained to it, and the result is typed end to end.
- **persist** — reuses the existing transactional `storeEntry` helper (unchanged SQL).
- **respond** — streams a natural reply. If an entry was stored, the system prompt asks
  it to confirm what was recorded.

Entries that don't fit a category skip straight from `classify` to `respond`.

### Provider-agnostic by construction

`createChatModel()` returns a LangChain `BaseChatModel` — `ChatGoogleGenerativeAI` or
`ChatOllama`. Every node calls the same factory, so swapping clouds is one env var
(`LLM_PROVIDER`), not a second code path. Migrated off the deprecated
`@google/generative-ai` SDK to `@langchain/google-genai`.

### State ownership

The graph is **stateless**. Conversation history is owned by the caller and keyed per
connection in a `WeakMap<ServerWebSocket, BaseMessage[]>`, so it is isolated per user
and garbage-collected when the socket closes. This fixes the shared-`chatHistory` bug.

### Streaming

`graph.stream(input, { streamMode: ["updates", "messages"] })`:
- `updates` carries each node's partial state — we read the classified `category` from it.
- `messages` streams LLM tokens; we forward **only** the `respond` node's tokens to the
  WebSocket, so classification/extraction calls never leak into the user's stream.

The WebSocket wire protocol is unchanged, so the existing React client works untouched.

## Consequences

- No more brittle JSON string-slicing; extraction is schema-validated.
- No more cross-user context bleak.
- Adding a provider or a graph node is a local change.
- The design is now a natural base for **Phase 2** (below).

## Phase 2 — conversational agent with tools (planned)

The current graph is a deterministic pipeline. Phase 2 adds an agentic branch: bind the
per-category read queries (`getFinancial`, `getHealthWellbeingEntries`,
`getRelationships`, aggregates) as LangChain **tools**, and let a tool-calling node answer
questions over the user's own history ("how much did I spend on coffee this month?",
"how often did I meditate?"). This turns MemBot from a capture pipeline into a companion
that can reason over what it stored — using the same graph, plus a `tools` node and a
conditional edge. Long-term memory (summary folding) slots in at the same seam.
