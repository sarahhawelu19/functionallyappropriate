import React, { useState } from 'react';
import { BarChart3, User, Clock, ArrowUp, ArrowDown, Search, Filter, Settings, Eye } from 'lucide-react';
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

// Student Detail Modal Component
interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-bg-primary rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple rounded-full text-white">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-medium">Student Details</h2>
                <p className="text-text-secondary">{student.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            {/* Student Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <User className="text-purple" size={16} />
                  Basic Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Name:</span>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Grade:</span>
                    <span className="font-medium">{student.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Program:</span>
                    <span className="font-medium">{student.program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Student ID:</span>
                    <span className="font-medium">s{student.id}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-bg-secondary rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="text-purple" size={16} />
                  Progress Overview
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-bg-primary rounded-full h-2">
                      <div 
                        className="bg-purple h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Goals Met:</span>
                    <span className="font-medium">{student.goalsMet} of {student.totalGoals}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Next Review:</span>
                    <span className="font-medium">{new Date(student.nextReview).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Breakdown */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">IEP Goals Progress</h3>
              <div className="space-y-3">
                {Array.from({ length: student.totalGoals }, (_, index) => {
                  const isCompleted = index < student.goalsMet;
                  const goalProgress = isCompleted ? 100 : Math.random() * 80 + 10; // Mock progress
                  
                  return (
                    <div key={index} className="p-3 border border-border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Goal {index + 1}: {
                          index === 0 ? 'Reading Comprehension' :
                          index === 1 ? 'Math Problem Solving' :
                          index === 2 ? 'Social Skills' :
                          index === 3 ? 'Written Expression' :
                          'Communication Skills'
                        }</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isCompleted ? 'bg-green text-white' : 'bg-gold text-black'
                        }`}>
                          {isCompleted ? 'Met' : 'In Progress'}
                        </span>
                      </div>
                      <div className="w-full bg-bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green' : 'bg-gold'
                          }`}
                          style={{ width: `${goalProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-text-secondary mt-1">
                        {Math.round(goalProgress)}% complete
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-bg-secondary rounded">
                  <div className="w-2 h-2 bg-green rounded-full"></div>
                  <span className="text-sm">Goal 1 marked as completed</span>
                  <span className="text-xs text-text-secondary ml-auto">2 days ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-bg-secondary rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Progress report updated</span>
                  <span className="text-xs text-text-secondary ml-auto">1 week ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-bg-secondary rounded">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-sm">IEP meeting scheduled</span>
                  <span className="text-xs text-text-secondary ml-auto">2 weeks ago</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link
                to={`/student-service-schedule/s${student.id}`}
                className="btn border border-purple text-purple hover:bg-purple hover:bg-opacity-10 flex items-center gap-2 no-underline"
                onClick={onClose}
              >
                <Settings size={16} />
                Manage Schedule
              </Link>
              <button
                onClick={onClose}
                className="btn bg-accent-purple"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingReviews = [...students]
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
    .slice(0, 3);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };
  
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
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="btn bg-accent-purple text-xs py-1 px-3 flex items-center gap-1 hover:bg-opacity-90 transition-all"
                          title="View student details"
                        >
                          <Eye size={12} />
                          View
                        </button>
                        <Link
                          to={`/student-service-schedule/s${student.id}`}
                          className="btn border border-purple text-purple hover:bg-purple hover:bg-opacity-10 text-xs py-1 px-3 flex items-center gap-1 no-underline transition-all"
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

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StudentDashboard;