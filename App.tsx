import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SystemStatus, Contact, LocationData, EmergencyType, ViewRole } from './types';
import AudioMonitor from './components/AudioMonitor';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { EmergencyPendingScreen } from './components/screens/EmergencyPendingScreen';
import { EmergencyEscalationScreen } from './components/screens/EmergencyEscalationScreen';
import { SmartReminderScreen } from './components/screens/SmartReminderScreen';
import { TrustedContactScreen } from './components/screens/TrustedContactScreen';
import { LiveLocationScreen } from './components/screens/LiveLocationScreen';

export default function App() {
  // --- Global State ---
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [activeView, setActiveView] = useState<'DASHBOARD' | 'REMINDERS' | 'MAP'>('DASHBOARD');
  const [userRole, setUserRole] = useState<ViewRole>('USER'); // Simulation Toggle
  
  // Default to NYC coordinates for a nice initial map view instead of ocean
  const [location, setLocation] = useState<LocationData>({ 
      latitude: 40.7128, 
      longitude: -74.0060, 
      address: "123 Maple Ave, Springfield" 
  });
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Alex (Husband)', role: 'Husband', status: 'Unknown', phone: '123-456-7890' },
    { id: '2', name: 'Dr. Sarah', role: 'Doctor', status: 'Unknown', phone: '987-654-3210' },
  ]);
  
  // Settings
  const [escalationDelay, setEscalationDelay] = useState(45); // Default 45 seconds
  
  const [pendingTimer, setPendingTimer] = useState(escalationDelay);
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // --- Logic Refs ---
  // Fix: Replaced NodeJS.Timeout with any to resolve "Cannot find namespace 'NodeJS'" error in browser environment
  const timerRef = useRef<any>(null);

  // --- Initialization ---
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
      alert("Microphone and Location permissions are required for the safety system.");
    }
  };

  // --- State Transitions ---

  const triggerPending = useCallback((type: EmergencyType) => {
    if (status === SystemStatus.EMERGENCY) return; // Already escalated
    console.log("Triggering Pending State:", type);
    setStatus(SystemStatus.PENDING);
    setEmergencyType(type);
    setPendingTimer(escalationDelay); // Reset to configured delay
  }, [status, escalationDelay]);

  const triggerEscalation = useCallback(() => {
    setStatus(SystemStatus.EMERGENCY);
    if (timerRef.current) clearInterval(timerRef.current);
    // Logic: Update contacts to notify them
    setContacts(prev => prev.map(c => ({...c, status: 'Danger'})));
  }, []);

  const resolveEmergency = useCallback((reason: string) => {
    console.log("Resolving Emergency:", reason);
    setStatus(SystemStatus.MONITORING);
    setEmergencyType(null);
    if (timerRef.current) clearInterval(timerRef.current);
    // Reset contacts
    setContacts(prev => prev.map(c => ({...c, status: 'Unknown'})));
    setActiveView('DASHBOARD');
  }, []);

  // --- Timer Logic for Pending State ---
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


  // --- View Rendering Logic ---

  const renderContent = () => {
    // 1. Uninitialized
    if (status === SystemStatus.IDLE) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2]">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-sm w-full text-center">
                <div className="w-24 h-24 bg-[#FFAB91] rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                    🤰
                </div>
                <h1 className="text-3xl font-bold text-[#5D4037] mb-2 tracking-tight">MamaGuard AI</h1>
                <p className="text-[#5D4037] opacity-70 mb-8 leading-relaxed">Intelligent distress detection and safety monitoring for pregnancy.</p>
                <button 
                    onClick={startSystem}
                    className="w-full bg-[#5D4037] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#8D6E63] transition-all active:scale-95 text-lg"
                >
                    Activate Protection
                </button>
            </div>
        </div>
      );
    }

    // 2. Trusted Contact View (Override)
    if (userRole === 'CONTACT') {
        return (
            <TrustedContactScreen 
                contactName="Alex"
                targetName="Maria"
                targetPhone="555-0199"
                systemStatus={status}
                location={location}
                lastUpdate="Just now"
                pendingSeconds={pendingTimer}
                onConfirmSafe={() => resolveEmergency("Confirmed Safe by Contact")}
                onConfirmDanger={triggerEscalation}
            />
        );
    }

    // 3. User Views based on Status
    if (status === SystemStatus.EMERGENCY) {
        return (
            <EmergencyEscalationScreen 
                reason={emergencyType}
                contacts={contacts}
                location={location}
                onResolve={() => resolveEmergency("Manual Cancellation")}
            />
        );
    }

    if (status === SystemStatus.PENDING) {
        return (
            <EmergencyPendingScreen 
                reason={emergencyType}
                countdown={pendingTimer}
                onCancel={() => resolveEmergency("Manual Safe")}
                onConfirm={triggerEscalation}
            />
        );
    }

    // 4. User Views based on Navigation (Monitoring State)
    switch(activeView) {
        case 'REMINDERS':
            return <SmartReminderScreen onBack={() => setActiveView('DASHBOARD')} onConfirmSafety={() => {}} />;
        case 'MAP':
            return <LiveLocationScreen location={location} onBack={() => setActiveView('DASHBOARD')} />;
        default:
            return (
                <DashboardScreen 
                    status={status}
                    isMicActive={hasPermission}
                    onManualHelp={() => triggerPending('Manual')}
                    onOpenReminders={() => setActiveView('REMINDERS')}
                    onViewMap={() => setActiveView('MAP')}
                    contacts={contacts}
                    escalationDelay={escalationDelay}
                    setEscalationDelay={setEscalationDelay}
                />
            );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FFF3E0] relative font-sans">
      
      {/* Simulation/Role Switcher Bar (Top overlay for demo) */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
         <div className="bg-[#5D4037]/90 text-white px-4 py-1 rounded-b-xl text-[10px] uppercase font-bold tracking-widest pointer-events-auto cursor-pointer flex gap-4 shadow-lg backdrop-blur-md">
            <span 
                className={userRole === 'USER' ? 'text-[#FFAB91]' : 'text-gray-400 hover:text-white'}
                onClick={() => setUserRole('USER')}
            >
                👩 Pregnant Mom View
            </span>
            <span className="text-gray-600">|</span>
            <span 
                className={userRole === 'CONTACT' ? 'text-[#66BB6A]' : 'text-gray-400 hover:text-white'}
                onClick={() => setUserRole('CONTACT')}
            >
                👨 Husband View
            </span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full max-w-md mx-auto bg-[#FFF3E0] shadow-2xl overflow-hidden relative">
          {renderContent()}
      </div>

      {/* Background Audio Monitor (Always Active if Monitoring) */}
      <AudioMonitor 
        status={status} 
        isMicActive={hasPermission}
        onDistressDetected={(type) => {
            // Only trigger if we are in monitoring status and looking at User view (or background)
            if (status === SystemStatus.MONITORING) triggerPending(type);
        }} 
        onSafetyVerified={(reason) => {
             // Voice verification
             console.log("Voice Safety Verified:", reason);
             // Optional: Show a toast notification
        }}
      />
    </div>
  );
}