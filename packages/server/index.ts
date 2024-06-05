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
			console.log(`Received ${message}`);
			// send back a message
			ws.send(`You said: ${message}`);

			try {
				const messageObject = JSON.parse(message as string);

				if (messageObject.type === "init") {
					// await ollama.delete({
					// 	model: "gemma2"
					// })
					return;
					// check if ollama is running and has gemma2 installed
					const list = await ollama.list();

					if (list.models.find(model => model.name === "gemma2") === undefined) {
						console.log("Installing gemma2...");
						const puller = await ollama.pull({
							model: "gemma2",
							stream: true
						});

						ws.send("Installing gemma2...");

						for await (const progress of puller) {
							console.log(progress);
							ws.send(JSON.stringify({
								type: "pull-progress",
								data: progress
							}));
						}
					}
				}
			} catch (e) {
				console.error(`Failed to parse message: ${message}`);
			}
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);

export type { Message };