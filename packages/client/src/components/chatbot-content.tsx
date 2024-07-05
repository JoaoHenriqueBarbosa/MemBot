import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon, Loader2 } from "lucide-react";
import { WebSocketMessage } from "@ai-jrnl/server/utils/types";
import { adaptativeHumanByteReader } from "@/lib/utils";
import { Remark } from "react-remark";
import { API_HOST } from "@/lib/consts";

export function ChatbotContent() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([
    {
        "type": "message",
        "id": "2",
        "role": "user",
        "content": "Hello, can you help me with my project?"
    },
    {
        "type": "message",
        "id": "3",
        "role": "assistant",
        "content": "Sure, what do you need help with?"
    },
    {
        "type": "message",
        "id": "4",
        "role": "user",
        "content": "I need some advice on using TypeScript with Node.js."
    },
    {
        "type": "message",
        "id": "5",
        "role": "assistant",
        "content": "TypeScript is great for adding type safety to your Node.js projects. Do you have any specific questions?"
    },
    {
        "type": "message",
        "id": "8",
        "role": "user",
        "content": "Sure, here is a snippet from my tsconfig.json."
    },
    {
        "type": "message",
        "id": "10",
        "role": "assistant",
        "content": "Thanks for sharing. I recommend using ts-node for seamless execution of TypeScript files."
    },
    {
        "type": "message",
        "id": "11",
        "role": "user",
        "content": "That's a good idea. I'll try it out."
    },
    {
        "type": "message",
        "id": "13",
        "role": "user",
        "content": "It worked! Thanks for your help."
    },
    {
        "type": "message",
        "id": "14",
        "role": "assistant",
        "content": "You're welcome! Let me know if you need anything else."
    }
]
);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pullingStatus, setPullingStatus] = useState<string>(
    "Establishing connection..."
  );
  const [pageStatus, setPageStatus] = useState<
    "chat" | "pulling" | "idle" | "docker-not-running"
  >("idle");
  const [pullProgress, setPullProgress] = useState<number | null>(null);
  const [modelSize, setModelSize] = useState<number | null>(null);
  const [categorize, setCategorize] = useState<boolean>(false);
  const messagesContentRef = useRef<HTMLDivElement | null>(null);
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${API_HOST}`);

    socket.addEventListener("message", (event) => {
      if (event.data === "docker-not-running") {
        setPageStatus("docker-not-running");
        return;
      }
      const wsMessage = JSON.parse(event.data) as WebSocketMessage;

      switch (wsMessage.type) {
        case "message":
          setMessages((prevMessages) => {
            const newMessages = wsMessage.id && prevMessages.find((msg) => msg.id === wsMessage.id)
              ? prevMessages.map((msg) =>
                  msg.id === wsMessage.id
                    ? {
                        ...msg,
                        content: (msg.content || "") + (wsMessage.content || ""),
                      }
                    : msg
                )
              : [...prevMessages, wsMessage];
            
            setTimeout(() => {
              if (messagesContentRef.current) {
                messagesContentRef.current.scrollTop = messagesContentRef.current.scrollHeight;
              }
            }, 0);

            return newMessages;
          });
          if (wsMessage.done) {
            setIsLoading(false);
          }
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
          setTimeout(() => {
            const offsetTop = messagesContentRef.current?.offsetTop;

            messagesContentRef.current?.style.setProperty(
              "height",
              `calc(100vh - ${offsetTop}px - 60px - 25px)`
            );
          });
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
    conn.current?.send(
      JSON.stringify({
        type: "message",
        content: message,
        categorize: categorize,
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      sendMessage(message);
      setMessage("");
    }
  };

  if (pageStatus !== "chat") {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="space-y-4">
            {pageStatus === "docker-not-running" && (
              <p>
                Docker is not running. Please start Ollama Docker and refresh
                the page.
              </p>
            )}
            {pageStatus === "idle" && <p>Establishing connection...</p>}
            {pageStatus === "pulling" && (
              <div>
                <h2>Installing gemma2...</h2>
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
                {pullingStatus !== "pulling" && pullingStatus}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full chatbot">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">AI Journal</p>
            <p className="text-sm text-muted-foreground">
              Your personal assistant
            </p>
          </div>
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={categorize}
            onChange={(e) => setCategorize(e.target.checked)}
            className="form-checkbox h-4 w-4 text-primary"
          />
          <span className="text-sm">Categorize entries</span>
        </label>
      </CardHeader>
      <CardContent ref={messagesContentRef} className="messages">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.category && (
                <div
                  className={`category ${message.category.replace(/\s/g, "-")}`}
                >
                  {message.category}
                </div>
              )}
              <div className="remark-content">
                <Remark>{message.content}</Remark>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full space-x-2"
        >
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={"Type your message..."}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
