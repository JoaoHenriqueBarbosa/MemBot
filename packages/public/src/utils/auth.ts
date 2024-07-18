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

export const handleRegister = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'registrationError' };
  }
};

export const handleVerifyEmail = async (token: string) => {
  try {
    const response = await fetch(`${API_PROTOCOL}://${API_HOST}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    console.error('emailVerificationError', error);
    return { success: false, message: 'emailVerificationError' };
  }
};

export const handleLogout = (setAuth: (token: string | null, user: null) => void) => {
  setAuth(null, null);
};
