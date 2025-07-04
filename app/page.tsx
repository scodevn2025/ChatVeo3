'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoGenerator from '@/components/VideoGenerator';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  Terminal, 
  Cpu, 
  Activity,
  Trash2,
  Settings,
  MessageSquare,
  Video,
  Brain
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function CyberMindChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'SYSTEM INITIALIZED. CYBERMIND AI ONLINE. Neural pathways activated with enhanced thinking capabilities. How can I assist you in the digital realm?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) {
      console.log('Input empty or loading:', { trimmedInput, isLoading });
      return;
    }

    console.log('Submitting message:', trimmedInput);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Making API request...');
      
      // Use conditional routing like VideoGenerator component
      const apiUrl = window.location.hostname === 'localhost' 
        ? '/api/chat' 
        : '/.netlify/functions/chat';
      
      const requestBody = {
        message: trimmedInput,
        history: messages
      };
      
      console.log('Request URL:', apiUrl);
      console.log('Request body:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content || 'ERROR: No response received from CYBERMIND.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error details:', error);
      
      let errorMessage = 'CONNECTION TO CYBERMIND FAILED.';
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('401')) {
          errorMessage = 'NEURAL LINK AUTHENTICATION FAILED. API KEY REQUIRED.';
        } else if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('429')) {
          errorMessage = 'CYBERMIND PROCESSING CAPACITY EXCEEDED. TRY AGAIN LATER.';
        } else if (error.message.includes('model') || error.message.includes('400')) {
          errorMessage = 'NEURAL MODEL UNAVAILABLE. SYSTEM RECALIBRATION REQUIRED.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'NETWORK CONNECTION FAILED. CHECK YOUR CONNECTION.';
        } else {
          errorMessage = `SYSTEM MALFUNCTION: ${error.message}`;
        }
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: `ERROR: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    console.log('Clearing chat...');
    setMessages([{
      id: '1',
      content: 'SYSTEM REINITIALIZED. MEMORY BANKS CLEARED. CYBERMIND AI READY WITH ENHANCED NEURAL PROCESSING.',
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Test button click handler
  const handleTestClick = () => {
    console.log('Test button clicked!');
    alert('Button click is working!');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Terminal className="h-8 w-8 text-cyan-400 neon-glow" />
                <h1 className="text-2xl font-orbitron font-bold text-cyan-400 neon-glow glitch" data-text="CYBERMIND AI">
                  CYBERMIND AI
                </h1>
              </div>
              <Badge variant="outline" className="border-green-400 text-green-400 neon-border">
                <Activity className="h-3 w-3 mr-1" />
                ONLINE
              </Badge>
              <Badge variant="outline" className="border-purple-400 text-purple-400 neon-border">
                <Brain className="h-3 w-3 mr-1" />
                MARKDOWN READY
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestClick}
                className="cyber-button border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
              >
                TEST CLICK
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="cyber-button border-red-400 text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                CLEAR
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cyber-button"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/60 border border-cyan-400/30">
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400/70 font-orbitron"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              NEURAL CHAT
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400/70 font-orbitron"
            >
              <Video className="h-4 w-4 mr-2" />
              VEO SYNTHESIS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-[600px]">
            <Card className="h-full neon-border bg-black/60 backdrop-blur-sm">
              <ScrollArea ref={scrollAreaRef} className="h-full p-6 custom-scrollbar">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-4 message-enter ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-purple-500/20 border border-purple-400/30' 
                          : 'bg-cyan-500/20 border border-cyan-400/30'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-purple-400" />
                        ) : (
                          <Bot className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-sm font-mono ${
                            message.role === 'user' ? 'text-purple-400' : 'text-cyan-400'
                          }`}>
                            {message.role === 'user' ? 'USER' : 'CYBERMIND'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div className={`p-4 rounded-lg border ${
                          message.role === 'user'
                            ? 'bg-purple-500/10 border-purple-400/30 text-purple-100'
                            : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-100'
                        } text-sm leading-relaxed`}>
                          {message.role === 'assistant' ? (
                            <MarkdownRenderer 
                              content={message.content}
                              className="font-fira-code"
                            />
                          ) : (
                            <div className="font-fira-code">
                              {message.content}
                            </div>
                          )}
                          {isLoading && index === messages.length - 1 && message.role === 'user' && (
                            <div className="mt-2 text-cyan-400">
                              <Activity className="h-4 w-4 animate-spin inline mr-2" />
                              Processing neural pathways with enhanced thinking...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="h-[600px]">
            <VideoGenerator />
          </TabsContent>
        </Tabs>
      </div>

      {/* Input Area - Only show for chat tab */}
      {activeTab === 'chat' && (
        <div className="border-t border-cyan-500/30 bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your query into the enhanced neural network..."
                  disabled={isLoading}
                  className="terminal-input pr-12 h-12 font-fira-code text-cyan-400 placeholder:text-cyan-400/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute right-3 top-3">
                  <Cpu className="h-5 w-5 text-cyan-400/50" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                onClick={(e) => {
                  console.log('Button clicked!', { isLoading, inputValue: input.trim() });
                  handleSubmit(e);
                }}
                className="cyber-button h-12 px-6 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    PROCESSING
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    TRANSMIT
                  </>
                )}
              </Button>
            </form>
            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Powered by Gemini 2.5 Pro with Markdown Support</span>
                </span>
                <Separator orientation="vertical" className="h-3" />
                <span className="pulse-neon">Enhanced Neural Link Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}