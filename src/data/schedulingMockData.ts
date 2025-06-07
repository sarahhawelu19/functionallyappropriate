// src/data/schedulingMockData.ts

// Blueprints for our team members
export interface TeamMember {
  id: string;
  name: string;
  role: string; // e.g., 'Case Manager', 'Teacher', 'Speech Therapist', 'Principal (LEA)'
  email: string;
}

// Blueprints for our students
export interface StudentProfile {
  id: string;
  name: string;
  caseManagerId: string; // Links to a TeamMember (Case Manager)
  serviceAvailability: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    slots: { startTime: string; endTime: string }[];
  }[];
}

// Blueprints for district-wide blackout dates
export interface DistrictBlackout {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: 'holiday' | 'pd_day' | 'break' | 'other';
  notes?: string;
}

// Blueprints for individual staff member's unavailability
export interface IndividualBlackout {
  id: string;
  userId: string; // Links to a TeamMember
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  reason: 'PTO' | 'meeting' | 'appointment' | 'other';
  notes?: string;
}

// Type for different IEP Meeting types
export type MeetingType = 'Annual IEP' | 'Triennial IEP' | '30 Day IEP' | 'Amendment IEP' | 'Other';

export interface IEPMeeting {
  id: string;
  eventType: 'iep_meeting';
  studentId: string;
  studentName: string;
  meetingType: MeetingType;
  customMeetingType?: string;
  teamMemberIds: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  status: 'pending_scheduling' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdByUserId: string;
}

export interface ServiceSession {
  id: string;
  eventType: 'service_session';
  studentId: string;
  studentName: string;
  providerId: string;
  providerName: string;
  serviceType: 'Speech' | 'Occupational Therapy' | 'Vision' | 'Behavior' | 'Counseling' | 'Other';
  customServiceType?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationMinutes: number;
  status: 'scheduled' | 'provided_full' | 'no_session_makeup_needed' | 'no_session_no_makeup_needed' | 'other_see_notes';
  trackingNotes?: string;
  isRecurring: boolean;
}

export type CalendarEvent = IEPMeeting | ServiceSession | DistrictBlackout | IndividualBlackout;

// --- MOCK DATA EXAMPLES ---

// Array of meeting type strings for dropdowns
export const meetingTypes: MeetingType[] = [
  'Annual IEP',
  'Triennial IEP',
  '30 Day IEP',
  'Amendment IEP',
  'Other',
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Miller (You)', role: 'Case Manager', email: 'sarah.miller@example.com' },
  { id: 'tm2', name: 'David Chen', role: 'Teacher', email: 'david.chen@example.com' },
  { id: 'tm3', name: 'Linda Kim', role: 'Speech Therapist', email: 'linda.kim@example.com' },
  { id: 'tm4', name: 'Robert Davis', role: 'Principal (LEA)', email: 'robert.davis@example.com' },
  { id: 'tm5', name: 'Emily White', role: 'Occupational Therapist', email: 'emily.white@example.com' },
  { id: 'tm6', name: 'Michael Brown', role: 'School Psychologist', email: 'michael.brown@example.com' },
];

export const mockStudents: StudentProfile[] = [
  {
    id: 's1',
    name: 'Leo Gonzalez',
    caseManagerId: 'tm1',
    serviceAvailability: [
      { day: 'Monday', slots: [{ startTime: '09:00', endTime: '10:00' }, { startTime: '13:00', endTime: '13:45' }] },
      { day: 'Wednesday', slots: [{ startTime: '10:30', endTime: '11:30' }] },
      { day: 'Friday', slots: [{ startTime: '14:00', endTime: '15:00' }] },
    ],
  },
  {
    id: 's2',
    name: 'Mia Patel',
    caseManagerId: 'tm1',
    serviceAvailability: [
      { day: 'Tuesday', slots: [{ startTime: '10:00', endTime: '11:00' }] },
      { day: 'Thursday', slots: [{ startTime: '11:00', endTime: '11:45' }, { startTime: '14:30', endTime: '15:15' }] },
    ],
  },
];

export const mockDistrictBlackouts: DistrictBlackout[] = [
    {id: 'db1', title: 'Winter Break', startDate: '2024-12-23', endDate: '2025-01-03', type: 'break'},
    {id: 'db2', title: 'Staff PD Day', startDate: '2025-01-20', endDate: '2025-01-20', type: 'pd_day'},
];

export const mockIndividualBlackouts: IndividualBlackout[] = [
    {id: 'ib1', userId: 'tm1', title: 'Doctor Appointment', startDate: '2024-11-15', endDate: '2024-11-15', startTime: '10:00', endTime: '11:00', reason: 'appointment'},
    {id: 'ib2', userId: 'tm3', title: 'Conference', startDate: '2024-11-20', endDate: '2024-11-22', reason: 'other', notes: 'Attending SLP Conference'},
];

export const mockIEPMeetings: IEPMeeting[] = [];

export const mockServiceSessions: ServiceSession[] = [];