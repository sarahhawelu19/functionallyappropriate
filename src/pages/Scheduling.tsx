import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, Users, ArrowLeft } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday } from 'date-fns';
import NewIEPMeetingModal from '../components/scheduling/NewIEPMeetingModal';
import DurationSelectionModal from '../components/scheduling/DurationSelectionModal';
import { IEPMeeting, mockTeamMembers } from '../data/schedulingMockData';

type ViewMode = 'initial' | 'availability';

interface CommonAvailableSlot {
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM" (e.g., "09:00")
  endTime: string; // "HH:MM" (e.g., "11:30")
}

const Scheduling: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [iepMeetings, setIepMeetings] = useState<IEPMeeting[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('initial');
  const [currentMeetingProposal, setCurrentMeetingProposal] = useState<Partial<IEPMeeting> | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<CommonAvailableSlot | null>(null);

  // Mock common availability data - in a real app, this would be calculated based on team member availability
  const mockCommonSlots: CommonAvailableSlot[] = [
    { date: "2025-01-20", startTime: "10:00", endTime: "11:30" },
    { date: "2025-01-20", startTime: "14:00", endTime: "15:00" },
    { date: "2025-01-22", startTime: "09:00", endTime: "10:30" },
    { date: "2025-01-22", startTime: "13:30", endTime: "15:30" },
    { date: "2025-01-24", startTime: "10:30", endTime: "12:00" },
    { date: "2025-01-27", startTime: "09:00", endTime: "11:00" },
    { date: "2025-01-27", startTime: "14:30", endTime: "16:00" },
    { date: "2025-01-29", startTime: "10:00", endTime: "11:00" },
    { date: "2025-01-31", startTime: "09:30", endTime: "11:30" },
    { date: "2025-02-03", startTime: "10:00", endTime: "12:00" },
    { date: "2025-02-05", startTime: "13:00", endTime: "15:00" },
    { date: "2025-02-07", startTime: "09:00", endTime: "10:30" },
  ];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthEvents = iepMeetings.filter(meeting => 
    meeting.date && isSameMonth(new Date(meeting.date), currentMonth)
  );

  // Filter common slots for the current month
  const monthCommonSlots = mockCommonSlots.filter(slot => 
    isSameMonth(new Date(slot.date), currentMonth)
  );

  const handleScheduleMeeting = (meetingDetails: Partial<IEPMeeting>) => {
    console.log('Meeting proposal received:', meetingDetails);
    setCurrentMeetingProposal(meetingDetails);
    setViewMode('availability');
    setIsNewMeetingModalOpen(false);
  };

  const handleSlotClick = (slot: CommonAvailableSlot) => {
    setSelectedSlot(slot);
    setIsDurationModalOpen(true);
  };

  const handleDurationSubmit = (durationMinutes: number) => {
    if (!currentMeetingProposal || !selectedSlot) return;
    
    // Create final meeting object
    const finalMeeting: IEPMeeting = {
      ...currentMeetingProposal,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      durationMinutes: durationMinutes,
      status: 'scheduled',
    } as IEPMeeting;
    
    // Add to meetings list
    setIepMeetings(prev => [...prev, finalMeeting]);
    
    // Clear states after successful scheduling
    setCurrentMeetingProposal(null);
    setSelectedSlot(null);
    setIsDurationModalOpen(false);
    setViewMode('initial'); // Return to initial view after scheduling
  };

  const handleBackToInitial = () => {
    // Set view mode to initial and immediately reopen the modal with the current proposal
    setViewMode('initial');
    setIsNewMeetingModalOpen(true);
  };

  const getTeamMemberNames = (teamMemberIds: string[]) => {
    return teamMemberIds
      .map(id => mockTeamMembers.find(member => member.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatTime = (timeString: string): string => {
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  // Initial View
  if (viewMode === 'initial') {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Scheduling</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area - Initial View */}
          <div className="lg:col-span-2">
            <div className="card text-center py-12">
              <CalendarIcon className="text-teal mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-medium mb-4">Schedule IEP Meetings</h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Get started by scheduling a new IEP meeting. We'll help you find common availability 
                among all required team members.
              </p>
              
              <button 
                className="btn bg-accent-teal text-lg px-8 py-4"
                onClick={() => setIsNewMeetingModalOpen(true)}
              >
                <span className="flex items-center gap-2">
                  <Plus size={24} />
                  Schedule New IEP Meeting
                </span>
              </button>
            </div>
          </div>
          
          {/* Upcoming Events Sidebar */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="text-teal" size={20} />
              <h2 className="text-xl font-medium">Upcoming Events</h2>
            </div>
            
            {iepMeetings.length > 0 ? (
              <div className="space-y-4">
                {iepMeetings
                  .filter(meeting => meeting.date && new Date(meeting.date) >= new Date())
                  .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
                  .slice(0, 5)
                  .map(meeting => (
                    <div key={meeting.id} className="p-3 border border-border rounded-md hover:border-teal transition-all">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{meeting.studentName}</h3>
                        <span className="text-sm bg-teal text-white px-2 py-0.5 rounded">
                          {meeting.date && format(new Date(meeting.date), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        {meeting.time && formatTime(meeting.time)} - {meeting.meetingType}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-text-secondary py-4 text-center">No upcoming events scheduled</p>
            )}
            
            <button 
              className="w-full mt-4 p-2 border border-teal text-teal rounded-md hover:bg-teal hover:bg-opacity-10 transition-all flex items-center justify-center gap-1"
              onClick={() => setIsNewMeetingModalOpen(true)}
            >
              <Plus size={16} />
              Add Event
            </button>
          </div>
        </div>

        <NewIEPMeetingModal
          isOpen={isNewMeetingModalOpen}
          onClose={() => setIsNewMeetingModalOpen(false)}
          onScheduleMeeting={handleScheduleMeeting}
          initialProposal={currentMeetingProposal}
        />
      </div>
    );
  }

  // Availability View
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToInitial}
            className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-2xl font-medium">Find Common Availability</h1>
        </div>
      </div>

      {/* Meeting Proposal Summary */}
      {currentMeetingProposal && (
        <div className="card mb-6 bg-teal bg-opacity-5 border-teal">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-teal rounded-full text-white">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-2">
                {currentMeetingProposal.meetingType} for {currentMeetingProposal.studentName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Meeting Type:</span> {currentMeetingProposal.meetingType}
                  {currentMeetingProposal.customMeetingType && ` (${currentMeetingProposal.customMeetingType})`}
                </div>
                <div>
                  <span className="font-medium">Team Members:</span> {getTeamMemberNames(currentMeetingProposal.teamMemberIds || [])}
                </div>
              </div>
              <p className="text-text-secondary mt-2 text-sm">
                Click on any available time slot below to schedule this meeting.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">{format(currentMonth, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-md hover:bg-bg-secondary transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-md hover:bg-bg-secondary transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium p-2 text-sm">
                {day}
              </div>
            ))}
            
            {Array.from({ length: getDay(monthStart) }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-24 p-2 border border-border bg-bg-secondary bg-opacity-30 rounded-md" />
            ))}
            
            {monthDays.map(day => {
              const dayMeetings = iepMeetings.filter(meeting => 
                meeting.date && format(new Date(meeting.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );
              
              const daySlots = monthCommonSlots.filter(slot => 
                format(new Date(slot.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );
              
              const isPastDate = day < new Date(new Date().setHours(0, 0, 0, 0));
              
              return (
                <div 
                  key={day.toString()} 
                  className={`h-24 p-1 border border-border rounded-md overflow-hidden transition-all ${
                    isPastDate 
                      ? 'bg-bg-secondary bg-opacity-50' 
                      : daySlots.length > 0 
                        ? 'hover:border-teal' 
                        : ''
                  } ${
                    isToday(day) ? 'bg-teal bg-opacity-10 border-teal' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isPastDate ? 'text-text-secondary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {/* Show existing meetings */}
                    {dayMeetings.map(meeting => (
                      <div key={meeting.id} className="text-xs p-1 bg-gray-500 text-white rounded truncate">
                        {meeting.time && formatTime(meeting.time)}
                        <div className="text-[10px] opacity-80 truncate">{meeting.studentName}</div>
                      </div>
                    ))}
                    
                    {/* Show available slots */}
                    {!isPastDate && daySlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotClick(slot)}
                        className="w-full text-xs p-1 bg-teal text-white rounded hover:bg-opacity-90 transition-colors"
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {Array.from({ length: 6 - getDay(monthEnd) }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-24 p-2 border border-border bg-bg-secondary bg-opacity-30 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-teal" size={20} />
            <h2 className="text-xl font-medium">Available Times</h2>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-bg-secondary rounded-md">
              <h3 className="font-medium mb-2">How to Schedule</h3>
              <ol className="space-y-2 text-text-secondary">
                <li>1. Click on any teal time slot in the calendar</li>
                <li>2. Select your preferred meeting duration</li>
                <li>3. Confirm to schedule the meeting</li>
              </ol>
            </div>
            
            <div className="p-3 border border-border rounded-md">
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="space-y-2 text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-teal rounded"></div>
                  <span>Available time slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>Existing meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-bg-secondary rounded"></div>
                  <span>Past dates (unavailable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-teal bg-opacity-10 border border-teal rounded"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Show available slots for current month */}
            {monthCommonSlots.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">This Month's Available Slots</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {monthCommonSlots
                    .filter(slot => new Date(slot.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotClick(slot)}
                        className="w-full text-left text-xs p-2 border border-teal rounded hover:bg-teal hover:bg-opacity-10 transition-colors"
                      >
                        <div className="font-medium">{format(new Date(slot.date), 'MMM d')}</div>
                        <div className="text-text-secondary">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewIEPMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onScheduleMeeting={handleScheduleMeeting}
        initialProposal={currentMeetingProposal}
      />

      <DurationSelectionModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSubmitDuration={handleDurationSubmit}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default Scheduling;