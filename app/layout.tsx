import './globals.css';
import type { Metadata } from 'next';
import { Orbitron, Fira_Code } from 'next/font/google';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
});

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code'
});

export const metadata: Metadata = {
  title: 'CyberMind AI - Cyberpunk Chat Interface',
  description: 'Advanced AI-powered cyberpunk chat interface with Google Gemini integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${firaCode.variable}`}>
      <body className="font-orbitron">
        <div className="matrix-bg"></div>
        <div className="cyber-grid"></div>
        {children}
      </body>
    </html>
  );
}