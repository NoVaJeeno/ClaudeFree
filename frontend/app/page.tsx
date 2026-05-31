'use client';
import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Workspace');

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex' }}>
      {/* Sidebar - Pro Layout */}
      <aside style={{ width: '260px', background: '#111', borderRight: '1px solid #333', padding: '20px' }}>
        <h1 style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#00ffcc' }}>AetherOS Enterprise</h1>
        <nav>
          {['Workspace', 'Deployment', 'System', 'Agents', 'Settings'].map(tab => (
            <div key={tab} 
                 style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', 
                          background: activeTab === tab ? '#222' : 'transparent', border: activeTab === tab ? '1px solid #444' : 'none' }}
                 onClick={() => setActiveTab(tab)}>
              {tab}
            </div>
          ))}
        </nav>
      </aside>

      {/* Haupt-Dashboard */}
      <section style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{activeTab}</h2>
          <div style={{ background: '#00ffcc', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>SYSTEM LIVE</div>
        </header>
        
        <div style={{ background: '#161616', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
          {activeTab === 'Workspace' && <p>Hier werden deine Agenten in Echtzeit kompiliert.</p>}
          {/* Hier kommt später die dynamische UI-Logik rein */}
        </div>
      </section>

      {/* AI Terminal */}
      <aside style={{ width: '400px', background: '#111', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}><h3>AI Developer Terminal</h3></div>
        <div style={{ flex: 1, overflowY: 'auto' }}><ChatWindow /></div>
      </aside>
    </main>
  );
}