import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('chat_message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const send = () => {
    socket.emit('chat_message', input);
    setInput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ClaudeFree Kommandozentrale</h1>
      <div style={{ height: '400px', border: '1px solid #ccc', overflowY: 'auto' }}>
        {messages.map((m, i) => <p key={i}>{m}</p>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Senden</button>
    </div>
  );
}
