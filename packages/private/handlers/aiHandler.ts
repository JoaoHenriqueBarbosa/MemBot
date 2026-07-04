import type { ServerWebSocket } from "bun";
import { Ollama } from "ollama";
import { HumanMessage, AIMessage, type BaseMessage } from "@langchain/core/messages";
import { WebSocketMessage } from "../utils/types.js";
import { journalGraph } from "../ai/graph.js";
import { resolveProvider, ollamaModelName } from "../ai/models.js";

/**
 * Per-connection conversation history. The old implementation kept a single
 * module-level `chatHistory` array, so every user shared (and corrupted) the
 * same context. History now lives keyed by the socket and is GC'd on close.
 */
const historyBySocket = new WeakMap<ServerWebSocket<unknown>, BaseMessage[]>();

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

export const handleInit = async (
  ws: ServerWebSocket<{ authToken: string }>,
) => {
  historyBySocket.set(ws, []);

  // Cloud provider: nothing to install.
  if (resolveProvider() !== "ollama") {
    ws.send('{ "type": "init" }');
    return;
  }

  // Local Ollama: make sure the model is present, streaming pull progress.
  const modelName = ollamaModelName();
  const list = await ollama.list();
  const installed = list.models.some((m) => m.name === `${modelName}:latest`);

  if (installed) {
    ws.send('{ "type": "init" }');
    return;
  }

  console.log(`Installing ${modelName}...`);
  const puller = await ollama.pull({ model: modelName, stream: true });
  for await (const progress of puller) {
    ws.send(JSON.stringify({ type: "pull-progress", content: progress }));
  }
  ws.send('{ "type": "init" }');
};

export const handleUserMessage = async (
  ws: ServerWebSocket<{ authToken: string }>,
  { content, categorize, language, user }: WebSocketMessage,
) => {
  // Echo the user's message back so the UI can render it.
  ws.send(
    JSON.stringify({
      type: "message",
      content,
      role: "user",
    } as WebSocketMessage),
  );

  const history = historyBySocket.get(ws) ?? [];
  const id = Math.random().toString(36).substring(7);
  let category: WebSocketMessage["category"];
  let assistantText = "";

  // streamMode ["updates","messages"]:
  //  - "updates" gives us each node's partial state (we read `category`)
  //  - "messages" streams LLM tokens; we forward only the `respond` node's.
  const stream = await journalGraph.stream(
    { input: content, categorize: Boolean(categorize), language, user, messages: history },
    { streamMode: ["updates", "messages"] },
  );

  for await (const [mode, payload] of stream) {
    if (mode === "updates") {
      const update = payload as Record<string, { category?: WebSocketMessage["category"] }>;
      if (update.classify && "category" in update.classify) {
        category = update.classify.category ?? undefined;
      }
      continue;
    }

    // mode === "messages": payload is [messageChunk, metadata]
    const [chunk, metadata] = payload as [
      { content: unknown },
      { langgraph_node?: string },
    ];
    if (metadata?.langgraph_node !== "respond") continue;

    const text = typeof chunk.content === "string" ? chunk.content : "";
    if (!text) continue;

    assistantText += text;
    ws.send(
      JSON.stringify({
        type: "message",
        id,
        content: text,
        role: "assistant",
        done: false,
        category,
      } as WebSocketMessage),
    );
  }

  // Close out the streamed message.
  ws.send(
    JSON.stringify({
      type: "message",
      id,
      content: "",
      role: "assistant",
      done: true,
      category,
    } as WebSocketMessage),
  );

  // Persist the turn into this connection's history for follow-up context.
  history.push(new HumanMessage(content), new AIMessage(assistantText));
  historyBySocket.set(ws, history);
};
