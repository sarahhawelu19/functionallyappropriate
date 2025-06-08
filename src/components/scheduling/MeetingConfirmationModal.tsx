import React from 'react';
import { X, Check, Calendar, Clock, Users, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { IEPMeeting, mockTeamMembers } from '../../data/schedulingMockData';

interface MeetingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvitations: (meeting: IEPMeeting) => void;
  meeting: IEPMeeting | null;
  isEditMode?: boolean; // NEW: Optional prop to indicate edit mode
}

const MeetingConfirmationModal: React.FC<MeetingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSendInvitations,
  meeting,
  isEditMode = false, // NEW: Default to false for backward compatibility
}) => {
  const formatTime = (timeString: string): string => {
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTeamMembers = () => {
    if (!meeting?.teamMemberIds) return [];
    return meeting.teamMemberIds
      .map(id => mockTeamMembers.find(member => member.id === id))
      .filter(Boolean);
  };

  const handleSendInvitations = () => {
    if (meeting) {
      onSendInvitations(meeting);
      onClose();
    }
  };

  if (!isOpen || !meeting) return null;

  const teamMembers = getTeamMembers();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-bg-primary rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full text-white ${isEditMode ? 'bg-gold' : 'bg-green'}`}>
                <Check size={24} />
              </div>
              <h2 className="text-2xl font-medium">
                {isEditMode ? 'Meeting Updated!' : 'Meeting Scheduled!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Success Message */}
            <div className={`mb-6 p-4 bg-opacity-10 border rounded-md ${isEditMode ? 'bg-gold border-gold' : 'bg-green border-green'}`}>
              <p className={`font-medium ${isEditMode ? 'text-gold' : 'text-green'}`}>
                {isEditMode 
                  ? 'The meeting has been updated successfully. Would you like to send updated invitations to the team members?'
                  : 'The meeting has been added to the calendar. Would you like to send out invitations to the team members?'
                }
              </p>
            </div>

            {/* Meeting Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Meeting Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-bg-secondary rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-teal" size={16} />
                    <span className="font-medium">Student</span>
                  </div>
                  <p className="text-lg">{meeting.studentName}</p>
                </div>

                <div className="p-4 bg-bg-secondary rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-teal" size={16} />
                    <span className="font-medium">Meeting Type</span>
                  </div>
                  <p className="text-lg">
                    {meeting.meetingType}
                    {meeting.customMeetingType && ` (${meeting.customMeetingType})`}
                  </p>
                </div>

                <div className="p-4 bg-bg-secondary rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-teal" size={16} />
                    <span className="font-medium">Date</span>
                  </div>
                  <p className="text-lg">{meeting.date && formatDate(meeting.date)}</p>
                </div>

                <div className="p-4 bg-bg-secondary rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-teal" size={16} />
                    <span className="font-medium">Time & Duration</span>
                  </div>
                  <p className="text-lg">
                    {meeting.time && formatTime(meeting.time)} ({meeting.durationMinutes} minutes)
                  </p>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-teal" size={20} />
                  <h4 className="font-medium">Team Members ({teamMembers.length})</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 border border-border rounded-md">
                      <div className="w-10 h-10 bg-teal rounded-full flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-text-secondary">{member.role}</div>
                        <div className="text-xs text-text-secondary">{member.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Preview */}
              <div className="mb-6 p-4 bg-bg-secondary rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-teal" size={16} />
                  <span className="font-medium">Email Invitation Preview</span>
                </div>
                <div className="text-sm text-text-secondary bg-bg-primary p-3 rounded border">
                  <p className="font-medium mb-2">
                    Subject: {isEditMode ? 'UPDATED: ' : ''}IEP Meeting {isEditMode ? 'Update' : 'Invitation'} - {meeting.studentName}
                  </p>
                  <p>
                    {isEditMode 
                      ? `The IEP meeting for ${meeting.studentName} has been updated. New details: ${meeting.meetingType} on ${meeting.date && formatDate(meeting.date)} at ${meeting.time && formatTime(meeting.time)} for ${meeting.durationMinutes} minutes. Please confirm your availability.`
                      : `You are invited to an IEP meeting for ${meeting.studentName} (${meeting.meetingType}) on ${meeting.date && formatDate(meeting.date)} at ${meeting.time && formatTime(meeting.time)} for ${meeting.durationMinutes} minutes.`
                    }
                  </p>
                  <p className="mt-2">
                    {isEditMode 
                      ? 'Please update your RSVP and let us know if you have any conflicts with the new time.'
                      : 'Please RSVP and let us know if you have any conflicts.'
                    }
                  </p>
                </div>
              </div>

              {/* Edit Mode Notice */}
              {isEditMode && (
                <div className="mb-6 p-4 bg-gold bg-opacity-10 border border-gold rounded-md">
                  <h4 className="font-medium text-gold mb-2">Important: Meeting Update Notice</h4>
                  <p className="text-sm text-text-secondary">
                    Since this meeting was updated, all participant RSVP statuses have been reset to "Pending" and they will need to respond again to confirm their availability for the new meeting details.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-border rounded-md hover:bg-bg-secondary transition-colors font-medium"
              >
                Done
              </button>
              <button
                onClick={handleSendInvitations}
                className={`px-6 py-3 text-white rounded-md hover:bg-opacity-90 transition-colors font-medium flex items-center gap-2 ${
                  isEditMode ? 'bg-gold' : 'bg-teal'
                }`}
              >
                <Mail size={20} />
                {isEditMode ? 'Send Updated Invitations' : 'Send Invitations'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingConfirmationModal;