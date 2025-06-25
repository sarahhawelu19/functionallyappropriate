import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Check, X, AlertTriangle, Bell, Save, Edit3, Trash2, Users, MapPin, Repeat } from 'lucide-react';

interface ServiceProvider {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface ServiceEntry {
  id: number;
  studentName: string;
  serviceType: string;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'given' | 'missed';
  location?: string;
  notes?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  sessionCount?: number;
  isRecurring?: boolean;
  providerName?: string;
  providerRole?: string;
}

interface MissedServiceNotification {
  id: number;
  serviceId: number;
  providerId: number;
  studentName: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'reschedule' | 'no-reschedule';
  sentAt: string;
}

interface ServicesTabProps {
  services: ServiceEntry[];
  setServices: React.Dispatch<React.SetStateAction<ServiceEntry[]>>;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, setServices }) => {
  const [serviceProviders] = useState<ServiceProvider[]>([
    { id: 1, name: 'Sarah Johnson', role: 'Speech Language Pathologist', email: 'sarah.johnson@school.edu' },
    { id: 2, name: 'Michael Chen', role: 'Occupational Therapist', email: 'michael.chen@school.edu' },
    { id: 3, name: 'Lisa Rodriguez', role: 'Resource Teacher', email: 'lisa.rodriguez@school.edu' },
    { id: 4, name: 'David Kim', role: 'School Counselor', email: 'david.kim@school.edu' },
    { id: 5, name: 'Emily Davis', role: 'Physical Therapist', email: 'emily.davis@school.edu' },
  ]);

  const [serviceTypes] = useState([
    'Speech Therapy',
    'Occupational Therapy',
    'Physical Therapy',
    'Resource Room',
    'Counseling',
    'Behavior Support',
    'Social Skills Training',
    'Adaptive PE',
    'Vision Services',
    'Hearing Services',
    'Other'
  ]);

  const [notifications, setNotifications] = useState<MissedServiceNotification[]>([
    {
      id: 1,
      serviceId: 3,
      providerId: 3,
      studentName: 'John Smith',
      serviceType: 'Resource Room',
      date: '2025-01-15',
      time: '13:00',
      status: 'pending',
      sentAt: '2025-01-15T13:45:00'
    }
  ]);

  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [activeView, setActiveView] = useState<'weekly' | 'schedule' | 'notifications'>('weekly');
  
  const [newService, setNewService] = useState<Partial<ServiceEntry>>({
    studentName: 'John Smith',
    serviceType: '',
    providerId: 0,
    startTime: '',
    endTime: '',
    duration: 30,
    status: 'scheduled',
    location: '',
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    sessionCount: 1,
    isRecurring: false
  });

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  // Generate recurring service dates based on frequency
  const generateRecurringDates = (startDate: Date, frequency: 'daily' | 'weekly' | 'monthly', dayOfWeek: number, sessionCount: number) => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    // Adjust to the correct day of week for the first occurrence
    const dayDiff = dayOfWeek - currentDate.getDay();
    if (dayDiff !== 0) {
      currentDate.setDate(currentDate.getDate() + (dayDiff >= 0 ? dayDiff : dayDiff + 7));
    }
    
    for (let i = 0; i < sessionCount; i++) {
      dates.push(new Date(currentDate));
      
      switch (frequency) {
        case 'daily':
          // Skip weekends for daily services
          do {
            currentDate.setDate(currentDate.getDate() + 1);
          } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
    
    return dates;
  };

  // Get current week's services
  const getCurrentWeekServices = () => {
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return services.filter(service => {
      const serviceDate = new Date(service.date);
      return serviceDate >= startOfWeek && serviceDate <= endOfWeek;
    }).sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const getProviderName = (providerId: number) => {
    const provider = serviceProviders.find(p => p.id === providerId);
    return provider ? provider.name : 'Unknown Provider';
  };

  const getProviderRole = (providerId: number) => {
    const provider = serviceProviders.find(p => p.id === providerId);
    return provider ? provider.role : 'Unknown Role';
  };

  const handleServiceStatusChange = (serviceId: number, newStatus: 'given' | 'missed') => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const updatedService = { ...service, status: newStatus };
        
        // If marking as missed, create notification
        if (newStatus === 'missed') {
          const notification: MissedServiceNotification = {
            id: Math.max(...notifications.map(n => n.id), 0) + 1,
            serviceId: service.id,
            providerId: service.providerId,
            studentName: service.studentName,
            serviceType: service.serviceType,
            date: service.date,
            time: service.startTime,
            status: 'pending',
            sentAt: new Date().toISOString()
          };
          setNotifications(prev => [...prev, notification]);
        }
        
        return updatedService;
      }
      return service;
    }));
  };

  const handleAddService = () => {
    if (!newService.serviceType || !newService.providerId || !newService.startTime || !newService.frequency || newService.dayOfWeek === undefined || !newService.sessionCount) {
      return;
    }

    const startDate = new Date();
    const endTime = calculateEndTime(newService.startTime!, newService.duration!);
    const provider = serviceProviders.find(p => p.id === newService.providerId);
    
    // Generate dates based on frequency and session count
    const serviceDates = generateRecurringDates(
      startDate, 
      newService.frequency as 'daily' | 'weekly' | 'monthly', 
      newService.dayOfWeek!, 
      newService.sessionCount!
    );

    const newServices: ServiceEntry[] = serviceDates.map((date, index) => ({
      id: Math.max(...services.map(s => s.id), 0) + 1 + index,
      studentName: newService.studentName || 'John Smith',
      serviceType: newService.serviceType!,
      providerId: newService.providerId!,
      date: date.toISOString().split('T')[0],
      startTime: newService.startTime!,
      endTime: endTime,
      duration: newService.duration || 30,
      status: 'scheduled',
      location: newService.location || '',
      frequency: newService.frequency as 'daily' | 'weekly' | 'monthly',
      dayOfWeek: newService.dayOfWeek,
      sessionCount: index + 1,
      isRecurring: newService.sessionCount! > 1,
      providerName: provider?.name,
      providerRole: provider?.role
    }));

    setServices(prev => [...prev, ...newServices]);

    setNewService({
      studentName: 'John Smith',
      serviceType: '',
      providerId: 0,
      startTime: '',
      endTime: '',
      duration: 30,
      status: 'scheduled',
      location: '',
      frequency: 'weekly',
      dayOfWeek: 1,
      sessionCount: 1,
      isRecurring: false
    });
    setShowNewServiceForm(false);
  };

  const handleNotificationResponse = (notificationId: number, response: 'reschedule' | 'no-reschedule') => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: response }
        : notification
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'given':
        return 'bg-green text-white';
      case 'missed':
        return 'bg-red-500 text-white';
      case 'scheduled':
        return 'bg-purple text-white';
      default:
        return 'bg-bg-secondary text-text-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'given':
        return <Check size={16} />;
      case 'missed':
        return <X size={16} />;
      case 'scheduled':
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-teal/20 text-teal';
      case 'weekly':
        return 'bg-purple/20 text-purple';
      case 'monthly':
        return 'bg-gold/20 text-gold';
      default:
        return 'bg-bg-secondary text-text-primary';
    }
  };

  const currentWeekServices = getCurrentWeekServices();

  const renderWeeklyView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">Weekly Service Tracking</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
            className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
          >
            ←
          </button>
          <span className="font-medium">
            Week of {selectedWeek.toLocaleDateString()}
          </span>
          <button
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
            className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
          >
            →
          </button>
          <button 
            onClick={() => setShowNewServiceForm(true)}
            className="btn bg-purple text-white hover:bg-purple/90 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Schedule Service</span>
          </button>
        </div>
      </div>

      {/* Service Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-purple/10 border-purple/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple">Total Scheduled</p>
              <p className="text-2xl font-bold text-purple">
                {currentWeekServices.length}
              </p>
            </div>
            <Calendar className="text-purple" size={24} />
          </div>
        </div>
        
        <div className="card bg-green/10 border-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green">Services Given</p>
              <p className="text-2xl font-bold text-green">
                {currentWeekServices.filter(s => s.status === 'given').length}
              </p>
            </div>
            <Check className="text-green" size={24} />
          </div>
        </div>
        
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Services Missed</p>
              <p className="text-2xl font-bold text-red-700">
                {currentWeekServices.filter(s => s.status === 'missed').length}
              </p>
            </div>
            <X className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="card bg-gold/10 border-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gold">Completion Rate</p>
              <p className="text-2xl font-bold text-gold">
                {currentWeekServices.length > 0 
                  ? Math.round((currentWeekServices.filter(s => s.status === 'given').length / currentWeekServices.length) * 100)
                  : 0}%
              </p>
            </div>
            <Users className="text-gold" size={24} />
          </div>
        </div>
      </div>

      {/* Weekly Services List */}
      <div className="space-y-4">
        {currentWeekServices.length > 0 ? (
          currentWeekServices.map(service => (
            <div key={service.id} className={`border rounded-lg p-4 transition-all ${
              service.status === 'given' ? 'border-green bg-green/5' :
              service.status === 'missed' ? 'border-red-500 bg-red-50' :
              'border-border hover:border-purple/30'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-lg">{service.serviceType}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="capitalize">{service.status}</span>
                    </span>
                    {service.frequency && (
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getFrequencyColor(service.frequency)}`}>
                        <Repeat size={12} />
                        <span className="capitalize">{service.frequency}</span>
                      </span>
                    )}
                    {service.isRecurring && (
                      <span className="px-2 py-1 bg-bg-secondary text-text-secondary text-xs rounded-full">
                        Session {service.sessionCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-text-secondary" />
                      <span>{new Date(service.date).toLocaleDateString()} ({weekDayNames[new Date(service.date).getDay()]})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-text-secondary" />
                      <span>{service.startTime} - {service.endTime} ({service.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-text-secondary" />
                      <span>{service.providerName || getProviderName(service.providerId)}</span>
                    </div>
                    {service.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-text-secondary" />
                        <span>{service.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-text-secondary">
                    Provider: {service.providerRole || getProviderRole(service.providerId)}
                    {service.frequency && (
                      <span className="ml-4">
                        Frequency: {service.frequency} on {weekDayNames[service.dayOfWeek || 0]}s
                      </span>
                    )}
                  </div>
                </div>
                
                {service.status === 'scheduled' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleServiceStatusChange(service.id, 'given')}
                      className="px-3 py-2 bg-green text-white text-sm rounded-md hover:bg-green/80 transition-colors flex items-center space-x-1"
                    >
                      <Check size={14} />
                      <span>Mark Given</span>
                    </button>
                    <button
                      onClick={() => handleServiceStatusChange(service.id, 'missed')}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1"
                    >
                      <X size={14} />
                      <span>Mark Missed</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">No Services Scheduled</h3>
            <p className="mb-4">Schedule services for this week to start tracking</p>
            <button 
              onClick={() => setShowNewServiceForm(true)}
              className="btn bg-purple text-white hover:bg-purple/90 flex items-center space-x-2 mx-auto"
            >
              <Plus size={16} />
              <span>Schedule First Service</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="text-purple" size={24} />
        <h2 className="text-xl font-semibold">Missed Service Notifications</h2>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-lg p-4">
        <h3 className="font-medium text-purple mb-2">Automatic Notification System</h3>
        <p className="text-sm text-text-secondary">
          When a service is marked as missed, an automatic notification is sent to the assigned service provider. 
          They can respond with their preferred action for rescheduling.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-red-500" size={20} />
                  <div>
                    <h3 className="font-medium">Missed Service Notification</h3>
                    <p className="text-sm text-text-secondary">
                      Sent to {getProviderName(notification.providerId)} on {new Date(notification.sentAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  notification.status === 'pending' ? 'bg-gold text-black' :
                  notification.status === 'reschedule' ? 'bg-purple text-white' :
                  'bg-bg-secondary text-text-primary'
                }`}>
                  {notification.status === 'pending' ? 'Awaiting Response' :
                   notification.status === 'reschedule' ? 'Reschedule Requested' :
                   'No Reschedule Needed'}
                </span>
              </div>
              
              <div className="bg-bg-secondary rounded-lg p-3 mb-3">
                <h4 className="font-medium mb-2">Service Details:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div><strong>Student:</strong> {notification.studentName}</div>
                  <div><strong>Service:</strong> {notification.serviceType}</div>
                  <div><strong>Date:</strong> {new Date(notification.date).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {notification.time}</div>
                </div>
              </div>
              
              {notification.status === 'pending' && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">Provider Response:</span>
                  <button
                    onClick={() => handleNotificationResponse(notification.id, 'reschedule')}
                    className="px-3 py-1 bg-purple text-white text-sm rounded-md hover:bg-purple/80 transition-colors"
                  >
                    Reschedule Service
                  </button>
                  <button
                    onClick={() => handleNotificationResponse(notification.id, 'no-reschedule')}
                    className="px-3 py-1 bg-bg-secondary text-text-primary text-sm rounded-md hover:bg-border transition-colors"
                  >
                    No Need to Reschedule
                  </button>
                </div>
              )}
              
              {notification.status === 'reschedule' && (
                <div className="bg-purple/10 border border-purple/20 rounded-lg p-3">
                  <p className="text-sm text-purple">
                    <strong>Provider Response:</strong> Reschedule requested. Please coordinate with {getProviderName(notification.providerId)} to find a new time.
                  </p>
                </div>
              )}
              
              {notification.status === 'no-reschedule' && (
                <div className="bg-green/10 border border-green/20 rounded-lg p-3">
                  <p className="text-sm text-green">
                    <strong>Provider Response:</strong> No reschedule needed. This missed service has been acknowledged.
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">No Notifications</h3>
            <p>All services are on track. Notifications will appear here when services are missed.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNewServiceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Schedule New Service</h2>
        
        <div className="space-y-6">
          {/* Service Type and Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Type *</label>
              <select
                value={newService.serviceType}
                onChange={e => setNewService(prev => ({ ...prev, serviceType: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Service Provider *</label>
              <select
                value={newService.providerId}
                onChange={e => setNewService(prev => ({ ...prev, providerId: parseInt(e.target.value) }))}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value={0}>Select Provider</option>
                {serviceProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Frequency and Schedule */}
          <div className="bg-purple/5 border border-purple/20 rounded-lg p-4">
            <h3 className="font-medium text-purple mb-3">Service Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Frequency *</label>
                <select
                  value={newService.frequency}
                  onChange={e => setNewService(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Day of Week *</label>
                <select
                  value={newService.dayOfWeek}
                  onChange={e => setNewService(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  {weekDayNames.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Number of Sessions *</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={newService.sessionCount}
                  onChange={e => setNewService(prev => ({ ...prev, sessionCount: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div className="text-sm text-text-secondary bg-bg-secondary rounded-md p-3">
              <strong>Schedule Preview:</strong> This will create {newService.sessionCount || 0} sessions 
              {newService.frequency === 'daily' && ' every weekday'}
              {newService.frequency === 'weekly' && ` every ${weekDayNames[newService.dayOfWeek || 0]}`}
              {newService.frequency === 'monthly' && ` on the ${weekDayNames[newService.dayOfWeek || 0]} of each month`}
              {newService.sessionCount && newService.sessionCount > 1 && ', starting from the next occurrence.'}
            </div>
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="time"
                value={newService.startTime}
                onChange={e => {
                  const startTime = e.target.value;
                  const endTime = calculateEndTime(startTime, newService.duration || 30);
                  setNewService(prev => ({ ...prev, startTime, endTime }));
                }}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Session Length (minutes) *</label>
              <select
                value={newService.duration}
                onChange={e => {
                  const duration = parseInt(e.target.value);
                  const endTime = newService.startTime ? calculateEndTime(newService.startTime, duration) : '';
                  setNewService(prev => ({ ...prev, duration, endTime }));
                }}
                className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={newService.endTime}
                readOnly
                className="w-full p-2 border border-border rounded-md bg-bg-secondary text-text-secondary cursor-not-allowed"
              />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={newService.location}
              onChange={e => setNewService(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
              placeholder="e.g., Speech Room 101, OT Room, Resource Room 205"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={() => setShowNewServiceForm(false)}
            className="btn border border-border hover:bg-bg-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddService}
            disabled={!newService.serviceType || !newService.providerId || !newService.startTime || !newService.frequency || newService.dayOfWeek === undefined || !newService.sessionCount}
            className="btn bg-purple text-white hover:bg-purple/90 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>Schedule Service</span>
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
          onClick={() => setActiveView('weekly')}
          className={`px-4 py-2 rounded-md transition-all ${
            activeView === 'weekly' ? 'bg-purple text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Weekly Tracking
        </button>
        <button
          onClick={() => setActiveView('notifications')}
          className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
            activeView === 'notifications' ? 'bg-purple text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>Notifications</span>
          {notifications.filter(n => n.status === 'pending').length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter(n => n.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Content based on active view */}
      {activeView === 'weekly' && renderWeeklyView()}
      {activeView === 'notifications' && renderNotifications()}

      {/* New Service Form Modal */}
      {showNewServiceForm && renderNewServiceForm()}
    </div>
  );
};

export default ServicesTab;