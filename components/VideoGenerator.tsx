'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Play, 
  Download, 
  Clock, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface VideoOperation {
  operationName: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed';
  videoUrls?: string[];
  startTime: Date;
  settings: {
    duration: number;
    aspectRatio: string;
    sampleCount: number;
    generateAudio: boolean;
  };
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(8);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [sampleCount, setSampleCount] = useState(1);
  const [generateAudio, setGenerateAudio] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [operations, setOperations] = useState<VideoOperation[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration,
          sampleCount,
          aspectRatio,
          personGeneration: 'allow_all',
          addWatermark: true,
          includeRaiReason: true,
          generateAudio
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }

      const data = await response.json();
      
      const newOperation: VideoOperation = {
        operationName: data.operationName,
        prompt: prompt.trim(),
        status: 'generating',
        startTime: new Date(),
        settings: {
          duration,
          aspectRatio,
          sampleCount,
          generateAudio
        }
      };

      setOperations(prev => [newOperation, ...prev]);
      setPrompt('');
      
      // Start polling for status
      pollVideoStatus(newOperation);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoStatus = async (operation: VideoOperation) => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/check-video-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: operation.operationName
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const statusData = await response.json();
        
        if (statusData.done) {
          const videoUrls = statusData.response?.videos?.map((video: any) => video.gcsUri) || [];
          setOperations(prev => 
            prev.map(op => 
              op.operationName === operation.operationName
                ? {
                    ...op,
                    status: videoUrls.length > 0 ? 'completed' : 'failed',
                    videoUrls: videoUrls
                  }
                : op
            )
          );
        } else {
          // Continue polling if not done
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        console.error('Status check error:', error);
        setOperations(prev => 
          prev.map(op => 
            op.operationName === operation.operationName
              ? { ...op, status: 'failed' }
              : op
          )
        );
      }
    };

    checkStatus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: VideoOperation['status']) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: VideoOperation['status']) => {
    switch (status) {
      case 'generating':
        return 'border-yellow-400 text-yellow-400';
      case 'completed':
        return 'border-green-400 text-green-400';
      case 'failed':
        return 'border-red-400 text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Generation Form */}
      <Card className="neon-border bg-black/60 backdrop-blur-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Video className="h-6 w-6 text-cyan-400 neon-glow" />
          <h2 className="text-xl font-orbitron font-bold text-cyan-400 neon-glow">
            VEO 3.0 VIDEO SYNTHESIS
          </h2>
          <Badge variant="outline" className="border-purple-400 text-purple-400 neon-border ml-2">
            PREVIEW
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              VIDEO PROMPT
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              disabled={isGenerating}
              className="terminal-input font-fira-code text-cyan-400 placeholder:text-cyan-400/50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                DURATION
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isGenerating}
                className="terminal-input font-fira-code text-cyan-400 bg-black/80 border border-cyan-400 rounded px-3 py-2 w-full"
              >
                <option value={5}>5 seconds</option>
                <option value={6}>6 seconds</option>
                <option value={7}>7 seconds</option>
                <option value={8}>8 seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                ASPECT RATIO
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                disabled={isGenerating}
                className="terminal-input font-fira-code text-cyan-400 bg-black/80 border border-cyan-400 rounded px-3 py-2 w-full"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                SAMPLES
              </label>
              <select
                value={sampleCount}
                onChange={(e) => setSampleCount(Number(e.target.value))}
                disabled={isGenerating}
                className="terminal-input font-fira-code text-cyan-400 bg-black/80 border border-cyan-400 rounded px-3 py-2 w-full"
              >
                <option value={1}>1 video</option>
                <option value={2}>2 videos</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                variant="outline"
                size="sm"
                className="cyber-button border-purple-400 text-purple-400 hover:bg-purple-400/10 w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                ADVANCED
              </Button>
            </div>
          </div>

          {showAdvanced && (
            <div className="p-4 border border-purple-400/30 rounded-lg bg-purple-500/5">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generateAudio"
                    checked={generateAudio}
                    onChange={(e) => setGenerateAudio(e.target.checked)}
                    disabled={isGenerating}
                    className="w-4 h-4 text-cyan-400 bg-black border-cyan-400 rounded focus:ring-cyan-400"
                  />
                  <label htmlFor="generateAudio" className="text-sm font-mono text-cyan-400 flex items-center">
                    {generateAudio ? <Volume2 className="h-4 w-4 mr-1" /> : <VolumeX className="h-4 w-4 mr-1" />}
                    GENERATE AUDIO
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="cyber-button h-12 px-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  SYNTHESIZING
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  GENERATE VIDEO
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Operations List */}
      {operations.length > 0 && (
        <Card className="neon-border bg-black/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-orbitron font-bold text-cyan-400 neon-glow mb-4">
            SYNTHESIS OPERATIONS
          </h3>
          
          <div className="space-y-4">
            {operations.map((operation, index) => (
              <div key={operation.operationName} className="message-enter">
                <div className="flex items-start space-x-4 p-4 rounded-lg border border-cyan-400/30 bg-cyan-500/5">
                  <div className="flex-shrink-0">
                    {getStatusIcon(operation.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={`neon-border ${getStatusColor(operation.status)}`}>
                        {operation.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTime(operation.startTime)}
                      </span>
                      <Separator orientation="vertical" className="h-3" />
                      <span className="text-xs text-gray-400">
                        {operation.settings.duration}s • {operation.settings.aspectRatio} • {operation.settings.sampleCount} sample{operation.settings.sampleCount > 1 ? 's' : ''}
                      </span>
                      {operation.settings.generateAudio && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <Volume2 className="h-3 w-3 text-green-400" />
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm font-fira-code text-cyan-100 mb-2">
                      {operation.prompt}
                    </p>
                    
                    {operation.status === 'completed' && operation.videoUrls && operation.videoUrls.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {operation.videoUrls.map((url, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="cyber-button border-green-400 text-green-400 hover:bg-green-400/10"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            VIDEO {idx + 1}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {operation.status === 'generating' && (
                      <div className="flex items-center space-x-2 text-xs text-yellow-400">
                        <Clock className="h-3 w-3" />
                        <span>Neural synthesis in progress...</span>
                      </div>
                    )}

                    {operation.status === 'failed' && (
                      <div className="flex items-center space-x-2 text-xs text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        <span>Synthesis failed - check parameters and try again</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}