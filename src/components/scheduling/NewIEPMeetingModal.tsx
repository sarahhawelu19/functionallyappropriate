import React, { useState } from 'react';
import { X, Users, Calendar } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface MeetingDetails {
  studentName: string;
  meetingType: string;
  customType?: string;
  selectedTeamMembers: string[];
}

interface NewIEPMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleMeeting: (meetingDetails: MeetingDetails) => void;
}

const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Miller', role: 'Case Manager' },
  { id: 'tm2', name: 'David Chen', role: 'Teacher' },
  { id: 'tm3', name: 'Linda Kim', role: 'Speech Therapist' },
  { id: 'tm4', name: 'Robert Davis', role: 'Principal (LEA)' },
  { id: 'tm5', name: 'Emily White', role: 'Occupational Therapist' },
  { id: 'tm6', name: 'Michael Brown', role: 'School Psychologist' },
];

const meetingTypes = [
  'Annual IEP',
  'Triennial IEP',
  '30 Day IEP',
  'Amendment IEP',
  'Other',
];

const NewIEPMeetingModal: React.FC<NewIEPMeetingModalProps> = ({
  isOpen,
  onClose,
  onScheduleMeeting,
}) => {
  const [studentName, setStudentName] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [customType, setCustomType] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  const handleTeamMemberToggle = (memberId: string) => {
    setSelectedTeamMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleMeeting({
      studentName,
      meetingType: meetingType === 'Other' ? customType : meetingType,
      customType: meetingType === 'Other' ? customType : undefined,
      selectedTeamMembers,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-bg-primary rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="text-teal" size={24} />
              <h2 className="text-xl font-medium">Schedule New IEP Meeting</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-teal"
                  required
                />
              </div>

              <div>
                <label htmlFor="meetingType" className="block text-sm font-medium mb-1">
                  Meeting Type
                </label>
                <select
                  id="meetingType"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-teal"
                  required
                >
                  <option value="">Select Meeting Type</option>
                  {meetingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {meetingType === 'Other' && (
                <div>
                  <label htmlFor="customType" className="block text-sm font-medium mb-1">
                    Specify Meeting Type
                  </label>
                  <input
                    type="text"
                    id="customType"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-teal"
                    required
                  />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-teal" size={20} />
                  <h3 className="font-medium">Select Team Members</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamMembers.map(member => (
                    <label
                      key={member.id}
                      className="flex items-start gap-3 p-3 border border-border rounded-md hover:border-teal transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeamMembers.includes(member.id)}
                        onChange={() => handleTeamMemberToggle(member.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-text-secondary">{member.role}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-md hover:bg-bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal text-white rounded-md hover:bg-opacity-90 transition-colors"
                disabled={!studentName || !meetingType || (meetingType === 'Other' && !customType)}
              >
                Find Availability & Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewIEPMeetingModal;