import ollama from "ollama";
import { Message } from "./types.js";

// {"type":"pull-progress","data":{"status":"pulling ff1d1fc78170","digest":"sha256:ff1d1fc78170d787ee1201778e2dd65ea211654ca5fb7d69b5a2e7b123a50373","total":5443143296,"completed":426517248}}
const server = Bun.serve<{ authToken: string }>({
	async fetch(req, server) {
		// upgrade the request to a WebSocket
		if (server.upgrade(req)) {
			return; // do not return a Response
		}
		return new Response("Upgrade failed", { status: 500 });
	},
	websocket: {
		// this is called when a message is received
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