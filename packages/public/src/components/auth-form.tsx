import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { handleLogin, handleRegister } from "@/utils/auth";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "./language-switcher";
import { AlertCircleIcon, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setAuth } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    setIsSuccess(false);

    try {
      if (isLogin) {
        const result = await handleLogin(username, password, setAuth);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setMessage(result.message);
        }
      } else {
        const result = await handleRegister(username, email, password);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setMessage(result.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6">
        <div className="text-2xl font-bold mb-4 flex items-center justify-between">
          <h2>{isLogin ? t("login") : t("register")}</h2>
          <LanguageSwitcher />
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder={t("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
            disabled={isLoading}
          />
          {!isLogin && (
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              disabled={isLoading}
            />
          )}
          <Input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full mb-4" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isLogin ? (
              t("login")
            ) : (
              t("register")
            )}
          </Button>
        </form>
        {message && !isSuccess && (
          <Alert className="mb-4 space-x-2 border-red-800">
            <AlertCircleIcon className="h-6 w-6 stroke-red-800" />
            <AlertTitle className="text-red-800">{t("error")}</AlertTitle>
            <AlertDescription className="text-red-800">{t(message)}</AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert className="mb-4 space-x-2">
            <Check className="h-6 w-6" />
            <AlertTitle>{t("registrationSuccess")}</AlertTitle>
            <AlertDescription>
              {t("checkEmailForVerification")}
            </AlertDescription>
          </Alert>
        )}
        <Button
          variant="link"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
            setIsSuccess(false);
          }}
          className="w-full"
          disabled={isLoading}
        >
          {isLogin ? t("needAccount") : t("alreadyHaveAccount")}
        </Button>
      </Card>
    </div>
  );
};
