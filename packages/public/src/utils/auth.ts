import { API_HOST, API_PROTOCOL } from "../lib/consts";

export const handleLogin = async (username: string, password: string, setToken: (token: string) => void) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
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

export const handleRegister = async (username: string, password: string, setToken: (token: string) => void) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
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

export const handleLogout = (setToken: (token: string | null) => void) => {
  setToken(null);
  localStorage.removeItem('token');
};
