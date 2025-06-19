import React, { useState } from 'react';
import { BarChart3, User, Clock, ArrowUp, ArrowDown, Search, Filter, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockStudents } from '../data/schedulingMockData';

interface Student {
  id: number;
  name: string;
  grade: string;
  program: string;
  nextReview: string;
  progress: number;
  goalsMet: number;
  totalGoals: number;
}

const StudentDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { 
      id: 1, 
      name: 'Leo Gonzalez', 
      grade: '3rd', 
      program: 'Resource', 
      nextReview: '2025-05-15', 
      progress: 75,
      goalsMet: 3,
      totalGoals: 4
    },
    { 
      id: 2, 
      name: 'Mia Patel', 
      grade: '5th', 
      program: 'Self-Contained', 
      nextReview: '2025-04-10', 
      progress: 60,
      goalsMet: 3,
      totalGoals: 5
    },
    { 
      id: 3, 
      name: 'Alex Rodriguez', 
      grade: '2nd', 
      program: 'Resource', 
      nextReview: '2025-06-05', 
      progress: 40,
      goalsMet: 2,
      totalGoals: 5
    },
    { 
      id: 4, 
      name: 'Emma Thompson', 
      grade: '4th', 
      program: 'Inclusion', 
      nextReview: '2025-03-20', 
      progress: 90,
      goalsMet: 4,
      totalGoals: 4
    },
    { 
      id: 5, 
      name: 'Jordan Williams', 
      grade: '1st', 
      program: 'Resource', 
      nextReview: '2025-05-30', 
      progress: 50,
      goalsMet: 2,
      totalGoals: 4
    },
    {
      id: 6,
      name: 'Sophia Chen',
      grade: '6th',
      program: 'Inclusion',
      nextReview: '2025-04-25',
      progress: 85,
      goalsMet: 5,
      totalGoals: 6
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingReviews = [...students]
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
    .slice(0, 3);
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Student Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-md bg-bg-primary focus:outline-none focus:ring-2 focus:ring-purple w-full md:w-auto"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          </div>
          <button className="btn-primary flex items-center gap-1">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-purple bg-opacity-10 border-purple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">Total Students</p>
              <h2 className="text-2xl font-medium mt-1">{students.length}</h2>
            </div>
            <div className="p-2 bg-purple rounded-full text-white">
              <User size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-text-secondary flex items-center">
            <ArrowUp size={14} className="text-green mr-1" />
            <span>2 new this month</span>
          </div>
        </div>
        
        <div className="card bg-purple bg-opacity-10 border-purple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">Average Progress</p>
              <h2 className="text-2xl font-medium mt-1">
                {Math.round(students.reduce((acc, student) => acc + student.progress, 0) / students.length)}%
              </h2>
            </div>
            <div className="p-2 bg-purple rounded-full text-white">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-text-secondary flex items-center">
            <ArrowUp size={14} className="text-green mr-1" />
            <span>5% increase from last quarter</span>
          </div>
        </div>
        
        <div className="card bg-purple bg-opacity-10 border-purple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">Goals Met</p>
              <h2 className="text-2xl font-medium mt-1">
                {students.reduce((acc, student) => acc + student.goalsMet, 0)} / {students.reduce((acc, student) => acc + student.totalGoals, 0)}
              </h2>
            </div>
            <div className="p-2 bg-purple rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-text-secondary flex items-center">
            <ArrowUp size={14} className="text-green mr-1" />
            <span>3 more goals met this month</span>
          </div>
        </div>
        
        <div className="card bg-purple bg-opacity-10 border-purple">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary text-sm">Upcoming Reviews</p>
              <h2 className="text-2xl font-medium mt-1">
                {upcomingReviews.length}
              </h2>
            </div>
            <div className="p-2 bg-purple rounded-full text-white">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-text-secondary flex items-center">
            <ArrowDown size={14} className="text-red-500 mr-1" />
            <span>1 less than last month</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Student Progress</h2>
            <button className="text-sm text-purple hover:underline">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Grade</th>
                  <th className="text-left p-3">Program</th>
                  <th className="text-left p-3">Progress</th>
                  <th className="text-left p-3">Next Review</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="border-b border-border hover:bg-bg-secondary">
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3">{student.grade}</td>
                    <td className="p-3">{student.program}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-full max-w-[100px] bg-bg-secondary rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-purple h-2.5 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span>{student.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">{new Date(student.nextReview).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button className="btn bg-accent-purple text-xs py-1 px-3">View</button>
                        <Link
                          to={`/student-service-schedule/s${student.id}`}
                          className="btn border border-purple text-purple hover:bg-purple hover:bg-opacity-10 text-xs py-1 px-3 flex items-center gap-1"
                          title="Manage Service Schedule"
                        >
                          <Settings size={12} />
                          Schedule
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <User size={40} className="mx-auto mb-2 opacity-30" />
              <p>No students match your search criteria</p>
              <button 
                className="mt-4 text-purple hover:underline"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Upcoming Reviews</h2>
          
          {upcomingReviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingReviews.map(student => (
                <div key={student.id} className="p-3 border border-border rounded-md hover:border-purple transition-all">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{student.name}</h3>
                    <span className="text-xs bg-purple text-white px-2 py-0.5 rounded">
                      {new Date(student.nextReview).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {student.grade} Grade - {student.program}
                  </p>
                  <div className="mt-2">
                    <div className="text-xs text-text-secondary mb-1">
                      Goals: {student.goalsMet}/{student.totalGoals} met
                    </div>
                    <div className="w-full bg-bg-secondary rounded-full h-1.5">
                      <div 
                        className="bg-purple h-1.5 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary py-4 text-center">No upcoming reviews</p>
          )}
          
          <div className="mt-6 p-4 bg-bg-secondary rounded-md">
            <h3 className="font-medium mb-2">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Initial Evaluations</span>
                  <span>2</span>
                </div>
                <div className="w-full bg-bg-primary rounded-full h-1.5 mt-1">
                  <div className="bg-teal h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Annual Reviews</span>
                  <span>5</span>
                </div>
                <div className="w-full bg-bg-primary rounded-full h-1.5 mt-1">
                  <div className="bg-gold h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Triennial Reviews</span>
                  <span>1</span>
                </div>
                <div className="w-full bg-bg-primary rounded-full h-1.5 mt-1">
                  <div className="bg-green h-1.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;