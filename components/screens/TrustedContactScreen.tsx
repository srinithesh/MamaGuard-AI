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

  // Auto-switch to Status tab on emergency/risk and expand to show controls
  useEffect(() => {
    if (!isSafe) {
        setActiveTab('STATUS');
        setIsExpanded(true);
    }
  }, [isSafe]);

  // Configuration based on status
  let statusColor = 'bg-emerald-500';
  let statusBg = 'bg-emerald-50';
  let statusText = 'SAFE';
  let statusSubtext = `Verified by AI • ${lastUpdate}`;
  let markerColor = '#10B981'; // emerald-500

  if (isPending) {
    statusColor = 'bg-amber-400';
    statusBg = 'bg-amber-50';
    statusText = 'POTENTIAL RISK';
    statusSubtext = 'Unusual activity detected';
    markerColor = '#FBBF24'; // amber-400
  } else if (isEmergency) {
    statusColor = 'bg-red-600';
    statusBg = 'bg-red-50';
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
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                        <div className="flex justify-between items-end mb-2">
                             <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heart Rate</h4>
                                <span className="text-3xl font-bold text-slate-800">78 <span className="text-sm font-normal text-slate-400">bpm</span></span>
                             </div>
                             <div className="text-emerald-500 font-bold text-sm">Normal</div>
                        </div>
                        {/* Mock Graph */}
                        <div className="flex items-end h-16 gap-1">
                            {[40, 60, 55, 70, 65, 80, 75, 60, 50, 65, 70, 78].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-200 rounded-t-sm transition-all hover:bg-emerald-300" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>

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
                                <span className="text-xl">🩸</span>
                                <span className="text-xs font-bold text-slate-500 uppercase">Oxygen</span>
                            </div>
                            <div className="font-bold text-slate-800">98%</div>
                            <div className="text-xs text-slate-400">SpO2</div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Device Status</h4>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">📱 Phone Battery</span>
                                <span className="font-bold text-emerald-600">84%</span>
                             </div>
                             <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 w-[84%] h-full rounded-full"></div>
                             </div>
                             
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 flex items-center gap-2">⌚️ Watch Battery</span>
                                <span className="font-bold text-emerald-600">62%</span>
                             </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 w-[62%] h-full rounded-full"></div>
                             </div>
                         </div>
                    </div>
                </div>
            );
        case 'HISTORY':
            return (
                <div className="space-y-0 relative border-l-2 border-slate-100 ml-3 my-2 animate-fadeIn pl-6">
                    {[
                        { time: '12:05 PM', title: 'Location Update', desc: 'Arrived at 123 Maple Ave', icon: '📍', color: 'bg-blue-100 text-blue-600 border-blue-200' },
                        { time: '11:45 AM', title: 'Reminder Completed', desc: 'Confirmed: Prenatal Vitamins', icon: '💊', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
                        { time: '10:30 AM', title: 'Safety Check', desc: 'Routine automated check - Safe', icon: '🛡', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                        { time: '09:15 AM', title: 'Movement Started', desc: 'Walking detected (15 mins)', icon: '👟', color: 'bg-orange-100 text-orange-600 border-orange-200' },
                    ].map((item, idx) => (
                        <div key={idx} className="mb-8 relative group">
                            <div className={`absolute -left-[33px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${item.color} shadow-sm z-10 bg-white`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-400 mb-0.5 block">{item.time}</span>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 -mt-1 group-hover:border-slate-200 transition-colors">
                                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'STATUS':
        default:
            return (
                <div className="space-y-4 animate-fadeIn">
                     {/* Current Location Card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-slate-400 bg-white p-2 rounded-full shadow-sm">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Current Location</h3>
                                <p className="text-base font-bold text-slate-900 leading-tight">{location.address || "Acquiring satellite lock..."}</p>
                                <p className="text-xs text-slate-400 mt-1">Accurate to 5 meters</p>
                            </div>
                        </div>
                    </div>

                    {isSafe && (
                        <>
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col justify-between h-24">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Battery</div>
                                        <span className="text-lg">🔋</span>
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-900">84%</div>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex flex-col justify-between h-24">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Signal</div>
                                        <span className="text-lg">📶</span>
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-900">Strong</div>
                                </div>
                            </div>

                            <a href={`tel:${targetPhone}`} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-xl shadow-slate-200/50">
                                <span className="bg-white/20 p-1 rounded-full text-xs">📞</span> 
                                <span>Call {targetName}</span>
                            </a>
                        </>
                    )}

                    {isPending && (
                        <>
                            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⚠️</div>
                                <h4 className="font-bold text-amber-900 flex items-center gap-2 text-sm uppercase tracking-wide mb-2">
                                    System Detected Distress
                                </h4>
                                <p className="text-sm text-amber-800 font-medium leading-relaxed z-10 relative">
                                    We detected keywords indicating pain or distress. Movement has ceased. Please confirm safety immediately.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button onClick={onConfirmSafe} className="py-4 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all text-sm">
                                    It's a False Alarm
                                </button>
                                <button onClick={onConfirmDanger} className="py-4 rounded-2xl font-bold bg-red-600 text-white shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm">
                                    CONFIRM DANGER
                                </button>
                            </div>
                        </>
                    )}

                    {isEmergency && (
                        <>
                            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                                <p className="text-red-800 font-black text-xl mb-1 relative z-10">ESCALATION ACTIVE</p>
                                <p className="text-red-700 text-sm font-medium relative z-10">Emergency services and family are being notified.</p>
                            </div>

                            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl shadow-red-500/40 animate-pulse">
                                <span className="text-xl">🚑</span> CALL 911 NOW
                            </button>
                            
                            <button onClick={onConfirmSafe} className="w-full py-4 rounded-2xl font-bold border border-slate-200 text-slate-500 text-sm hover:bg-slate-50">
                                Mark as Resolved
                            </button>
                        </>
                    )}
                </div>
            );
    }
  };

  return (
    <div className="h-full w-full relative bg-slate-100 overflow-hidden font-sans text-slate-800">
      
      {/* 1. Full Screen Map Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
          <LeafletMap 
              center={{ lat: location.latitude, lng: location.longitude }}
              markerColor={markerColor}
              markerPulseColor={markerColor}
              zoom={16}
          />
      </div>

      {/* 2. Top Floating Status Card (Glassmorphism) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-14 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 border border-white/50 flex items-center gap-4 pointer-events-auto transition-transform hover:scale-[1.02]">
              <div className={`w-14 h-14 rounded-full ${statusColor} flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/20 shrink-0`}>
                  {isSafe ? '🛡' : isPending ? '⚠️' : '🚨'}
              </div>
              <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold truncate text-slate-800">{targetName} is {statusText}</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide truncate">{statusSubtext}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
          </div>
      </div>

      {/* 3. Center Layer (Countdown) - Only shows in Pending state */}
      {isPending && (
         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="mt-[-80px] bg-red-600/95 text-white backdrop-blur-md p-8 rounded-full w-56 h-56 flex flex-col items-center justify-center shadow-2xl animate-pulse border-[6px] border-white/20 pointer-events-auto scale-100 transition-transform">
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Escalating in</span>
                <span className="text-7xl font-black font-mono tracking-tighter">{Math.ceil(pendingSeconds || 0)}</span>
                <span className="text-xs font-bold opacity-80 mt-2 uppercase tracking-wider">seconds</span>
            </div>
         </div>
      )}

      {/* 4. Bottom Action Sheet with Tabs */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${isExpanded || !isSafe ? 'h-[85%]' : 'h-[40%]'}`}
      >
          
          {/* Header Area with Drag Handle & Tabs */}
          <div className="flex-none pt-3 pb-0 bg-white rounded-t-[2.5rem] border-b border-slate-100 z-40 sticky top-0" onClick={() => setIsExpanded(!isExpanded)}>
               {/* Drag Handle */}
               <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 cursor-pointer hover:bg-slate-300 transition-colors"></div>
               
               {/* Segmented Control Tabs */}
               <div className="px-6 mb-0">
                   <div className="flex p-1 bg-slate-100 rounded-2xl relative">
                        {/* Animated Slider Background (Conceptual) */}
                        <div 
                            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
                            style={{ 
                                left: activeTab === 'STATUS' ? '4px' : activeTab === 'VITALS' ? '33.33%' : '66.66%',
                                width: 'calc(33.33% - 5px)' // approximate
                            }}
                        ></div>

                        {(['STATUS', 'VITALS', 'HISTORY'] as TabOption[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={(e) => { e.stopPropagation(); setActiveTab(tab); setIsExpanded(true); }}
                                className={`flex-1 py-3 text-xs font-bold tracking-wider rounded-xl transition-colors relative z-10 text-center ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                   </div>
               </div>
               <div className="h-4"></div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-2 bg-white scroll-smooth">
               {renderTabContent()}
               {/* Bottom Padding for scroll */}
               <div className="h-8"></div>
          </div>
      </div>
    </div>
  );
};