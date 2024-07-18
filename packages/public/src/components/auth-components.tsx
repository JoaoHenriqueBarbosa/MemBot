import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface AuthProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
}

export const AuthComponents: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? t('login') : t('register')}</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={t('username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button type="submit" className="w-full mb-4">
          {isLogin ? t('login') : t('register')}
        </Button>
      </form>
      <Button
        variant="link"
        onClick={() => setIsLogin(!isLogin)}
        className="w-full"
      >
        {isLogin ? t('needAccount') : t('alreadyHaveAccount')}
      </Button>
    </Card>
  );
};
