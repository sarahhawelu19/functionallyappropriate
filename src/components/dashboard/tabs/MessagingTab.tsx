import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Search, User, Clock, Check, CheckCheck, Plus, X, Users, Shield } from 'lucide-react';

interface BetterSpedUser {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
  delivered: boolean;
}

interface Conversation {
  id: number;
  participantId: number;
  lastMessage?: Message;
  unreadCount: number;
}

const MessagingTab: React.FC = () => {
  const [currentUser] = useState<BetterSpedUser>({
    id: 1,
    name: 'Sarah Thompson',
    role: 'Case Manager',
    email: 'sarah.thompson@school.edu',
    isOnline: true
  });

  const [betterSpedUsers] = useState<BetterSpedUser[]>([
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Speech Language Pathologist',
      email: 'michael.chen@school.edu',
      isOnline: true
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      role: 'Occupational Therapist',
      email: 'lisa.rodriguez@school.edu',
      isOnline: false,
      lastSeen: '2025-01-15T14:30:00'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'School Psychologist',
      email: 'david.kim@school.edu',
      isOnline: true
    },
    {
      id: 5,
      name: 'Emily Davis',
      role: 'Physical Therapist',
      email: 'emily.davis@school.edu',
      isOnline: false,
      lastSeen: '2025-01-15T09:15:00'
    },
    {
      id: 6,
      name: 'Jennifer Wilson',
      role: 'Resource Teacher',
      email: 'jennifer.wilson@school.edu',
      isOnline: true
    },
    {
      id: 7,
      name: 'Robert Martinez',
      role: 'Behavior Specialist',
      email: 'robert.martinez@school.edu',
      isOnline: false,
      lastSeen: '2025-01-14T16:45:00'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 2,
      receiverId: 1,
      content: 'Hi Sarah, I wanted to discuss John Smith\'s progress in speech therapy. He\'s been making great improvements with his articulation goals.',
      timestamp: '2025-01-15T10:30:00',
      read: true,
      delivered: true
    },
    {
      id: 2,
      senderId: 1,
      receiverId: 2,
      content: 'That\'s wonderful to hear! Could you provide some specific examples? I\'m updating his progress report this week.',
      timestamp: '2025-01-15T10:35:00',
      read: true,
      delivered: true
    },
    {
      id: 3,
      senderId: 2,
      receiverId: 1,
      content: 'Absolutely! He\'s now producing /r/ sounds correctly in 80% of structured activities. We\'ve also seen improvement in his conversational speech during our sessions.',
      timestamp: '2025-01-15T10:40:00',
      read: true,
      delivered: true
    },
    {
      id: 4,
      senderId: 1,
      receiverId: 2,
      content: 'Perfect! I\'ll include that in his quarterly report. Should we schedule an IEP team meeting to discuss potentially adjusting his goals?',
      timestamp: '2025-01-15T10:45:00',
      read: false,
      delivered: true
    },
    {
      id: 5,
      senderId: 3,
      receiverId: 1,
      content: 'Hi Sarah, I need to reschedule Emily Johnson\'s OT session tomorrow. Can we move it to Thursday at the same time?',
      timestamp: '2025-01-15T14:20:00',
      read: false,
      delivered: true
    },
    {
      id: 6,
      senderId: 4,
      receiverId: 1,
      content: 'Good morning! I\'ve completed the psychological evaluation for Michael Davis. The report will be ready by Friday. Would you like to schedule a meeting to review the findings?',
      timestamp: '2025-01-15T09:15:00',
      read: false,
      delivered: true
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, participantId: 2, unreadCount: 1 },
    { id: 2, participantId: 3, unreadCount: 1 },
    { id: 3, participantId: 4, unreadCount: 1 },
    { id: 4, participantId: 6, unreadCount: 0 }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<number | null>(2);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedNewRecipient, setSelectedNewRecipient] = useState<number | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  // Update conversations with last messages
  useEffect(() => {
    setConversations(prev => prev.map(conv => {
      const conversationMessages = messages.filter(
        msg => (msg.senderId === conv.participantId && msg.receiverId === currentUser.id) ||
               (msg.senderId === currentUser.id && msg.receiverId === conv.participantId)
      );
      const lastMessage = conversationMessages.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      const unreadCount = conversationMessages.filter(
        msg => msg.senderId === conv.participantId && msg.receiverId === currentUser.id && !msg.read
      ).length;

      return {
        ...conv,
        lastMessage,
        unreadCount
      };
    }));
  }, [messages, currentUser.id]);

  const getConversationMessages = (participantId: number) => {
    return messages
      .filter(msg => 
        (msg.senderId === participantId && msg.receiverId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.receiverId === participantId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getUserById = (id: number) => {
    return betterSpedUsers.find(user => user.id === id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      senderId: currentUser.id,
      receiverId: selectedConversation,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      delivered: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Mark messages as read when viewing conversation
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.senderId === selectedConversation && msg.receiverId === currentUser.id && !msg.read
          ? { ...msg, read: true }
          : msg
      ));
    }, 1000);
  };

  const handleStartNewConversation = () => {
    if (!selectedNewRecipient || !newMessageContent.trim()) return;

    const message: Message = {
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      senderId: currentUser.id,
      receiverId: selectedNewRecipient,
      content: newMessageContent.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      delivered: true
    };

    setMessages(prev => [...prev, message]);

    // Add new conversation if it doesn't exist
    const existingConversation = conversations.find(conv => conv.participantId === selectedNewRecipient);
    if (!existingConversation) {
      setConversations(prev => [...prev, {
        id: Math.max(...prev.map(c => c.id), 0) + 1,
        participantId: selectedNewRecipient,
        unreadCount: 0
      }]);
    }

    setSelectedConversation(selectedNewRecipient);
    setShowNewMessageModal(false);
    setSelectedNewRecipient(null);
    setNewMessageContent('');
  };

  const handleSelectConversation = (participantId: number) => {
    setSelectedConversation(participantId);
    
    // Mark messages as read
    setMessages(prev => prev.map(msg => 
      msg.senderId === participantId && msg.receiverId === currentUser.id && !msg.read
        ? { ...msg, read: true }
        : msg
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getLastSeenText = (user: BetterSpedUser) => {
    if (user.isOnline) return 'Online';
    if (!user.lastSeen) return 'Offline';
    
    const lastSeen = new Date(user.lastSeen);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} min ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return lastSeen.toLocaleDateString();
    }
  };

  const filteredUsers = betterSpedUsers.filter(user =>
    user.id !== currentUser.id &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredConversations = conversations.filter(conv => {
    const user = getUserById(conv.participantId);
    return user && (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedUser = selectedConversation ? getUserById(selectedConversation) : null;
  const conversationMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];

  return (
    <div className="h-[600px] flex border border-border rounded-lg overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col bg-bg-primary">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="text-purple" size={20} />
              <h3 className="font-semibold">Messages</h3>
            </div>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="p-2 bg-purple text-white rounded-md hover:bg-purple/80 transition-colors"
              aria-label="New message"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple text-sm"
            />
          </div>
        </div>

        {/* BetterSped Users Notice */}
        <div className="p-3 bg-purple/10 border-b border-purple/20">
          <div className="flex items-center space-x-2">
            <Shield className="text-purple" size={16} />
            <span className="text-xs text-purple font-medium">Secure BetterSped Network</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Messages are restricted to verified BetterSped users only
          </p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations
              .sort((a, b) => {
                const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
                const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
                return bTime - aTime;
              })
              .map(conversation => {
                const user = getUserById(conversation.participantId);
                if (!user) return null;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.participantId)}
                    className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-bg-secondary ${
                      selectedConversation === conversation.participantId ? 'bg-purple/10 border-r-2 border-r-purple' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center">
                          <User size={16} className="text-purple" />
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green rounded-full border-2 border-bg-primary"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{user.name}</h4>
                          {conversation.lastMessage && (
                            <span className="text-xs text-text-secondary">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-text-secondary mb-1">{user.role}</p>
                        
                        {conversation.lastMessage && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-text-secondary truncate">
                              {conversation.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="p-4 text-center text-text-secondary">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-bg-secondary">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center">
                    <User size={16} className="text-purple" />
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green rounded-full border-2 border-bg-secondary"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-text-secondary">
                    {selectedUser.role} • {getLastSeenText(selectedUser)}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map(message => {
                const isOwnMessage = message.senderId === currentUser.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage 
                        ? 'bg-purple text-white' 
                        : 'bg-bg-secondary text-text-primary'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        isOwnMessage ? 'text-white/70' : 'text-text-secondary'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {isOwnMessage && (
                          <div className="flex items-center">
                            {message.delivered && (
                              message.read ? (
                                <CheckCheck size={12} className="text-green" />
                              ) : (
                                <Check size={12} />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${selectedUser.name}...`}
                  className="flex-1 p-3 border border-border rounded-lg bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-primary rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Message</h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Recipient</label>
                <div className="max-h-48 overflow-y-auto border border-border rounded-md">
                  {betterSpedUsers
                    .filter(user => user.id !== currentUser.id)
                    .map(user => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedNewRecipient(user.id)}
                        className={`p-3 cursor-pointer transition-colors hover:bg-bg-secondary ${
                          selectedNewRecipient === user.id ? 'bg-purple/10 border-r-2 border-r-purple' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-8 h-8 bg-purple/20 rounded-full flex items-center justify-center">
                              <User size={14} className="text-purple" />
                            </div>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green rounded-full border border-bg-primary"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-text-secondary">{user.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                  className="w-full p-3 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="btn border border-border hover:bg-bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewConversation}
                disabled={!selectedNewRecipient || !newMessageContent.trim()}
                className="btn bg-purple text-white hover:bg-purple/90 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingTab;