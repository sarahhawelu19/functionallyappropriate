import React, { useState } from 'react';
import { Target, Plus, Save, Trash2 } from 'lucide-react';

interface Goal {
  id: number;
  area: string;
  description: string;
  baseline: string;
  targetDate: string;
}

const GoalWriting: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      area: 'Reading Comprehension',
      description: 'Student will identify the main idea and three supporting details in grade-level text with 80% accuracy in 3 out of 4 trials.',
      baseline: 'Currently identifies main idea with 40% accuracy',
      targetDate: '2025-06-15',
    },
    {
      id: 2,
      area: 'Social Skills',
      description: 'Student will initiate appropriate peer interactions during unstructured activities at least 4 times per day for 4 consecutive weeks.',
      baseline: 'Currently initiates interactions 1-2 times per day',
      targetDate: '2025-05-30',
    },
  ]);
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  const goalAreas = [
    'Reading Comprehension',
    'Written Expression',
    'Math Calculation',
    'Math Problem Solving',
    'Social Skills',
    'Behavior',
    'Communication',
    'Adaptive Skills',
    'Fine Motor',
    'Gross Motor',
  ];
  
  const handleNewGoal = () => {
    const newGoal: Goal = {
      id: goals.length ? Math.max(...goals.map(g => g.id)) + 1 : 1,
      area: '',
      description: '',
      baseline: '',
      targetDate: '',
    };
    
    setSelectedGoal(newGoal);
  };
  
  const handleSaveGoal = () => {
    if (!selectedGoal) return;
    
    if (goals.find(g => g.id === selectedGoal.id)) {
      setGoals(goals.map(g => g.id === selectedGoal.id ? selectedGoal : g));
    } else {
      setGoals([...goals, selectedGoal]);
    }
    
    setSelectedGoal(null);
  };
  
  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    if (selectedGoal?.id === id) {
      setSelectedGoal(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Goal Writing</h1>
        <button className="btn bg-accent-green" onClick={handleNewGoal}>
          <span className="flex items-center gap-1">
            <Plus size={18} />
            New Goal
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <div className="card">
              <h2 className="text-xl font-medium mb-4">
                {selectedGoal.id ? `Edit Goal #${selectedGoal.id}` : 'Create New Goal'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Goal Area</label>
                  <select
                    value={selectedGoal.area}
                    onChange={e => setSelectedGoal({...selectedGoal, area: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
                  >
                    <option value="">Select Goal Area</option>
                    {goalAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Goal Description</label>
                  <textarea
                    value={selectedGoal.description}
                    onChange={e => setSelectedGoal({...selectedGoal, description: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green h-24"
                    placeholder="e.g., Student will... with X% accuracy..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Current Baseline</label>
                  <textarea
                    value={selectedGoal.baseline}
                    onChange={e => setSelectedGoal({...selectedGoal, baseline: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green h-16"
                    placeholder="Describe current performance level..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Target Date</label>
                  <input
                    type="date"
                    value={selectedGoal.targetDate}
                    onChange={e => setSelectedGoal({...selectedGoal, targetDate: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-green"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    className="btn border border-border hover:bg-bg-secondary"
                    onClick={() => setSelectedGoal(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn bg-accent-green"
                    onClick={handleSaveGoal}
                    disabled={!selectedGoal.area || !selectedGoal.description}
                  >
                    <span className="flex items-center gap-1">
                      <Save size={16} />
                      Save Goal
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-green" size={22} />
                <h2 className="text-xl font-medium">Current IEP Goals</h2>
              </div>
              
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="border border-border rounded-md p-4 hover:border-green transition-all">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <span className="px-2 py-1 bg-green text-white text-xs rounded-md">
                            {goal.area}
                          </span>
                          Goal #{goal.id}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1.5 hover:bg-bg-secondary rounded-md transition-colors" 
                            onClick={() => setSelectedGoal(goal)}
                            aria-label="Edit goal"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <button 
                            className="p-1.5 hover:bg-bg-secondary rounded-md transition-colors text-red-500" 
                            onClick={() => handleDeleteGoal(goal.id)}
                            aria-label="Delete goal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-text-secondary">
                        <p>{goal.description}</p>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="border border-border rounded p-2">
                          <span className="font-medium">Baseline:</span> {goal.baseline}
                        </div>
                        <div className="border border-border rounded p-2">
                          <span className="font-medium">Target Date:</span> {new Date(goal.targetDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <Target size={40} className="mx-auto mb-2 opacity-30" />
                  <p>No goals have been created yet</p>
                  <button 
                    className="mt-4 btn bg-accent-green"
                    onClick={handleNewGoal}
                  >
                    <span className="flex items-center gap-1">
                      <Plus size={16} />
                      Create First Goal
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="card h-fit">
          <h2 className="text-xl font-medium mb-4">Goal Bank</h2>
          <p className="text-text-secondary mb-4">Use these pre-written templates to quickly create common IEP goals.</p>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-green rounded-md hover:bg-green hover:bg-opacity-5 transition-all">
              <h3 className="font-medium">Reading Fluency</h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                Student will read grade-level text at [X] words per minute with [Y]% accuracy.
              </p>
            </button>
            
            <button className="w-full text-left p-3 border border-green rounded-md hover:bg-green hover:bg-opacity-5 transition-all">
              <h3 className="font-medium">Math Problem Solving</h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                Student will solve multi-step word problems involving [operation] with [X]% accuracy.
              </p>
            </button>
            
            <button className="w-full text-left p-3 border border-green rounded-md hover:bg-green hover:bg-opacity-5 transition-all">
              <h3 className="font-medium">Written Expression</h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                Student will write [X]-paragraph essays with appropriate organization and details.
              </p>
            </button>
            
            <button className="w-full text-left p-3 border border-green rounded-md hover:bg-green hover:bg-opacity-5 transition-all">
              <h3 className="font-medium">Self-Regulation</h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                Student will identify and use [X] coping strategies when feeling frustrated or anxious.
              </p>
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-bg-secondary rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Goal Writing Tips
            </h3>
            <ul className="text-sm space-y-2 text-text-secondary">
              <li>• Include measurable criteria for success</li>
              <li>• Specify conditions under which the skill will be performed</li>
              <li>• Include a timeframe for achievement</li>
              <li>• Ensure goals are appropriate and achievable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalWriting;