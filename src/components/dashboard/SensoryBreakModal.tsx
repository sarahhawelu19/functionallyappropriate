import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface SensoryBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SensoryBreakModal: React.FC<SensoryBreakModalProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('breathing');

  const activities = [
    { id: 'breathing', name: 'Deep Breathing', duration: 300, color: 'bg-blue-500' },
    { id: 'movement', name: 'Movement Break', duration: 180, color: 'bg-green-500' },
    { id: 'quiet', name: 'Quiet Time', duration: 600, color: 'bg-purple' },
    { id: 'sensory', name: 'Sensory Play', duration: 420, color: 'bg-gold' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Could add notification sound here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivityChange = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activityId);
      setTimeLeft(activity.duration);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const activity = activities.find(a => a.id === selectedActivity);
    if (activity) {
      setTimeLeft(activity.duration);
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  const selectedActivityData = activities.find(a => a.id === selectedActivity);
  const progress = selectedActivityData ? 
    ((selectedActivityData.duration - timeLeft) / selectedActivityData.duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Clock className="text-purple" size={24} />
            <span>Sensory Break</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Choose Activity:</label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map(activity => (
              <button
                key={activity.id}
                onClick={() => handleActivityChange(activity.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedActivity === activity.id
                    ? `${activity.color} text-white border-transparent`
                    : 'border-border hover:border-purple/30'
                }`}
              >
                <div className="font-medium text-sm">{activity.name}</div>
                <div className="text-xs opacity-80">
                  {Math.floor(activity.duration / 60)} min
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-bg-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-purple transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-purple hover:bg-purple/80'
              } text-white`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-secondary hover:bg-border transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-text-secondary mb-2">
            {selectedActivityData?.name} Session
          </p>
          {timeLeft === 0 && (
            <div className="p-3 bg-green/10 border border-green/20 rounded-lg">
              <p className="text-green font-medium">Break Complete! 🎉</p>
              <p className="text-sm text-text-secondary mt-1">
                Great job taking care of yourself!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensoryBreakModal;