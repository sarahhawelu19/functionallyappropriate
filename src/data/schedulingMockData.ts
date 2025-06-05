export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export type MeetingType = 
  | 'Annual IEP'
  | 'Triennial IEP'
  | '30 Day IEP'
  | 'Amendment IEP'
  | 'Other';

export interface IEPMeeting {
  id: string;
  eventType: 'iep_meeting';
  studentName: string;
  meetingType: MeetingType;
  customMeetingType?: string;
  teamMemberIds: string[];
  date: string;
  time: string;
  durationMinutes: number;
  status: 'scheduled';
  createdByUserId: string;
}

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Miller', role: 'Case Manager' },
  { id: 'tm2', name: 'David Chen', role: 'Teacher' },
  { id: 'tm3', name: 'Linda Kim', role: 'Speech Therapist' },
  { id: 'tm4', name: 'Robert Davis', role: 'Principal (LEA)' },
  { id: 'tm5', name: 'Emily White', role: 'Occupational Therapist' },
  { id: 'tm6', name: 'Michael Brown', role: 'School Psychologist' },
];

export const meetingTypes: MeetingType[] = [
  'Annual IEP',
  'Triennial IEP',
  '30 Day IEP',
  'Amendment IEP',
  'Other',
];