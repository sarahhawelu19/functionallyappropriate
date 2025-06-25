import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  Edit3, 
  Trash2, 
  Search, 
  Grid3X3, 
  List, 
  Eye, 
  Copy,
  Move,
  X,
  Check,
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Coffee,
  Gamepad2,
  Users,
  Laptop,
  Tablet,
  Utensils,
  Scissors,
  Palette,
  Music,
  Heart,
  Zap,
  Home,
  Car,
  Star,
  Circle,
  Download,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ScheduleType = 'daily' | 'weekly' | 'short';

interface ScheduleActivity {
  id: string;
  name: string;
  icon: React.ReactNode;
  time?: string;
  duration?: number;
  isCustom?: boolean;
  category: string;
}

interface Schedule {
  id: string;
  name: string;
  type: ScheduleType;
  activities: ScheduleActivity[];
  createdAt: string;
  lastModified: string;
}

const VisualScheduleTab: React.FC = () => {
  const [selectedScheduleType, setSelectedScheduleType] = useState<ScheduleType>('daily');
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleActivity[]>([]);
  const [savedSchedules, setSavedSchedules] = useState<Schedule[]>([
    {
      id: '1',
      name: 'Monday Morning Routine',
      type: 'daily',
      activities: [],
      createdAt: '2025-01-15',
      lastModified: '2025-01-15'
    }
  ]);
  const [showIconLibrary, setShowIconLibrary] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomActivityModal, setShowCustomActivityModal] = useState(false);
  const [customActivityName, setCustomActivityName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [draggedItem, setDraggedItem] = useState<ScheduleActivity | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Ref for the printable schedule content
  const printableScheduleRef = useRef<HTMLDivElement>(null);

  // Predefined icon library organized by categories
  const iconLibrary: Record<string, ScheduleActivity[]> = {
    subjects: [
      { id: 'math', name: 'Math', icon: <Calculator size={24} />, category: 'subjects' },
      { id: 'reading', name: 'Reading', icon: <BookOpen size={24} />, category: 'subjects' },
      { id: 'science', name: 'Science', icon: <Beaker size={24} />, category: 'subjects' },
      { id: 'social-studies', name: 'Social Studies', icon: <Globe size={24} />, category: 'subjects' },
      { id: 'art', name: 'Art', icon: <Palette size={24} />, category: 'subjects' },
      { id: 'music', name: 'Music', icon: <Music size={24} />, category: 'subjects' },
    ],
    breaks: [
      { id: 'sensory-break', name: 'Sensory Break', icon: <Heart size={24} />, category: 'breaks' },
      { id: 'recess', name: 'Recess', icon: <Gamepad2 size={24} />, category: 'breaks' },
      { id: 'lunch', name: 'Lunch', icon: <Utensils size={24} />, category: 'breaks' },
      { id: 'snack', name: 'Snack', icon: <Coffee size={24} />, category: 'breaks' },
    ],
    therapies: [
      { id: 'ot', name: 'Occupational Therapy', icon: <Scissors size={24} />, category: 'therapies' },
      { id: 'speech', name: 'Speech Therapy', icon: <Users size={24} />, category: 'therapies' },
      { id: 'pt', name: 'Physical Therapy', icon: <Zap size={24} />, category: 'therapies' },
    ],
    technology: [
      { id: 'computer', name: 'Computer Time', icon: <Laptop size={24} />, category: 'technology' },
      { id: 'ipad', name: 'iPad Time', icon: <Tablet size={24} />, category: 'technology' },
    ],
    social: [
      { id: 'circle-time', name: 'Circle Time', icon: <Users size={24} />, category: 'social' },
      { id: 'group-activity', name: 'Group Activity', icon: <Users size={24} />, category: 'social' },
    ],
    personal: [
      { id: 'bathroom', name: 'Bathroom', icon: <Home size={24} />, category: 'personal' },
      { id: 'wash-hands', name: 'Wash Hands', icon: <Circle size={24} />, category: 'personal' },
    ]
  };

  const categories = [
    { id: 'all', name: 'All Activities', count: Object.values(iconLibrary).flat().length },
    { id: 'subjects', name: 'Subjects', count: iconLibrary.subjects.length },
    { id: 'breaks', name: 'Breaks', count: iconLibrary.breaks.length },
    { id: 'therapies', name: 'Therapies', count: iconLibrary.therapies.length },
    { id: 'technology', name: 'Technology', count: iconLibrary.technology.length },
    { id: 'social', name: 'Social/Events', count: iconLibrary.social.length },
    { id: 'personal', name: 'Personal Care', count: iconLibrary.personal.length },
  ];

  const scheduleTypes = [
    { 
      id: 'daily' as ScheduleType, 
      name: 'Daily Schedule', 
      description: 'Full day schedule with time blocks',
      icon: <Calendar size={20} />
    },
    { 
      id: 'weekly' as ScheduleType, 
      name: 'Weekly Schedule', 
      description: 'Recurring weekly activities',
      icon: <Grid3X3 size={20} />
    },
    { 
      id: 'short' as ScheduleType, 
      name: 'Short Schedule', 
      description: '2-5 items for transitions',
      icon: <List size={20} />
    },
  ];

  const getAllActivities = () => {
    const allActivities = Object.values(iconLibrary).flat();
    if (selectedCategory === 'all') {
      return allActivities;
    }
    return iconLibrary[selectedCategory] || [];
  };

  const filteredActivities = getAllActivities().filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addActivityToSchedule = (activity: ScheduleActivity) => {
    const newActivity = {
      ...activity,
      id: `${activity.id}-${Date.now()}`,
      time: selectedScheduleType === 'daily' ? '09:00' : undefined,
      duration: 30
    };
    setCurrentSchedule(prev => [...prev, newActivity]);
  };

  const removeActivityFromSchedule = (activityId: string) => {
    setCurrentSchedule(prev => prev.filter(activity => activity.id !== activityId));
  };

  const updateActivityTime = (activityId: string, time: string) => {
    setCurrentSchedule(prev => prev.map(activity =>
      activity.id === activityId ? { ...activity, time } : activity
    ));
  };

  const updateActivityDuration = (activityId: string, duration: number) => {
    setCurrentSchedule(prev => prev.map(activity =>
      activity.id === activityId ? { ...activity, duration } : activity
    ));
  };

  const createCustomActivity = () => {
    if (!customActivityName.trim()) return;

    const customActivity: ScheduleActivity = {
      id: `custom-${Date.now()}`,
      name: customActivityName,
      icon: <Star size={24} />, // Default icon for custom activities
      category: 'custom',
      isCustom: true
    };

    addActivityToSchedule(customActivity);
    setCustomActivityName('');
    setShowCustomActivityModal(false);
  };

  const saveSchedule = () => {
    if (!scheduleName.trim() || currentSchedule.length === 0) return;

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      name: scheduleName,
      type: selectedScheduleType,
      activities: currentSchedule,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    setSavedSchedules(prev => [...prev, newSchedule]);
    setCurrentSchedule([]);
    setScheduleName('');
  };

  const loadSchedule = (schedule: Schedule) => {
    setCurrentSchedule(schedule.activities);
    setSelectedScheduleType(schedule.type);
    setScheduleName(schedule.name);
  };

  const deleteSchedule = (scheduleId: string) => {
    setSavedSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const moveActivity = (fromIndex: number, toIndex: number) => {
    const newSchedule = [...currentSchedule];
    const [movedActivity] = newSchedule.splice(fromIndex, 1);
    newSchedule.splice(toIndex, 0, movedActivity);
    setCurrentSchedule(newSchedule);
  };

  const getMaxActivities = () => {
    switch (selectedScheduleType) {
      case 'short': return 5;
      case 'daily': return 12;
      case 'weekly': return 20;
      default: return 12;
    }
  };

  const canAddMoreActivities = () => {
    return currentSchedule.length < getMaxActivities();
  };

  // PDF Generation Functions
  const generatePDF = async () => {
    if (currentSchedule.length === 0) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary container for the printable content
      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '0';
      printContainer.style.width = '800px';
      printContainer.style.backgroundColor = 'white';
      printContainer.style.padding = '40px';
      printContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Create the schedule content
      const scheduleContent = createPrintableScheduleHTML();
      printContainer.innerHTML = scheduleContent;
      
      document.body.appendChild(printContainer);
      
      // Generate canvas from the content
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: printContainer.scrollHeight
      });
      
      // Remove the temporary container
      document.body.removeChild(printContainer);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      const fileName = `${scheduleName || 'Visual Schedule'} - ${new Date().toLocaleDateString()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const createPrintableScheduleHTML = () => {
    const title = scheduleName || 'My Visual Schedule';
    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let scheduleHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #800080; font-size: 28px; margin-bottom: 10px; font-weight: bold;">${title}</h1>
        <p style="color: #666; font-size: 16px; margin: 0;">${date}</p>
        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0; text-transform: capitalize;">${selectedScheduleType} Schedule</p>
      </div>
    `;
    
    if (selectedScheduleType === 'daily') {
      // Daily schedule with times
      scheduleHTML += `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          ${currentSchedule.map((activity, index) => `
            <div style="border: 2px solid #800080; border-radius: 12px; padding: 20px; text-align: center; background: #f9f9f9;">
              <div style="font-size: 48px; margin-bottom: 15px; color: #800080;">
                ${getIconSymbol(activity)}
              </div>
              <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #333;">${activity.name}</h3>
              <p style="font-size: 16px; color: #800080; font-weight: bold; margin: 5px 0;">
                ${activity.time || ''}
              </p>
              <p style="font-size: 14px; color: #666; margin: 0;">
                ${activity.duration ? `${activity.duration} minutes` : ''}
              </p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (selectedScheduleType === 'short') {
      // Short schedule with step numbers
      scheduleHTML += `
        <div style="display: flex; flex-direction: column; gap: 15px;">
          ${currentSchedule.map((activity, index) => `
            <div style="display: flex; align-items: center; border: 2px solid #800080; border-radius: 12px; padding: 20px; background: #f9f9f9;">
              <div style="background: #800080; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 20px; flex-shrink: 0;">
                ${index + 1}
              </div>
              <div style="font-size: 36px; margin-right: 20px; color: #800080; flex-shrink: 0;">
                ${getIconSymbol(activity)}
              </div>
              <div style="flex-grow: 1;">
                <h3 style="font-size: 20px; font-weight: bold; margin: 0; color: #333;">${activity.name}</h3>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Weekly schedule
      scheduleHTML += `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          ${currentSchedule.map((activity, index) => `
            <div style="border: 2px solid #800080; border-radius: 12px; padding: 15px; text-align: center; background: #f9f9f9;">
              <div style="font-size: 36px; margin-bottom: 10px; color: #800080;">
                ${getIconSymbol(activity)}
              </div>
              <h3 style="font-size: 16px; font-weight: bold; margin: 0; color: #333;">${activity.name}</h3>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Add footer
    scheduleHTML += `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          Generated by BetterSped Visual Schedule Builder • ${new Date().toLocaleDateString()}
        </p>
      </div>
    `;
    
    return scheduleHTML;
  };

  const getIconSymbol = (activity: ScheduleActivity) => {
    // Convert React icons to Unicode symbols for PDF
    const iconMap: Record<string, string> = {
      'math': '🔢',
      'reading': '📖',
      'science': '🧪',
      'social-studies': '🌍',
      'art': '🎨',
      'music': '🎵',
      'sensory-break': '💜',
      'recess': '🎮',
      'lunch': '🍽️',
      'snack': '☕',
      'ot': '✂️',
      'speech': '👥',
      'pt': '⚡',
      'computer': '💻',
      'ipad': '📱',
      'circle-time': '👥',
      'group-activity': '👥',
      'bathroom': '🏠',
      'wash-hands': '⭕',
    };
    
    // Extract the base ID from the activity ID
    const baseId = activity.id.split('-')[0];
    return iconMap[baseId] || (activity.isCustom ? '⭐' : '📋');
  };

  const downloadScheduleAsPDF = async (schedule?: Schedule) => {
    if (schedule) {
      // Temporarily load the schedule for PDF generation
      const originalSchedule = currentSchedule;
      const originalName = scheduleName;
      const originalType = selectedScheduleType;
      
      setCurrentSchedule(schedule.activities);
      setScheduleName(schedule.name);
      setSelectedScheduleType(schedule.type);
      
      // Wait for state to update
      setTimeout(async () => {
        await generatePDF();
        
        // Restore original state
        setCurrentSchedule(originalSchedule);
        setScheduleName(originalName);
        setSelectedScheduleType(originalType);
      }, 100);
    } else {
      await generatePDF();
    }
  };

  const renderScheduleTypeSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Select Schedule Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scheduleTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedScheduleType(type.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedScheduleType === type.id
                ? 'border-purple bg-purple/10'
                : 'border-border hover:border-purple/30'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              {type.icon}
              <h4 className="font-medium">{type.name}</h4>
            </div>
            <p className="text-sm text-text-secondary">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderIconLibrary = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activity Library</h3>
        <button
          onClick={() => setShowIconLibrary(!showIconLibrary)}
          className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
        >
          {showIconLibrary ? <X size={16} /> : <Grid3X3 size={16} />}
        </button>
      </div>

      {showIconLibrary && (
        <>
          {/* Search and Filter */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-border'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Activity Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {filteredActivities.map(activity => (
              <button
                key={activity.id}
                onClick={() => canAddMoreActivities() && addActivityToSchedule(activity)}
                disabled={!canAddMoreActivities()}
                className={`p-3 border border-border rounded-lg hover:border-purple/30 transition-all text-center ${
                  !canAddMoreActivities() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple/5'
                }`}
              >
                <div className="flex justify-center mb-2 text-purple">
                  {activity.icon}
                </div>
                <span className="text-xs font-medium">{activity.name}</span>
              </button>
            ))}
          </div>

          {/* Add Custom Activity Button */}
          <button
            onClick={() => setShowCustomActivityModal(true)}
            disabled={!canAddMoreActivities()}
            className={`w-full p-3 border-2 border-dashed rounded-lg transition-all ${
              canAddMoreActivities()
                ? 'border-purple text-purple hover:bg-purple/5'
                : 'border-border text-text-secondary cursor-not-allowed'
            }`}
          >
            <Plus size={20} className="mx-auto mb-1" />
            <span className="text-sm font-medium">Add Other Activity</span>
          </button>
        </>
      )}
    </div>
  );

  const renderScheduleBuilder = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {selectedScheduleType === 'daily' && 'Daily Schedule Builder'}
          {selectedScheduleType === 'weekly' && 'Weekly Schedule Builder'}
          {selectedScheduleType === 'short' && 'Short Schedule Builder (2-5 items)'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">
            {currentSchedule.length}/{getMaxActivities()} activities
          </span>
          {currentSchedule.length > 0 && (
            <>
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 text-purple hover:bg-purple/10 rounded-md transition-colors"
                title="Preview Schedule"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => downloadScheduleAsPDF()}
                disabled={isGeneratingPDF}
                className="p-2 text-purple hover:bg-purple/10 rounded-md transition-colors disabled:opacity-50"
                title="Download as PDF"
              >
                {isGeneratingPDF ? (
                  <div className="animate-spin">
                    <Download size={16} />
                  </div>
                ) : (
                  <Download size={16} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {currentSchedule.length === 0 ? (
        <div className="text-center py-12 text-text-secondary border-2 border-dashed border-border rounded-lg">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <h4 className="text-lg font-medium mb-2">Start Building Your Schedule</h4>
          <p className="text-sm">
            Select activities from the library to add them to your {selectedScheduleType} schedule
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentSchedule.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:border-purple/30 transition-all"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-purple">{activity.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.name}</h4>
                  {activity.isCustom && (
                    <span className="text-xs text-purple">Custom Activity</span>
                  )}
                </div>
              </div>

              {selectedScheduleType === 'daily' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={activity.time || '09:00'}
                    onChange={(e) => updateActivityTime(activity.id, e.target.value)}
                    className="px-2 py-1 border border-border rounded text-sm bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                  <select
                    value={activity.duration || 30}
                    onChange={(e) => updateActivityDuration(activity.id, parseInt(e.target.value))}
                    className="px-2 py-1 border border-border rounded text-sm bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-1">
                {index > 0 && (
                  <button
                    onClick={() => moveActivity(index, index - 1)}
                    className="p-1 hover:bg-bg-secondary rounded transition-colors"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < currentSchedule.length - 1 && (
                  <button
                    onClick={() => moveActivity(index, index + 1)}
                    className="p-1 hover:bg-bg-secondary rounded transition-colors"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => removeActivityFromSchedule(activity.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove activity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentSchedule.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Enter schedule name..."
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
            />
            <button
              onClick={saveSchedule}
              disabled={!scheduleName.trim()}
              className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSavedSchedules = () => (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Saved Schedules</h3>
      
      {savedSchedules.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <List size={40} className="mx-auto mb-2 opacity-30" />
          <p>No saved schedules yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedSchedules.map(schedule => (
            <div key={schedule.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{schedule.name}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadScheduleAsPDF(schedule)}
                    disabled={isGeneratingPDF}
                    className="p-1 text-purple hover:bg-purple/10 rounded transition-colors disabled:opacity-50"
                    title="Download as PDF"
                  >
                    {isGeneratingPDF ? (
                      <div className="animate-spin">
                        <Download size={14} />
                      </div>
                    ) : (
                      <Download size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => loadSchedule(schedule)}
                    className="p-1 text-purple hover:bg-purple/10 rounded transition-colors"
                    aria-label="Load schedule"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    aria-label="Delete schedule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span className="capitalize">{schedule.type} Schedule</span>
                <span>{schedule.activities.length} activities</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">
                Modified: {new Date(schedule.lastModified).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">Visual Schedule Builder</h2>
        </div>
        {currentSchedule.length > 0 && (
          <button
            onClick={() => downloadScheduleAsPDF()}
            disabled={isGeneratingPDF}
            className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin">
                  <Download size={16} />
                </div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Printer size={16} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        )}
      </div>

      {renderScheduleTypeSelector()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {renderScheduleBuilder()}
        </div>
        
        <div className="space-y-6">
          {renderIconLibrary()}
          {renderSavedSchedules()}
        </div>
      </div>

      {/* Custom Activity Modal */}
      {showCustomActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-primary rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Custom Activity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Name</label>
                <input
                  type="text"
                  value={customActivityName}
                  onChange={(e) => setCustomActivityName(e.target.value)}
                  placeholder="e.g., Field Trip, Quiet Time"
                  className="w-full px-3 py-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  autoFocus
                />
              </div>
              <div className="text-sm text-text-secondary">
                <p>A star icon will be automatically generated for this custom activity.</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCustomActivityModal(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCustomActivity}
                disabled={!customActivityName.trim()}
                className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Activity</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-primary rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Preview</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadScheduleAsPDF()}
                  disabled={isGeneratingPDF}
                  className="p-2 text-purple hover:bg-purple/10 rounded-md transition-colors disabled:opacity-50"
                  title="Download as PDF"
                >
                  {isGeneratingPDF ? (
                    <div className="animate-spin">
                      <Download size={16} />
                    </div>
                  ) : (
                    <Download size={16} />
                  )}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-bg-secondary rounded-lg p-4">
              <h4 className="text-center text-lg font-medium mb-4">
                {scheduleName || 'My Schedule'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSchedule.map((activity, index) => (
                  <div key={activity.id} className="bg-bg-primary p-4 rounded-lg text-center border border-border">
                    <div className="text-purple mb-2 flex justify-center">
                      {activity.icon}
                    </div>
                    <h5 className="font-medium text-sm mb-1">{activity.name}</h5>
                    {selectedScheduleType === 'daily' && activity.time && (
                      <p className="text-xs text-text-secondary">
                        {activity.time} ({activity.duration} min)
                      </p>
                    )}
                    {selectedScheduleType !== 'daily' && (
                      <p className="text-xs text-text-secondary">Step {index + 1}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden printable content for PDF generation */}
      <div ref={printableScheduleRef} style={{ display: 'none' }}>
        {/* This will be populated dynamically during PDF generation */}
      </div>
    </div>
  );
};

export default VisualScheduleTab;