import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-8">Page not found</p>
      <Link 
        to="/" 
        className="btn bg-accent-purple flex items-center gap-2"
      >
        <Home size={16} />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;