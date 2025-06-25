import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IEPMeeting, MeetingParticipantRSVP, AlternativeTimeProposal } from '../data/schedulingMockData';

interface MeetingsContextType {
  iepMeetings: IEPMeeting[];
  setIepMeetings: React.Dispatch<React.SetStateAction<IEPMeeting[]>>;
  updateMeetingRSVP: (meetingId: string, participantId: string, newStatus: MeetingParticipantRSVP['status'], note?: string) => void;
  addMeeting: (meeting: IEPMeeting) => void;
  updateMeeting: (updatedMeeting: IEPMeeting) => void;
  editingMeetingId: string | null;
  setEditingMeetingId: React.Dispatch<React.SetStateAction<string | null>>;
  // Alternative proposal functions
  addAlternativeProposal: (meetingId: string, proposal: AlternativeTimeProposal) => void;
  voteOnAlternative: (meetingId: string, proposalId: string, voterId: string, vote: 'AcceptAlternative' | 'PreferOriginal') => void;
  // Proposing alternative state
  meetingToProposeAlternativeFor: IEPMeeting | null;
  setMeetingToProposeAlternativeFor: React.Dispatch<React.SetStateAction<IEPMeeting | null>>;
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};

interface MeetingsProviderProps {
  children: ReactNode;
}

// Sample initial meeting data to ensure the app has content
const initialMeetings: IEPMeeting[] = [
  {
    id: '1',
    eventType: 'iep_meeting',
    studentId: 's1',
    studentName: 'Leo Gonzalez',
    meetingType: 'Annual IEP',
    teamMemberIds: ['tm1', 'tm2', 'tm3', 'tm4'],
    date: '2025-02-15',
    time: '10:00',
    durationMinutes: 60,
    status: 'scheduled',
    createdByUserId: 'tm1',
    participants: [
      { teamMemberId: 'tm1', status: 'Accepted', respondedAt: '2025-01-10T10:00:00' },
      { teamMemberId: 'tm2', status: 'Accepted', respondedAt: '2025-01-10T11:30:00' },
      { teamMemberId: 'tm3', status: 'Pending' },
      { teamMemberId: 'tm4', status: 'Pending' }
    ]
  },
  {
    id: '2',
    eventType: 'iep_meeting',
    studentId: 's2',
    studentName: 'Mia Patel',
    meetingType: 'Triennial IEP',
    teamMemberIds: ['tm1', 'tm2', 'tm5', 'tm6'],
    date: '2025-02-20',
    time: '13:30',
    durationMinutes: 90,
    status: 'scheduled',
    createdByUserId: 'tm1',
    participants: [
      { teamMemberId: 'tm1', status: 'Accepted', respondedAt: '2025-01-12T09:15:00' },
      { teamMemberId: 'tm2', status: 'Declined', note: 'Have another meeting at this time', respondedAt: '2025-01-12T14:20:00' },
      { teamMemberId: 'tm5', status: 'Accepted', respondedAt: '2025-01-13T10:45:00' },
      { teamMemberId: 'tm6', status: 'Pending' }
    ],
    alternativeProposals: [
      {
        proposalId: '101',
        proposedDate: '2025-02-22',
        proposedTime: '10:00',
        proposedByMemberId: 'tm2',
        proposedAt: '2025-01-12T14:25:00',
        votes: [
          { teamMemberId: 'tm1', vote: 'Pending' },
          { teamMemberId: 'tm2', vote: 'AcceptAlternative', votedAt: '2025-01-12T14:25:00' },
          { teamMemberId: 'tm5', vote: 'Pending' },
          { teamMemberId: 'tm6', vote: 'Pending' }
        ]
      }
    ]
  },
  {
    id: '3',
    eventType: 'iep_meeting',
    studentId: 's3',
    studentName: 'Alex Rodriguez',
    meetingType: 'Amendment IEP',
    teamMemberIds: ['tm1', 'tm3', 'tm4'],
    date: '2025-01-30',
    time: '15:00',
    durationMinutes: 45,
    status: 'scheduled',
    createdByUserId: 'tm3',
    participants: [
      { teamMemberId: 'tm1', status: 'Pending' },
      { teamMemberId: 'tm3', status: 'Accepted', respondedAt: '2025-01-15T08:30:00' },
      { teamMemberId: 'tm4', status: 'Accepted', respondedAt: '2025-01-15T09:45:00' }
    ]
  }
];

export const MeetingsProvider: React.FC<MeetingsProviderProps> = ({ children }) => {
  const [iepMeetings, setIepMeetings] = useState<IEPMeeting[]>(initialMeetings);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  // State for proposing alternative times
  const [meetingToProposeAlternativeFor, setMeetingToProposeAlternativeFor] = useState<IEPMeeting | null>(null);

  const updateMeetingRSVP = (
    meetingId: string, 
    participantId: string, 
    newStatus: MeetingParticipantRSVP['status'], 
    note?: string
  ) => {
    setIepMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === meetingId 
          ? {
              ...meeting,
              participants: meeting.participants.map(p => 
                p.teamMemberId === participantId 
                  ? { 
                      ...p, 
                      status: newStatus, 
                      note: note || p.note,
                      respondedAt: new Date().toISOString()
                    } 
                  : p
              ),
            }
          : meeting
      )
    );
  };

  const addMeeting = (meeting: IEPMeeting) => {
    setIepMeetings(prev => [...prev, meeting]);
  };

  const updateMeeting = (updatedMeeting: IEPMeeting) => {
    setIepMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === updatedMeeting.id 
          ? {
              ...updatedMeeting,
              // Reset all participants to 'Pending' when meeting details change
              participants: updatedMeeting.teamMemberIds.map(teamMemberId => ({
                teamMemberId,
                status: 'Pending' as const,
              })),
            }
          : meeting
      )
    );
  };

  // Add alternative proposal function
  const addAlternativeProposal = (meetingId: string, proposal: AlternativeTimeProposal) => {
    setIepMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === meetingId 
          ? {
              ...meeting,
              alternativeProposals: [...(meeting.alternativeProposals || []), proposal],
            }
          : meeting
      )
    );
  };

  // Vote on alternative proposal function
  const voteOnAlternative = (
    meetingId: string, 
    proposalId: string, 
    voterId: string, 
    vote: 'AcceptAlternative' | 'PreferOriginal'
  ) => {
    setIepMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === meetingId 
          ? {
              ...meeting,
              alternativeProposals: meeting.alternativeProposals?.map(proposal =>
                proposal.proposalId === proposalId
                  ? {
                      ...proposal,
                      votes: proposal.votes.map(v =>
                        v.teamMemberId === voterId
                          ? { ...v, vote, votedAt: new Date().toISOString() }
                          : v
                      ),
                    }
                  : proposal
              ),
              // Update participant RSVP status to indicate they've voted
              participants: meeting.participants.map(p =>
                p.teamMemberId === voterId
                  ? { ...p, status: 'VotedOnAlternative' as const, respondedAt: new Date().toISOString() }
                  : p
              ),
            }
          : meeting
      )
    );
  };

  return (
    <MeetingsContext.Provider value={{ 
      iepMeetings, 
      setIepMeetings, 
      updateMeetingRSVP, 
      addMeeting,
      updateMeeting,
      editingMeetingId,
      setEditingMeetingId,
      // Alternative proposal functions
      addAlternativeProposal,
      voteOnAlternative,
      meetingToProposeAlternativeFor,
      setMeetingToProposeAlternativeFor,
    }}>
      {children}
    </MeetingsContext.Provider>
  );
};