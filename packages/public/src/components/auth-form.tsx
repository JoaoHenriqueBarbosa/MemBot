import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { handleLogin, handleRegister } from "@/utils/auth";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "./language-switcher";

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(username, password, setToken);
    } else {
      handleRegister(username, password, setToken);
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
          />
          <Input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full mb-4">
            {isLogin ? t("login") : t("register")}
          </Button>
        </form>
        <Button
          variant="link"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full"
        >
          {isLogin ? t("needAccount") : t("alreadyHaveAccount")}
        </Button>
      </Card>
    </div>
  );
};
