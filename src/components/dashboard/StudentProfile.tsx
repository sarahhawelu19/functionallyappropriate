import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { User, Award, Clock, MessageCircle } from 'lucide-react';

interface StudentProfileProps {
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
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, 
  onSensoryBreak, 
  onAddToken 
}) => {
  return (
    <div className="bg-gradient-to-br from-purple to-purple/80 rounded-2xl p-4 sm:p-6 text-white shadow-lg container-safe">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            {student.avatar ? (
              <img 
                src={student.avatar} 
                alt={student.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white/20"
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                <User size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{student.name}</h2>
            <p className="text-white/80 text-sm sm:text-base truncate">{student.grade} Grade • {student.program}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex items-center space-x-1 bg-white/20 rounded-full px-2 sm:px-3 py-1">
            <Award size={14} className="sm:w-4 sm:h-4" />
            <span className="font-medium text-sm sm:text-base">{student.tokens}</span>
          </div>
          <button
            onClick={onAddToken}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="text-sm sm:text-lg font-bold">+</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-3">
            <CircularProgressbar
              value={student.dailyProgress}
              text={`${student.dailyProgress}%`}
              styles={buildStyles({
                textColor: 'white',
                pathColor: 'white',
                trailColor: 'rgba(255, 255, 255, 0.2)',
                textSize: '16px',
              })}
            />
          </div>
          <p className="text-xs sm:text-sm text-white/80 text-center">Daily Goals</p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <button
            onClick={onSensoryBreak}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg py-2 sm:py-3 px-3 sm:px-4 transition-colors text-sm sm:text-base"
          >
            <Clock size={16} className="sm:w-5 sm:h-5" />
            <span className="truncate">Sensory Break</span>
          </button>
          
          <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg py-1.5 sm:py-2 px-3 sm:px-4">
            <MessageCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Next: {student.nextBreak || '2:30 PM'}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-white/80">This Week:</span>
            <span className="font-medium">4/5 Goals</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Tokens Earned:</span>
            <span className="font-medium">{student.tokens}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Behavior:</span>
            <span className="font-medium text-green">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;