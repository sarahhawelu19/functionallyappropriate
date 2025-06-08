import React from 'react';
import { Menu, X, Monitor, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <header className="bg-bg-primary border-b border-border h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 p-2 rounded-md hover:bg-bg-secondary transition-colors"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link to="/" className="flex items-center">
          <img 
            src={resolvedTheme === 'dark' ? '/bettersped_logow.png' : '/bettersped_logob.png'} 
            alt="BetterSPED Logo"
            className="h-8 w-auto" 
          />
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="appearance-none bg-bg-secondary text-text-primary rounded-md pl-10 pr-8 py-2 cursor-pointer border border-border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            aria-label="Select theme"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {theme === 'light' ? (
              <Sun size={16} />
            ) : theme === 'dark' ? (
              <Moon size={16} />
            ) : (
              <Monitor size={16} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;