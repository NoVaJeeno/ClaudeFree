import './globals.css';

export const metadata = {
  title: 'ClaudeFree — Quantum Workspace',
  description: 'Sicherer Agenten-Workspace mit Chat, Memory, Tools und Connector Registry.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
