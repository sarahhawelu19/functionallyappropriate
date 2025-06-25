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
  // NEW: Alternative proposal functions
  addAlternativeProposal: (meetingId: string, proposal: AlternativeTimeProposal) => void;
  voteOnAlternative: (meetingId: string, proposalId: string, voterId: string, vote: 'AcceptAlternative' | 'PreferOriginal') => void;
  // NEW: Proposing alternative state
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

export const MeetingsProvider: React.FC<MeetingsProviderProps> = ({ children }) => {
  const [iepMeetings, setIepMeetings] = useState<IEPMeeting[]>([]);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  // NEW: State for proposing alternative times
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

  // NEW: Add alternative proposal function
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

  // NEW: Vote on alternative proposal function
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
      // NEW: Alternative proposal functions
      addAlternativeProposal,
      voteOnAlternative,
      meetingToProposeAlternativeFor,
      setMeetingToProposeAlternativeFor,
    }}>
      {children}
    </MeetingsContext.Provider>
  );
};