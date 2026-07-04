import {
  StateGraph,
  Annotation,
  START,
  END,
} from "@langchain/langgraph";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import { createChatModel } from "./models";
import {
  ClassificationSchema,
  entitySchemaFor,
  type Category,
} from "./schemas";
import { classifyPrompt, extractPrompt, systemPrompt } from "./prompts";
import { storeEntry } from "../utils/storeEntry";
import type { User } from "../utils/types";

/**
 * Graph state. `messages` is the running conversation (append-reduced, the
 * standard LangGraph pattern); everything else is per-turn scratch space.
 * This replaces the old module-global `chatHistory` array — the graph is
 * stateless and the history is owned by the caller (per WebSocket connection).
 */
export const JournalState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (prev, next) => prev.concat(next),
    default: () => [],
  }),
  input: Annotation<string>(),
  categorize: Annotation<boolean>(),
  language: Annotation<string>(),
  user: Annotation<Partial<User>>(),
  category: Annotation<Category | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  entities: Annotation<Record<string, unknown> | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
  stored: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),
});

type State = typeof JournalState.State;

/** classify → pick a category with structured output, or null. */
async function classify(state: State): Promise<Partial<State>> {
  if (!state.categorize) return { category: null };
  const model = createChatModel({ temperature: 0 }).withStructuredOutput(
    ClassificationSchema,
    { name: "classify" },
  );
  const result = await model.invoke([
    new SystemMessage(classifyPrompt(state.language)),
    new HumanMessage(state.input),
  ]);
  return { category: result.category ?? null };
}

/** extract → pull typed entities for the chosen category. No JSON string surgery. */
async function extract(state: State): Promise<Partial<State>> {
  if (!state.category) return {};
  const schema = entitySchemaFor(state.category);
  const model = createChatModel({ temperature: 0 }).withStructuredOutput(schema, {
    name: "extract",
  });
  const entities = (await model.invoke([
    new SystemMessage(extractPrompt(state.category, state.language)),
    new HumanMessage(state.input),
  ])) as Record<string, unknown>;
  return { entities };
}

/** persist → write to Postgres inside the existing transactional helper. */
async function persist(state: State): Promise<Partial<State>> {
  if (!state.category || !state.entities) return {};
  try {
    await storeEntry(state.category, state.entities, state.user);
    return { stored: true };
  } catch (error) {
    console.error("persist node failed:", error);
    return { stored: false };
  }
}

/** respond → stream a natural reply. Tokens leave via streamMode:"messages". */
async function respond(state: State): Promise<Partial<State>> {
  const model = createChatModel({ temperature: 0.5 });
  const conversation = [
    new SystemMessage(
      systemPrompt({
        language: state.language,
        stored: state.stored,
        category: state.category,
        entities: state.entities,
      }),
    ),
    ...state.messages,
    new HumanMessage(state.input),
  ];
  const reply = await model.invoke(conversation);
  return {
    messages: [new HumanMessage(state.input), new AIMessage({ content: reply.content })],
  };
}

const workflow = new StateGraph(JournalState)
  .addNode("classify", classify)
  .addNode("extract", extract)
  .addNode("persist", persist)
  .addNode("respond", respond)
  .addEdge(START, "classify")
  .addConditionalEdges(
    "classify",
    (state: State) => (state.category ? "extract" : "respond"),
    { extract: "extract", respond: "respond" },
  )
  .addEdge("extract", "persist")
  .addEdge("persist", "respond")
  .addEdge("respond", END);

export const journalGraph = workflow.compile();
