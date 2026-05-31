'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function ChatWindow() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('output', (data: any) => {
      const response = data.stdout || data.stderr || data.error;
      setMessages(prev => [...prev, { role: 'system', content: response }]);
    });
  }, []);

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }]);
    
    // Befehl senden
    socket.emit('execute-command', { command: input });
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', width: '300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => <p key={i}><strong>{m.role}:</strong> {m.content}</p>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
      <button onClick={sendMessage}>Senden</button>
    </div>
  );
}