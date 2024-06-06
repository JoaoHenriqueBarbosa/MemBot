import ollama from "ollama";
import { Message } from "./types.js";

const server = Bun.serve<{ authToken: string }>({
	async fetch(req, server) {
		if (server.upgrade(req)) {
			return;
		}
		return new Response("Upgrade failed", { status: 500 });
	},
	websocket: {
		async message(ws, message) {
			try {
				const messageObject = JSON.parse(message as string);
				console.log(`Received message: ${message}`);

				if (messageObject.type === "init") {
					const list = await ollama.list();

					if (list.models.find(model => model.name === "gemma2:latest") === undefined) {
						console.log("Installing gemma2...");
						const puller = await ollama.pull({
							model: "gemma2",
							stream: true
						});

						for await (const progress of puller) {
							ws.send(JSON.stringify({
								type: "pull-progress",
								data: progress
							}));
						}
					} else {
						ws.send('{ "type": "init" }');
					}
				} else if (messageObject.type === "message") {
					ws.send(JSON.stringify({ type: "message", data: messageObject.data, role: "user" }));

					const response = await ollama.chat({
						model: "gemma2",
						messages: [{
							role: "user",
							content: messageObject.data
						}],
						stream: true
					});

					const id = Math.random().toString(36).substring(7);

					for await (const message of response) {
						ws.send(JSON.stringify({ type: "message", id, data: message.message.content, role: "robot", done: message.done }));
					}
				}
			} catch (e) {
				console.log(e);
				console.error(`Failed to parse message: ${message}`);
			}
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);

export type { Message };