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
import { Progress } from "@/components/ui/progress";
import { SendIcon, Loader2 } from "lucide-react";
import { WebSocketMessage } from "private/utils/types";
import { adaptativeHumanByteReader, cn } from "@/lib/utils";
import { Remark } from "react-remark";
import { API_HOST } from "@/lib/consts";
import { useTranslation } from "react-i18next";

export function ChatbotContent() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pullingStatus, setPullingStatus] = useState<string>(
    t("establishingConnection")
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
            const newMessages =
              wsMessage.id &&
              prevMessages.find((msg) => msg.id === wsMessage.id)
                ? prevMessages.map((msg) =>
                    msg.id === wsMessage.id
                      ? {
                          ...msg,
                          content:
                            (msg.content || "") + (wsMessage.content || ""),
                        }
                      : msg
                  )
                : [...prevMessages, wsMessage];

            setTimeout(() => {
              if (messagesContentRef.current) {
                messagesContentRef.current.scrollTop =
                  messagesContentRef.current.scrollHeight;
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
            setTimeout(() => {
              const offsetTop = messagesContentRef.current?.offsetTop;

              messagesContentRef.current?.style.setProperty(
                "height",
                `calc(100vh - ${offsetTop}px - 60px - 25px)`
              );
            });
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
        language: i18n.language,
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
      <Card className="w-full h-full">
        <CardContent>
          <div className="space-y-4">
            {pageStatus === "docker-not-running" && (
              <p>{t("dockerNotRunning")}</p>
            )}
            {pageStatus === "idle" && (
              <div
                className="flex items-center justify-center"
                style={{
                  height: "calc(100vh - 60px - 40px)",
                }}
              >
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
            {pageStatus === "pulling" && (
              <div
                className="flex flex-col items-center justify-center gap-8"
                style={{
                  height: "calc(100vh - 60px - 40px)",
                }}
              >
                <h2>{t("installingAIModel")}</h2>
                {pullProgress !== null &&
                  modelSize !== null &&
                  pullingStatus.includes("pulling") && (
                    <div className="w-full max-w-xs">
                      <Progress
                        value={(pullProgress / modelSize) * 100}
                        className="mb-2"
                      />
                      <div className="text-sm text-center">
                        {adaptativeHumanByteReader(pullProgress)} /{" "}
                        {adaptativeHumanByteReader(modelSize)}
                      </div>
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
              {t("assistantDescription")}
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
          <span className="text-sm">{t("categorizeEntries")}</span>
        </label>
      </CardHeader>
      <CardContent ref={messagesContentRef} className="messages">
        <div className="space-y-4 flex flex-col items-start">
          {messages.map((message, i) => (
              <div
                key={i}
                className={`flex flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground self-end"
                    : "bg-muted"
                }`}
              >
                {message.category && (
                  <div
                    className={`category ${message.category.replace(
                      /\s/g,
                      "-"
                    )}`}
                  >
                    {t(message.category)}
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
            placeholder={t("typeYourMessage")}
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !message.trim()}
          >
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
