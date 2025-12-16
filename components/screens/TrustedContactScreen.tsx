import React, { useState, useEffect } from 'react';
import { Contact, SystemStatus, LocationData } from '../../types';
import { LeafletMap } from '../LeafletMap';

interface Props {
  contactName: string; // The logged in contact
  targetName: string; // The pregnant woman
  targetPhone?: string;
  systemStatus: SystemStatus;
  location: LocationData;
  lastUpdate: string;
  pendingSeconds?: number;
  onConfirmSafe: () => void;
  onConfirmDanger: () => void;
}

type TabOption = 'STATUS' | 'VITALS' | 'HISTORY';

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
  const [activeTab, setActiveTab] = useState<TabOption>('STATUS');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isEmergency = systemStatus === SystemStatus.EMERGENCY;
  const isPending = systemStatus === SystemStatus.PENDING;
  const isSafe = systemStatus === SystemStatus.MONITORING || systemStatus === SystemStatus.IDLE;

  // Auto-switch to Status tab on emergency/risk
  useEffect(() => {
    if (!isSafe) {
        setActiveTab('STATUS');
        setIsExpanded(true);
    }
  }, [isSafe]);

  // Configuration based on status
  let statusColor = 'bg-emerald-500';
  let statusText = 'SAFE';
  let statusSubtext = `Verified by AI • ${lastUpdate}`;
  let markerColor = '#10B981'; // emerald-500

  if (isPending) {
    statusColor = 'bg-amber-400';
    statusText = 'POTENTIAL RISK';
    statusSubtext = 'Unusual activity detected';
    markerColor = '#FBBF24'; // amber-400
  } else if (isEmergency) {
    statusColor = 'bg-red-600';
    statusText = 'EMERGENCY';
    statusSubtext = 'Immediate assistance required';
    markerColor = '#DC2626'; // red-600
  }

  // Render Content based on active Tab
  const renderTabContent = () => {
    switch (activeTab) {
        case 'VITALS':
            return (
                <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">🏃‍♀️</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">Movement</span>
                            </div>
                            <div className="font-bold text-slate-800">Stationary</div>
                            <div className="text-xs text-slate-400">Since 10 mins ago</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">🔊</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">Audio Env</span>
                            </div>
                            <div className="font-bold text-slate-800">Quiet</div>
                            <div className="text-xs text-slate-400">Low noise level</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">📱</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">Phone</span>
                            </div>
                            <div className="font-bold text-slate-800">Screen Off</div>
                            <div className="text-xs text-slate-400">Battery 84%</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">⌚️</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">Watch</span>
                            </div>
                            <div className="font-bold text-slate-800">HR 78 bpm</div>
                            <div className="text-xs text-slate-400">Normal Range</div>
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <p className="text-sm text-emerald-800 leading-relaxed">
                            <strong>AI Analysis:</strong> Vital signs appear normal. No sudden movements or distress sounds detected in the last hour.
                        </p>
                    </div>
                </div>
            );
        case 'HISTORY':
            return (
                <div className="space-y-0 relative border-l-2 border-slate-100 ml-3 my-2 animate-fadeIn">
                    {[
                        { time: '12:05 PM', title: 'Location Update', desc: 'Arrived at 123 Maple Ave', icon: '📍' },
                        { time: '11:45 AM', title: 'Reminder Completed', desc: 'Confirmed: Prenatal Vitamins', icon: '💊' },
                        { time: '10:30 AM', title: 'Safety Check', desc: 'Routine automated check - Safe', icon: '🛡' },
                        { time: '09:15 AM', title: 'Movement Started', desc: 'Walking detected', icon: '👟' },
                    ].map((item, idx) => (
                        <div key={idx} className="mb-6 pl-6 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                            <span className="text-xs font-bold text-slate-400 mb-1 block">{item.time}</span>
                            <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            );
        case 'STATUS':
        default:
            return (
                <div className="space-y-4 animate-fadeIn">
                     {/* Address Row */}
                    <div className="flex items-start gap-3 mb-2 bg-slate-50 p-3 rounded-xl">
                        <div className="mt-1 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Current Location</h3>
                            <p className="text-sm text-slate-500 leading-snug">{location.address || "Locating..."}</p>
                        </div>
                    </div>

                    {isSafe && (
                        <>
                            {/* AI Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase">Battery</div>
                                        <div className="text-lg font-bold text-emerald-900">84%</div>
                                    </div>
                                    <span className="text-xl">🔋</span>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase">Signal</div>
                                        <div className="text-lg font-bold text-emerald-900">4G</div>
                                    </div>
                                    <span className="text-xl">📶</span>
                                </div>
                            </div>

                            <a href={`tel:${targetPhone}`} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200">
                                <span>📞</span> Call {targetName}
                            </a>
                        </>
                    )}

                    {isPending && (
                        <>
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                <h4 className="font-bold text-amber-800 flex items-center gap-2 text-sm uppercase">
                                    <span>🤖</span> AI Analysis
                                </h4>
                                <p className="text-sm text-amber-900 mt-1">
                                    Voice analysis detected distress keywords. Movement has stopped. Verification required.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={onConfirmSafe} className="py-4 rounded-xl font-bold border-2 border-slate-200 text-slate-600 active:bg-slate-50 transition-colors">
                                    She is Safe
                                </button>
                                <button onClick={onConfirmDanger} className="py-4 rounded-xl font-bold bg-red-600 text-white shadow-lg shadow-red-200 active:scale-95 transition-transform">
                                    CONFIRM DANGER
                                </button>
                            </div>
                        </>
                    )}

                    {isEmergency && (
                        <>
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                                <p className="text-red-800 font-bold text-lg">System Escalating...</p>
                                <p className="text-red-600 text-sm">Notifying nearby hospitals and emergency services.</p>
                            </div>

                            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg animate-pulse">
                                <span>🚑</span> CALL 911
                            </button>
                            
                            <button onClick={onConfirmSafe} className="w-full py-3 rounded-xl font-bold border border-slate-200 text-slate-500 text-sm">
                                Resolve / False Alarm
                            </button>
                        </>
                    )}
                </div>
            );
    }
  };

  return (
    <div className="h-full w-full relative bg-gray-100 overflow-hidden font-sans text-slate-800">
      
      {/* 1. Full Screen Map Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
          <LeafletMap 
              center={{ lat: location.latitude, lng: location.longitude }}
              markerColor={markerColor}
              markerPulseColor={markerColor}
              zoom={16}
          />
      </div>

      {/* 2. Top Floating Status Card */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-white/20 flex items-center gap-4 pointer-events-auto">
              <div className={`w-12 h-12 rounded-full ${statusColor} flex items-center justify-center text-white text-xl shadow-md shrink-0`}>
                  {isSafe ? '🛡' : isPending ? '⚠️' : '🚨'}
              </div>
              <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold truncate">{targetName} is {statusText}</h1>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">{statusSubtext}</p>
              </div>
          </div>
      </div>

      {/* 3. Center Layer (Countdown) - Only shows in Pending state */}
      {isPending && (
         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="mt-[-100px] bg-red-600/90 text-white backdrop-blur-sm p-6 rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-2xl animate-pulse border-4 border-white/30 pointer-events-auto">
                <span className="text-sm font-bold uppercase tracking-widest opacity-90 mb-1">Confirm in</span>
                <span className="text-6xl font-black font-mono">{Math.ceil(pendingSeconds || 0)}</span>
                <span className="text-sm font-bold opacity-80 mt-1">seconds</span>
            </div>
         </div>
      )}

      {/* 4. Bottom Action Sheet with Tabs */}
      <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out flex flex-col ${isExpanded || !isSafe ? 'h-[85%]' : 'h-[55%]'}`}>
          
          {/* Drag Handle & Tab Bar */}
          <div className="flex-none pt-2 pb-0 bg-white rounded-t-3xl border-b border-slate-100 z-40 sticky top-0" onClick={() => setIsExpanded(!isExpanded)}>
               <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 cursor-pointer"></div>
               
               {/* Segmented Control Tabs */}
               <div className="flex px-6 pb-0 gap-6">
                    {(['STATUS', 'VITALS', 'HISTORY'] as TabOption[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={(e) => { e.stopPropagation(); setActiveTab(tab); setIsExpanded(true); }}
                            className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></div>
                            )}
                        </button>
                    ))}
               </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
               {renderTabContent()}
          </div>
      </div>
    </div>
  );
};