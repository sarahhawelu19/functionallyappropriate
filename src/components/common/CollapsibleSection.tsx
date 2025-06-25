import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  accentColor?: 'purple' | 'green' | 'teal' | 'gold';
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  badge,
  className = '',
  headerClassName = '',
  contentClassName = '',
  accentColor = 'purple'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getAccentColorClasses = () => {
    switch (accentColor) {
      case 'green':
        return 'hover:border-green/30 focus:ring-green';
      case 'teal':
        return 'hover:border-teal/30 focus:ring-teal';
      case 'gold':
        return 'hover:border-gold/30 focus:ring-gold';
      default:
        return 'hover:border-purple/30 focus:ring-purple';
    }
  };

  return (
    <div className={`border border-border rounded-lg transition-all duration-200 ${className}`}>
      <button
        onClick={toggleExpanded}
        className={`w-full p-4 flex items-center justify-between text-left transition-all duration-200 rounded-t-lg ${getAccentColorClasses()} focus:outline-none focus:ring-2 focus:ring-offset-2 ${headerClassName}`}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          {badge && (
            <div className="flex-shrink-0">
              {badge}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
          <div className="transition-transform duration-200 ease-in-out">
            {isExpanded ? (
              <ChevronDown size={20} className="text-text-secondary" />
            ) : (
              <ChevronRight size={20} className="text-text-secondary" />
            )}
          </div>
        </div>
      </button>
      
      <div
        id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`p-4 pt-0 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;