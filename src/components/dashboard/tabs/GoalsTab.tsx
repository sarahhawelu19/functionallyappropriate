import React, { useState } from 'react';
import { Target, Plus, Save, Calendar, CheckCircle, Clock, Edit3, Trash2, Upload, Download, Users, GraduationCap, MapPin, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Goal {
  id: number;
  text: string;
  studentName: string;
  status: 'active' | 'achieved' | 'on-hold';
  nextProgressDue: string;
  area: string;
  baseline?: string;
  targetCriteria?: string;
  extractedFromIEP?: boolean;
  lastUpdated: string;
  shortTermObjectives?: ShortTermObjective[];
}

interface ShortTermObjective {
  id: number;
  text: string;
  completed: boolean;
  targetDate: string;
}

interface WeeklyGoal {
  goalId: number;
  day: string;
  completed: boolean;
}

interface InclusionEntry {
  id: number;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  activity: string;
  location: string;
  attended: boolean;
}

const GoalsTab: React.FC = () => {
  const { classification } = useTheme();
  const isESN = classification === 'esn';

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      text: 'Student will read grade-level text with 90% accuracy and answer comprehension questions with 80% accuracy in 4 out of 5 trials.',
      studentName: 'John Smith',
      status: 'active',
      nextProgressDue: '2025-03-15',
      area: 'Reading Comprehension',
      baseline: 'Currently reads with 65% accuracy',
      targetCriteria: '90% accuracy, 4/5 trials',
      extractedFromIEP: true,
      lastUpdated: '2025-01-10',
      shortTermObjectives: isESN ? [
        { id: 1, text: 'Student will identify main idea in 3-sentence paragraphs with 70% accuracy', completed: true, targetDate: '2025-02-15' },
        { id: 2, text: 'Student will answer literal comprehension questions with 75% accuracy', completed: false, targetDate: '2025-02-28' },
        { id: 3, text: 'Student will identify supporting details in grade-level text with 80% accuracy', completed: false, targetDate: '2025-03-10' }
      ] : undefined
    },
    {
      id: 2,
      text: 'Student will solve multi-step word problems involving addition and subtraction with 75% accuracy over 3 consecutive sessions.',
      studentName: 'John Smith',
      status: 'active',
      nextProgressDue: '2025-02-28',
      area: 'Math Problem Solving',
      baseline: 'Currently solves with 45% accuracy',
      targetCriteria: '75% accuracy, 3 consecutive sessions',
      extractedFromIEP: true,
      lastUpdated: '2025-01-10',
      shortTermObjectives: isESN ? [
        { id: 4, text: 'Student will solve single-step addition problems with 80% accuracy', completed: true, targetDate: '2025-02-01' },
        { id: 5, text: 'Student will solve single-step subtraction problems with 80% accuracy', completed: true, targetDate: '2025-02-15' },
        { id: 6, text: 'Student will identify key words in word problems with 85% accuracy', completed: false, targetDate: '2025-02-25' }
      ] : undefined
    },
    {
      id: 3,
      text: 'Student will initiate appropriate social interactions with peers during unstructured activities at least 5 times per day for 2 consecutive weeks.',
      studentName: 'John Smith',
      status: 'active',
      nextProgressDue: '2025-02-15',
      area: 'Social Skills',
      baseline: 'Currently initiates 1-2 interactions per day',
      targetCriteria: '5 interactions daily, 2 weeks',
      extractedFromIEP: false,
      lastUpdated: '2025-01-12',
      shortTermObjectives: isESN ? [
        { id: 7, text: 'Student will make eye contact when greeting peers with 90% accuracy', completed: true, targetDate: '2025-01-30' },
        { id: 8, text: 'Student will use appropriate greetings with peers 3 times per day', completed: false, targetDate: '2025-02-10' },
        { id: 9, text: 'Student will ask peers to join activities 2 times per day', completed: false, targetDate: '2025-02-15' }
      ] : undefined
    }
  ]);

  const [inclusionEntries, setInclusionEntries] = useState<InclusionEntry[]>([
    {
      id: 1,
      studentName: 'John Smith',
      date: '2025-01-15',
      startTime: '09:00',
      endTime: '09:45',
      activity: 'General Ed Math',
      location: 'Classroom 3A',
      attended: true
    },
    {
      id: 2,
      studentName: 'John Smith',
      date: '2025-01-15',
      startTime: '11:30',
      endTime: '12:00',
      activity: 'Art Class',
      location: 'Art Room',
      attended: true
    },
    {
      id: 3,
      studentName: 'John Smith',
      date: '2025-01-15',
      startTime: '14:00',
      endTime: '14:30',
      activity: 'Recess',
      location: 'Playground',
      attended: false
    },
    {
      id: 4,
      studentName: 'John Smith',
      date: '2025-01-16',
      startTime: '09:00',
      endTime: '09:45',
      activity: 'General Ed Math',
      location: 'Classroom 3A',
      attended: false
    },
    {
      id: 5,
      studentName: 'John Smith',
      date: '2025-01-16',
      startTime: '13:00',
      endTime: '13:45',
      activity: 'Science Lab',
      location: 'Science Room',
      attended: false
    }
  ]);

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([
    { goalId: 1, day: 'Monday', completed: true },
    { goalId: 2, day: 'Monday', completed: false },
    { goalId: 1, day: 'Tuesday', completed: false },
    { goalId: 3, day: 'Tuesday', completed: true },
    { goalId: 2, day: 'Wednesday', completed: false },
    { goalId: 1, day: 'Thursday', completed: false },
    { goalId: 3, day: 'Friday', completed: false }
  ]);

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'weekly' | 'today' | 'inclusion'>('list');
  const [showNewInclusionForm, setShowNewInclusionForm] = useState(false);
  const [newInclusionEntry, setNewInclusionEntry] = useState<Partial<InclusionEntry>>({
    studentName: 'John Smith',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    activity: '',
    location: '',
    attended: false
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green/10 text-green border-green/20';
      case 'achieved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-bg-secondary text-text-primary border-border';
    }
  };

  const getTodaysGoals = () => {
    const todayGoalIds = weeklyGoals
      .filter(wg => wg.day === today)
      .map(wg => wg.goalId);
    
    return goals.filter(goal => todayGoalIds.includes(goal.id));
  };

  const getGoalsForDay = (day: string) => {
    const dayGoalIds = weeklyGoals
      .filter(wg => wg.day === day)
      .map(wg => wg.goalId);
    
    return goals.filter(goal => dayGoalIds.includes(goal.id));
  };

  const toggleDailyCompletion = (goalId: number, day: string) => {
    setWeeklyGoals(prev => 
      prev.map(wg => 
        wg.goalId === goalId && wg.day === day 
          ? { ...wg, completed: !wg.completed }
          : wg
      )
    );
  };

  const addGoalToDay = (goalId: number, day: string) => {
    const exists = weeklyGoals.some(wg => wg.goalId === goalId && wg.day === day);
    if (!exists) {
      setWeeklyGoals(prev => [...prev, { goalId, day, completed: false }]);
    }
  };

  const removeGoalFromDay = (goalId: number, day: string) => {
    setWeeklyGoals(prev => prev.filter(wg => !(wg.goalId === goalId && wg.day === day)));
  };

  const handleNewGoal = () => {
    const newGoal: Goal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      text: '',
      studentName: 'John Smith',
      status: 'active',
      nextProgressDue: '',
      area: '',
      extractedFromIEP: false,
      lastUpdated: new Date().toISOString().split('T')[0],
      shortTermObjectives: isESN ? [] : undefined
    };
    setSelectedGoal(newGoal);
    setShowNewGoalForm(true);
  };

  const handleSaveGoal = () => {
    if (!selectedGoal) return;
    
    if (goals.find(g => g.id === selectedGoal.id)) {
      setGoals(goals.map(g => g.id === selectedGoal.id ? selectedGoal : g));
    } else {
      setGoals([...goals, selectedGoal]);
    }
    
    setSelectedGoal(null);
    setShowNewGoalForm(false);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    setWeeklyGoals(weeklyGoals.filter(wg => wg.goalId !== id));
  };

  const handleAddShortTermObjective = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !isESN) return;

    const newObjective: ShortTermObjective = {
      id: Math.max(...(goal.shortTermObjectives?.map(o => o.id) || [0])) + 1,
      text: '',
      completed: false,
      targetDate: ''
    };

    const updatedGoals = goals.map(g => 
      g.id === goalId 
        ? { ...g, shortTermObjectives: [...(g.shortTermObjectives || []), newObjective] }
        : g
    );
    setGoals(updatedGoals);
  };

  const handleUpdateShortTermObjective = (goalId: number, objectiveId: number, updates: Partial<ShortTermObjective>) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId 
        ? { 
            ...g, 
            shortTermObjectives: g.shortTermObjectives?.map(o => 
              o.id === objectiveId ? { ...o, ...updates } : o
            )
          }
        : g
    );
    setGoals(updatedGoals);
  };

  const handleDeleteShortTermObjective = (goalId: number, objectiveId: number) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId 
        ? { 
            ...g, 
            shortTermObjectives: g.shortTermObjectives?.filter(o => o.id !== objectiveId)
          }
        : g
    );
    setGoals(updatedGoals);
  };

  const handleAddInclusionEntry = () => {
    if (!newInclusionEntry.date || !newInclusionEntry.startTime || !newInclusionEntry.endTime || !newInclusionEntry.activity || !newInclusionEntry.location) {
      return;
    }

    const entry: InclusionEntry = {
      id: Math.max(...inclusionEntries.map(e => e.id)) + 1,
      studentName: newInclusionEntry.studentName || 'John Smith',
      date: newInclusionEntry.date!,
      startTime: newInclusionEntry.startTime!,
      endTime: newInclusionEntry.endTime!,
      activity: newInclusionEntry.activity!,
      location: newInclusionEntry.location!,
      attended: false
    };

    setInclusionEntries([...inclusionEntries, entry]);
    setNewInclusionEntry({
      studentName: 'John Smith',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      activity: '',
      location: '',
      attended: false
    });
    setShowNewInclusionForm(false);
  };

  const toggleInclusionAttendance = (entryId: number) => {
    setInclusionEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, attended: !entry.attended }
          : entry
      )
    );
  };

  const renderGoalList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="text-green" size={24} />
          <h2 className="text-xl font-semibold">IEP Goals Management</h2>
          <div className="flex items-center space-x-2 ml-4">
            {classification === 'mild-mod' ? (
              <div className="flex items-center space-x-1 px-2 py-1 bg-bg-secondary rounded-md">
                <GraduationCap size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">Mild/Mod Mode</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green/10 border border-green/20 rounded-md">
                <Users size={16} className="text-green" />
                <span className="text-sm text-green">ESN Mode - Enhanced Features</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn border border-border hover:bg-bg-secondary flex items-center space-x-2">
            <Upload size={16} />
            <span>Upload IEP</span>
          </button>
          <button 
            onClick={handleNewGoal}
            className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New Goal</span>
          </button>
        </div>
      </div>

      {/* IEP Upload Notice */}
      <div className="bg-green/10 border border-green/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Upload className="text-green mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-green mb-1">Automatic Goal Extraction</h3>
            <p className="text-sm text-text-secondary">
              Upload your student's most recent IEP document and BetterSped will automatically extract and populate their annual goals.
              {isESN && ' For ESN students, short-term objectives will also be extracted and organized.'}
            </p>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="border border-border rounded-lg p-4 hover:border-green/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-green/20 text-green text-sm rounded-full font-medium">
                  {goal.area}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('-', ' ').toUpperCase()}
                </span>
                {goal.extractedFromIEP && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                    Auto-Extracted
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedGoal(goal)}
                  className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
                  aria-label="Edit goal"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-2 hover:bg-bg-secondary rounded-md transition-colors text-red-500"
                  aria-label="Delete goal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-text-primary mb-3 leading-relaxed">{goal.text}</p>
            
            {/* Short-Term Objectives Section (ESN Only) */}
            {isESN && goal.shortTermObjectives && (
              <div className="mt-4 p-4 bg-green/5 border border-green/20 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green">Short-Term Objectives</h4>
                  <button
                    onClick={() => handleAddShortTermObjective(goal.id)}
                    className="px-3 py-1 bg-green text-white text-sm rounded-md hover:bg-green/80 transition-colors flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Add Objective</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {goal.shortTermObjectives.map(objective => (
                    <div key={objective.id} className="flex items-start space-x-3 p-3 bg-bg-primary rounded-md border border-border">
                      <input
                        type="checkbox"
                        checked={objective.completed}
                        onChange={(e) => handleUpdateShortTermObjective(goal.id, objective.id, { completed: e.target.checked })}
                        className="w-4 h-4 text-green border-border rounded focus:ring-green mt-0.5"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={objective.text}
                          onChange={(e) => handleUpdateShortTermObjective(goal.id, objective.id, { text: e.target.value })}
                          className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green text-sm"
                          placeholder="Enter short-term objective..."
                        />
                        <input
                          type="date"
                          value={objective.targetDate}
                          onChange={(e) => handleUpdateShortTermObjective(goal.id, objective.id, { targetDate: e.target.value })}
                          className="mt-2 p-1 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteShortTermObjective(goal.id, objective.id)}
                        className="p-1 hover:bg-bg-secondary rounded-md transition-colors text-red-500"
                        aria-label="Delete objective"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mt-3">
              <div className="p-2 bg-bg-secondary rounded">
                <span className="font-medium text-text-secondary">Baseline:</span>
                <p className="mt-1">{goal.baseline || 'Not specified'}</p>
              </div>
              <div className="p-2 bg-bg-secondary rounded">
                <span className="font-medium text-text-secondary">Target Criteria:</span>
                <p className="mt-1">{goal.targetCriteria || 'Not specified'}</p>
              </div>
              <div className="p-2 bg-bg-secondary rounded">
                <span className="font-medium text-text-secondary">Next Progress Due:</span>
                <p className="mt-1 font-medium text-green">
                  {goal.nextProgressDue ? new Date(goal.nextProgressDue).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <Target size={48} className="mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Goals Added Yet</h3>
          <p className="mb-4">Upload an IEP document or manually add goals to get started</p>
          <button 
            onClick={handleNewGoal}
            className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2 mx-auto"
          >
            <Plus size={16} />
            <span>Add First Goal</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderInclusionMinutes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="text-green" size={24} />
          <h2 className="text-xl font-semibold">Inclusion Minutes Tracking</h2>
          <div className="flex items-center space-x-1 px-2 py-1 bg-green/10 border border-green/20 rounded-md ml-4">
            <Users size={16} className="text-green" />
            <span className="text-sm text-green">ESN Feature</span>
          </div>
        </div>
        <button 
          onClick={() => setShowNewInclusionForm(true)}
          className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Schedule Entry</span>
        </button>
      </div>

      <div className="bg-green/10 border border-green/20 rounded-lg p-4">
        <h3 className="font-medium text-green mb-2">Mainstreaming Schedule & Attendance</h3>
        <p className="text-sm text-text-secondary">
          Track scheduled inclusion minutes for ESN students in general education settings. 
          Mark attendance for each scheduled period to monitor participation and progress.
        </p>
      </div>

      {/* New Inclusion Entry Form */}
      {showNewInclusionForm && (
        <div className="border border-border rounded-lg p-4 bg-bg-secondary">
          <h3 className="font-medium mb-4">Add New Inclusion Schedule Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newInclusionEntry.date}
                onChange={(e) => setNewInclusionEntry(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Activity/Class</label>
              <input
                type="text"
                value={newInclusionEntry.activity}
                onChange={(e) => setNewInclusionEntry(prev => ({ ...prev, activity: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="e.g., General Ed Math, Art Class, Recess"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={newInclusionEntry.startTime}
                onChange={(e) => setNewInclusionEntry(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={newInclusionEntry.endTime}
                onChange={(e) => setNewInclusionEntry(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={newInclusionEntry.location}
                onChange={(e) => setNewInclusionEntry(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
                placeholder="e.g., Classroom 3A, Art Room, Playground"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button 
              onClick={() => setShowNewInclusionForm(false)}
              className="btn border border-border hover:bg-bg-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddInclusionEntry}
              className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Add Entry</span>
            </button>
          </div>
        </div>
      )}

      {/* Inclusion Entries List */}
      <div className="space-y-4">
        {inclusionEntries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(entry => (
            <div key={entry.id} className={`border rounded-lg p-4 transition-all ${
              entry.attended ? 'border-green bg-green/5' : 'border-border hover:border-green/30'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <label className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={entry.attended}
                      onChange={() => toggleInclusionAttendance(entry.id)}
                      className="w-5 h-5 text-green border-border rounded focus:ring-green"
                    />
                  </label>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-medium text-lg">{entry.activity}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.attended ? 'bg-green text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.attended ? 'Attended' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-text-secondary" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-text-secondary" />
                        <span>{entry.startTime} - {entry.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-text-secondary" />
                        <span>{entry.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {entry.attended && (
                  <div className="flex items-center space-x-1 text-green">
                    <Check size={16} />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {inclusionEntries.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">No Inclusion Schedule Entries</h3>
          <p className="mb-4">Add scheduled inclusion minutes to track mainstreaming participation</p>
          <button 
            onClick={() => setShowNewInclusionForm(true)}
            className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2 mx-auto"
          >
            <Plus size={16} />
            <span>Add First Entry</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderWeeklyPlanner = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="text-green" size={24} />
          <h2 className="text-xl font-semibold">Weekly Goal Planner</h2>
        </div>
        <button 
          onClick={() => setActiveView('list')}
          className="btn border border-border hover:bg-bg-secondary"
        >
          Back to Goals List
        </button>
      </div>

      <div className="bg-green/10 border border-green/20 rounded-lg p-4">
        <h3 className="font-medium text-green mb-2">Plan Your Week</h3>
        <p className="text-sm text-text-secondary">
          Assign goals to specific days of the week to organize your classroom instruction. 
          Goals assigned to today will automatically appear in your "Today's Goals" dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {weekDays.map(day => (
          <div key={day} className={`border rounded-lg p-4 ${day === today ? 'border-green bg-green/5' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-medium ${day === today ? 'text-green' : 'text-text-primary'}`}>
                {day}
                {day === today && <span className="ml-2 text-xs">(Today)</span>}
              </h3>
              <span className="text-xs text-text-secondary">
                {getGoalsForDay(day).length} goals
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              {getGoalsForDay(day).map(goal => {
                const weeklyGoal = weeklyGoals.find(wg => wg.goalId === goal.id && wg.day === day);
                return (
                  <div key={`${goal.id}-${day}`} className="p-2 bg-bg-secondary rounded text-xs">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium truncate">{goal.area}</span>
                      <button
                        onClick={() => removeGoalFromDay(goal.id, day)}
                        className="text-red-500 hover:text-red-700 ml-1"
                        aria-label="Remove goal"
                      >
                        ×
                      </button>
                    </div>
                    {day === today && (
                      <label className="flex items-center space-x-1 mt-1">
                        <input
                          type="checkbox"
                          checked={weeklyGoal?.completed || false}
                          onChange={() => toggleDailyCompletion(goal.id, day)}
                          className="w-3 h-3 text-green border-border rounded focus:ring-green"
                        />
                        <span className="text-xs">Completed</span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addGoalToDay(parseInt(e.target.value), day);
                  e.target.value = '';
                }
              }}
              className="w-full text-xs p-2 border border-border rounded bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
            >
              <option value="">+ Add Goal</option>
              {goals
                .filter(goal => !getGoalsForDay(day).some(dg => dg.id === goal.id))
                .map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.area}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTodaysGoals = () => {
    const todaysGoals = getTodaysGoals();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green" size={24} />
            <h2 className="text-xl font-semibold">Today's Goals ({today})</h2>
          </div>
          <button 
            onClick={() => setActiveView('weekly')}
            className="btn bg-green text-white hover:bg-green/90"
          >
            Plan Weekly Goals
          </button>
        </div>

        {todaysGoals.length > 0 ? (
          <div className="space-y-3">
            {todaysGoals.map(goal => {
              const weeklyGoal = weeklyGoals.find(wg => wg.goalId === goal.id && wg.day === today);
              return (
                <div key={goal.id} className={`border rounded-lg p-4 transition-all ${
                  weeklyGoal?.completed ? 'border-green bg-green/5' : 'border-border hover:border-green/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    <label className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={weeklyGoal?.completed || false}
                        onChange={() => toggleDailyCompletion(goal.id, today)}
                        className="w-5 h-5 text-green border-border rounded focus:ring-green"
                      />
                    </label>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-green/20 text-green text-sm rounded-full font-medium">
                          {goal.area}
                        </span>
                        {weeklyGoal?.completed && (
                          <span className="px-2 py-1 bg-green text-white text-xs rounded-full">
                            Completed Today
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${weeklyGoal?.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                        {goal.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            <Calendar size={40} className="mx-auto mb-2 opacity-30" />
            <p>No goals scheduled for today</p>
            <button 
              onClick={() => setActiveView('weekly')}
              className="mt-4 btn bg-green text-white hover:bg-green/90"
            >
              Plan Weekly Goals
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderGoalForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {selectedGoal?.id ? 'Edit Goal' : 'Add New Goal'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Goal Area</label>
            <input
              type="text"
              value={selectedGoal?.area || ''}
              onChange={e => setSelectedGoal(prev => prev ? {...prev, area: e.target.value} : null)}
              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              placeholder="e.g., Reading Comprehension, Math Problem Solving"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Goal Text</label>
            <textarea
              value={selectedGoal?.text || ''}
              onChange={e => setSelectedGoal(prev => prev ? {...prev, text: e.target.value} : null)}
              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green h-24"
              placeholder="Enter the complete IEP goal text..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Baseline</label>
              <textarea
                value={selectedGoal?.baseline || ''}
                onChange={e => setSelectedGoal(prev => prev ? {...prev, baseline: e.target.value} : null)}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green h-16"
                placeholder="Current performance level..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Criteria</label>
              <textarea
                value={selectedGoal?.targetCriteria || ''}
                onChange={e => setSelectedGoal(prev => prev ? {...prev, targetCriteria: e.target.value} : null)}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green h-16"
                placeholder="Success criteria..."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={selectedGoal?.status || 'active'}
                onChange={e => setSelectedGoal(prev => prev ? {...prev, status: e.target.value as any} : null)}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              >
                <option value="active">Active</option>
                <option value="achieved">Achieved</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Next Progress Due</label>
              <input
                type="date"
                value={selectedGoal?.nextProgressDue || ''}
                onChange={e => setSelectedGoal(prev => prev ? {...prev, nextProgressDue: e.target.value} : null)}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={() => {
              setSelectedGoal(null);
              setShowNewGoalForm(false);
            }}
            className="btn border border-border hover:bg-bg-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveGoal}
            className="btn bg-green text-white hover:bg-green/90 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Goal</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex items-center space-x-1 bg-bg-secondary rounded-lg p-1">
        <button
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'list' ? 'bg-green text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Goals List
        </button>
        <button
          onClick={() => setActiveView('today')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'today' ? 'bg-green text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Today's Goals
        </button>
        <button
          onClick={() => setActiveView('weekly')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'weekly' ? 'bg-green text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Weekly Planner
        </button>
        {isESN && (
          <button
            onClick={() => setActiveView('inclusion')}
            className={`px-4 py-2 rounded-md transition-all ${
              activeView === 'inclusion' ? 'bg-green text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Inclusion Minutes
          </button>
        )}
      </div>

      {/* Content based on active view */}
      {activeView === 'list' && renderGoalList()}
      {activeView === 'today' && renderTodaysGoals()}
      {activeView === 'weekly' && renderWeeklyPlanner()}
      {activeView === 'inclusion' && isESN && renderInclusionMinutes()}

      {/* Goal Form Modal */}
      {(selectedGoal || showNewGoalForm) && renderGoalForm()}
    </div>
  );
};

export default GoalsTab;