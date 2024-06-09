import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Remark } from "react-remark";
import { WebSocketMessage } from "@ai-jrnl/server/types";
import { adaptativeHumanByteReader } from "./utils/functions";

const ucFirst = (str: string) => str[0].toUpperCase() + str.slice(1);

function App() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [pullingStatus, setPullingStatus] = useState<string>(
    "Establishing connection..."
  );
  const [pageStatus, setPageStatus] = useState<"chat" | "pulling" | "idle">(
    "idle"
  );
  const [pullProgress, setPullProgress] = useState<number | null>(null);
  const [modelSize, setModelSize] = useState<number | null>(null);
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("message", (event) => {
      const wsMessage = JSON.parse(event.data) as WebSocketMessage;

      switch (wsMessage.type) {
        case "message":
          setMessages((prevMessages) => {
            if (
              wsMessage.id &&
              prevMessages.find((msg) => msg.id === wsMessage.id)
            ) {
              return prevMessages.map((msg) =>
                msg.id === wsMessage.id
                  ? { ...msg, content: (msg.content || "") + (wsMessage.content || "") }
                  : msg
              );
            }

            return [...prevMessages, wsMessage];
          });
          break;
        case "pull-progress":
          setPageStatus("pulling");
          console.log(wsMessage.content);
          setPullingStatus(wsMessage.content.status);
          setModelSize(wsMessage.content.total);
          setPullProgress(wsMessage.content.completed);

          if (wsMessage.content.status === "success") {
            setPageStatus("chat");
            setModelSize(null);
          }
          break;
        case "init":
          setPageStatus("chat");
          break;
      }
    });

    socket.addEventListener("open", () => {
      socket.send('{"type":"init"}');
    });

    conn.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    conn.current?.send(`{"type":"message","content":"${message}"}`);
  };

  if (pageStatus === "idle") {
    return (
      <div>
        <h1>AI Journal</h1>
        <p>Establishing connection...</p>
      </div>
    );
  }

  if (pageStatus === "pulling") {
    return (
      <div>
        <h1>AI Journal</h1>
        <h2>Installing gemma2...</h2>
        <div>
          {pullProgress !== null &&
            modelSize !== null &&
            pullingStatus.includes("pulling") && (
              <div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(pullProgress / modelSize) * 100}%`,
                    }}
                  />
                </div>
                {adaptativeHumanByteReader(pullProgress)} /{" "}
                {adaptativeHumanByteReader(modelSize)}
              </div>
            )}
          {pullingStatus !== "pulling" && ucFirst(pullingStatus)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>AI Journal</h1>
      </div>
      <div className="chat">
        {messages.map((message, i) => (
          <div className="message-wrapper" key={i}>
            <div className="avatar">
              <div className={`role ${message.role || "assistant"}`}>{message.role || "assistant"}</div>
            </div>
            <div className="message">
            <Remark>{message.content || ""}</Remark>
          </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
