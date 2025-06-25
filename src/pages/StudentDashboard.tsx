import React, { useState } from 'react';
import TabNavigation, { TabType } from '../components/dashboard/TabNavigation';
import OverviewTab from '../components/dashboard/tabs/OverviewTab';
import DemographicsTab from '../components/dashboard/tabs/DemographicsTab';
import GoalsTab from '../components/dashboard/tabs/GoalsTab';
import BehaviorTab from '../components/dashboard/tabs/BehaviorTab';
import ServicesTab from '../components/dashboard/tabs/ServicesTab';
import MessagingTab from '../components/dashboard/tabs/MessagingTab';
import VisualScheduleTab from '../components/dashboard/tabs/VisualScheduleTab';
import ParentPortalTab from '../components/dashboard/tabs/ParentPortalTab';
import SensoryBreakModal from '../components/dashboard/SensoryBreakModal';

interface Goal {
  id: number;
  subject: string;
  description: string;
  completed: boolean;
  dueTime?: string;
}

interface ServiceEntry {
  id: number;
  studentName: string;
  serviceType: string;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'given' | 'missed';
  location?: string;
  providerName?: string;
  providerRole?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  sessionCount?: number;
  isRecurring?: boolean;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showSensoryModal, setShowSensoryModal] = useState(false);
  const [selectedDate] = useState(new Date());
  
  const [student, setStudent] = useState({
    id: 1,
    name: 'John Smith',
    grade: '3rd',
    program: 'Resource Support',
    avatar: '',
    dailyProgress: 60,
    tokens: 15,
    nextBreak: '2:30 PM',
  });

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      subject: 'ELA',
      description: 'Read 2 pages from chapter book and answer comprehension questions',
      completed: true,
      dueTime: '10:00 AM'
    },
    {
      id: 2,
      subject: 'Math',
      description: 'Complete 10 addition problems with regrouping',
      completed: true,
      dueTime: '11:30 AM'
    },
    {
      id: 3,
      subject: 'Social Skills',
      description: 'Practice turn-taking during group activity',
      completed: false,
      dueTime: '1:00 PM'
    },
    {
      id: 4,
      subject: 'ELA',
      description: 'Write 3 sentences about favorite character',
      completed: false,
      dueTime: '2:00 PM'
    },
    {
      id: 5,
      subject: 'Behavior',
      description: 'Use coping strategy when feeling frustrated',
      completed: true,
      dueTime: 'All day'
    }
  ]);

  // Shared services state that can be accessed by both Overview and Services tabs
  const [services, setServices] = useState<ServiceEntry[]>([
    {
      id: 1,
      studentName: 'John Smith',
      serviceType: 'Speech Therapy',
      providerId: 1,
      date: new Date().toISOString().split('T')[0], // Today
      startTime: '09:00',
      endTime: '09:30',
      duration: 30,
      status: 'given',
      location: 'Speech Room 101',
      providerName: 'Sarah Johnson',
      providerRole: 'Speech Language Pathologist',
      frequency: 'weekly',
      dayOfWeek: new Date().getDay(),
      sessionCount: 1,
      isRecurring: true
    },
    {
      id: 2,
      studentName: 'John Smith',
      serviceType: 'Occupational Therapy',
      providerId: 2,
      date: new Date().toISOString().split('T')[0], // Today
      startTime: '10:30',
      endTime: '11:00',
      duration: 30,
      status: 'given',
      location: 'OT Room',
      providerName: 'Michael Chen',
      providerRole: 'Occupational Therapist',
      frequency: 'weekly',
      dayOfWeek: new Date().getDay(),
      sessionCount: 1,
      isRecurring: true
    },
    {
      id: 3,
      studentName: 'John Smith',
      serviceType: 'Resource Room',
      providerId: 3,
      date: new Date().toISOString().split('T')[0], // Today
      startTime: '13:00',
      endTime: '13:45',
      duration: 45,
      status: 'scheduled',
      location: 'Resource Room 205',
      providerName: 'Lisa Rodriguez',
      providerRole: 'Resource Teacher',
      frequency: 'daily',
      dayOfWeek: new Date().getDay(),
      sessionCount: 1,
      isRecurring: true
    },
    {
      id: 4,
      studentName: 'John Smith',
      serviceType: 'Counseling',
      providerId: 4,
      date: new Date().toISOString().split('T')[0], // Today
      startTime: '14:00',
      endTime: '14:30',
      duration: 30,
      status: 'scheduled',
      location: 'Counselor Office',
      providerName: 'David Kim',
      providerRole: 'School Counselor',
      frequency: 'monthly',
      dayOfWeek: new Date().getDay(),
      sessionCount: 1,
      isRecurring: false
    }
  ]);

  const handleToggleGoal = (goalId: number) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      );
      
      // Update daily progress
      const completedGoals = updatedGoals.filter(goal => goal.completed).length;
      const totalGoals = updatedGoals.length;
      const newProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
      
      setStudent(prev => ({ ...prev, dailyProgress: newProgress }));
      
      return updatedGoals;
    });
  };

  const handleAddToken = () => {
    setStudent(prev => ({ ...prev, tokens: prev.tokens + 1 }));
  };

  const handleSensoryBreak = () => {
    setShowSensoryModal(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            goals={goals} 
            onToggleGoal={handleToggleGoal} 
            selectedDate={selectedDate}
            student={student}
            onSensoryBreak={handleSensoryBreak}
            onAddToken={handleAddToken}
            services={services}
          />
        );
      case 'demographics':
        return <DemographicsTab />;
      case 'goals':
        return <GoalsTab />;
      case 'behavior':
        return <BehaviorTab />;
      case 'services':
        return <ServicesTab services={services} setServices={setServices} />;
      case 'messaging':
        return <MessagingTab />;
      case 'schedules':
        return <VisualScheduleTab />;
      case 'parent-portal':
        return <ParentPortalTab />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-bg-primary rounded-lg shadow border border-border">
        <div className="p-6">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {renderTabContent()}
        </div>
      </div>
      
      <SensoryBreakModal 
        isOpen={showSensoryModal}
        onClose={() => setShowSensoryModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;