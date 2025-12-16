import React, { useState } from 'react';
import { Reminder } from '../../types';

interface Props {
  onBack: () => void;
  onConfirmSafety: (reason: string) => void;
}

export const SmartReminderScreen: React.FC<Props> = ({ onBack, onConfirmSafety }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Prenatal Vitamins', time: '09:00 AM', completed: false, type: 'MEDICINE' },
    { id: '2', text: 'Drink Water (Glass 4)', time: '11:00 AM', completed: false, type: 'WATER' },
    { id: '3', text: 'Lunch', time: '01:00 PM', completed: false, type: 'FOOD' },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    // Verify safety if interacted
    onConfirmSafety("User interacted with reminders");
  };

  return (
    <div className="h-full bg-[#FFF3E0] flex flex-col text-[#5D4037]">
        <div className="p-6 pt-8 border-b border-[#FFAB91]/30 bg-[#FFAB91]/20">
            <button onClick={onBack} className="text-[#5D4037] opacity-70 font-medium text-sm mb-4 flex items-center gap-1">
                ← Back
            </button>
            <h1 className="text-2xl font-bold text-[#5D4037]">Daily Check-in</h1>
            <p className="text-[#5D4037] opacity-60 text-sm">Logging your activity confirms you are safe.</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {reminders.map(r => (
                <div key={r.id} onClick={() => toggleReminder(r.id)} className={`
                    p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4
                    ${r.completed ? 'bg-[#66BB6A]/10 border-[#66BB6A]' : 'bg-white border-[#FFD180] shadow-sm'}
                `}>
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors
                        ${r.completed ? 'bg-[#66BB6A]' : 'bg-[#FFD180]'}
                    `}>
                        {r.completed && '✓'}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-bold ${r.completed ? 'text-[#66BB6A]' : 'text-[#5D4037]'}`}>{r.text}</h3>
                        <p className="text-xs text-[#5D4037] opacity-50">{r.time}</p>
                    </div>
                    <div className="text-2xl">
                        {r.type === 'MEDICINE' ? '💊' : r.type === 'WATER' ? '💧' : '🥗'}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="p-6">
             <div className="bg-[#FFAB91]/20 p-4 rounded-xl flex items-start gap-3 border border-[#FFAB91]/30">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-[#5D4037] leading-relaxed">
                    <strong>Tip:</strong> You can also just say "I took my medicine" and the AI will mark it for you.
                </p>
             </div>
        </div>
    </div>
  );
};