import React, { useState } from 'react';
import { Brain, Award, TrendingUp, AlertTriangle, Plus, Minus, Edit3, Save, X } from 'lucide-react';
import CollapsibleSection from '../../common/CollapsibleSection';

interface BehaviorProfile {
  tokenSystem: {
    type: string;
    customType?: string;
  };
  trackedBehaviors: string[];
  reinforcers: Array<{
    id: number;
    name: string;
    value: number;
  }>;
  copingStrategies: string[];
}

interface DailyBehaviorLog {
  date: string;
  behaviors: Record<string, number>;
  timestamps: Record<string, string[]>;
}

const BehaviorTab: React.FC = () => {
  const [tokens, setTokens] = useState(15);
  const [editMode, setEditMode] = useState(false);
  
  const [behaviorProfile, setBehaviorProfile] = useState<BehaviorProfile>({
    tokenSystem: {
      type: 'Tokens'
    },
    trackedBehaviors: [
      'On-Task Behavior',
      'Following Directions',
      'Appropriate Social Interactions',
      'Verbal Outbursts',
      'Tantrums'
    ],
    reinforcers: [
      { id: 1, name: 'Computer Time', value: 5 },
      { id: 2, name: 'Helper Badge', value: 3 },
      { id: 3, name: 'Free Choice Activity', value: 4 },
      { id: 4, name: 'Extra Recess', value: 6 },
      { id: 5, name: 'Lunch with Teacher', value: 8 },
      { id: 6, name: 'Special Pencil', value: 2 }
    ],
    copingStrategies: [
      'Deep Breathing',
      'Counting to Ten',
      'Taking a Break',
      'Using a Fidget Toy'
    ]
  });

  const [tempProfile, setTempProfile] = useState<BehaviorProfile>(behaviorProfile);
  
  // Daily behavior logging state
  const today = new Date().toISOString().split('T')[0];
  const [dailyLog, setDailyLog] = useState<DailyBehaviorLog>({
    date: today,
    behaviors: {},
    timestamps: {}
  });

  // Historical behavior data for the chart
  const behaviorData = [
    { date: '2025-01-15', positive: 8, negative: 2, notes: 'Great participation in group work' },
    { date: '2025-01-14', positive: 6, negative: 3, notes: 'Needed reminders for transitions' },
    { date: '2025-01-13', positive: 9, negative: 1, notes: 'Excellent self-regulation' },
    { date: '2025-01-12', positive: 5, negative: 4, notes: 'Difficulty with math frustration' },
    { date: '2025-01-11', positive: 7, negative: 2, notes: 'Used coping strategies effectively' },
  ];

  const copingStrategies = [
    { strategy: 'Deep Breathing', effectiveness: 85, lastUsed: '2025-01-15' },
    { strategy: 'Fidget Tool', effectiveness: 70, lastUsed: '2025-01-14' },
    { strategy: 'Movement Break', effectiveness: 90, lastUsed: '2025-01-15' },
    { strategy: 'Quiet Space', effectiveness: 75, lastUsed: '2025-01-13' },
  ];

  const tokenSystemOptions = ['Tokens', 'Dollars', 'Stars', 'Points', 'Stickers', 'Other'];
  const behaviorOptions = [
    'On-Task Behavior', 'Following Directions', 'Verbal Outbursts', 'Tantrums', 
    'Elopement', 'Appropriate Social Interactions', 'Completing Work', 'Staying in Seat',
    'Raising Hand', 'Waiting Turn', 'Other'
  ];
  const reinforcerOptions = [
    'Extra Computer Time', 'Choice of Activity', 'Verbal Praise', 'Small Toy', 
    'Snack', 'Helper Badge', 'Free Choice Activity', 'Extra Recess', 
    'Lunch with Teacher', 'Special Pencil', 'Stickers', 'Other'
  ];
  const copingStrategyOptions = [
    'Deep Breathing', 'Counting to Ten', 'Taking a Break', 'Using a Fidget Toy',
    'Talking to an Adult', 'Movement Break', 'Quiet Space', 'Listening to Music',
    'Drawing/Writing', 'Progressive Muscle Relaxation', 'Other'
  ];

  const handleTokenChange = (change: number) => {
    setTokens(Math.max(0, tokens + change));
  };

  const handleRedemption = (cost: number) => {
    if (tokens >= cost) {
      setTokens(tokens - cost);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setTempProfile({ ...behaviorProfile });
  };

  const handleSave = () => {
    setBehaviorProfile({ ...tempProfile });
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...behaviorProfile });
    setEditMode(false);
  };

  // Daily behavior logging functions
  const incrementBehavior = (behavior: string) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setDailyLog(prev => ({
      ...prev,
      behaviors: {
        ...prev.behaviors,
        [behavior]: (prev.behaviors[behavior] || 0) + 1
      },
      timestamps: {
        ...prev.timestamps,
        [behavior]: [...(prev.timestamps[behavior] || []), currentTime]
      }
    }));
  };

  const decrementBehavior = (behavior: string) => {
    setDailyLog(prev => {
      const currentCount = prev.behaviors[behavior] || 0;
      if (currentCount <= 0) return prev;

      const timestamps = prev.timestamps[behavior] || [];
      const newTimestamps = timestamps.slice(0, -1);

      return {
        ...prev,
        behaviors: {
          ...prev.behaviors,
          [behavior]: Math.max(0, currentCount - 1)
        },
        timestamps: {
          ...prev.timestamps,
          [behavior]: newTimestamps
        }
      };
    });
  };

  const getBehaviorCount = (behavior: string) => {
    return dailyLog.behaviors[behavior] || 0;
  };

  const getBehaviorType = (behavior: string) => {
    const positiveBehaviors = ['On-Task Behavior', 'Following Directions', 'Appropriate Social Interactions', 'Completing Work', 'Staying in Seat', 'Raising Hand', 'Waiting Turn'];
    return positiveBehaviors.includes(behavior) ? 'positive' : 'negative';
  };

  const updateTokenSystem = (type: string) => {
    setTempProfile(prev => ({
      ...prev,
      tokenSystem: {
        type,
        customType: type === 'Other' ? prev.tokenSystem.customType || '' : undefined
      }
    }));
  };

  const updateCustomTokenType = (customType: string) => {
    setTempProfile(prev => ({
      ...prev,
      tokenSystem: {
        ...prev.tokenSystem,
        customType
      }
    }));
  };

  const addBehavior = (behavior: string) => {
    if (behavior === 'Other') {
      setTempProfile(prev => ({
        ...prev,
        trackedBehaviors: [...prev.trackedBehaviors, '']
      }));
    } else if (!tempProfile.trackedBehaviors.includes(behavior)) {
      setTempProfile(prev => ({
        ...prev,
        trackedBehaviors: [...prev.trackedBehaviors, behavior]
      }));
    }
  };

  const updateBehavior = (index: number, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      trackedBehaviors: prev.trackedBehaviors.map((behavior, i) => 
        i === index ? value : behavior
      )
    }));
  };

  const removeBehavior = (index: number) => {
    setTempProfile(prev => ({
      ...prev,
      trackedBehaviors: prev.trackedBehaviors.filter((_, i) => i !== index)
    }));
  };

  const addReinforcer = (name: string) => {
    const newId = Math.max(...tempProfile.reinforcers.map(r => r.id), 0) + 1;
    if (name === 'Other') {
      setTempProfile(prev => ({
        ...prev,
        reinforcers: [...prev.reinforcers, { id: newId, name: '', value: 1 }]
      }));
    } else {
      const existingReinforcer = tempProfile.reinforcers.find(r => r.name === name);
      if (!existingReinforcer) {
        setTempProfile(prev => ({
          ...prev,
          reinforcers: [...prev.reinforcers, { id: newId, name, value: 1 }]
        }));
      }
    }
  };

  const updateReinforcer = (id: number, field: 'name' | 'value', value: string | number) => {
    setTempProfile(prev => ({
      ...prev,
      reinforcers: prev.reinforcers.map(reinforcer => 
        reinforcer.id === id ? { ...reinforcer, [field]: value } : reinforcer
      )
    }));
  };

  const removeReinforcer = (id: number) => {
    setTempProfile(prev => ({
      ...prev,
      reinforcers: prev.reinforcers.filter(r => r.id !== id)
    }));
  };

  const addCopingStrategy = (strategy: string) => {
    if (strategy === 'Other') {
      setTempProfile(prev => ({
        ...prev,
        copingStrategies: [...prev.copingStrategies, '']
      }));
    } else if (!tempProfile.copingStrategies.includes(strategy)) {
      setTempProfile(prev => ({
        ...prev,
        copingStrategies: [...prev.copingStrategies, strategy]
      }));
    }
  };

  const updateCopingStrategy = (index: number, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      copingStrategies: prev.copingStrategies.map((strategy, i) => 
        i === index ? value : strategy
      )
    }));
  };

  const removeCopingStrategy = (index: number) => {
    setTempProfile(prev => ({
      ...prev,
      copingStrategies: prev.copingStrategies.filter((_, i) => i !== index)
    }));
  };

  const getTokenDisplayName = () => {
    const profile = editMode ? tempProfile : behaviorProfile;
    return profile.tokenSystem.type === 'Other' 
      ? profile.tokenSystem.customType || 'Tokens'
      : profile.tokenSystem.type;
  };

  const renderSectionHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Brain className="text-purple" size={24} />
        <h2 className="text-xl font-semibold">Behavior Profile</h2>
        {editMode && (
          <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
            Editing Mode
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {editMode ? (
          <>
            <button
              onClick={handleCancel}
              className="p-2 text-text-secondary hover:bg-bg-secondary rounded-md transition-colors"
              aria-label="Cancel editing"
            >
              <X size={16} />
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-purple text-white hover:bg-purple/80 rounded-md transition-colors"
              aria-label="Save changes"
            >
              <Save size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="p-2 text-purple hover:bg-purple/10 rounded-md transition-colors"
            aria-label="Edit behavior profile"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  // Calculate active behaviors count for badge
  const activeBehaviorsCount = behaviorProfile.trackedBehaviors.length;
  const todaysBehaviorCount = Object.values(dailyLog.behaviors).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {renderSectionHeader()}
      
      <div className="space-y-4">
        {/* Token System - Collapsible */}
        <CollapsibleSection
          title="Token System"
          icon={<Award className="text-purple" size={20} />}
          badge={
            <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full font-medium">
              {tokens} {getTokenDisplayName()}
            </span>
          }
          defaultExpanded={true}
          accentColor="purple"
          className={`transition-all ${editMode ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        >
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token Type</label>
                <select
                  value={tempProfile.tokenSystem.type}
                  onChange={(e) => updateTokenSystem(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  {tokenSystemOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {tempProfile.tokenSystem.type === 'Other' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Token Name</label>
                  <input
                    type="text"
                    value={tempProfile.tokenSystem.customType || ''}
                    onChange={(e) => updateCustomTokenType(e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                    placeholder="e.g., Points, Stickers"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple mb-2">{tokens}</div>
                <p className="text-text-secondary">{getTokenDisplayName()} Available</p>
              </div>
              
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => handleTokenChange(-1)}
                  className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => handleTokenChange(1)}
                  className="w-10 h-10 bg-green hover:bg-green/80 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recent Earnings:</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Completed math worksheet</span>
                    <span className="text-green">+2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Helped classmate</span>
                    <span className="text-green">+1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used coping strategy</span>
                    <span className="text-green">+1</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CollapsibleSection>

        {/* Behavior Tracking with Daily Logging - Collapsible */}
        <CollapsibleSection
          title="Behavior Tracking"
          icon={<TrendingUp className="text-purple" size={20} />}
          badge={
            editMode ? (
              <span className="px-2 py-1 bg-purple/10 text-purple text-xs rounded-full">
                {activeBehaviorsCount} Behaviors
              </span>
            ) : (
              <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full font-medium">
                {todaysBehaviorCount} Today
              </span>
            )
          }
          defaultExpanded={true}
          accentColor="purple"
          className={`transition-all ${editMode ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        >
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tracked Behaviors</label>
                <div className="space-y-2">
                  {tempProfile.trackedBehaviors.map((behavior, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={behavior}
                        onChange={(e) => updateBehavior(index, e.target.value)}
                        className="flex-1 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="Enter behavior to track"
                      />
                      <button
                        onClick={() => removeBehavior(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Remove behavior"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addBehavior(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="">+ Add Behavior</option>
                    {behaviorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Daily Behavior Tracking Interface */}
              <div className="mb-6 p-4 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-purple">Today's Behavior Log</h4>
                  <span className="text-sm text-text-secondary">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {behaviorProfile.trackedBehaviors.map((behavior, index) => {
                    const count = getBehaviorCount(behavior);
                    const behaviorType = getBehaviorType(behavior);
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-all ${
                          behaviorType === 'positive' 
                            ? 'border-green/20 bg-green/5' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{behavior}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            behaviorType === 'positive' 
                              ? 'bg-green text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {behaviorType === 'positive' ? '+' : '-'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => decrementBehavior(behavior)}
                            disabled={count <= 0}
                            className="w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center hover:bg-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease count"
                          >
                            <Minus size={14} />
                          </button>
                          
                          <div className="text-center min-w-[40px]">
                            <div className="text-xl font-bold text-purple">{count}</div>
                            <div className="text-xs text-text-secondary">today</div>
                          </div>
                          
                          <button
                            onClick={() => incrementBehavior(behavior)}
                            className="w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center hover:bg-purple/80 transition-colors"
                            aria-label="Increase count"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {behaviorProfile.trackedBehaviors.length === 0 && (
                  <div className="text-center py-4 text-text-secondary">
                    <p className="text-sm">No behaviors configured for tracking</p>
                    <p className="text-xs mt-1">Use edit mode to add behaviors</p>
                  </div>
                )}
              </div>

              {/* Historical Data */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent History:</h4>
                {behaviorData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-1">
                        <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green text-sm">+{day.positive}</span>
                          <span className="text-red-500 text-sm">-{day.negative}</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{day.notes}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple">
                        {day.positive - day.negative > 0 ? '+' : ''}{day.positive - day.negative}
                      </div>
                      <div className="text-xs text-text-secondary">Net</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CollapsibleSection>

        {/* Reinforcement Inventory - Collapsible */}
        <CollapsibleSection
          title="Reinforcement"
          icon={<Award className="text-purple" size={20} />}
          badge={
            <span className="px-2 py-1 bg-purple/20 text-purple text-xs rounded-full font-medium">
              {behaviorProfile.reinforcers.length} Items
            </span>
          }
          defaultExpanded={false}
          accentColor="purple"
          className={`transition-all ${editMode ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        >
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reinforcers</label>
                <div className="space-y-2">
                  {tempProfile.reinforcers.map((reinforcer) => (
                    <div key={reinforcer.id} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={reinforcer.name}
                        onChange={(e) => updateReinforcer(reinforcer.id, 'name', e.target.value)}
                        className="flex-1 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="Reinforcer name"
                      />
                      <input
                        type="number"
                        min="1"
                        value={reinforcer.value}
                        onChange={(e) => updateReinforcer(reinforcer.id, 'value', parseInt(e.target.value))}
                        className="w-20 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="Cost"
                      />
                      <span className="text-xs text-text-secondary">{getTokenDisplayName()}</span>
                      <button
                        onClick={() => removeReinforcer(reinforcer.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Remove reinforcer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addReinforcer(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="">+ Add Reinforcer</option>
                    {reinforcerOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {behaviorProfile.reinforcers.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                  tokens >= item.value
                    ? 'border-green bg-green/5'
                    : 'border-border bg-bg-secondary'
                }`}>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-text-secondary">
                      {item.value} {getTokenDisplayName().toLowerCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedemption(item.value)}
                    disabled={tokens < item.value}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      tokens >= item.value
                        ? 'bg-purple text-white hover:bg-purple/80'
                        : 'bg-bg-secondary text-text-secondary cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>

        {/* Coping Strategies - Collapsible */}
        <CollapsibleSection
          title="Coping Strategies"
          icon={<Brain className="text-purple" size={20} />}
          badge={
            <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
              90% Effective
            </span>
          }
          defaultExpanded={false}
          accentColor="purple"
          className={`transition-all ${editMode ? 'ring-2 ring-purple/20 bg-purple/5' : 'bg-bg-primary'}`}
        >
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coping Strategies</label>
                <div className="space-y-2">
                  {tempProfile.copingStrategies.map((strategy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={strategy}
                        onChange={(e) => updateCopingStrategy(index, e.target.value)}
                        className="flex-1 p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                        placeholder="Enter coping strategy"
                      />
                      <button
                        onClick={() => removeCopingStrategy(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="Remove strategy"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addCopingStrategy(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    <option value="">+ Add Strategy</option>
                    {copingStrategyOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {copingStrategies.map((strategy, index) => (
                  <div key={index} className="p-3 bg-bg-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{strategy.strategy}</span>
                      <span className="text-sm text-text-secondary">
                        {strategy.effectiveness}% effective
                      </span>
                    </div>
                    <div className="w-full bg-bg-primary rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${strategy.effectiveness}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-text-secondary">
                      Last used: {new Date(strategy.lastUsed).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-purple/10 border border-purple/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-purple mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Recommendation</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Movement breaks are most effective. Consider increasing frequency during math activities.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default BehaviorTab;