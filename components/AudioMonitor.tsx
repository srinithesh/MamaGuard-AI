import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { SystemStatus, EmergencyType } from '../types';

interface AudioMonitorProps {
  status: SystemStatus;
  onDistressDetected: (type: EmergencyType, confidence: string) => void;
  onSafetyVerified: (reason: string) => void;
  isMicActive: boolean;
}

const AudioMonitor: React.FC<AudioMonitorProps> = ({ status, onDistressDetected, onSafetyVerified, isMicActive }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  
  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Gemini Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  // Tools definition
  const tools: FunctionDeclaration[] = [
    {
      name: 'trigger_emergency',
      description: 'Call this when the user screams for help, mentions severe pain, bleeding, falling, or urgent medical need.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          reason: { type: Type.STRING, description: 'The detected reason (e.g., "screaming help", "abdominal pain")' },
          severity: { type: Type.STRING, description: 'Severity level: LOW, MEDIUM, HIGH' }
        },
        required: ['reason', 'severity']
      }
    },
    {
      name: 'verify_safety',
      description: 'Call this when the user explicitly says they are safe, it was a false alarm, or is having a calm, normal conversation.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          reason: { type: Type.STRING, description: 'Why the user is considered safe' }
        },
        required: ['reason']
      }
    }
  ];

  const connectToGemini = useCallback(async () => {
    if (!process.env.API_KEY) {
      console.error("No API Key found");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Cleanup previous session if exists
    if (audioContextRef.current) {
        audioContextRef.current.close();
    }

    // Audio Setup
    const stream = await navigator.mediaDevices.getUserMedia({ audio: {
      sampleRate: 16000,
      channelCount: 1,
      echoCancellation: true
    }});
    mediaStreamRef.current = stream;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextRef.current = audioContext;
    
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;
    
    // Script Processor for raw PCM extraction
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    // Volume Meter Logic (Simple RMS)
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateVolume = () => {
        if (!isConnected) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setVolume(sum / dataArray.length);
        requestAnimationFrame(updateVolume);
    };
    // Note: Volume update loop is started after connection logic below

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        tools: [{ functionDeclarations: tools }],
        systemInstruction: `You are an emergency detection system for a pregnant woman. 
        Your ONLY job is to listen for distress signals.
        
        Triggers for 'trigger_emergency':
        - Words: "Help", "Pain", "Blood", "Water broke", "Falling", "I can't breathe", "Baby is coming".
        - Sounds: Screaming, crying, loud crashes followed by silence.
        - Tone: Panic, urgency, breathlessness.

        Triggers for 'verify_safety':
        - Words: "I'm okay", "False alarm", "Just watching TV", "Talking to my husband".
        - Tone: Calm, laughing, steady breathing.
        
        If unsure, remain silent. Do not respond verbally unless asking for clarification briefly. 
        Prioritize safety.`,
      },
      callbacks: {
        onopen: () => {
          setIsConnected(true);
          updateVolume();
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            // Convert Float32 to Int16 PCM
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
               int16[i] = inputData[i] * 32768;
            }
            
            // Manual Base64 Encode
            let binary = '';
            const bytes = new Uint8Array(int16.buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const b64 = btoa(binary);

            sessionPromise.then(session => {
                session.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: b64
                    }
                });
            });
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall) {
                for (const call of msg.toolCall.functionCalls) {
                    console.log("Tool Called:", call.name, call.args);
                    
                    if (call.name === 'trigger_emergency') {
                        const args = call.args as any;
                        onDistressDetected('Voice', args.severity || 'HIGH');
                    } else if (call.name === 'verify_safety') {
                        const args = call.args as any;
                        onSafetyVerified(args.reason || 'User verbal confirmed safety');
                    }

                    // Acknowledge tool call
                    sessionPromise.then(session => {
                        session.sendToolResponse({
                            functionResponses: {
                                name: call.name,
                                id: call.id,
                                response: { result: "ACK" }
                            }
                        });
                    });
                }
            }
        },
        onclose: () => {
            setIsConnected(false);
            console.log("Gemini Live Disconnected");
        },
        onerror: (err) => {
            console.error("Gemini Live Error", err);
            setIsConnected(false);
        }
      }
    });
    
    sessionPromiseRef.current = sessionPromise;

  }, [onDistressDetected, onSafetyVerified]);

  const disconnect = useCallback(() => {
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    // We can't explicitly "close" the session object from here easily without storing the session itself, 
    // but closing the socket via context destruction helps.
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (status === SystemStatus.MONITORING && isMicActive && !isConnected) {
        connectToGemini();
    } else if (status === SystemStatus.IDLE && isConnected) {
        disconnect();
    }
    
    // Cleanup on unmount
    return () => {
        disconnect();
    };
  }, [status, isMicActive, connectToGemini, disconnect, isConnected]);

  if (status === SystemStatus.IDLE) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg flex items-center gap-3 border border-pink-200 z-50">
       <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
       <div className="text-xs font-semibold text-pink-800">
         {isConnected ? 'AI Listening' : 'Connecting...'}
       </div>
       {isConnected && (
         <div className="flex items-end gap-0.5 h-4">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-pink-500 rounded-t transition-all duration-75"
                    style={{ height: `${Math.min(100, Math.max(10, volume * (i + 1) * 0.5))}%` }} 
                />
            ))}
         </div>
       )}
    </div>
  );
};

export default AudioMonitor;