import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IEPMeeting, MeetingParticipantRSVP } from '../data/schedulingMockData';

interface MeetingsContextType {
  iepMeetings: IEPMeeting[];
  setIepMeetings: React.Dispatch<React.SetStateAction<IEPMeeting[]>>;
  updateMeetingRSVP: (meetingId: string, participantId: string, newStatus: MeetingParticipantRSVP['status'], note?: string) => void;
  addMeeting: (meeting: IEPMeeting) => void;
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

  return (
    <MeetingsContext.Provider value={{ 
      iepMeetings, 
      setIepMeetings, 
      updateMeetingRSVP, 
      addMeeting 
    }}>
      {children}
    </MeetingsContext.Provider>
  );
};