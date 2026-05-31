'use client';
import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <main style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar Menü */}
      <nav style={{ width: '200px', background: '#f4f4f4', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <h2>AetherOS</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('Dashboard')}>Dashboard</li>
          <li style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('Agents')}>Agents</li>
          <li style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('Settings')}>Settings</li>
        </ul>
      </nav>

      {/* Hauptinhalt */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>{activeTab}</h1>
        <p>Willkommen in deiner AetherOS Entwicklungsumgebung.</p>
      </div>

      {/* Chat Sidebar */}
      <div style={{ width: '320px', padding: '1rem', borderLeft: '1px solid #ccc' }}>
        <h3>Claude Developer</h3>
        <ChatWindow />
      </div>
    </main>
  );
}