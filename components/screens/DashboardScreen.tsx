import React from 'react';
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
  status, isMicActive, onManualHelp, onOpenReminders, onViewMap, contacts 
}) => {
  return (
    <div className="flex flex-col h-full bg-[#FFF3E0] text-brown overflow-y-auto pb-24">
      {/* Top Header Branding */}
      <div className="p-6 pt-10 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-8">
            <div className="w-10 h-10 bg-salmon rounded-full flex items-center justify-center shadow-md">❤️</div>
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg">MotherGuard</span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest -mt-1">Mother View</span>
            </div>
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Safe
            </div>
        </div>

        {/* Hello Banner */}
        <div className="w-full bg-white/40 p-6 rounded-[2.5rem] border border-white/60 shadow-sm flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-black">Hello, Sarah</h2>
                <p className="text-sm opacity-60">Everything looks great today.</p>
            </div>
            <div className="text-4xl">🤰</div>
        </div>

        {/* Status Monitoring Card */}
        <div className="w-full bg-white p-5 rounded-[2rem] border border-green-100 shadow-sm flex items-center gap-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">🛡</div>
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl text-green-500 shadow-inner">🛡</div>
            <div>
                <h3 className="font-bold text-slate-800">Sarah is SAFE</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verified by AI • Just now</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Grid Actions */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <button onClick={onOpenReminders} className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col items-center gap-2 hover:bg-peach-50 active:scale-95 transition-all">
                <span className="text-4xl">💊</span>
                <span className="font-bold text-sm">Health Logs</span>
                <span className="text-[10px] opacity-40">5 Pending</span>
            </button>
            <button onClick={onManualHelp} className="bg-salmon p-6 rounded-[2rem] shadow-md flex flex-col items-center gap-2 active:scale-95 transition-all">
                <span className="text-4xl">🆘</span>
                <span className="font-bold text-sm">Need Help?</span>
                <span className="text-[10px] opacity-60">Emergency SOS</span>
            </button>
        </div>

        {/* Location & Stats Overview */}
        <div className="w-full mt-6 space-y-4">
             <div onClick={onViewMap} className="bg-white p-5 rounded-[2rem] border border-peach-100 shadow-sm flex items-center gap-4 cursor-pointer">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl">📍</div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold opacity-40 uppercase">Current Location</p>
                    <p className="font-bold text-sm truncate">123 Maple Street, Brooklyn, NY</p>
                </div>
                <span className="text-blue-500 text-lg">→</span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-green-50 shadow-sm flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold opacity-40 uppercase">
                        Battery <span className="text-lg">🔋</span>
                    </div>
                    <div className="text-2xl font-black">84%</div>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-green-50 shadow-sm flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold opacity-40 uppercase">
                        Signal <span className="text-lg">📶</span>
                    </div>
                    <div className="text-2xl font-black">Strong</div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};