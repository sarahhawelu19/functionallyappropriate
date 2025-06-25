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
    <header className="bg-bg-primary border-b border-border h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center">
        {/* Hamburger menu - ALWAYS visible on ALL screen sizes */}
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-bg-secondary transition-colors"
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
      
      {/* Right side - always aligned to the right */}
      <div className="flex items-center space-x-2 ml-auto">
        {/* Theme Selector */}
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
        
        {/* Built by Bolt Link */}
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Built by Bolt"
        >
          <img
            src={resolvedTheme === 'dark' ? '/white_circle.png' : '/black_circle.png'}
            alt="Built by Bolt"
            className="w-6 h-6"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;