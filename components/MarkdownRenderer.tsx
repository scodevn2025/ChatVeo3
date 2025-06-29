'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-cyan-300 mb-4 neon-glow border-b border-cyan-500/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-cyan-300 mb-3 neon-glow">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-cyan-300 mb-2 neon-glow">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-cyan-300 mb-2">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-bold text-cyan-300 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-bold text-cyan-300 mb-2">
              {children}
            </h6>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-cyan-100">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-cyan-100 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-cyan-100 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-cyan-100">
              {children}
            </li>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors neon-glow"
            >
              {children}
            </a>
          ),
          
          // Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-green-400 neon-glow">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-yellow-400">
              {children}
            </em>
          ),
          
          // Code
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              return (
                <div className="relative group mb-4">
                  <div className="flex items-center justify-between bg-gray-900/80 border border-cyan-500/30 rounded-t-lg px-4 py-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase">
                      {language}
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeString)}
                      className="flex items-center space-x-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {copiedCode === codeString ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={atomDark}
                    language={language}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none border border-t-0 border-cyan-500/30 !bg-black/60"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 0.5rem 0.5rem',
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      borderTop: 'none',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            return (
              <code
                className="bg-black/60 border border-cyan-500/30 rounded px-2 py-1 text-sm font-mono text-green-400 neon-glow"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 bg-purple-500/10 pl-4 py-2 mb-4 italic text-purple-200">
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-cyan-500/30 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-cyan-500/20">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-black/40">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-cyan-500/20">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-bold text-cyan-300 border-r border-cyan-500/20 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-cyan-100 border-r border-cyan-500/20 last:border-r-0">
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}