import React from 'react';
import { Contact, SystemStatus, LocationData } from '../../types';

interface Props {
  contactName: string; // The logged in contact
  targetName: string; // The pregnant woman
  targetPhone?: string;
  systemStatus: SystemStatus;
  location: LocationData;
  lastUpdate: string;
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
  onConfirmSafe,
  onConfirmDanger
}) => {
  const isEmergency = systemStatus === SystemStatus.EMERGENCY;
  const isPending = systemStatus === SystemStatus.PENDING;
  const isSafe = systemStatus === SystemStatus.MONITORING || systemStatus === SystemStatus.IDLE;

  let headerBg = 'bg-[#66BB6A]'; // Safe
  let headerText = 'text-white';
  let statusBadgeBg = 'bg-white';
  let statusBadgeText = 'text-[#66BB6A]';
  let statusLabel = 'SAFE';

  if (isPending) {
    headerBg = 'bg-[#FFD180]'; // Risk
    headerText = 'text-[#5D4037]';
    statusBadgeBg = 'bg-white';
    statusBadgeText = 'text-[#FFD180]'; // Or Brown
    statusLabel = 'RISK DETECTED';
  } else if (isEmergency) {
    headerBg = 'bg-[#E53935]'; // Emergency
    headerText = 'text-white';
    statusBadgeBg = 'bg-white';
    statusBadgeText = 'text-[#E53935]';
    statusLabel = 'EMERGENCY';
  }

  return (
    <div className="h-full flex flex-col bg-[#FFF3E0]">
      {/* Context-Aware Header */}
      <div className={`p-6 pb-6 shadow-sm z-10 transition-colors duration-500 ${headerBg} ${headerText}`}>
        <p className="text-[10px] uppercase font-bold opacity-70 mb-2 tracking-widest">
            {isSafe ? 'MONITORING DASHBOARD' : '⚠️ ACTION REQUIRED'}
        </p>
        
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    {targetName}
                </h1>
                {/* AI Reasoning Text */}
                <p className={`text-sm mt-2 font-medium flex items-center gap-2 opacity-90`}>
                    {!isSafe ? (
                        <>
                            <span className="animate-pulse">🚨</span> Distress Detected via Voice
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified by voice & activity 1 min ago
                        </>
                    )}
                </p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeBg} ${statusBadgeText === 'text-[#FFD180]' ? 'text-[#5D4037]' : statusBadgeText}`}>
                {statusLabel}
            </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden">
        {/* Placeholder Map */}
        <div className="absolute inset-0 opacity-60" 
             style={{
                 backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', 
                 backgroundSize: '20px 20px',
                 backgroundColor: '#e5e7eb'
             }}>
        </div>
        
        {/* Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
             <div className="relative">
                 <div className={`w-6 h-6 rounded-full border-4 border-white shadow-xl z-10 relative ${!isSafe ? 'bg-[#E53935]' : 'bg-[#66BB6A]'}`}></div>
                 <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${!isSafe ? 'bg-[#E53935] w-20 h-20 -top-7 -left-7' : 'bg-[#66BB6A] w-12 h-12 -top-3 -left-3'}`}></div>
             </div>
             <div className="mt-3 bg-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold text-[#5D4037] whitespace-nowrap border border-[#FFD180] flex flex-col items-center">
                <span>{location.address || "123 Main St, Home"}</span>
                <span className="text-[10px] text-[#5D4037] opacity-60 mt-0.5">Updated: {lastUpdate}</span>
             </div>
        </div>

        {/* Distance Info Overlay */}
        <div className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl flex items-center justify-between border border-white/50">
            <div>
                <p className="text-[#5D4037] opacity-50 text-[10px] font-bold uppercase tracking-wide">DISTANCE</p>
                <p className="text-xl font-bold text-[#5D4037]">1.2 miles</p>
            </div>
            <div className="h-8 w-[1px] bg-[#FFD180]"></div>
            <div>
                <p className="text-[#5D4037] opacity-50 text-[10px] font-bold uppercase tracking-wide">ETA DRIVING</p>
                <p className="text-xl font-bold text-[#5D4037]">5 mins</p>
            </div>
            <div className="w-10 h-10 bg-[#FFF3E0] rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                🚗
            </div>
        </div>
      </div>

      {/* Emergency Actions (Conditional - Only shows on Risk/Emergency) */}
      {!isSafe && (
          <div className="p-4 bg-white border-t border-[#FFD180]/30 space-y-3 pb-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 -mt-4 relative">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <p className="text-center text-sm font-bold text-[#5D4037] mb-2">Emergency detected. Please verify.</p>
              
              <div className="flex flex-col gap-3">
                  <button 
                      onClick={onConfirmSafe}
                      className="w-full bg-white border-2 border-[#66BB6A] text-[#66BB6A] font-bold py-3.5 rounded-2xl shadow-sm active:bg-[#66BB6A] active:text-white transition-colors text-sm">
                      SHE IS SAFE
                  </button>

                  <div className="flex gap-3">
                      <a 
                          href={`tel:${targetPhone}`}
                          className="flex-1 bg-[#FFAB91] text-[#5D4037] font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm"
                      >
                          <span>📞</span> CALL NOW
                      </a>
                      <button 
                          onClick={onConfirmDanger}
                          className="flex-1 bg-[#E53935] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm">
                          <span>🚨</span> CONFIRM DANGER
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};