import React, { useState } from 'react';
import { SystemStatus, Contact } from '../../types';

interface Props {
  status: SystemStatus;
  isMicActive: boolean;
  onManualHelp: () => void;
  onOpenReminders: () => void;
  onViewMap: () => void;
  contacts: Contact[];
  escalationDelay: number;
  setEscalationDelay: (seconds: number) => void;
}

export const DashboardScreen: React.FC<Props> = ({ 
  status, 
  isMicActive, 
  onManualHelp, 
  onOpenReminders, 
  onViewMap,
  contacts,
  escalationDelay,
  setEscalationDelay
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [reminderDone, setReminderDone] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#FFF3E0] relative text-[#5D4037]">
      
      {/* How it Works Modal */}
      {showInfo && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-xs w-full animate-pulse-fast">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#5D4037] text-lg">How MamaGuard Works</h3>
                <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600">✕</button>
             </div>
             <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                MamaGuard uses AI to verify your safety by listening for distress words (like "Help" or "Pain"), monitoring your movement, and checking that you respond to daily reminders.
             </p>
             <div className="space-y-2 text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">🎤 Listens for distress</div>
                <div className="flex items-center gap-2">📍 Tracks location securely</div>
                <div className="flex items-center gap-2">🛡 Verifies before alerting</div>
             </div>
             <button onClick={() => setShowInfo(false)} className="mt-6 w-full bg-[#FFAB91] text-[#5D4037] font-bold py-3 rounded-xl">
                Got it
             </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-xs w-full">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#5D4037] text-lg">Safety Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">✕</button>
             </div>
             
             <div className="mb-6">
                <label className="block text-sm font-bold text-[#5D4037] mb-2">
                    Auto-Escalation Timer
                </label>
                <p className="text-xs text-gray-500 mb-4">
                    How long the system waits for your confirmation before calling for help automatically.
                </p>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="5"
                        value={escalationDelay}
                        onChange={(e) => setEscalationDelay(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFAB91]"
                    />
                    <span className="font-mono font-bold text-[#5D4037] w-12 text-right">{escalationDelay}s</span>
                </div>
             </div>

             <button onClick={() => setShowSettings(false)} className="w-full bg-[#5D4037] text-white font-bold py-3 rounded-xl">
                Save Settings
             </button>
          </div>
        </div>
      )}

      {/* Header - Salmon Background */}
      <div className="bg-[#FFAB91] p-6 pb-6 rounded-b-[2.5rem] shadow-sm z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-[#5D4037]">Hello, Mama</h1>
                <button onClick={() => setShowInfo(true)} className="text-[#5D4037] opacity-60 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </button>
                <button onClick={() => setShowSettings(true)} className="text-[#5D4037] opacity-60 hover:opacity-100 ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
            <p className="text-[#5D4037] text-xs mt-1 opacity-80">You are cared for and safe.</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner text-[#5D4037]">
            🤰
          </div>
        </div>

        {/* AI Safety Status Bar - White card on Salmon header */}
        <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-4 transition-all shadow-sm" onClick={() => setShowDetails(!showDetails)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isMicActive ? 'bg-[#66BB6A] animate-pulse' : 'bg-red-400'}`}></div>
                    <div>
                        <h3 className="text-sm font-bold text-[#5D4037]">AI Safety Check</h3>
                        <p className="text-xs text-[#5D4037] opacity-60">{isMicActive ? 'System Active & Monitoring' : 'System Offline'}</p>
                    </div>
                </div>
                <span className="text-[#5D4037] text-xs opacity-50">{showDetails ? '▲' : '▼'}</span>
            </div>
            
            {showDetails && (
                <div className="mt-4 pt-4 border-t border-[#FFD180]/30 grid grid-cols-2 gap-y-3 gap-x-4">
                    <div className="flex items-center gap-2 text-xs text-[#5D4037]">
                        <span className="text-[#66BB6A]">🎙</span> Voice: Active
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5D4037]">
                        <span className="text-[#66BB6A]">📞</span> Phone: Active
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5D4037]">
                        <span className="text-blue-500">📍</span> Location: Stable
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5D4037]">
                        <span className="text-purple-500">🧠</span> Context: Safe
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        
        {/* Health Check Card - White with Risk Border */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#FFD180] flex items-center justify-between">
           <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center text-2xl border border-[#FFD180]">
                 🩺
               </div>
               <div>
                 <h3 className="font-bold text-[#5D4037]">Health Check: Normal</h3>
                 <p className="text-[#5D4037] opacity-50 text-xs">Based on activity & voice</p>
               </div>
           </div>
           <div className="text-[#66BB6A] text-xl">✓</div>
        </div>

        {/* Smart Reminder Card - Risk/Amber Background */}
        {!reminderDone && (
            <div className="bg-[#FFD180] p-5 rounded-3xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-[#5D4037] text-sm">⏰ Reminder</h4>
                    <span className="text-[10px] bg-white/50 px-2 py-1 rounded text-[#5D4037] font-bold">12:00 PM</span>
                </div>
                <p className="text-[#5D4037] text-sm mb-4">Did you take your prenatal vitamins today?</p>
                <div className="flex gap-2">
                    <button onClick={() => setReminderDone(true)} className="flex-1 bg-[#66BB6A] text-white text-xs font-bold py-3 rounded-xl shadow-sm active:scale-95">
                        Yes, I took them
                    </button>
                    <button className="flex-1 bg-white text-[#5D4037] text-xs font-bold py-3 rounded-xl shadow-sm active:scale-95">
                        🎤 Confirm Voice
                    </button>
                </div>
            </div>
        )}

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={onOpenReminders}
                className="bg-white p-4 rounded-3xl border border-[#FFD180] shadow-sm flex flex-col items-center justify-center gap-2 active:bg-[#FFF3E0] transition-colors h-32"
            >
                <span className="text-3xl">💊</span>
                <span className="font-bold text-[#5D4037] text-sm">Log Health</span>
            </button>

            <button 
                onClick={onManualHelp}
                className="bg-[#FFAB91] p-4 rounded-3xl border border-[#FFAB91] shadow-sm flex flex-col items-center justify-center gap-2 active:bg-[#E53935] active:text-white transition-colors group h-32"
            >
                <span className="text-3xl group-hover:scale-110 transition-transform">🆘</span>
                <span className="font-bold text-[#5D4037] group-active:text-white text-sm">Need Help?</span>
            </button>
        </div>

        {/* Trusted Contacts Mini Panel */}
        <div>
            <h4 className="text-xs font-bold text-[#5D4037] opacity-50 uppercase mb-3 ml-1">Trusted Contacts</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {contacts.map(c => (
                    <div key={c.id} className="min-w-[140px] bg-white p-3 rounded-2xl border border-[#FFD180] shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF3E0] flex items-center justify-center text-xs font-bold text-[#5D4037]">
                            {c.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#5D4037]">{c.role}</p>
                            <p className="text-[10px] text-[#66BB6A] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#66BB6A] rounded-full"></span>
                                Online
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Emergency History Section */}
        <div>
             <h4 className="text-xs font-bold text-[#5D4037] opacity-50 uppercase mb-3 ml-1">Emergency History</h4>
             <div className="bg-white p-4 rounded-2xl border border-[#FFD180] shadow-sm space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-[#5D4037] opacity-40">🕒</span>
                        <span className="text-[#5D4037]">Last check-in</span>
                    </div>
                    <span className="font-bold text-[#5D4037] bg-[#FFF3E0] px-2 py-1 rounded text-xs">Today, 10:42 AM</span>
                </div>
                <div className="w-full h-px bg-[#FFF3E0]"></div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-[#5D4037] opacity-40">🔔</span>
                        <span className="text-[#5D4037]">Last alert</span>
                    </div>
                    <span className="font-bold text-[#66BB6A] text-xs">None</span>
                </div>
             </div>
        </div>

        {/* Bottom Padding */}
        <div className="h-16"></div>

      </div>
    </div>
  );
};