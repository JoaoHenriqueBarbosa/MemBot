import { API_HOST, API_PROTOCOL } from "../lib/consts";

export const handleLogin = async (username: string, password: string, setAuth: (token: string, user: { id: number, username: string }) => void) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setAuth(data.token, data.user);
      return true;
    } else {
      console.error('Login failed');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const handleRegister = async (username: string, password: string, setAuth: (token: string, user: { id: number, username: string }) => void) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setAuth(data.token, data.user);
      return true;
    } else {
      console.error('Registration failed');
      return false;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

export const handleLogout = (setAuth: (token: string | null, user: null) => void) => {
  setAuth(null, null);
};
