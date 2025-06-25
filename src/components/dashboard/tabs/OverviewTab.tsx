import React from 'react';
import DailyGoals from '../DailyGoals';
import StudentProfile from '../StudentProfile';
import CollapsibleSection from '../../common/CollapsibleSection';
import { Calendar, TrendingUp, AlertCircle, CheckCircle, FileText, Users, Clock, User, Target, Bell } from 'lucide-react';
import { addDays, addMonths } from 'date-fns';

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
}

interface OverviewTabProps {
  goals: Goal[];
  onToggleGoal: (goalId: number) => void;
  selectedDate: Date;
  student: {
    id: number;
    name: string;
    grade: string;
    program: string;
    avatar?: string;
    dailyProgress: number;
    tokens: number;
    nextBreak?: string;
  };
  onSensoryBreak: () => void;
  onAddToken: () => void;
  services?: ServiceEntry[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  goals, 
  onToggleGoal, 
  selectedDate, 
  student,
  onSensoryBreak,
  onAddToken,
  services = []
}) => {
  // Generate upcoming IEP and progress report dates
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'IEP Annual Review Due', 
      date: '2025-09-15', 
      time: 'All Day', 
      type: 'iep-due',
      priority: 'high',
      daysUntil: Math.ceil((new Date('2025-09-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    },
    { 
      id: 2, 
      title: 'Progress Report Due', 
      date: '2025-03-15', 
      time: 'End of Day', 
      type: 'progress-report',
      priority: 'medium',
      daysUntil: Math.ceil((new Date('2025-03-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    },
    { 
      id: 3, 
      title: 'IEP Team Meeting', 
      date: '2025-02-01', 
      time: '10:00 AM', 
      type: 'meeting',
      priority: 'high',
      daysUntil: Math.ceil((new Date('2025-02-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    },
    { 
      id: 4, 
      title: 'Parent Conference', 
      date: '2025-01-25', 
      time: '2:30 PM', 
      type: 'conference',
      priority: 'medium',
      daysUntil: Math.ceil((new Date('2025-01-25').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    },
  ];

  const recentProgress = [
    { area: 'Reading Comprehension', progress: 85, trend: 'up' },
    { area: 'Math Problem Solving', progress: 72, trend: 'up' },
    { area: 'Social Skills', progress: 68, trend: 'stable' },
    { area: 'Written Expression', progress: 45, trend: 'down' },
  ];

  // Get today's services
  const today = new Date().toISOString().split('T')[0];
  const todaysServices = services.filter(service => service.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const alerts = [
    { 
      id: 1, 
      message: 'IEP Annual Review due in 247 days', 
      type: 'info',
      action: 'Schedule meeting 2 weeks prior'
    },
    { 
      id: 2, 
      message: 'Progress Report due in 58 days', 
      type: 'warning',
      action: 'Begin data collection'
    },
    // Add service-related alerts
    ...services.filter(s => s.status === 'missed' && s.date === today).map(service => ({
      id: `service-${service.id}`,
      message: `${service.serviceType} session missed today`,
      type: 'warning' as const,
      action: 'Contact provider for reschedule'
    }))
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'iep-due':
        return 'bg-red-500/20 text-red-700 border-red-200';
      case 'progress-report':
        return 'bg-gold/20 text-gold border-gold/20';
      case 'meeting':
        return 'bg-purple/20 text-purple border-purple/20';
      case 'conference':
        return 'bg-teal/20 text-teal border-teal/20';
      default:
        return 'bg-bg-secondary text-text-primary border-border';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'iep-due':
        return <FileText size={16} />;
      case 'progress-report':
        return <FileText size={16} />;
      case 'meeting':
        return <Users size={16} />;
      case 'conference':
        return <Calendar size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getPriorityBadge = (priority: string, daysUntil: number) => {
    if (daysUntil <= 7) {
      return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Urgent</span>;
    } else if (daysUntil <= 30) {
      return <span className="px-2 py-1 bg-gold text-black text-xs rounded-full">Soon</span>;
    } else if (priority === 'high') {
      return <span className="px-2 py-1 bg-purple text-white text-xs rounded-full">High</span>;
    }
    return null;
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'given':
        return 'text-green';
      case 'scheduled':
        return 'text-purple';
      case 'missed':
        return 'text-red-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'given':
        return '✓';
      case 'scheduled':
        return '○';
      case 'missed':
        return '✗';
      default:
        return '○';
    }
  };

  // Calculate badge values for collapsible sections
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completedServices = todaysServices.filter(s => s.status === 'given').length;
  const totalServices = todaysServices.length;
  const urgentEvents = upcomingEvents.filter(e => e.daysUntil <= 7).length;
  const urgentAlerts = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Student Profile - always visible */}
      <StudentProfile 
        student={student}
        onSensoryBreak={onSensoryBreak}
        onAddToken={onAddToken}
      />
      
      <div className="space-y-4">
        {/* Today's Goals - Collapsible */}
        <CollapsibleSection
          title="Today's Goals"
          icon={<Target className="text-green" size={20} />}
          badge={
            <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
              {completedGoals}/{totalGoals} Complete
            </span>
          }
          defaultExpanded={true}
          accentColor="green"
          className="bg-bg-primary"
        >
          <DailyGoals 
            goals={goals} 
            onToggleGoal={onToggleGoal} 
            selectedDate={selectedDate} 
          />
        </CollapsibleSection>

        {/* Today's Services - Collapsible */}
        <CollapsibleSection
          title="Today's Services"
          icon={<User className="text-purple" size={20} />}
          badge={
            <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full font-medium">
              {completedServices}/{totalServices} Complete
            </span>
          }
          defaultExpanded={true}
          accentColor="purple"
          className="bg-bg-primary"
        >
          {todaysServices.length > 0 ? (
            <div className="space-y-3">
              {todaysServices.map(service => (
                <div key={service.id} className={`p-3 rounded-lg border transition-all ${
                  service.status === 'given' ? 'border-green bg-green/5' :
                  service.status === 'missed' ? 'border-red-500 bg-red-50' :
                  'border-border'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getServiceStatusColor(service.status)}`}>
                        {getServiceStatusIcon(service.status)}
                      </span>
                      <span className="font-medium text-sm">{service.serviceType}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      service.status === 'given' ? 'bg-green text-white' :
                      service.status === 'missed' ? 'bg-red-500 text-white' :
                      'bg-purple text-white'
                    }`}>
                      {service.status === 'given' ? 'Completed' : 
                       service.status === 'missed' ? 'Missed' : 'Scheduled'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{service.startTime} - {service.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span>{service.providerName || 'Provider'}</span>
                    </div>
                    {service.location && (
                      <div className="flex items-center space-x-1 sm:col-span-2">
                        <span>📍</span>
                        <span>{service.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-text-secondary">
              <User size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No services scheduled for today</p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-purple/10 border border-purple/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={16} className="text-purple" />
              <span className="font-medium text-sm">Service Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-text-secondary">Total:</span>
                <span className="ml-1 font-medium text-purple">
                  {todaysServices.length}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Completed:</span>
                <span className="ml-1 font-medium text-green">
                  {todaysServices.filter(s => s.status === 'given').length}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Remaining:</span>
                <span className="ml-1 font-medium text-purple">
                  {todaysServices.filter(s => s.status === 'scheduled').length}
                </span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Upcoming IEP & Reports - Collapsible */}
        <CollapsibleSection
          title="Upcoming IEP & Reports"
          icon={<Calendar className="text-purple" size={20} />}
          badge={
            urgentEvents > 0 ? (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                {urgentEvents} Urgent
              </span>
            ) : (
              <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full font-medium">
                {upcomingEvents.length} Events
              </span>
            )
          }
          defaultExpanded={false}
          accentColor="purple"
          className="bg-bg-primary"
        >
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(event.type)}
                    <h4 className="font-medium text-sm">{event.title}</h4>
                  </div>
                  {getPriorityBadge(event.priority, event.daysUntil)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>{event.date} at {event.time}</span>
                  <span className="font-medium">
                    {event.daysUntil > 0 ? `${event.daysUntil} days` : 'Today'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-purple/10 border border-purple/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle size={16} className="text-purple" />
              <span className="font-medium text-sm">Scheduling Tip</span>
            </div>
            <p className="text-xs text-text-secondary">
              IEP meetings should be scheduled 2-3 weeks before due dates to allow time for preparation and parent coordination.
            </p>
          </div>
        </CollapsibleSection>

        {/* Progress Summary - Collapsible */}
        <CollapsibleSection
          title="Progress Summary"
          icon={<TrendingUp className="text-purple" size={20} />}
          badge={
            <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
              {recentProgress.filter(p => p.trend === 'up').length} Improving
            </span>
          }
          defaultExpanded={false}
          accentColor="purple"
          className="bg-bg-primary"
        >
          <div className="space-y-4">
            {recentProgress.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.area}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{item.progress}%</span>
                      <div className={`w-2 h-2 rounded-full ${
                        item.trend === 'up' ? 'bg-green' :
                        item.trend === 'down' ? 'bg-red-500' :
                        'bg-gold'
                      }`}></div>
                    </div>
                  </div>
                  <div className="w-full bg-bg-secondary rounded-full h-2">
                    <div 
                      className="bg-purple h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Alerts & Reminders - Collapsible */}
        <CollapsibleSection
          title="Alerts & Reminders"
          icon={<Bell className="text-purple" size={20} />}
          badge={
            urgentAlerts > 0 ? (
              <span className="px-2 py-1 bg-gold text-black text-xs rounded-full font-medium">
                {urgentAlerts} Warnings
              </span>
            ) : (
              <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
                All Clear
              </span>
            )
          }
          defaultExpanded={urgentAlerts > 0}
          accentColor="purple"
          className="bg-bg-primary"
        >
          {alerts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-gold/10 border-gold' :
                  alert.type === 'info' ? 'bg-teal/10 border-teal' :
                  'bg-red-50 border-red-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-2">
                        {alert.type === 'warning' ? (
                          <AlertCircle size={16} className="text-gold mt-0.5" />
                        ) : alert.type === 'info' ? (
                          <CheckCircle size={16} className="text-teal mt-0.5" />
                        ) : (
                          <AlertCircle size={16} className="text-red-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-text-secondary mt-1">{alert.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-text-secondary">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">All caught up! No alerts at this time.</p>
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default OverviewTab;