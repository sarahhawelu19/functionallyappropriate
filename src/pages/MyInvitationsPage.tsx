import React, { useState } from 'react';
import { Mail, Calendar, Clock, User, Check, X, MessageSquare, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useMeetings } from '../context/MeetingsContext';
import { mockTeamMembers, MeetingParticipantRSVP } from '../data/schedulingMockData';

const MyInvitationsPage: React.FC = () => {
  // Simulate current user - can be changed to test different perspectives
  const currentUserId = 'tm2'; // David Chen (Teacher) - change to 'tm1', 'tm3', etc. to test different users
  const currentUser = mockTeamMembers.find(member => member.id === currentUserId);
  
  const { iepMeetings, updateMeetingRSVP } = useMeetings();
  const [declineNote, setDeclineNote] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);

  // Filter meetings where current user is a participant
  const myInvitations = iepMeetings.filter(meeting => 
    meeting.teamMemberIds.includes(currentUserId) && 
    meeting.status === 'scheduled'
  );

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

  const getCurrentRSVPStatus = (meeting: any): MeetingParticipantRSVP | undefined => {
    return meeting.participants?.find((p: MeetingParticipantRSVP) => p.teamMemberId === currentUserId);
  };

  const getStatusIcon = (status: MeetingParticipantRSVP['status']) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="text-green\" size={20} />;
      case 'Declined':
        return <XCircle className="text-red-500" size={20} />;
      case 'ProposedNewTime':
        return <ClockIcon className="text-gold" size={20} />;
      default:
        return <AlertCircle className="text-text-secondary" size={20} />;
    }
  };

  const getStatusColor = (status: MeetingParticipantRSVP['status']) => {
    switch (status) {
      case 'Accepted':
        return 'text-green bg-green bg-opacity-10 border-green';
      case 'Declined':
        return 'text-red-500 bg-red-500 bg-opacity-10 border-red-500';
      case 'ProposedNewTime':
        return 'text-gold bg-gold bg-opacity-10 border-gold';
      default:
        return 'text-text-secondary bg-bg-secondary border-border';
    }
  };

  const handleAccept = (meetingId: string) => {
    updateMeetingRSVP(meetingId, currentUserId, 'Accepted');
  };

  const handleDecline = (meetingId: string) => {
    setShowDeclineModal(meetingId);
  };

  const confirmDecline = (meetingId: string) => {
    updateMeetingRSVP(meetingId, currentUserId, 'Declined', declineNote);
    setShowDeclineModal(null);
    setDeclineNote('');
  };

  const handleProposeNewTime = (meetingId: string) => {
    // For now, just mark as "Proposed New Time" - functionality to be added later
    updateMeetingRSVP(meetingId, currentUserId, 'ProposedNewTime', 'Requested alternative time');
  };

  const getOtherParticipants = (meeting: any) => {
    return meeting.teamMemberIds
      .filter((id: string) => id !== currentUserId)
      .map((id: string) => mockTeamMembers.find(member => member.id === id))
      .filter(Boolean);
  };

  const getResponseSummary = (meeting: any) => {
    const participants = meeting.participants || [];
    const accepted = participants.filter((p: MeetingParticipantRSVP) => p.status === 'Accepted').length;
    const declined = participants.filter((p: MeetingParticipantRSVP) => p.status === 'Declined').length;
    const pending = participants.filter((p: MeetingParticipantRSVP) => p.status === 'Pending').length;
    const total = participants.length;
    
    return { accepted, declined, pending, total };
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium">My Meeting Invitations</h1>
          <p className="text-text-secondary mt-1">
            Viewing as: <span className="font-medium text-teal">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="text-teal" size={20} />
          <span className="font-medium">{myInvitations.length} invitation{myInvitations.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {myInvitations.length > 0 ? (
        <div className="space-y-6">
          {myInvitations.map(meeting => {
            const rsvpStatus = getCurrentRSVPStatus(meeting);
            const otherParticipants = getOtherParticipants(meeting);
            const responseSummary = getResponseSummary(meeting);
            
            return (
              <div key={meeting.id} className="card border-l-4 border-l-teal">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Meeting Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium mb-2">
                          {meeting.meetingType} - {meeting.studentName}
                        </h3>
                        {meeting.customMeetingType && (
                          <p className="text-sm text-text-secondary mb-2">
                            Custom Type: {meeting.customMeetingType}
                          </p>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(rsvpStatus?.status || 'Pending')}`}>
                        {getStatusIcon(rsvpStatus?.status || 'Pending')}
                        {rsvpStatus?.status || 'Pending'}
                      </div>
                    </div>

                    {/* Meeting Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-teal" size={16} />
                        <div>
                          <div className="font-medium">{meeting.date && formatDate(meeting.date)}</div>
                          <div className="text-sm text-text-secondary">Meeting Date</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="text-teal" size={16} />
                        <div>
                          <div className="font-medium">
                            {meeting.time && formatTime(meeting.time)} ({meeting.durationMinutes} min)
                          </div>
                          <div className="text-sm text-text-secondary">Time & Duration</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="text-teal" size={16} />
                        <div>
                          <div className="font-medium">{meeting.teamMemberIds.length} participants</div>
                          <div className="text-sm text-text-secondary">Team Size</div>
                        </div>
                      </div>
                    </div>

                    {/* Other Participants */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Other Participants:</h4>
                      <div className="flex flex-wrap gap-2">
                        {otherParticipants.map(participant => (
                          <span key={participant.id} className="px-2 py-1 bg-bg-secondary rounded-md text-sm">
                            {participant.name} ({participant.role})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Response Summary */}
                    <div className="mb-4 p-3 bg-bg-secondary rounded-md">
                      <h4 className="font-medium mb-2">Response Summary:</h4>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="text-green" size={14} />
                          {responseSummary.accepted} Accepted
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="text-red-500" size={14} />
                          {responseSummary.declined} Declined
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="text-text-secondary" size={14} />
                          {responseSummary.pending} Pending
                        </span>
                      </div>
                    </div>

                    {/* Show decline note if user declined */}
                    {rsvpStatus?.status === 'Declined' && rsvpStatus.note && (
                      <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-md">
                        <h4 className="font-medium text-red-500 mb-1">Your Decline Reason:</h4>
                        <p className="text-sm">{rsvpStatus.note}</p>
                      </div>
                    )}
                  </div>

                  {/* RSVP Actions */}
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-bg-secondary p-4 rounded-md">
                      <h4 className="font-medium mb-3">Your Response:</h4>
                      
                      {rsvpStatus?.status === 'Pending' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAccept(meeting.id)}
                            className="w-full btn bg-green text-white hover:bg-opacity-90 flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Accept
                          </button>
                          
                          <button
                            onClick={() => handleDecline(meeting.id)}
                            className="w-full btn border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 flex items-center justify-center gap-2"
                          >
                            <X size={16} />
                            Decline
                          </button>
                          
                          <button
                            onClick={() => handleProposeNewTime(meeting.id)}
                            className="w-full btn border border-gold text-gold hover:bg-gold hover:bg-opacity-10 flex items-center justify-center gap-2"
                          >
                            <Clock size={16} />
                            Propose New Time
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${getStatusColor(rsvpStatus?.status || 'Pending')}`}>
                            {getStatusIcon(rsvpStatus?.status || 'Pending')}
                            <span className="font-medium">{rsvpStatus?.status}</span>
                          </div>
                          
                          {rsvpStatus?.respondedAt && (
                            <p className="text-xs text-text-secondary mt-2">
                              Responded: {format(new Date(rsvpStatus.respondedAt), 'MMM d, yyyy h:mm a')}
                            </p>
                          )}
                          
                          <div className="mt-3 space-y-1">
                            <button
                              onClick={() => handleAccept(meeting.id)}
                              className="w-full btn-sm border border-border text-text-secondary hover:border-green hover:text-green text-xs"
                            >
                              Change to Accept
                            </button>
                            <button
                              onClick={() => handleDecline(meeting.id)}
                              className="w-full btn-sm border border-border text-text-secondary hover:border-red-500 hover:text-red-500 text-xs"
                            >
                              Change to Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Mail size={64} className="mx-auto mb-4 text-text-secondary opacity-30" />
          <h2 className="text-xl font-medium mb-2">No Meeting Invitations</h2>
          <p className="text-text-secondary">
            You don't have any pending meeting invitations at this time.
          </p>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeclineModal(null)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-bg-primary rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-red-500" size={20} />
                  <h3 className="text-lg font-medium">Decline Meeting</h3>
                </div>
                <button
                  onClick={() => setShowDeclineModal(null)}
                  className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4">
                <p className="text-text-secondary mb-4">
                  Please provide a reason for declining this meeting invitation (optional):
                </p>
                
                <textarea
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                  placeholder="e.g., Schedule conflict, prior commitment, etc."
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowDeclineModal(null)}
                    className="btn border border-border hover:bg-bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmDecline(showDeclineModal)}
                    className="btn bg-red-500 text-white hover:bg-opacity-90"
                  >
                    Decline Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvitationsPage;