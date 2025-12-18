import React from 'react';
import { LocationData } from '../../types';

interface Props {
  location: LocationData;
  onBack: () => void;
}

export const LiveLocationScreen: React.FC<Props> = ({ location, onBack }) => {
  const hospitals = [
    { name: "Brooklyn Medical Center", address: "456 Hospital Drive, Brooklyn, NY 11215", distance: "8322.1 mi", time: "19974 min" },
    { name: "Maternal Health Center", address: "321 Wellness Blvd, Brooklyn, NY 11225", distance: "8324.1 mi", time: "19978 min" },
    { name: "St. Mary's Women's Hospital", address: "789 Care Lane, Brooklyn, NY 11220", distance: "8324.6 mi", time: "19980 min" }
  ];

  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col text-brown overflow-y-auto pb-24">
        {/* Header Branding */}
        <div className="px-6 pt-6 flex flex-col items-center">
             <div className="flex items-center justify-between w-full mb-8">
                <div className="w-10 h-10 bg-salmon rounded-full flex items-center justify-center shadow-md">❤️</div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">MotherGuard</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-widest -mt-1">Mother View</span>
                </div>
                <div className="flex gap-2">
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Safe
                    </div>
                    <button className="text-xl">⇄</button>
                </div>
             </div>

             <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">📍</div>
             <h1 className="text-2xl font-black mb-1">Live Location</h1>
             <p className="text-brown opacity-50 text-sm mb-8">Your location is shared with trusted contacts</p>
        </div>

        {/* API Key Nudge */}
        <div className="px-6 mb-4">
            <div className="bg-white p-5 rounded-[2.5rem] border border-orange-50 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">⚙️</div>
                <div className="flex-1">
                    <h4 className="font-bold text-xs">Enable Live Map</h4>
                    <p className="text-[10px] text-slate-400">Add your Google Maps API key to see the interactive map.</p>
                </div>
                <button className="bg-white border border-salmon text-salmon text-[10px] font-bold py-2 px-4 rounded-full active:scale-95 transition-all">
                    Go to Settings
                </button>
            </div>
        </div>

        {/* Map Placeholder */}
        <div className="px-6 mb-6">
            <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] border border-peach-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
                <div className="w-14 h-14 bg-peach-50 rounded-full flex items-center justify-center text-2xl mb-4 text-slate-300">📍</div>
                <h4 className="font-bold text-sm text-slate-700 mb-1">Google Maps API key required</h4>
                <p className="text-xs text-slate-400">Go to Settings to add your key</p>
            </div>
        </div>

        {/* Coordinates Card */}
        <div className="px-6 mb-6">
            <div className="bg-white p-5 rounded-[2.5rem] border border-orange-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-xl shrink-0">📍</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm">Your Location</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">12.6580, 77.4474</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Updated 10:38:02 PM</p>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8">
            <button className="bg-white border-2 border-salmon text-salmon font-bold py-4 rounded-full flex items-center justify-center gap-2 text-xs shadow-sm active:scale-95 transition-all">
                <span>🔗</span> Share Location
            </button>
            <button className="bg-white border-2 border-salmon text-salmon font-bold py-4 rounded-full flex items-center justify-center gap-2 text-xs shadow-sm active:scale-95 transition-all">
                <span>🔄</span> Refresh
            </button>
        </div>

        {/* Hospital Section Title */}
        <div className="px-6 mb-4 flex items-center gap-2 text-salmon font-bold text-sm uppercase tracking-wider">
            <span>🏥</span> Nearby Hospitals
        </div>

        {/* Hospital List */}
        <div className="px-6 space-y-4 mb-8">
            {hospitals.map((h, i) => (
                <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-orange-50 shadow-sm">
                    <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-xl shrink-0">🏥</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{h.name}</h3>
                            <p className="text-[10px] text-slate-400 mb-1 truncate">{h.address}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                <span>🚗 {h.distance}</span>
                                <span>🕒 ~{h.time}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-[#E53935] text-white py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2">
                            📞 Call
                        </button>
                        <button className="bg-white border-2 border-orange-200 text-salmon py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2">
                            🚀 Navigate
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};