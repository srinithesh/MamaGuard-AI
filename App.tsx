import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SystemStatus, Contact, LocationData, EmergencyType, ViewRole } from './types';
import AudioMonitor from './components/AudioMonitor';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { EmergencyPendingScreen } from './components/screens/EmergencyPendingScreen';
import { EmergencyEscalationScreen } from './components/screens/EmergencyEscalationScreen';
import { SmartReminderScreen } from './components/screens/SmartReminderScreen';
import { TrustedContactScreen } from './components/screens/TrustedContactScreen';
import { LiveLocationScreen } from './components/screens/LiveLocationScreen';
import { ContactsScreen } from './components/screens/ContactsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'HOME' | 'REMINDERS' | 'LOCATION' | 'CONTACTS' | 'SETTINGS'>('HOME');
  const [userRole, setUserRole] = useState<ViewRole>('USER');
  
  const [location, setLocation] = useState<LocationData>({ 
      latitude: 40.7128, 
      longitude: -74.0060, 
      address: "123 Maple Street, Brooklyn, NY 11201" 
  });
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Michael Johnson', role: 'Husband', status: 'Unknown', phone: '+1 (555) 234-5678' },
    { id: '2', name: 'Emily Davis', role: 'Mother', status: 'Unknown', phone: '+1 (555) 345-6789' },
    { id: '3', name: 'Dr. Amanda Wilson', role: 'Doctor', status: 'Unknown', phone: '+1 (555) 456-7890' },
  ]);
  
  const [escalationDelay, setEscalationDelay] = useState(45);
  const [pendingTimer, setPendingTimer] = useState(escalationDelay);
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const timerRef = useRef<any>(null);

  const startSystem = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
        (err) => console.error(err)
      );
      setHasPermission(true);
      setStatus(SystemStatus.MONITORING);
    } catch (e) {
      alert("Permissions are required for safety.");
    }
  };

  const triggerPending = useCallback((type: EmergencyType) => {
    if (status === SystemStatus.EMERGENCY) return;
    setStatus(SystemStatus.PENDING);
    setEmergencyType(type);
    setPendingTimer(escalationDelay);
  }, [status, escalationDelay]);

  const triggerEscalation = useCallback(() => {
    setStatus(SystemStatus.EMERGENCY);
    if (timerRef.current) clearInterval(timerRef.current);
    setContacts(prev => prev.map(c => ({...c, status: 'Danger'})));
  }, []);

  const resolveEmergency = useCallback((reason: string) => {
    setStatus(SystemStatus.MONITORING);
    setEmergencyType(null);
    if (timerRef.current) clearInterval(timerRef.current);
    setContacts(prev => prev.map(c => ({...c, status: 'Unknown'})));
    setActiveTab('HOME');
  }, []);

  useEffect(() => {
    if (status === SystemStatus.PENDING) {
        timerRef.current = setInterval(() => {
            setPendingTimer((prev) => {
                if (prev <= 1) {
                    triggerEscalation();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); }
  }, [status, triggerEscalation]);

  const renderContent = () => {
    if (status === SystemStatus.IDLE) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-[#FFF3E0]">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-sm w-full">
                <div className="w-20 h-20 bg-salmon rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">🤰</div>
                <h1 className="text-3xl font-bold text-brown mb-2">MotherGuard</h1>
                <p className="text-brown opacity-70 mb-8 leading-relaxed">Safety monitoring for your journey.</p>
                <button onClick={startSystem} className="w-full bg-brown text-white font-bold py-4 rounded-2xl shadow-lg">Activate Now</button>
            </div>
        </div>
      );
    }

    if (userRole === 'CONTACT') {
        return (
            <TrustedContactScreen 
                contactName="Alex"
                targetName="Sarah"
                systemStatus={status}
                location={location}
                lastUpdate="Just now"
                pendingSeconds={pendingTimer}
                onConfirmSafe={() => resolveEmergency("Safe")}
                onConfirmDanger={triggerEscalation}
            />
        );
    }

    if (status === SystemStatus.EMERGENCY) {
        return <EmergencyEscalationScreen reason={emergencyType} contacts={contacts} location={location} onResolve={() => resolveEmergency("Cancel")} />;
    }

    if (status === SystemStatus.PENDING) {
        return <EmergencyPendingScreen reason={emergencyType} countdown={pendingTimer} onCancel={() => resolveEmergency("Safe")} onConfirm={triggerEscalation} />;
    }

    switch(activeTab) {
        case 'REMINDERS':
            return <SmartReminderScreen onBack={() => setActiveTab('HOME')} onConfirmSafety={() => {}} />;
        case 'LOCATION':
            return <LiveLocationScreen location={location} onBack={() => setActiveTab('HOME')} />;
        case 'CONTACTS':
            return <ContactsScreen onBack={() => setActiveTab('HOME')} />;
        case 'SETTINGS':
            return <SettingsScreen onBack={() => setActiveTab('HOME')} />;
        default:
            return (
                <DashboardScreen 
                    status={status}
                    isMicActive={hasPermission}
                    onManualHelp={() => triggerPending('Manual')}
                    onOpenReminders={() => setActiveTab('REMINDERS')}
                    onViewMap={() => setActiveTab('LOCATION')}
                    contacts={contacts}
                    escalationDelay={escalationDelay}
                    setEscalationDelay={setEscalationDelay}
                />
            );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FFF3E0] relative font-sans">
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
         <div className="bg-brown/90 text-white px-4 py-1 rounded-b-xl text-[10px] uppercase font-bold tracking-widest pointer-events-auto flex gap-4 shadow-lg backdrop-blur-md">
            <span className={userRole === 'USER' ? 'text-salmon' : 'opacity-50'} onClick={() => setUserRole('USER')}>Mother View</span>
            <span className="opacity-20">|</span>
            <span className={userRole === 'CONTACT' ? 'text-green-400' : 'opacity-50'} onClick={() => setUserRole('CONTACT')}>Husband View</span>
         </div>
      </div>

      <div className="h-full max-w-md mx-auto bg-[#FFF3E0] shadow-2xl flex flex-col relative">
          <div className="flex-1 overflow-hidden relative">
            {renderContent()}
          </div>
          
          {userRole === 'USER' && status === SystemStatus.MONITORING && (
            <div className="bg-white border-t border-peach-200 pb-safe px-4 pt-3 flex justify-between items-center z-50">
               {[
                 { id: 'HOME', icon: '🏠', label: 'Home' },
                 { id: 'REMINDERS', icon: '🔔', label: 'Reminders' },
                 { id: 'LOCATION', icon: '📍', label: 'Location' },
                 { id: 'CONTACTS', icon: '👥', label: 'Contacts' },
                 { id: 'SETTINGS', icon: '⚙️', label: 'Settings' }
               ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${activeTab === tab.id ? 'text-salmon scale-105' : 'text-brown opacity-40'}`}
                 >
                   <span className="text-xl">{tab.icon}</span>
                   <span className="text-[10px] font-bold">{tab.label}</span>
                   {activeTab === tab.id && <div className="w-1 h-1 bg-salmon rounded-full"></div>}
                 </button>
               ))}
            </div>
          )}
      </div>

      <AudioMonitor status={status} isMicActive={hasPermission} onDistressDetected={triggerPending} onSafetyVerified={() => {}} />
    </div>
  );
}