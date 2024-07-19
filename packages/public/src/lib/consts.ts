export const API_HOST = import.meta.env.VITE_API_URL || '';
export const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
export const WS_PROTOCOL = import.meta.env.VITE_API_PROTOCOL.replace('http', 'ws') || 'ws';