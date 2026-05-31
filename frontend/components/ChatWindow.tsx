'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Holt die URL aus Umgebungsvariablen für produktive Deployments
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

export default function ChatWindow() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('output', (data: any) => {
      const response = data.stdout || data.stderr || data.error;
      setMessages(prev => [...prev, { role: 'system', content: response }]);
    });
    
    return () => {
      socket.off('output');
    };
  }, []);

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { role: 'user', content: input }]);
    
    // Befehl senden
    socket.emit('execute-command', { command: input });
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', width: '100%', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #444' }}>
        {messages.map((m, i) => <p key={i}><strong>{m.role}:</strong> {m.content}</p>)}
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <input 
          style={{ flex: 1, color: '#000' }}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
          placeholder="Command..."
        />
        <button onClick={sendMessage}>Senden</button>
      </div>
    </div>
  );
}