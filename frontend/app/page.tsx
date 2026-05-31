"use client";

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

export default function Home() {
  const [messages, setMessages] = useState<{ sender: 'Du' | 'Agent' | 'System', text: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chat_message', (msg: string) => setMessages(p => [...p, { sender: 'System', text: msg }]));
    socket.on('agent_result', (res: any) => setMessages(p => [...p, { sender: 'Agent', text: res.output }]));
    return () => { socket.off('chat_message'); socket.off('agent_result'); };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('agent_task', { cmd: input });
    setMessages(p => [...p, { sender: 'Du', text: input }]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-300 font-sans">
      {/* Sidebar - Entwickler-Tools */}
      <aside className="w-72 border-r border-neutral-800 bg-[#0d0d0d] p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-1">
            ClaudeFree v2.0
          </h1>
          <p className="text-xs text-neutral-500 font-mono">CORE_INTEGRATION.SYSTEM</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Agent Online: Active
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Security: Kernel OK
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button className="w-full py-2 text-xs rounded border border-neutral-800 hover:bg-neutral-900 transition">Integrity Check</button>
          <button className="w-full py-2 text-xs rounded border border-neutral-800 hover:bg-neutral-900 transition">System Logs</button>
        </div>
      </aside>

      {/* Main Chat */}
      <section className="flex-1 flex flex-col bg-[#0a0a0a]">
        <header className="h-16 border-b border-neutral-900 flex items-center px-8 text-sm text-neutral-500">
          Entwickler-Sitzung / Terminal_01
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.sender === 'Du' ? 'justify-end' : ''}`}>
              {m.sender !== 'Du' && <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center font-mono text-[10px]">{m.sender[0]}</div>}
              <div className={`p-4 rounded-lg text-sm max-w-[70%] font-mono ${m.sender === 'Du' ? 'bg-blue-900/20 border border-blue-900/50 text-blue-100' : 'bg-neutral-900 border border-neutral-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <footer className="p-8 pb-4">
          <div className="relative">
            <input 
              className="w-full bg-[#111] border border-neutral-800 rounded-lg p-4 pr-32 focus:outline-none focus:border-blue-500 transition font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="claude.ask(task) --exec"
            />
            <button 
              onClick={sendMessage}
              className="absolute right-2 top-2 bg-neutral-900 hover:bg-blue-600/20 border border-neutral-800 px-4 py-2 rounded text-xs font-mono transition"
            >
              RUN_TASK
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
