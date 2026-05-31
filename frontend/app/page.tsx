'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(JSON.stringify(data)))
      .catch(err => setStatus('Error'));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>AetherOS Interface</h1>
      <div>Status: {status}</div>
      {/* Hier wird ein Menü benötigt */}
    </main>
  );
}