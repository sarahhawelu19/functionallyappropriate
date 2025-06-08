import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Mail, User, Crown, Edit, Trash2, Check, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { IEPMeeting, mockTeamMembers, MeetingParticipantRSVP } from '../../data/schedulingMockData';

interface ViewMeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: IEPMeeting | null;
  currentUserId: string;
  onEdit: (meeting: IEPMeeting) => void;
  onCancelMeeting: (meetingId: string) => void;
  onAccept: (meetingId: string) => void;
  onDecline: (meetingId: string) => void;
  onProposeNewTime: (meeting: IEPMeeting) => void;
}

const ViewMeetingDetailsModal: React.FC<ViewMeetingDetailsModalProps> = ({
  isOpen,
  onClose,
  meeting,
  currentUserId,
  onEdit,
  onCancelMeeting,
  onAccept,
  onDecline,
  onProposeNewTime,
}) => {
  const [showDeclineNote, setShowDeclineNote] = useState(false);
  const [declineNote, setDeclineNote] = useState('');

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

  const getCurrentRSVPStatus = (): MeetingParticipantRSVP | undefined => {
    return meeting?.participants?.find(p => p.teamMemberId === currentUserId);
  };

  const getResponseSummary = () => {
    const participants = meeting?.participants || [];
    const accepted = participants.filter(p => p.status === 'Accepted').length;
    const declined = participants.filter(p => p.status === 'Declined').length;
    const pending = participants.filter(p => p.status === 'Pending').length;
    const proposed = participants.filter(p => p.status === 'ProposedNewTime').length;
    
    return { accepted, declined, pending, proposed, total: participants.length };
  };

  const isOrganizer = (): boolean => {
    return meeting?.createdByUserId === currentUserId;
  };

  const handleDeclineWithNote = () => {
    if (meeting) {
      onDecline(meeting.id);
      // Note: The actual decline note handling would be passed through the onDecline callback
      // For now, we'll just close the modal
      setShowDeclineNote(false);
      setDeclineNote('');
      onClose();
    }
  };

  const handleEdit = () => {
    if (meeting) {
      onEdit(meeting);
      onClose();
    }
  };

  const handleCancel = () => {
    if (meeting && confirm('Are you sure you want to cancel this meeting? This action cannot be undone.')) {
      onCancelMeeting(meeting.id);
      onClose();
    }
  };

  const handleAcceptMeeting = () => {
    if (meeting) {
      onAccept(meeting.id);
      onClose();
    }
  };

  const handleProposeTime = () => {
    if (meeting) {
      onProposeNewTime(meeting);
      onClose();
    }
  };

  if (!isOpen || !meeting) return null;

  const teamMembers = getTeamMembers();
  const currentRSVP = getCurrentRSVPStatus();
  const responseSummary = getResponseSummary();
  const userIsOrganizer = isOrganizer();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-bg-primary rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-bg-primary z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full text-white ${userIsOrganizer ? 'bg-gold' : 'bg-teal'}`}>
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-medium">Meeting Details</h2>
                <p className="text-text-secondary">
                  {userIsOrganizer ? 'You organized this meeting' : 'Meeting invitation'}
                </p>
              </div>
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
            {/* Meeting Header */}
            <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-medium">
                      {meeting.meetingType} - {meeting.studentName}
                    </h3>
                    {userIsOrganizer && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gold bg-opacity-10 border border-gold rounded-full text-xs font-medium text-gold">
                        <Crown size={12} />
                        Organizer
                      </div>
                    )}
                  </div>
                  {meeting.customMeetingType && (
                    <p className="text-text-secondary">
                      Custom Type: {meeting.customMeetingType}
                    </p>
                  )}
                </div>
                
                {!userIsOrganizer && currentRSVP && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${
                    currentRSVP.status === 'Accepted' ? 'text-green bg-green bg-opacity-10 border-green' :
                    currentRSVP.status === 'Declined' ? 'text-red-500 bg-red-500 bg-opacity-10 border-red-500' :
                    currentRSVP.status === 'ProposedNewTime' ? 'text-gold bg-gold bg-opacity-10 border-gold' :
                    'text-text-secondary bg-bg-secondary border-border'
                  }`}>
                    {currentRSVP.status === 'Accepted' && <Check size={16} />}
                    {currentRSVP.status === 'Declined' && <XCircle size={16} />}
                    {currentRSVP.status === 'ProposedNewTime' && <Clock size={16} />}
                    {currentRSVP.status}
                  </div>
                )}
              </div>

              {/* Meeting Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-teal" size={20} />
                  <div>
                    <div className="font-medium">{meeting.date && formatDate(meeting.date)}</div>
                    <div className="text-sm text-text-secondary">Meeting Date</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="text-teal" size={20} />
                  <div>
                    <div className="font-medium">
                      {meeting.time && formatTime(meeting.time)} ({meeting.durationMinutes} min)
                    </div>
                    <div className="text-sm text-text-secondary">Time & Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="text-teal" size={20} />
                  <div>
                    <div className="font-medium">{meeting.teamMemberIds.length} participants</div>
                    <div className="text-sm text-text-secondary">Team Size</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Members & Responses */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users className="text-teal" size={20} />
                    Team Members ({teamMembers.length})
                  </h4>
                  <div className="space-y-3">
                    {teamMembers.map(member => {
                      const memberRSVP = meeting.participants?.find(p => p.teamMemberId === member.id);
                      const isCurrentUser = member.id === currentUserId;
                      
                      return (
                        <div key={member.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                          isCurrentUser ? 'border-teal bg-teal bg-opacity-5' : 'border-border'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                              isCurrentUser ? 'bg-teal' : 'bg-gray-500'
                            }`}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">
                                {member.name}
                                {isCurrentUser && <span className="text-teal ml-1">(You)</span>}
                                {member.id === meeting.createdByUserId && (
                                  <span className="text-gold ml-1">(Organizer)</span>
                                )}
                              </div>
                              <div className="text-sm text-text-secondary">{member.role}</div>
                              <div className="text-xs text-text-secondary">{member.email}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              memberRSVP?.status === 'Accepted' ? 'text-green bg-green bg-opacity-10' :
                              memberRSVP?.status === 'Declined' ? 'text-red-500 bg-red-500 bg-opacity-10' :
                              memberRSVP?.status === 'ProposedNewTime' ? 'text-gold bg-gold bg-opacity-10' :
                              'text-text-secondary bg-bg-secondary'
                            }`}>
                              {memberRSVP?.status === 'Accepted' && <Check size={12} />}
                              {memberRSVP?.status === 'Declined' && <XCircle size={12} />}
                              {memberRSVP?.status === 'ProposedNewTime' && <Clock size={12} />}
                              {memberRSVP?.status || 'Pending'}
                            </div>
                            {memberRSVP?.respondedAt && (
                              <div className="text-xs text-text-secondary mt-1">
                                {format(new Date(memberRSVP.respondedAt), 'MMM d, h:mm a')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Response Summary */}
                <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
                  <h4 className="font-medium mb-3">Response Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="text-green" size={16} />
                      <span className="font-medium">{responseSummary.accepted}</span>
                      <span className="text-text-secondary">Accepted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="text-red-500" size={16} />
                      <span className="font-medium">{responseSummary.declined}</span>
                      <span className="text-text-secondary">Declined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-text-secondary" size={16} />
                      <span className="font-medium">{responseSummary.pending}</span>
                      <span className="text-text-secondary">Pending</span>
                    </div>
                    {responseSummary.proposed > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="text-gold" size={16} />
                        <span className="font-medium">{responseSummary.proposed}</span>
                        <span className="text-text-secondary">Proposed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-text-secondary">
                      Response Rate: {Math.round(((responseSummary.accepted + responseSummary.declined + responseSummary.proposed) / responseSummary.total) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Show decline note if current user declined */}
                {!userIsOrganizer && currentRSVP?.status === 'Declined' && currentRSVP.note && (
                  <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                    <h4 className="font-medium text-red-500 mb-2">Your Decline Reason:</h4>
                    <p className="text-sm">{currentRSVP.note}</p>
                  </div>
                )}
              </div>

              {/* Actions Panel */}
              <div className="lg:col-span-1">
                <div className="bg-bg-secondary p-4 rounded-lg sticky top-24">
                  {userIsOrganizer ? (
                    // Organizer Actions
                    <div>
                      <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Crown className="text-gold\" size={16} />
                        Organizer Actions
                      </h4>
                      
                      <div className="space-y-3">
                        <button
                          onClick={handleEdit}
                          className="w-full btn border border-gold text-gold hover:bg-gold hover:bg-opacity-10 flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit Meeting
                        </button>
                        
                        <button
                          onClick={handleCancel}
                          className="w-full btn border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} />
                          Cancel Meeting
                        </button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <h5 className="text-sm font-medium mb-2">Meeting Status</h5>
                        <p className="text-xs text-text-secondary">
                          Monitor team responses and manage meeting details using the actions above.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Invitee RSVP Actions
                    <div>
                      <h4 className="font-medium mb-4">Your Response</h4>
                      
                      {!showDeclineNote ? (
                        <div className="space-y-3">
                          <button
                            onClick={handleAcceptMeeting}
                            className="w-full btn bg-green text-white hover:bg-opacity-90 flex items-center justify-center gap-2"
                          >
                            <Check size={16} />
                            Accept
                          </button>
                          
                          <button
                            onClick={() => setShowDeclineNote(true)}
                            className="w-full btn border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10 flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} />
                            Decline
                          </button>
                          
                          <button
                            onClick={handleProposeTime}
                            className="w-full btn border border-gold text-gold hover:bg-gold hover:bg-opacity-10 flex items-center justify-center gap-2"
                          >
                            <Clock size={16} />
                            Propose New Time
                          </button>
                        </div>
                      ) : (
                        // Decline Note Form
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Reason for declining (optional):
                            </label>
                            <textarea
                              value={declineNote}
                              onChange={(e) => setDeclineNote(e.target.value)}
                              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none text-sm"
                              placeholder="e.g., Schedule conflict, prior commitment..."
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowDeclineNote(false)}
                              className="flex-1 btn border border-border text-text-secondary hover:bg-bg-primary text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeclineWithNote}
                              className="flex-1 btn bg-red-500 text-white hover:bg-opacity-90 text-sm"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )}

                      {currentRSVP && currentRSVP.status !== 'Pending' && !showDeclineNote && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="text-center">
                            <div className="text-sm text-text-secondary mb-2">
                              Current Status: <span className="font-medium">{currentRSVP.status}</span>
                            </div>
                            {currentRSVP.respondedAt && (
                              <div className="text-xs text-text-secondary">
                                Responded: {format(new Date(currentRSVP.respondedAt), 'MMM d, yyyy h:mm a')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6 pt-4 border-t border-border">
              <button
                onClick={onClose}
                className="btn border border-border hover:bg-bg-secondary px-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMeetingDetailsModal;