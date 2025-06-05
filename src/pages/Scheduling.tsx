import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday } from 'date-fns';
import NewIEPMeetingModal from '../components/scheduling/NewIEPMeetingModal';
import { IEPMeeting } from '../data/schedulingMockData';

const Scheduling: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [iepMeetings, setIepMeetings] = useState<IEPMeeting[]>([]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthEvents = iepMeetings.filter(meeting => 
    isSameMonth(new Date(meeting.date), currentMonth)
  );

  const handleScheduleMeeting = (newMeeting: IEPMeeting) => {
    console.log('Schedule Meeting:', newMeeting);
    setIepMeetings(prevMeetings => [...prevMeetings, newMeeting]);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Scheduling</h1>
        <button 
          className="btn bg-accent-teal"
          onClick={() => setIsNewMeetingModalOpen(true)}
        >
          <span className="flex items-center gap-1">
            <Plus size={18} />
            New Event
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div key={`empty-start-${index}`} className="h-20 p-2 border border-border bg-bg-secondary bg-opacity-30 rounded-md" />
            ))}
            
            {monthDays.map(day => {
              const dayMeetings = iepMeetings.filter(meeting => 
                format(new Date(meeting.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              );
              
              return (
                <div 
                  key={day.toString()} 
                  className={`h-20 p-2 border border-border rounded-md overflow-hidden transition-all hover:border-teal ${
                    isToday(day) ? 'bg-teal bg-opacity-10 border-teal' : ''
                  }`}
                >
                  <div className="text-sm font-medium">{format(day, 'd')}</div>
                  <div className="mt-1">
                    {dayMeetings.map(meeting => (
                      <div key={meeting.id} className="text-xs p-1 bg-teal text-white rounded truncate mb-1">
                        {meeting.time} - {meeting.studentName}
                        <div className="text-[10px] opacity-80">{meeting.meetingType}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {Array.from({ length: 6 - getDay(monthEnd) }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-20 p-2 border border-border bg-bg-secondary bg-opacity-30 rounded-md" />
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="text-teal" size={20} />
            <h2 className="text-xl font-medium">Upcoming Events</h2>
          </div>
          
          {monthEvents.length > 0 ? (
            <div className="space-y-4">
              {monthEvents.map(meeting => (
                <div key={meeting.id} className="p-3 border border-border rounded-md hover:border-teal transition-all">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{meeting.studentName}</h3>
                    <span className="text-sm bg-teal text-white px-2 py-0.5 rounded">
                      {format(new Date(meeting.date), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {meeting.time} - {meeting.meetingType}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary py-4 text-center">No events scheduled for this month</p>
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
      />
    </div>
  );
};

export default Scheduling;