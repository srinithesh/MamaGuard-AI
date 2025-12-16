import React from 'react';
import { LocationData } from '../../types';
import { LeafletMap } from '../LeafletMap';

interface Props {
  location: LocationData;
  onBack: () => void;
}

export const LiveLocationScreen: React.FC<Props> = ({ location, onBack }) => {
  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col relative text-[#5D4037]">
        <button onClick={onBack} className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-bold text-[#5D4037]">
            ← Back
        </button>

        <div className="flex-1 relative">
            {/* Real Map */}
            <LeafletMap 
                center={{ lat: location.latitude, lng: location.longitude }}
                markerColor="#FFAB91" // Mom's color
            />
        </div>

        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h2 className="text-lg font-bold text-[#5D4037] mb-1">Your Location</h2>
            <p className="text-[#5D4037] opacity-60 text-sm mb-4 flex items-center gap-1">
                📍 {location.address || "Fetching address..."}
            </p>

            <div className="flex items-center gap-3 bg-[#66BB6A]/10 p-3 rounded-xl border border-[#66BB6A]/20 mb-4">
                <div className="w-2 h-2 bg-[#66BB6A] rounded-full animate-pulse"></div>
                <p className="text-xs text-[#66BB6A] font-bold flex-1">Sharing live with Husband & Mom</p>
            </div>

            <h3 className="text-xs font-bold text-[#5D4037] opacity-40 uppercase mb-3">Nearby Safety</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
                <div className="min-w-[140px] p-3 rounded-xl border border-[#FFD180] bg-[#FFF3E0]">
                    <div className="text-lg mb-1">🏥</div>
                    <div className="font-bold text-sm text-[#5D4037]">City Hospital</div>
                    <div className="text-xs text-[#5D4037] opacity-60">1.2 miles</div>
                </div>
                 <div className="min-w-[140px] p-3 rounded-xl border border-[#FFD180] bg-[#FFF3E0]">
                    <div className="text-lg mb-1">🚑</div>
                    <div className="font-bold text-sm text-[#5D4037]">Urgent Care</div>
                    <div className="text-xs text-[#5D4037] opacity-60">2.4 miles</div>
                </div>
            </div>
        </div>
    </div>
  );
};