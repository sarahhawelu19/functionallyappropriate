import React from 'react';
import { 
  User, 
  Target, 
  Brain, 
  Calendar, 
  MessageSquare, 
  Layout, 
  Users,
  ClipboardList,
  UserCheck
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'demographics' 
  | 'goals' 
  | 'behavior' 
  | 'services' 
  | 'messaging' 
  | 'schedules' 
  | 'parent-portal';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: ClipboardList },
    { id: 'demographics' as TabType, label: 'Demographics', icon: User },
    { id: 'goals' as TabType, label: 'Goals', icon: Target },
    { id: 'behavior' as TabType, label: 'Behavior Profile', icon: Brain },
    { id: 'services' as TabType, label: 'Service Tracker', icon: UserCheck },
    { id: 'messaging' as TabType, label: 'Messaging', icon: MessageSquare },
    { id: 'schedules' as TabType, label: 'Visual Schedules', icon: Layout },
    { id: 'parent-portal' as TabType, label: 'Parent Portal', icon: Users },
  ];

  return (
    <div className="border-b border-border mb-4 sm:mb-6 container-safe">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'border-purple text-purple font-medium'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;