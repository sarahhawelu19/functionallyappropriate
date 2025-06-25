import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Target, FileText, BarChart3 } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { path: '/scheduling', label: 'Schedule', icon: <Calendar size={20} />, accent: 'teal' },
    { path: '/goals', label: 'Goals', icon: <Target size={20} />, accent: 'green' },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} />, accent: 'gold' },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} />, accent: 'purple' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border z-30">
      <nav className="flex justify-around items-center h-20">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? `text-${item.accent}` : 'text-text-secondary'
              }`
            }
            end
          >
            <div className="mb-1">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;