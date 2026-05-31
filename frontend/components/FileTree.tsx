'use client';
import { useState, useEffect } from 'react';

export default function FileTree() {
  const [files, setFiles] = useState<string[]>([]);

  // Holt die Dateistruktur vom Backend
  useEffect(() => {
    fetch('http://localhost:3001/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: 'ls -R' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.output) setFiles(data.output.split('\n'));
    });
  }, []);

  return (
    <div style={{ background: '#1c1c1c', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', color: '#aaa' }}>
      <h4 style={{ color: '#00ffcc', marginBottom: '10px' }}>Project Explorer</h4>
      <pre style={{ overflowX: 'auto' }}>
        {files.map((file, i) => <div key={i}>{file}</div>)}
      </pre>
    </div>
  );
}