import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const [apiKey, setApiKey] = useState('');
  const keywords = ["help", "pain", "emergency", "hurt", "fall", "bleeding", "faint", "dizzy"];

  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col text-brown overflow-y-auto pb-32">
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

             <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">⚙️</div>
             <h1 className="text-2xl font-black mb-1">Settings</h1>
        </div>

        {/* Emergency Keywords */}
        <div className="px-6 mb-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">🎙 Emergency Keywords</h3>
                    <button className="text-[10px] font-bold text-salmon border border-salmon px-3 py-1 rounded-full">+ Add Keyword</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((k, i) => (
                        <div key={i} className="bg-peach-50 text-salmon px-4 py-1.5 rounded-full text-xs font-bold border border-peach-100 flex items-center gap-2">
                            {k} <span className="text-peach-200">✕</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Alert Preferences */}
        <div className="px-6 mb-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm space-y-6">
                <h3 className="font-bold text-sm flex items-center gap-2">🔔 Alert Preferences</h3>
                {[
                    { title: "Push Notifications", desc: "Receive alerts on your device", icon: "🔔" },
                    { title: "Sound Alerts", desc: "Play sound for emergencies", icon: "🔊" },
                    { title: "Vibration", desc: "Vibrate on alerts", icon: "📳" }
                ].map((pref, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">{pref.icon}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-xs">{pref.title}</h4>
                            <p className="text-[10px] text-slate-400">{pref.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-salmon rounded-full relative">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Emergency Contact Methods */}
        <div className="px-6 mb-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm space-y-6">
                <h3 className="font-bold text-sm flex items-center gap-2">🛡 Emergency Contact Methods</h3>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">💬</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-xs">SMS Alerts</h4>
                        <p className="text-[10px] text-slate-400">Send text messages to contacts</p>
                    </div>
                    <div className="w-12 h-6 bg-salmon rounded-full relative">
                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">📞</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-xs">Auto-Call</h4>
                        <p className="text-[10px] text-slate-400">Call primary contact on emergency</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quiet Hours */}
        <div className="px-6 mb-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm space-y-6">
                <h3 className="font-bold text-sm flex items-center gap-2">🌙 Quiet Hours</h3>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">🕒</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-xs">Enable Quiet Hours</h4>
                        <p className="text-[10px] text-slate-400">Silence non-emergency alerts</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Google Maps API */}
        <div className="px-6 mb-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-lg">🗺️</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-xs">Google Maps API</h4>
                        <p className="text-[10px] text-slate-400">For live location tracking</p>
                    </div>
                </div>
                <div className="relative mb-4">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔗</span>
                    <input 
                        type="password" 
                        placeholder="Enter API key" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-[#FFF3E0] border border-peach-100 rounded-2xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-salmon"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 bg-salmon text-brown font-bold py-3 rounded-2xl shadow-sm active:scale-95 transition-all text-xs">
                        Save
                    </button>
                    <button className="w-12 h-12 bg-white border border-peach-100 rounded-2xl flex items-center justify-center text-salmon shadow-sm active:scale-95 transition-all">
                        ↗️
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};