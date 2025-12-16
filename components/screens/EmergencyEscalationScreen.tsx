import React from 'react';
import { Contact, EmergencyType, LocationData } from '../../types';
import HospitalFinder from '../HospitalFinder';

interface Props {
  reason: EmergencyType;
  contacts: Contact[];
  location: LocationData;
  onResolve: () => void;
}

export const EmergencyEscalationScreen: React.FC<Props> = ({ reason, contacts, location, onResolve }) => {
  return (
    <div className="h-full bg-[#E53935] text-white flex flex-col p-6 overflow-y-auto">
         {/* Top Banner */}
         <div className="flex justify-between items-center mb-6 pt-2">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                <h1 className="text-2xl font-black tracking-tight">HELP ON THE WAY</h1>
            </div>
         </div>

         <div className="bg-white/10 p-4 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <p className="text-white/80 uppercase text-[10px] font-bold tracking-widest mb-1">EMERGENCY TYPE</p>
            <p className="text-2xl font-bold">{reason || 'Distress Signal'}</p>
         </div>

         {/* Contacts Status */}
         <div className="space-y-3 mb-8">
            <p className="font-bold text-sm opacity-90 uppercase tracking-wide">Family Notified</p>
            {contacts.map(c => (
                <div key={c.id} className="flex items-center gap-4 bg-white text-[#5D4037] p-4 rounded-2xl shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-[#E53935]/10 flex items-center justify-center font-bold text-lg text-[#E53935]">
                        {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold">{c.name}</div>
                        <div className="text-xs text-[#E53935] font-medium">{c.status === 'Danger' ? 'NOTIFIED • VIEWING LOCATION' : 'NOTIFIED'}</div>
                    </div>
                    <a href={`tel:${c.phone}`} className="bg-[#E53935] text-white p-2 rounded-full">
                        📞
                    </a>
                </div>
            ))}
         </div>

         {/* AI Hospital Finder */}
         <div className="mb-6">
             <HospitalFinder latitude={location.latitude} longitude={location.longitude} />
         </div>

         <button 
            onClick={onResolve}
            className="mt-auto w-full bg-white/10 border-2 border-white/30 text-white font-bold py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
         >
            False Alarm? Cancel
         </button>
    </div>
  );
};