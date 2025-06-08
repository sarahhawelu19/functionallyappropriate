// src/utils/scheduleCalculator.ts

import { TeamMember, mockTeamMembers } from '../data/schedulingMockData';
import { format, addDays, getDay } from 'date-fns';

export interface AvailableSlot {
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isCommon: boolean; // true if ALL selected team members are available
  availableMembers: string[]; // IDs of team members available during this slot
}

export interface TeamMemberAvailability {
  memberId: string;
  memberName: string;
  slots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

// Convert day number to day name
const getDayName = (dayNumber: number): keyof TeamMember['weeklySchedule'] => {
  const days: (keyof TeamMember['weeklySchedule'])[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] as keyof TeamMember['weeklySchedule'];
};

// Convert time string to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to time string
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Generate available slots for a team member on a specific date
const generateMemberSlotsForDate = (member: TeamMember, date: string): { startTime: string; endTime: string }[] => {
  const dayOfWeek = getDay(new Date(date));
  const dayName = getDayName(dayOfWeek);
  
  // Skip weekends
  if (dayName === 'Sunday' || dayName === 'Saturday') {
    return [];
  }
  
  const schedule = member.weeklySchedule[dayName];
  if (!schedule) return [];
  
  const workStart = timeToMinutes(schedule.startTime);
  const workEnd = timeToMinutes(schedule.endTime);
  const unavailableSlots = schedule.unavailableSlots || [];
  
  // Create available time slots (30-minute increments)
  const slots: { startTime: string; endTime: string }[] = [];
  
  // Sort unavailable slots by start time
  const sortedUnavailable = [...unavailableSlots].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  
  let currentTime = workStart;
  
  for (const unavailable of sortedUnavailable) {
    const unavailableStart = timeToMinutes(unavailable.startTime);
    const unavailableEnd = timeToMinutes(unavailable.endTime);
    
    // Add slots before this unavailable period
    while (currentTime + 30 <= unavailableStart) {
      slots.push({
        startTime: minutesToTime(currentTime),
        endTime: minutesToTime(currentTime + 30)
      });
      currentTime += 30;
    }
    
    // Skip past the unavailable period
    currentTime = Math.max(currentTime, unavailableEnd);
  }
  
  // Add remaining slots after all unavailable periods
  while (currentTime + 30 <= workEnd) {
    slots.push({
      startTime: minutesToTime(currentTime),
      endTime: minutesToTime(currentTime + 30)
    });
    currentTime += 30;
  }
  
  return slots;
};

// Calculate availability for selected team members over a date range
export const calculateTeamAvailability = (
  teamMemberIds: string[],
  startDate: Date,
  endDate: Date
): {
  individualAvailability: TeamMemberAvailability[];
  commonSlots: AvailableSlot[];
  allSlots: AvailableSlot[];
} => {
  const selectedMembers = mockTeamMembers.filter(member => 
    teamMemberIds.includes(member.id)
  );
  
  const individualAvailability: TeamMemberAvailability[] = [];
  const allSlotsMap = new Map<string, AvailableSlot>(); // key: "date-startTime-endTime"
  
  // Calculate individual availability for each team member
  for (const member of selectedMembers) {
    const memberSlots: { date: string; startTime: string; endTime: string }[] = [];
    
    // Generate slots for each date in the range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const daySlots = generateMemberSlotsForDate(member, dateStr);
      
      for (const slot of daySlots) {
        memberSlots.push({
          date: dateStr,
          startTime: slot.startTime,
          endTime: slot.endTime
        });
        
        // Add to all slots map
        const slotKey = `${dateStr}-${slot.startTime}-${slot.endTime}`;
        if (!allSlotsMap.has(slotKey)) {
          allSlotsMap.set(slotKey, {
            date: dateStr,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isCommon: false,
            availableMembers: []
          });
        }
        
        const existingSlot = allSlotsMap.get(slotKey)!;
        existingSlot.availableMembers.push(member.id);
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    individualAvailability.push({
      memberId: member.id,
      memberName: member.name,
      slots: memberSlots
    });
  }
  
  // Convert map to array and determine common slots
  const allSlots = Array.from(allSlotsMap.values());
  const commonSlots = allSlots.filter(slot => 
    slot.availableMembers.length === selectedMembers.length
  );
  
  // Mark common slots
  commonSlots.forEach(slot => {
    slot.isCommon = true;
  });
  
  return {
    individualAvailability,
    commonSlots,
    allSlots
  };
};