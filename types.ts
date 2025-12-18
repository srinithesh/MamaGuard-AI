export enum SystemStatus {
  IDLE = 'IDLE',          // System off
  MONITORING = 'MONITORING',    // Listening for distress
  PENDING = 'PENDING',       // Distress detected, verification window
  EMERGENCY = 'EMERGENCY',     // Confirmed emergency, escalation active
  RESOLVED = 'RESOLVED'       // Incident cleared
}

export type ViewRole = 'USER' | 'CONTACT'; // Role-based view switching

export interface Contact {
  id: string;
  name: string;
  // Added 'Mother' role to fix type error in App.tsx line 26
  role: 'Husband' | 'Doctor' | 'Parent' | 'Mother';
  status: 'Unknown' | 'Safe' | 'Danger' | 'EnRoute';
  phone: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Hospital {
  name: string;
  address: string;
  distance?: string;
}

export type EmergencyType = 'Voice' | 'Fall' | 'Manual' | null;

export interface Reminder {
  id: string;
  text: string;
  description: string;
  timeLabel: string;
  completed: boolean;
  type: 'MEDICINE' | 'FOOD' | 'WATER' | 'REST' | 'EXERCISE';
}