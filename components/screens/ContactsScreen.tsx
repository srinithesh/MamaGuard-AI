import React, { useState } from 'react';

interface Props {
  onBack: () => void;
}

export const ContactsScreen: React.FC<Props> = ({ onBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const contacts = [
    { name: "Michael Johnson", role: "Husband", phone: "+1 (555) 234-5678", primary: true },
    { name: "Emily Davis", role: "Mother", phone: "+1 (555) 345-6789", primary: false },
    { name: "Dr. Amanda Wilson", role: "OB-GYN", phone: "+1 (555) 456-7890", primary: false }
  ];

  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col text-brown overflow-y-auto pb-24 relative">
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

             <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">👥</div>
             <h1 className="text-2xl font-black mb-1">Trusted Contacts</h1>
             <p className="text-brown opacity-50 text-sm mb-8">3 contacts will be notified in emergencies</p>
        </div>

        {/* Add Contact Action */}
        <div className="px-6 mb-8">
            <button 
                onClick={() => setShowAddModal(true)}
                className="w-full bg-white border-2 border-dashed border-salmon text-salmon font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <span className="text-xl">+</span> Add Trusted Contact
            </button>
        </div>

        {/* Contact List */}
        <div className="px-6 space-y-4 mb-8">
            {contacts.map((c, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-orange-100 shadow-sm flex items-center gap-4 relative">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">👤</div>
                    {c.primary && <div className="absolute top-4 left-10 w-4 h-4 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center text-[10px]">⭐</div>}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{c.name}</h3>
                            {c.primary && <span className="bg-green-50 text-green-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-green-100 uppercase">Primary</span>}
                        </div>
                        <p className="text-[10px] text-slate-400">{c.role}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{c.phone}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 bg-salmon/10 text-salmon rounded-full flex items-center justify-center text-sm">📞</button>
                        <button className="w-8 h-8 bg-salmon/10 text-salmon rounded-full flex items-center justify-center text-sm">💬</button>
                        <button className="w-8 h-8 text-slate-300 flex items-center justify-center text-xl font-black">⋮</button>
                    </div>
                </div>
            ))}
        </div>

        {/* Notification Banner */}
        <div className="px-6">
            <div className="bg-[#E7F5E9] p-5 rounded-[2rem] border border-[#C8E6C9] flex items-center gap-4">
                <div className="text-2xl">🛡</div>
                <div>
                    <h4 className="font-bold text-[#2E7D32] text-sm">Emergency Notification</h4>
                    <p className="text-[10px] text-[#388E3C] leading-tight">All contacts receive alerts with your live location. Primary contacts get priority.</p>
                </div>
            </div>
        </div>

        {/* Add Trusted Contact Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-peach-50 rounded-full flex items-center justify-center text-xl">👤</div>
                                <div>
                                    <h2 className="text-xl font-black">Add Trusted Contact</h2>
                                    <p className="text-xs text-slate-400">Add someone who will be notified during emergencies.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-slate-500 text-2xl font-light">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter full name" 
                                    className="w-full bg-white border border-peach-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Phone Number *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">📞</span>
                                    <input 
                                        type="tel" 
                                        placeholder="+1 (555) 000-0000" 
                                        className="w-full bg-white border border-peach-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Relationship *</label>
                                <div className="relative">
                                    <select className="w-full bg-[#FFF3E0] border border-peach-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon appearance-none transition-all">
                                        <option>Select relationship</option>
                                        <option>Husband</option>
                                        <option>Mother</option>
                                        <option>Doctor</option>
                                        <option>Friend</option>
                                    </select>
                                    <span className="absolute inset-y-0 right-4 flex items-center text-slate-400 pointer-events-none text-xs">▼</span>
                                </div>
                            </div>
                            
                            <div className="bg-[#FFF3E0] p-4 rounded-[1.5rem] flex items-center gap-3 mt-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-peach-100">
                                    <input type="checkbox" className="w-4 h-4 accent-salmon" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="text-salmon text-xs">❤️</span>
                                        <h4 className="font-bold text-xs">Set as Primary Contact</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-500">Primary contacts receive priority alerts</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 bg-white border-2 border-peach-100 text-salmon font-bold py-4 rounded-2xl text-sm active:scale-95 transition-all">
                                Cancel
                            </button>
                            <button className="flex-1 bg-salmon text-brown font-bold py-4 rounded-2xl text-sm shadow-md active:scale-95 transition-all">
                                Add Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};