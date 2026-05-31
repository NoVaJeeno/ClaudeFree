'use client';
import { useState } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    
    // Hier wird das Backend aufgerufen, sobald der Endpoint existiert
    // Für jetzt simulieren wir eine Antwort
    setMessages(prev => [...prev, { role: 'assistant', content: 'Ich arbeite an: ' + input }]);
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