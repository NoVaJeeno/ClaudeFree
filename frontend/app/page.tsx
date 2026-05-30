"use client";

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [agentStatus, setAgentStatus] = useState('Autonomes System bereit');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chat_message', (msg: string) => {
      setMessages((prev) => [...prev, { sender: 'System', text: msg }]);
    });
    socket.on('agent_result', (res: any) => {
      setMessages((prev) => [...prev, { sender: 'Agent', text: res.output || res.error || 'Fertig' }]);
    });
    return () => { socket.off('chat_message'); socket.off('agent_result'); };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('chat_message', input);
    socket.emit('agent_task', { cmd: input });
    setMessages((prev) => [...prev, { sender: 'Du', text: input }]);
    setInput('');
  };

  return (
    <main className="flex h-screen bg-neutral-950 text-white p-4">
      <aside className="w-64 border-r border-neutral-800 p-4 space-y-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ClaudeFree UI v1.0
        </h1>
        <div className="p-3 bg-neutral-900 rounded-lg text-sm text-neutral-400">
          Status: {agentStatus}
        </div>
      </aside>
      
      <section className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-xl max-w-lg ${m.sender === 'Du' ? 'bg-blue-600 ml-auto' : 'bg-neutral-800'}`}>
              <span className="text-xs font-bold opacity-50">{m.sender}</span>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input 
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Agenten-Befehl oder Chat..."
          />
          <button onClick={sendMessage} className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-500">
            Senden
          </button>
        </div>
      </section>
    </main>
  );
}
