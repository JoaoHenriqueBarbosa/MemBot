
import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Message } from '@ai-jrnl/server';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as Message;

      const actions: Record<Message['type'], () => void> = {
        'message': () => {
          setMessages(prevMessages => [...prevMessages, message.data]);
        },
        'pull-progress': () => {
          console.log(message.data);
        },
        'init': () => {
          console.log('Initialized');
        }
      }

      actions[message.type]();
    });

    socket.addEventListener("open", () => {
      socket.send('{"type":"init"}');
    });

    conn.current = socket;

    return () => {
      socket.close();
    }
  }, []);

  const sendMessage = (message: string) => {
    conn.current?.send(message);
  }

  return (
    <>
      <h1>AI Journal</h1>
      <div>
        <div className='chat'>
          {messages.map((message, i) => (
            <div className='message' key={i}>{message}</div>
          ))}
        </div>
        <div className='chat-input'>
          <textarea placeholder='Type a message...' value={message} onChange={e => setMessage(e.target.value)}></textarea>
          <button
            onClick={() => {
              sendMessage(message);
              setMessage('');
            }}
          >Send</button>
        </div>
      </div>
    </>
  )
}

export default App
