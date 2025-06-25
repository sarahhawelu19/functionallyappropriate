import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Edit, Trash2, Save, ArrowLeft, User, School, AlertCircle } from 'lucide-react';
import { mockStudents, StudentProfile } from '../data/schedulingMockData';

interface NonServiceBlock {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  blockName: string;
  startTime: string;
  endTime: string;
}

const StudentServiceSchedulePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [schoolDayStartTime, setSchoolDayStartTime] = useState('08:30');
  const [schoolDayEndTime, setSchoolDayEndTime] = useState('14:30');
  const [nonServiceBlocks, setNonServiceBlocks] = useState<NonServiceBlock[]>([]);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  
  // Form state for adding/editing blocks
  const [blockForm, setBlockForm] = useState({
    dayOfWeek: 'Monday' as const,
    blockName: '',
    startTime: '09:00',
    endTime: '10:00',
  });

  const weekDays: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  // Load student data
  useEffect(() => {
    if (studentId) {
      const foundStudent = mockStudents.find(s => s.id === studentId);
      if (foundStudent) {
        setStudent(foundStudent);
        setSchoolDayStartTime(foundStudent.schoolDayStartTime || '08:30');
        setSchoolDayEndTime(foundStudent.schoolDayEndTime || '14:30');
        setNonServiceBlocks(foundStudent.weeklyNonServiceSchedule || []);
      }
    }
  }, [studentId]);

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeString);
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  };

  const formatTime = (timeString: string): string => {
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const schoolStart = timeToMinutes(schoolDayStartTime);
    const schoolEnd = timeToMinutes(schoolDayEndTime);
    
    return start >= schoolStart && end <= schoolEnd && start < end;
  };

  const checkTimeConflict = (dayOfWeek: string, startTime: string, endTime: string, excludeId?: string): boolean => {
    const dayBlocks = nonServiceBlocks.filter(block => 
      block.dayOfWeek === dayOfWeek && block.id !== excludeId
    );
    
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);
    
    return dayBlocks.some(block => {
      const blockStart = timeToMinutes(block.startTime);
      const blockEnd = timeToMinutes(block.endTime);
      
      // Check for overlap
      return (newStart < blockEnd && newEnd > blockStart);
    });
  };

  const handleAddBlock = () => {
    if (!blockForm.blockName.trim()) {
      alert('Please enter a block name.');
      return;
    }

    if (!validateTimeRange(blockForm.startTime, blockForm.endTime)) {
      alert('Block time must be within school day hours and start time must be before end time.');
      return;
    }

    if (checkTimeConflict(blockForm.dayOfWeek, blockForm.startTime, blockForm.endTime)) {
      alert('This time conflicts with an existing block on the same day.');
      return;
    }

    const newBlock: NonServiceBlock = {
      id: Date.now().toString(),
      dayOfWeek: blockForm.dayOfWeek,
      blockName: blockForm.blockName.trim(),
      startTime: blockForm.startTime,
      endTime: blockForm.endTime,
    };

    setNonServiceBlocks(prev => [...prev, newBlock]);
    setIsAddingBlock(false);
    setBlockForm({
      dayOfWeek: 'Monday',
      blockName: '',
      startTime: '09:00',
      endTime: '10:00',
    });
  };

  const handleEditBlock = (block: NonServiceBlock) => {
    setEditingBlockId(block.id);
    setBlockForm({
      dayOfWeek: block.dayOfWeek,
      blockName: block.blockName,
      startTime: block.startTime,
      endTime: block.endTime,
    });
  };

  const handleUpdateBlock = () => {
    if (!blockForm.blockName.trim()) {
      alert('Please enter a block name.');
      return;
    }

    if (!validateTimeRange(blockForm.startTime, blockForm.endTime)) {
      alert('Block time must be within school day hours and start time must be before end time.');
      return;
    }

    if (checkTimeConflict(blockForm.dayOfWeek, blockForm.startTime, blockForm.endTime, editingBlockId!)) {
      alert('This time conflicts with an existing block on the same day.');
      return;
    }

    setNonServiceBlocks(prev => prev.map(block => 
      block.id === editingBlockId 
        ? {
            ...block,
            dayOfWeek: blockForm.dayOfWeek,
            blockName: blockForm.blockName.trim(),
            startTime: blockForm.startTime,
            endTime: blockForm.endTime,
          }
        : block
    ));

    setEditingBlockId(null);
    setBlockForm({
      dayOfWeek: 'Monday',
      blockName: '',
      startTime: '09:00',
      endTime: '10:00',
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Are you sure you want to delete this blocked time?')) {
      setNonServiceBlocks(prev => prev.filter(block => block.id !== blockId));
    }
  };

  const handleSaveSchedule = () => {
    // Update the student object (in a real app, this would call an API)
    const updatedStudent: StudentProfile = {
      ...student!,
      schoolDayStartTime,
      schoolDayEndTime,
      weeklyNonServiceSchedule: nonServiceBlocks,
    };

    console.log('Updated student schedule:', updatedStudent);
    
    // For now, just show success message
    alert(`Schedule saved for ${student?.name}!\n\nSchool Day: ${formatTime(schoolDayStartTime)} - ${formatTime(schoolDayEndTime)}\nBlocked Times: ${nonServiceBlocks.length} blocks`);
  };

  const getBlocksForDay = (day: string) => {
    return nonServiceBlocks
      .filter(block => block.dayOfWeek === day)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = timeToMinutes(schoolDayStartTime);
    const end = timeToMinutes(schoolDayEndTime);
    
    for (let minutes = start; minutes < end; minutes += 15) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
    return slots;
  };

  if (!student) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-medium">Student Not Found</h1>
        </div>
        
        <div className="card text-center py-12">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-medium mb-2">Student Not Found</h2>
          <p className="text-text-secondary mb-6">
            The student with ID "{studentId}" could not be found.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn bg-accent-purple"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const timeOptions = generateTimeOptions();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn border border-border hover:bg-bg-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div>
          <h1 className="text-2xl font-medium">Service Schedule Management</h1>
          <p className="text-text-secondary">Configure blocked times for {student.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info & School Day Settings */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-purple" size={24} />
              <h2 className="text-xl font-medium">Student Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="font-medium mb-2">Student Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {student.name}</div>
                  <div><span className="font-medium">Student ID:</span> {student.id}</div>
                  <div><span className="font-medium">Case Manager:</span> {student.caseManagerId}</div>
                </div>
              </div>
              
              <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <School size={16} />
                  School Day Hours
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <select
                      value={schoolDayStartTime}
                      onChange={(e) => setSchoolDayStartTime(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      {timeOptions.slice(0, timeOptions.length - 8).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <select
                      value={schoolDayEndTime}
                      onChange={(e) => setSchoolDayEndTime(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      {timeOptions.slice(8).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Display */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-purple" size={24} />
                <h2 className="text-xl font-medium">Weekly Non-Service Schedule</h2>
              </div>
              <button
                onClick={() => setIsAddingBlock(true)}
                className="btn bg-accent-purple flex items-center gap-2"
              >
                <Plus size={16} />
                Add Blocked Time
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weekDays.map(day => {
                const dayBlocks = getBlocksForDay(day);
                
                return (
                  <div key={day} className="border border-border rounded-lg p-3">
                    <h3 className="font-medium text-center mb-3 text-purple">{day}</h3>
                    
                    <div className="space-y-2">
                      {dayBlocks.length > 0 ? (
                        dayBlocks.map(block => (
                          <div
                            key={block.id}
                            className="p-2 bg-red-500 bg-opacity-10 border border-red-500 rounded text-xs"
                          >
                            <div className="font-medium text-red-500">{block.blockName}</div>
                            <div className="text-text-secondary">
                              {formatTime(block.startTime)} - {formatTime(block.endTime)}
                            </div>
                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => handleEditBlock(block)}
                                className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded"
                                title="Edit block"
                              >
                                <Edit size={10} />
                              </button>
                              <button
                                onClick={() => handleDeleteBlock(block.id)}
                                className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded"
                                title="Delete block"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-text-secondary text-xs py-4">
                          No blocked times
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-bg-secondary rounded-md">
              <div className="text-sm text-text-secondary">
                <strong>School Day:</strong> {formatTime(schoolDayStartTime)} - {formatTime(schoolDayEndTime)} 
                <span className="ml-4"><strong>Total Blocked Times:</strong> {nonServiceBlocks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Add/Edit Block Form */}
        <div className="card h-fit">
          {(isAddingBlock || editingBlockId) ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-purple" size={20} />
                <h3 className="text-lg font-medium">
                  {editingBlockId ? 'Edit Blocked Time' : 'Add Blocked Time'}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Day of Week</label>
                  <select
                    value={blockForm.dayOfWeek}
                    onChange={(e) => setBlockForm(prev => ({ ...prev, dayOfWeek: e.target.value as any }))}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    {weekDays.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Block Name</label>
                  <input
                    type="text"
                    value={blockForm.blockName}
                    onChange={(e) => setBlockForm(prev => ({ ...prev, blockName: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="e.g., Lunch, Recess, Math Class"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <select
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <select
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsAddingBlock(false);
                      setEditingBlockId(null);
                      setBlockForm({
                        dayOfWeek: 'Monday',
                        blockName: '',
                        startTime: '09:00',
                        endTime: '10:00',
                      });
                    }}
                    className="flex-1 btn border border-border hover:bg-bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBlockId ? handleUpdateBlock : handleAddBlock}
                    className="flex-1 btn bg-accent-purple"
                  >
                    {editingBlockId ? 'Update' : 'Add'} Block
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Save className="text-purple" size={20} />
                <h3 className="text-lg font-medium">Schedule Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-bg-secondary rounded-md">
                  <h4 className="font-medium mb-2">School Day</h4>
                  <div className="text-sm text-text-secondary">
                    {formatTime(schoolDayStartTime)} - {formatTime(schoolDayEndTime)}
                  </div>
                </div>

                <div className="p-3 bg-bg-secondary rounded-md">
                  <h4 className="font-medium mb-2">Blocked Times</h4>
                  <div className="text-sm text-text-secondary">
                    {nonServiceBlocks.length} total blocks across the week
                  </div>
                  {nonServiceBlocks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {weekDays.map(day => {
                        const dayBlocks = getBlocksForDay(day);
                        if (dayBlocks.length === 0) return null;
                        
                        return (
                          <div key={day} className="text-xs">
                            <span className="font-medium">{day}:</span> {dayBlocks.length} block{dayBlocks.length !== 1 ? 's' : ''}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveSchedule}
                  className="w-full btn bg-accent-purple flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Student Schedule
                </button>

                <div className="p-3 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-md">
                  <h4 className="font-medium text-blue-500 mb-1">Next Steps</h4>
                  <p className="text-xs text-text-secondary">
                    After saving, service providers will be able to see available time slots for scheduling ongoing services with this student.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentServiceSchedulePage;