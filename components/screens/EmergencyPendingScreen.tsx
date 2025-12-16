import React from 'react';
import { EmergencyType } from '../../types';

interface Props {
  reason: EmergencyType;
  countdown: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const EmergencyPendingScreen: React.FC<Props> = ({ reason, countdown, onCancel, onConfirm }) => {
  return (
    <div className="h-full bg-[#FFD180] text-[#5D4037] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] bg-white opacity-20 rounded-full animate-ping-slow"></div>
        </div>

        <div className="z-10 w-full max-w-md text-center flex-1 flex flex-col justify-center">
            <div className="mb-6">
                <span className="inline-block bg-[#E53935] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider animate-pulse">
                    Distress Detected
                </span>
                <h2 className="text-3xl font-bold mb-1 text-[#5D4037]">Are you okay?</h2>
                <p className="text-[#5D4037] text-lg opacity-80">Detected: {reason || 'Unusual Activity'}</p>
            </div>

            <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="8" />
                    <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#E53935" strokeWidth="8" 
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * countdown) / 15}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <span className="text-5xl font-mono font-bold text-[#5D4037]">{Math.ceil(countdown)}</span>
            </div>

            <p className="mb-8 text-sm font-medium opacity-80">Help will be notified automatically.</p>
        
            <div className="space-y-4 w-full">
                <button 
                    onClick={onCancel}
                    className="w-full bg-[#66BB6A] text-white font-bold py-5 rounded-2xl shadow-lg text-xl active:scale-95 transition-all"
                >
                    I AM SAFE
                </button>

                <button 
                    onClick={onConfirm}
                    className="w-full bg-[#E53935] text-white font-bold py-4 rounded-2xl shadow-lg text-lg active:scale-95 transition-all"
                >
                    HELP ME NOW
                </button>
            </div>
        </div>
    </div>
  );
};