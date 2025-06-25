import React from 'react';
import { CheckCircle2, Circle, Target, Calendar } from 'lucide-react';

interface Goal {
  id: number;
  subject: string;
  description: string;
  completed: boolean;
  dueTime?: string;
}

interface DailyGoalsProps {
  goals: Goal[];
  onToggleGoal: (goalId: number) => void;
  selectedDate: Date;
}

const DailyGoals: React.FC<DailyGoalsProps> = ({ goals, onToggleGoal, selectedDate }) => {
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  
  const getDaySchedule = (date: Date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    switch (day) {
      case 1: // Monday
      case 3: // Wednesday
      case 5: // Friday
        return 'ELA Focus';
      case 2: // Tuesday
      case 4: // Thursday
        return 'Math Focus';
      default:
        return 'Review & Practice';
    }
  };

  return (
    <div className="card container-safe">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Target className="text-green flex-shrink-0" size={20} />
          <h3 className="text-lg font-semibold">Today's Goals</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Calendar size={16} className="flex-shrink-0" />
          <span className="truncate">{getDaySchedule(selectedDate)}</span>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-green/10 rounded-lg border border-green/20">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Progress Today</span>
          <span className="text-sm text-green font-semibold">
            {completedGoals}/{totalGoals} Complete
          </span>
        </div>
        <div className="mt-2 w-full bg-bg-secondary rounded-full h-2">
          <div 
            className="bg-green h-2 rounded-full transition-all duration-300" 
            style={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {goals.map(goal => (
          <div 
            key={goal.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
              goal.completed 
                ? 'bg-green/10 border-green/20' 
                : 'bg-bg-secondary border-border hover:border-green/30'
            }`}
            onClick={() => onToggleGoal(goal.id)}
          >
            <button className="mt-0.5 flex-shrink-0">
              {goal.completed ? (
                <CheckCircle2 size={20} className="text-green" />
              ) : (
                <Circle size={20} className="text-text-secondary hover:text-green" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  goal.subject === 'ELA' ? 'bg-teal/20 text-teal' :
                  goal.subject === 'Math' ? 'bg-gold/20 text-gold' :
                  goal.subject === 'Social Skills' ? 'bg-green/20 text-green' :
                  'bg-purple/20 text-purple'
                }`}>
                  {goal.subject}
                </span>
                {goal.dueTime && (
                  <span className="text-xs text-text-secondary flex-shrink-0">{goal.dueTime}</span>
                )}
              </div>
              <p className={`mt-1 text-sm sm:text-base ${goal.completed ? 'line-through text-text-secondary' : ''}`}>
                {goal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <Target size={40} className="mx-auto mb-2 opacity-30" />
          <p>No goals assigned for today</p>
          <button className="mt-2 text-green hover:underline text-sm">
            Assign Goals
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;