import React, { useState } from 'react';
import { Reminder } from '../../types';

interface Props {
  onBack: () => void;
  onConfirmSafety: (reason: string) => void;
}

export const SmartReminderScreen: React.FC<Props> = ({ onBack, onConfirmSafety }) => {
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean, message: string, title: string }>({ visible: false, message: '', title: '' });
  
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Prenatal Vitamins', description: 'Take your daily prenatal vitamins with breakfast', timeLabel: 'in 17 minutes', completed: false, type: 'MEDICINE' },
    { id: '2', text: 'Gentle Stretching', description: 'Do some light stretching exercises', timeLabel: 'in about 4 hours', completed: false, type: 'EXERCISE' },
    { id: '3', text: 'Hydration Check', description: 'Drink a glass of water', timeLabel: 'completed 10 mins ago', completed: true, type: 'WATER' },
    { id: '4', text: 'Healthy Snack', description: 'Time for a nutritious snack', timeLabel: 'completed 1 hour ago', completed: true, type: 'FOOD' },
    { id: '5', text: 'Rest Break', description: 'Take a 15-minute rest break', timeLabel: 'completed 2 hours ago', completed: true, type: 'REST' },
  ]);

  // Form State for Modal
  const [newType, setNewType] = useState<Reminder['type']>('MEDICINE');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    
    if (!reminder.completed) {
        setToast({ 
            visible: true, 
            title: 'Reminder Completed', 
            message: `${reminder.text} has been marked as done.` 
        });
        setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000);
    }
    
    onConfirmSafety("Interacted with health logs");
  };

  const handleAddReminder = () => {
    if (!newTitle) return;

    const newReminder: Reminder = {
        id: Date.now().toString(),
        text: newTitle,
        description: newDesc || 'Scheduled health activity',
        timeLabel: `at ${newTime || 'anytime'}`,
        completed: false,
        type: newType
    };

    setReminders([newReminder, ...reminders]);
    setShowAddModal(false);
    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    
    setToast({ 
        visible: true, 
        title: 'Reminder Created', 
        message: `${newTitle} has been added to your logs.` 
    });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000);
  };

  const pendingCount = reminders.filter(r => !r.completed).length;
  const completedCount = reminders.filter(r => r.completed).length;

  const filteredReminders = reminders.filter(r => {
    if (activeFilter === 'PENDING') return !r.completed;
    if (activeFilter === 'COMPLETED') return r.completed;
    return true;
  });

  const getIcon = (type: Reminder['type']) => {
    switch(type) {
        case 'MEDICINE': return '💊';
        case 'WATER': return '💧';
        case 'FOOD': return '🥗';
        case 'REST': return '🌙';
        case 'EXERCISE': return '👟';
    }
  };

  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col text-brown overflow-hidden relative">
        {/* Header Branding */}
        <div className="px-6 pt-6 flex flex-col items-center flex-none">
             <div className="flex items-center justify-between w-full mb-6">
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

             <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">🔔</div>
             <h1 className="text-2xl font-black mb-1">Reminders</h1>
             <p className="text-brown opacity-50 text-sm mb-6">Stay on track with your health routine</p>
        </div>

        {/* Stats Cards */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-6 flex-none">
            <div className="bg-[#FFF8F0] p-4 rounded-3xl border border-orange-100 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Pending</span>
                    <span className="text-orange-400">🕒</span>
                </div>
                <div className="text-3xl font-black">{pendingCount}</div>
            </div>
            <div className="bg-[#F2FAF2] p-4 rounded-3xl border border-green-100 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Completed</span>
                    <span className="text-green-500">✓</span>
                </div>
                <div className="text-3xl font-black">{completedCount}</div>
            </div>
        </div>

        {/* Add Button */}
        <div className="px-6 mb-6 flex-none">
            <button 
                onClick={() => setShowAddModal(true)}
                className="w-full bg-salmon text-brown font-bold py-4 rounded-full shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all border border-salmon/20"
            >
                <span className="text-xl">+</span> Add New Reminder
            </button>
        </div>

        {/* Filters */}
        <div className="px-6 mb-4 flex-none">
            <div className="bg-white/50 p-1 rounded-full flex border border-peach-100 shadow-inner">
                {(['PENDING', 'COMPLETED', 'ALL'] as const).map(f => (
                    <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all ${activeFilter === f ? 'bg-white text-brown shadow-sm ring-1 ring-orange-50' : 'text-gray-400'}`}
                    >
                        {f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8 scroll-smooth">
            {filteredReminders.map(r => (
                <div key={r.id} className={`bg-white p-4 rounded-[2rem] border transition-all flex items-center gap-4 ${r.completed ? 'opacity-60 border-gray-100' : 'border-orange-100 shadow-sm'}`}>
                    <div className="w-12 h-12 bg-white rounded-full border border-gray-50 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {getIcon(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{r.text}</h3>
                            {r.completed && <span className="text-green-500 text-xs">✓</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 mb-1 leading-tight">{r.description}</p>
                        <p className="text-[10px] opacity-40 font-medium tracking-tight">🕒 {r.timeLabel}</p>
                    </div>
                    <button 
                        onClick={() => toggleReminder(r.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${r.completed ? 'bg-white text-salmon border-salmon opacity-40' : 'bg-white text-salmon border-salmon hover:bg-salmon hover:text-white'}`}
                    >
                        {r.completed ? '✓ Done' : '✓ Done'}
                    </button>
                </div>
            ))}
            {filteredReminders.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                    <div className="text-5xl mb-2">✨</div>
                    <p className="font-bold">No {activeFilter.toLowerCase()} tasks</p>
                </div>
            )}
        </div>

        {/* Add Reminder Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <span className="text-orange-400">🕒</span> Add Reminder
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Create a new health or activity reminder.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-slate-500 text-2xl font-light">✕</button>
                        </div>

                        <div className="space-y-5">
                            {/* Type Selector */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Type *</label>
                                <div className="flex justify-between gap-1">
                                    {[
                                        { id: 'MEDICINE', icon: '💊', label: 'Medicine' },
                                        { id: 'FOOD', icon: '🥗', label: 'Meal/Snack' },
                                        { id: 'WATER', icon: '💧', label: 'Hydration' },
                                        { id: 'EXERCISE', icon: '👟', label: 'Exercise' },
                                        { id: 'REST', icon: '🌙', label: 'Rest/Sleep' }
                                    ].map(type => (
                                        <button 
                                            key={type.id}
                                            onClick={() => setNewType(type.id as any)}
                                            className={`flex flex-col items-center gap-1 transition-all flex-1`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${newType === type.id ? 'bg-white border-2 border-salmon shadow-sm' : 'bg-slate-50 border border-slate-100 opacity-60'}`}>
                                                {type.icon}
                                            </div>
                                            <span className={`text-[8px] font-bold text-center leading-tight ${newType === type.id ? 'text-salmon' : 'text-slate-400'}`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title Input */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Title *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xs">🔗</span>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Take prenatal vitamins" 
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full bg-[#FFF3E0]/30 border border-peach-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Time Input */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Time *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xs">🕒</span>
                                    <input 
                                        type="time" 
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full bg-[#FFF3E0]/30 border border-peach-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">Description (Optional)</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Add any additional notes..." 
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    className="w-full bg-[#FFF3E0]/30 border border-peach-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-salmon transition-all shadow-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setShowAddModal(false)} 
                                className="flex-1 bg-white border-2 border-peach-100 text-salmon font-bold py-4 rounded-full text-sm active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddReminder}
                                className={`flex-1 font-bold py-4 rounded-full text-sm shadow-md active:scale-95 transition-all ${newTitle ? 'bg-salmon text-brown' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                Add Reminder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification */}
        {toast.visible && (
            <div className="fixed bottom-24 left-6 right-6 z-[110] animate-slideUp">
                <div className="bg-white p-4 rounded-3xl shadow-2xl border border-peach-100 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <span className="text-green-500">✓</span> {toast.title}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{toast.message}</p>
                </div>
            </div>
        )}

        <style>{`
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};