import React from 'react';
import { Contact, SystemStatus, LocationData } from '../../types';

interface Props {
  contactName: string; // The logged in contact
  targetName: string; // The pregnant woman
  targetPhone?: string;
  systemStatus: SystemStatus;
  location: LocationData;
  lastUpdate: string;
  pendingSeconds?: number; // Added for the countdown logic
  onConfirmSafe: () => void;
  onConfirmDanger: () => void;
}

export const TrustedContactScreen: React.FC<Props> = ({ 
  contactName, 
  targetName, 
  targetPhone = "911",
  systemStatus, 
  location, 
  lastUpdate,
  pendingSeconds = 45,
  onConfirmSafe,
  onConfirmDanger
}) => {
  const isEmergency = systemStatus === SystemStatus.EMERGENCY;
  const isPending = systemStatus === SystemStatus.PENDING;
  const isSafe = systemStatus === SystemStatus.MONITORING || systemStatus === SystemStatus.IDLE;

  let headerBg = 'bg-[#66BB6A]'; // Safe
  let headerText = 'text-white';
  let statusLabel = 'SAFE';

  if (isPending) {
    headerBg = 'bg-[#FFD180]'; // Risk
    headerText = 'text-[#5D4037]';
    statusLabel = 'RISK DETECTED';
  } else if (isEmergency) {
    headerBg = 'bg-[#E53935]'; // Emergency
    headerText = 'text-white';
    statusLabel = 'EMERGENCY';
  }

  return (
    <div className="h-full flex flex-col bg-[#FFF3E0]">
      {/* 1. Context-Aware Header */}
      <div className={`p-6 pt-8 pb-8 shadow-md z-20 transition-colors duration-500 rounded-b-3xl ${headerBg} ${headerText}`}>
        <div className="flex justify-between items-start mb-1">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {targetName} is {statusLabel}
                </h1>
                <p className={`text-xs font-bold mt-1 opacity-80 uppercase tracking-wide`}>
                    {!isSafe ? '⚠️ Immediate Attention Required' : `Verified by AI ${lastUpdate}`}
                </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">🤰</span>
            </div>
        </div>
      </div>

      {/* 2. AI Safety Explanation Card (Floating overlap) */}
      <div className="px-4 -mt-6 z-30">
         <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#FFD180]/30">
            <h3 className="font-bold text-[#5D4037] text-xs uppercase mb-3 flex items-center gap-2 opacity-80 border-b border-gray-100 pb-2">
               🧠 AI Safety Analysis
            </h3>
            
            {!isSafe ? (
                 <div className="space-y-2">
                     <div className="flex items-center gap-3 text-sm font-medium text-[#5D4037]">
                        <span className="text-[#E53935] animate-pulse">🎙</span> Distress Keywords Detected
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-[#5D4037]">
                        <span className="text-[#E53935] animate-pulse">📍</span> Unusual Movement Pattern
                     </div>
                 </div>
            ) : (
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-[#5D4037]">
                    <div className="flex items-center gap-2">
                        <span>🎙</span> Voice: <span className="font-bold text-[#66BB6A] bg-[#66BB6A]/10 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>📞</span> Phone: <span className="font-bold text-[#66BB6A] bg-[#66BB6A]/10 px-1.5 py-0.5 rounded">Detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>⏰</span> Check: <span className="font-bold">1 min ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>📍</span> Move: <span className="font-bold">Normal</span>
                    </div>
                </div>
            )}

            <div className="mt-3 pt-2 text-[10px] text-gray-400 font-medium flex items-center gap-1">
                {isSafe ? '🛡 Verified by MamaGuard AI using voice & activity.' : '🚨 AI requires your confirmation.'}
            </div>
         </div>
      </div>

      {/* 3. Map Area */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden -mt-10 pt-10">
        {/* Placeholder Map */}
        <div className="absolute inset-0 opacity-60" 
             style={{
                 backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', 
                 backgroundSize: '20px 20px',
                 backgroundColor: '#e5e7eb'
             }}>
        </div>
        
        {/* Response Timer Overlay */}
        {isPending && (
             <div className="absolute top-14 left-0 right-0 flex justify-center z-30 pointer-events-none">
                <div className="bg-[#E53935] text-white px-5 py-2 rounded-full shadow-xl animate-pulse font-bold text-sm flex items-center gap-2 border-2 border-white">
                    <span>⏳</span> Auto-escalation in: {Math.ceil(pendingSeconds)}s
                </div>
             </div>
        )}

        {/* Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
             <div className="relative">
                 <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl z-10 relative ${!isSafe ? 'bg-[#E53935]' : 'bg-[#66BB6A]'}`}></div>
                 <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${!isSafe ? 'bg-[#E53935] w-20 h-20 -top-7 -left-7' : 'bg-[#66BB6A] w-12 h-12 -top-3 -left-3'}`}></div>
             </div>
             <div className="mt-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-[10px] font-bold text-[#5D4037] border border-white/50">
                {location.address || "123 Main St"}
             </div>
        </div>
      </div>

      {/* 4. Bottom Action Sheet (Guidance & Actions) */}
      <div className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 relative">
          
          {/* Handle Safe State */}
          {isSafe && (
            <div className="p-6 space-y-5">
                {/* Guidance Card */}
                <div className="bg-[#FFF3E0] rounded-xl p-4 border border-[#FFD180]/50">
                    <h4 className="text-[10px] font-bold text-[#5D4037] uppercase mb-3 opacity-60 tracking-wider">🧭 What you can do now</h4>
                    <ul className="text-sm text-[#5D4037] space-y-2 font-medium">
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#5D4037] rounded-full opacity-40"></span>
                            Monitor live location
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#5D4037] rounded-full opacity-40"></span>
                            Call her if needed
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#5D4037] rounded-full opacity-40"></span>
                            Contact nearby neighbour if required
                        </li>
                    </ul>
                </div>

                {/* Recent Activity */}
                <div>
                     <h4 className="text-[10px] font-bold text-[#5D4037] uppercase mb-3 opacity-60 tracking-wider ml-1">Recent Activity</h4>
                     <div className="space-y-3 pl-1">
                        <div className="flex items-center gap-3 text-xs text-[#5D4037] font-medium">
                            <div className="w-5 h-5 rounded-full bg-[#66BB6A]/20 flex items-center justify-center text-[#66BB6A] text-[10px]">✓</div>
                            Safety verified – 12:18 PM
                        </div>
                         <div className="flex items-center gap-3 text-xs text-[#5D4037] font-medium">
                             <div className="w-5 h-5 rounded-full bg-[#66BB6A]/20 flex items-center justify-center text-[#66BB6A] text-[10px]">✓</div>
                            Reminder confirmed – 11:55 AM
                        </div>
                     </div>
                </div>

                {/* Primary Safe Action */}
                <div className="pt-2">
                     <a href={`tel:${targetPhone}`} className="w-full bg-[#FFAB91] text-[#5D4037] font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <span>📞</span> Call {targetName}
                     </a>
                </div>
            </div>
          )}

          {/* Handle Risk / Emergency State */}
          {!isSafe && (
              <div className="p-6">
                 {isPending ? (
                     <div className="space-y-4">
                        <div className="text-center mb-2">
                             <p className="text-sm font-bold text-[#5D4037]">She might be in distress.</p>
                             <p className="text-xs text-[#5D4037] opacity-60">System detected unusual voice patterns.</p>
                        </div>
                        
                        <a href={`tel:${targetPhone}`} className="w-full bg-[#FFD180] text-[#5D4037] font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                             <span>📞</span> Check on her (Call)
                        </a>
                        
                        <div className="flex gap-3">
                            <button onClick={onConfirmSafe} className="flex-1 bg-white border-2 border-[#66BB6A] text-[#66BB6A] font-bold py-4 rounded-2xl shadow-sm active:scale-95 transition-transform text-sm">
                                She is Safe
                            </button>
                            <button onClick={onConfirmDanger} className="flex-1 bg-[#E53935] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm">
                                <span>🚨</span> CONFIRM DANGER
                            </button>
                        </div>
                     </div>
                 ) : (
                    <div className="space-y-4">
                        <div className="bg-[#E53935]/10 p-4 rounded-xl border border-[#E53935]/20 text-center">
                            <p className="text-sm font-bold text-[#E53935] uppercase tracking-wide">EMERGENCY CONFIRMED</p>
                            <p className="text-xs text-[#5D4037] mt-1">Escalating to emergency services and nearby hospitals.</p>
                        </div>
                        
                        <button className="w-full bg-[#E53935] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 animate-pulse">
                            <span>🚑</span> CALL AMBULANCE (911)
                        </button>
                        
                        <button onClick={onConfirmSafe} className="w-full bg-white text-[#5D4037] font-bold py-3 rounded-xl text-sm border border-gray-200">
                            Mark as False Alarm
                        </button>
                    </div>
                 )}
              </div>
          )}
      </div>
    </div>
  );
};