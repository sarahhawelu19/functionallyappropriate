import React, { useState } from 'react';
import { Users, Calendar, FileText, MessageSquare, Download, Eye, Clock, CheckCircle, AlertCircle, Send, Upload, User, Mail, Phone, MapPin, Shield, Bell, Target, BarChart3, FileSignature as Signature, X, Check, ExternalLink, Lock, Key } from 'lucide-react';

interface ParentUser {
  id: number;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
  isEmergencyContact: boolean;
  hasPortalAccess: boolean;
  lastLogin?: string;
}

interface Document {
  id: number;
  name: string;
  type: 'iep' | 'permission-slip' | 'evaluation' | 'progress-report' | 'other';
  uploadDate: string;
  status: 'pending-signature' | 'signed' | 'declined' | 'view-only';
  signedBy?: string;
  signedDate?: string;
  dueDate?: string;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

interface WeeklyUpdate {
  id: number;
  weekOf: string;
  behaviorSummary: string;
  servicesProvided: string[];
  goalsProgress: Array<{
    goal: string;
    progress: string;
    status: 'on-track' | 'needs-attention' | 'exceeded';
  }>;
  upcomingEvents: string[];
  teacherNotes: string;
  sentDate: string;
}

interface MeetingRequest {
  id: number;
  requestedBy: string;
  requestDate: string;
  preferredDates: string[];
  reason: string;
  status: 'pending' | 'scheduled' | 'declined';
  scheduledDate?: string;
  scheduledTime?: string;
  attendees?: string[];
}

const ParentPortalTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'messaging' | 'meetings' | 'updates' | 'access'>('overview');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showMeetingRequestModal, setShowMeetingRequestModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);

  // Sample data
  const [parentUsers] = useState<ParentUser[]>([
    {
      id: 1,
      name: 'Maria Smith',
      relationship: 'Mother',
      email: 'maria.smith@email.com',
      phone: '(555) 123-4567',
      address: '123 Main Street, Anytown, ST 12345',
      isEmergencyContact: true,
      hasPortalAccess: true,
      lastLogin: '2025-01-15T10:30:00'
    },
    {
      id: 2,
      name: 'Carlos Smith',
      relationship: 'Father',
      email: 'carlos.smith@email.com',
      phone: '(555) 987-6543',
      address: '123 Main Street, Anytown, ST 12345',
      isEmergencyContact: true,
      hasPortalAccess: false
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      relationship: 'Grandmother',
      email: 'elena.rodriguez@email.com',
      phone: '(555) 456-7890',
      address: '456 Oak Avenue, Anytown, ST 12345',
      isEmergencyContact: true,
      hasPortalAccess: false
    }
  ]);

  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: 'Annual IEP Review 2024-2025',
      type: 'iep',
      uploadDate: '2025-01-10',
      status: 'pending-signature',
      dueDate: '2025-01-20'
    },
    {
      id: 2,
      name: 'Field Trip Permission Slip - Science Museum',
      type: 'permission-slip',
      uploadDate: '2025-01-12',
      status: 'pending-signature',
      dueDate: '2025-01-18'
    },
    {
      id: 3,
      name: 'Quarterly Progress Report - Q2',
      type: 'progress-report',
      uploadDate: '2025-01-08',
      status: 'view-only'
    },
    {
      id: 4,
      name: 'Speech Therapy Evaluation',
      type: 'evaluation',
      uploadDate: '2024-12-15',
      status: 'signed',
      signedBy: 'Maria Smith',
      signedDate: '2024-12-16'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: 1,
      senderId: 100,
      senderName: 'Sarah Thompson',
      senderRole: 'Case Manager',
      content: 'Hi Maria, I wanted to update you on John\'s progress this week. He\'s been doing exceptionally well with his reading comprehension goals and has shown great improvement in his social interactions during group activities.',
      timestamp: '2025-01-15T14:30:00',
      read: true
    },
    {
      id: 2,
      senderId: 1,
      senderName: 'Maria Smith',
      senderRole: 'Parent',
      content: 'Thank you for the update! We\'ve noticed improvements at home too. John has been more willing to read independently. Is there anything specific we should continue working on at home?',
      timestamp: '2025-01-15T16:45:00',
      read: true
    },
    {
      id: 3,
      senderId: 100,
      senderName: 'Sarah Thompson',
      senderRole: 'Case Manager',
      content: 'That\'s wonderful to hear! Please continue encouraging independent reading. We\'re also working on turn-taking skills, so any board games or activities that require waiting would be helpful.',
      timestamp: '2025-01-15T17:15:00',
      read: false
    }
  ]);

  const [weeklyUpdates] = useState<WeeklyUpdate[]>([
    {
      id: 1,
      weekOf: '2025-01-13',
      behaviorSummary: 'John had an excellent week with consistent on-task behavior and appropriate social interactions. He used his coping strategies effectively when feeling frustrated during math activities.',
      servicesProvided: [
        'Speech Therapy (2 sessions)',
        'Occupational Therapy (1 session)',
        'Resource Room Support (daily)',
        'Counseling (1 session)'
      ],
      goalsProgress: [
        {
          goal: 'Reading Comprehension',
          progress: 'Currently achieving 75% accuracy, up from 65% last week',
          status: 'on-track'
        },
        {
          goal: 'Social Skills',
          progress: 'Initiating 4-5 peer interactions daily, exceeding target of 3',
          status: 'exceeded'
        },
        {
          goal: 'Math Problem Solving',
          progress: 'Struggling with multi-step problems, additional support provided',
          status: 'needs-attention'
        }
      ],
      upcomingEvents: [
        'IEP Annual Review - January 25th',
        'Science Museum Field Trip - January 22nd',
        'Parent-Teacher Conference - February 1st'
      ],
      teacherNotes: 'John is making steady progress and showing increased confidence in his abilities. Continue encouraging his efforts at home.',
      sentDate: '2025-01-15'
    }
  ]);

  const [meetingRequests] = useState<MeetingRequest[]>([
    {
      id: 1,
      requestedBy: 'Maria Smith',
      requestDate: '2025-01-14',
      preferredDates: ['2025-01-25', '2025-01-26', '2025-01-27'],
      reason: 'Discuss John\'s transition planning for next year',
      status: 'pending'
    }
  ]);

  const studentInfo = {
    name: 'John Michael Smith',
    grade: '3rd Grade',
    program: 'Resource Support',
    caseManager: 'Sarah Thompson',
    currentGoals: [
      'Reading comprehension with 80% accuracy',
      'Social interaction initiation 4x daily',
      'Math problem solving with 75% accuracy'
    ],
    upcomingServices: [
      { service: 'Speech Therapy', date: '2025-01-16', time: '10:00 AM' },
      { service: 'OT Session', date: '2025-01-17', time: '2:00 PM' },
      { service: 'Counseling', date: '2025-01-18', time: '11:00 AM' }
    ]
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'iep':
        return 'bg-purple/10 text-purple border-purple/20';
      case 'permission-slip':
        return 'bg-gold/10 text-gold border-gold/20';
      case 'progress-report':
        return 'bg-green/10 text-green border-green/20';
      case 'evaluation':
        return 'bg-teal/10 text-teal border-teal/20';
      default:
        return 'bg-bg-secondary text-text-primary border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-signature':
        return 'bg-gold text-black';
      case 'signed':
        return 'bg-green text-white';
      case 'declined':
        return 'bg-red-500 text-white';
      case 'view-only':
        return 'bg-bg-secondary text-text-primary';
      default:
        return 'bg-bg-secondary text-text-primary';
    }
  };

  const getProgressStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green';
      case 'exceeded':
        return 'text-purple';
      case 'needs-attention':
        return 'text-gold';
      default:
        return 'text-text-secondary';
    }
  };

  const handleDocumentAction = (document: Document, action: 'sign' | 'decline' | 'view') => {
    if (action === 'view') {
      setSelectedDocument(document);
      setShowDocumentModal(true);
    } else if (action === 'sign') {
      // In a real implementation, this would integrate with DocuSign or similar
      alert('Electronic signature integration would be implemented here (DocuSign, Adobe Sign, etc.)');
    } else if (action === 'decline') {
      alert('Document declined. The school team has been notified.');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real implementation, this would send the message to the case manager
    alert('Message sent to case manager');
    setNewMessage('');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Student Information Summary */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <User className="text-purple" size={20} />
          <h3 className="text-lg font-semibold">Student Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-text-secondary">Student Name:</span>
              <p className="font-medium">{studentInfo.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-text-secondary">Grade & Program:</span>
              <p className="font-medium">{studentInfo.grade} • {studentInfo.program}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-text-secondary">Case Manager:</span>
              <p className="font-medium">{studentInfo.caseManager}</p>
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-text-secondary mb-2 block">Current IEP Goals:</span>
            <ul className="space-y-1">
              {studentInfo.currentGoals.map((goal, index) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <Target size={12} className="text-green mt-1 flex-shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSection('documents')}
          className="card hover:border-purple/30 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-purple" size={20} />
            <span className="text-xs bg-gold text-black px-2 py-1 rounded-full">
              {documents.filter(d => d.status === 'pending-signature').length} pending
            </span>
          </div>
          <h4 className="font-medium">Documents</h4>
          <p className="text-sm text-text-secondary">View and sign documents</p>
        </button>

        <button
          onClick={() => setActiveSection('messaging')}
          className="card hover:border-purple/30 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="text-purple" size={20} />
            <span className="text-xs bg-green text-white px-2 py-1 rounded-full">
              {messages.filter(m => !m.read && m.senderId !== 1).length} new
            </span>
          </div>
          <h4 className="font-medium">Messages</h4>
          <p className="text-sm text-text-secondary">Communicate with school team</p>
        </button>

        <button
          onClick={() => setActiveSection('meetings')}
          className="card hover:border-purple/30 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-purple" size={20} />
            <span className="text-xs bg-purple text-white px-2 py-1 rounded-full">
              {meetingRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>
          <h4 className="font-medium">Meetings</h4>
          <p className="text-sm text-text-secondary">Schedule IEP meetings</p>
        </button>
      </div>

      {/* Upcoming Services */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="text-purple" size={20} />
          <h3 className="text-lg font-semibold">Upcoming Services This Week</h3>
        </div>
        
        <div className="space-y-3">
          {studentInfo.upcomingServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
              <div>
                <h4 className="font-medium">{service.service}</h4>
                <p className="text-sm text-text-secondary">
                  {new Date(service.date).toLocaleDateString()} at {service.time}
                </p>
              </div>
              <CheckCircle className="text-green" size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">Documents & Signatures</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Shield size={16} />
          <span>Secure Document Portal</span>
        </div>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Signature className="text-purple mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-purple mb-1">Electronic Signature Integration</h3>
            <p className="text-sm text-text-secondary">
              Documents requiring signatures use secure electronic signature technology. 
              Your signatures are legally binding and encrypted for security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {documents.map(document => (
          <div key={document.id} className={`border rounded-lg p-4 transition-all ${
            document.status === 'pending-signature' ? 'border-gold bg-gold/5' : 'border-border'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getDocumentTypeColor(document.type)}`}>
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-medium">{document.name}</h3>
                  <p className="text-sm text-text-secondary">
                    Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                  </p>
                  {document.dueDate && (
                    <p className="text-sm text-gold">
                      Due: {new Date(document.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(document.status)}`}>
                  {document.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {document.status === 'signed' && document.signedBy && (
              <div className="mb-3 p-2 bg-green/10 border border-green/20 rounded-md">
                <p className="text-sm text-green">
                  ✓ Signed by {document.signedBy} on {new Date(document.signedDate!).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDocumentAction(document, 'view')}
                className="px-3 py-1 bg-bg-secondary hover:bg-border rounded-md text-sm transition-colors flex items-center space-x-1"
              >
                <Eye size={14} />
                <span>View</span>
              </button>
              
              <button
                className="px-3 py-1 bg-bg-secondary hover:bg-border rounded-md text-sm transition-colors flex items-center space-x-1"
              >
                <Download size={14} />
                <span>Download</span>
              </button>

              {document.status === 'pending-signature' && (
                <>
                  <button
                    onClick={() => handleDocumentAction(document, 'sign')}
                    className="px-3 py-1 bg-green text-white hover:bg-green/80 rounded-md text-sm transition-colors flex items-center space-x-1"
                  >
                    <Signature size={14} />
                    <span>Sign Document</span>
                  </button>
                  
                  <button
                    onClick={() => handleDocumentAction(document, 'decline')}
                    className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-md text-sm transition-colors"
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessaging = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">Secure Messaging</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Lock size={16} />
          <span>Encrypted Communication</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Conversation with Case Manager</h3>
          <span className="text-sm text-text-secondary">Sarah Thompson</span>
        </div>

        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.senderId === 1 
                  ? 'bg-purple text-white' 
                  : 'bg-bg-secondary text-text-primary'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{message.senderName}</span>
                  <span className={`text-xs ${message.senderId === 1 ? 'text-white/70' : 'text-text-secondary'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message to the case manager..."
              className="flex-1 p-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeetings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">IEP Meetings & Conferences</h2>
        </div>
        <button
          onClick={() => setShowMeetingRequestModal(true)}
          className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors flex items-center space-x-2"
        >
          <Calendar size={16} />
          <span>Request Meeting</span>
        </button>
      </div>

      {/* Upcoming Scheduled Meetings */}
      <div className="card">
        <h3 className="font-medium mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          <div className="p-3 border border-green rounded-lg bg-green/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Annual IEP Review</h4>
              <span className="text-sm text-green font-medium">Confirmed</span>
            </div>
            <div className="text-sm text-text-secondary space-y-1">
              <p>📅 January 25, 2025 at 10:00 AM</p>
              <p>📍 Conference Room B</p>
              <p>👥 Sarah Thompson, Dr. Chen, Lisa Rodriguez, You</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Requests */}
      <div className="card">
        <h3 className="font-medium mb-4">Meeting Requests</h3>
        {meetingRequests.length > 0 ? (
          <div className="space-y-3">
            {meetingRequests.map(request => (
              <div key={request.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Meeting Request</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === 'pending' ? 'bg-gold text-black' :
                    request.status === 'scheduled' ? 'bg-green text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-2">{request.reason}</p>
                <div className="text-xs text-text-secondary">
                  <p>Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                  <p>Preferred dates: {request.preferredDates.map(date => 
                    new Date(date).toLocaleDateString()
                  ).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-4">No meeting requests</p>
        )}
      </div>
    </div>
  );

  const renderWeeklyUpdates = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="text-purple" size={24} />
        <h2 className="text-xl font-semibold">Weekly Progress Updates</h2>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bell className="text-purple mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-purple mb-1">Automatic Weekly Updates</h3>
            <p className="text-sm text-text-secondary">
              Receive comprehensive weekly summaries of your child's progress, behavior, and upcoming events 
              every Friday afternoon.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {weeklyUpdates.map(update => (
          <div key={update.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Week of {new Date(update.weekOf).toLocaleDateString()}</h3>
              <span className="text-sm text-text-secondary">
                Sent: {new Date(update.sentDate).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              {/* Behavior Summary */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                  <BarChart3 size={16} className="text-purple" />
                  <span>Behavior Summary</span>
                </h4>
                <p className="text-sm text-text-secondary">{update.behaviorSummary}</p>
              </div>

              {/* Goals Progress */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                  <Target size={16} className="text-green" />
                  <span>Goals Progress</span>
                </h4>
                <div className="space-y-2">
                  {update.goalsProgress.map((goal, index) => (
                    <div key={index} className="p-2 bg-bg-secondary rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{goal.goal}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'on-track' ? 'bg-green text-white' :
                          goal.status === 'exceeded' ? 'bg-purple text-white' :
                          'bg-gold text-black'
                        }`}>
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">{goal.progress}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Provided */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                  <Users size={16} className="text-teal" />
                  <span>Services Provided</span>
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  {update.servicesProvided.map((service, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle size={12} className="text-green" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Teacher Notes */}
              <div>
                <h4 className="font-medium text-sm mb-2">Teacher Notes</h4>
                <p className="text-sm text-text-secondary italic">"{update.teacherNotes}"</p>
              </div>

              {/* Upcoming Events */}
              {update.upcomingEvents.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                    <Calendar size={16} className="text-gold" />
                    <span>Upcoming Events</span>
                  </h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {update.upcomingEvents.map((event, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Clock size={12} className="text-gold" />
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccessManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Key className="text-purple" size={24} />
          <h2 className="text-xl font-semibold">Portal Access Management</h2>
        </div>
        <button
          onClick={() => setShowAccessModal(true)}
          className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors flex items-center space-x-2"
        >
          <Users size={16} />
          <span>Manage Access</span>
        </button>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="text-purple mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-purple mb-1">Secure Access Control</h3>
            <p className="text-sm text-text-secondary">
              Manage who has access to your child's information through the parent portal. 
              Only authorized family members and guardians can view sensitive educational data.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {parentUsers.map(user => (
          <div key={user.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-purple" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className="text-xs px-2 py-1 bg-bg-secondary rounded-full">
                      {user.relationship}
                    </span>
                    {user.isEmergencyContact && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        Emergency Contact
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Mail size={12} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={12} />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={12} />
                      <span>{user.address}</span>
                    </div>
                  </div>

                  {user.lastLogin && (
                    <p className="text-xs text-text-secondary mt-2">
                      Last login: {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    user.hasPortalAccess ? 'text-green' : 'text-text-secondary'
                  }`}>
                    {user.hasPortalAccess ? 'Portal Access' : 'No Portal Access'}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {user.hasPortalAccess ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <button
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    user.hasPortalAccess
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green text-white hover:bg-green/80'
                  }`}
                >
                  {user.hasPortalAccess ? 'Revoke Access' : 'Grant Access'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sections = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'messaging', name: 'Messages', icon: MessageSquare },
    { id: 'meetings', name: 'Meetings', icon: Calendar },
    { id: 'updates', name: 'Weekly Updates', icon: Bell },
    { id: 'access', name: 'Access Management', icon: Key },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="text-purple" size={24} />
        <h2 className="text-xl font-semibold">Parent Portal</h2>
        <div className="flex items-center space-x-1 px-2 py-1 bg-purple/10 border border-purple/20 rounded-md ml-4">
          <Shield size={16} className="text-purple" />
          <span className="text-sm text-purple">Secure Family Access</span>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex items-center space-x-1 bg-bg-secondary rounded-lg p-1 overflow-x-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeSection === section.id
                  ? 'bg-purple text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              <span>{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content based on active section */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'documents' && renderDocuments()}
      {activeSection === 'messaging' && renderMessaging()}
      {activeSection === 'meetings' && renderMeetings()}
      {activeSection === 'updates' && renderWeeklyUpdates()}
      {activeSection === 'access' && renderAccessManagement()}

      {/* Meeting Request Modal */}
      {showMeetingRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-primary rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request IEP Meeting</h3>
              <button
                onClick={() => setShowMeetingRequestModal(false)}
                className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Meeting</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple resize-none"
                  placeholder="Please describe the reason for requesting this meeting..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Dates (select 2-3)</label>
                <div className="space-y-2">
                  {['2025-01-25', '2025-01-26', '2025-01-27'].map(date => (
                    <label key={date} className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-purple border-border rounded focus:ring-purple" />
                      <span className="text-sm">{new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMeetingRequestModal(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Meeting request submitted! The school team will contact you within 2 business days.');
                  setShowMeetingRequestModal(false);
                }}
                className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPortalTab;