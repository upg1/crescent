'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, School, Users, BookOpen, 
  GraduationCap, Settings, Plus, BarChart3,
  Sparkles, Search, Download, Filter
} from 'lucide-react';

export default function ClassView({ params }) {
  const { classId } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        await Promise.all([fetchClassDetails(), fetchStudents()]);
      } catch (error) {
        console.error('Error fetching class data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, router]);

  const fetchClassDetails = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock class data
      const mockClass = {
        id: classId,
        name: classId === "class1" ? "Algebra I" : 
              classId === "class2" ? "Chemistry 101" : 
              classId === "class3" ? "World Literature" : "Unknown Class",
        subject: classId === "class1" ? "Mathematics" : 
                 classId === "class2" ? "Science" : 
                 classId === "class3" ? "English" : "Unknown Subject",
        gradeLevel: classId === "class1" ? "9th Grade" : 
                    classId === "class2" ? "10th Grade" : 
                    classId === "class3" ? "11th Grade" : "Unknown Grade",
        enrollmentCode: classId === "class1" ? "ALG-9X42-Z7" : 
                        classId === "class2" ? "CHEM-A72B-Y3" : 
                        classId === "class3" ? "LIT-C913-X8" : "UNKNOWN-CODE",
        studentsEnrolled: classId === "class1" ? 28 : 
                          classId === "class2" ? 32 : 
                          classId === "class3" ? 24 : 0,
        activeStudents: classId === "class1" ? 26 : 
                        classId === "class2" ? 30 : 
                        classId === "class3" ? 22 : 0,
        lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        description: "This class covers key concepts and applications in " + 
                    (classId === "class1" ? "algebra including linear equations, quadratic functions, and systems of equations." : 
                     classId === "class2" ? "chemistry including atomic structure, chemical bonding, and reactions." : 
                     classId === "class3" ? "world literature with emphasis on critical analysis and interpretation." : 
                     "various subjects."),
        overallProgress: classId === "class1" ? 76 : 
                         classId === "class2" ? 68 : 
                         classId === "class3" ? 83 : 0,
        recentActivity: [
          { 
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
            type: "Content View", 
            count: 120 
          },
          { 
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
            type: "Exercise Completion", 
            count: 85 
          },
          { 
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
            type: "Note Creation", 
            count: 42 
          },
        ],
        topInsights: [
          { id: "i1", text: "Students show higher engagement with visual content in this class" },
          { id: "i2", text: "Memory palace technique improves retention by 34% for complex topics" },
          { id: "i3", text: "Group learning activities show 28% better outcomes than individual work" }
        ]
      };

      setClassData(mockClass);
    } catch (error) {
      console.error('Error fetching class details:', error);
      throw error;
    }
  };

  const fetchStudents = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock student data
      const mockStudents = [
        {
          id: "s1",
          name: "Alex Johnson",
          email: "alex.j@studentmail.com",
          grade: "9th Grade",
          enrollmentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          progress: {
            overall: 78,
            byClass: {
              [classId]: classId === "class1" ? 82 : classId === "class2" ? 74 : 76
            }
          },
          metrics: {
            exercises: 42,
            notes: 18,
            readingTime: 360, // minutes
            loggedIn: 16 // times this month
          }
        },
        {
          id: "s2",
          name: "Maya Patel",
          email: "maya.p@studentmail.com",
          grade: "10th Grade",
          enrollmentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          progress: {
            overall: 92,
            byClass: {
              [classId]: classId === "class1" ? 88 : classId === "class2" ? 95 : 90
            }
          },
          metrics: {
            exercises: 56,
            notes: 32,
            readingTime: 480, // minutes
            loggedIn: 22 // times this month
          }
        },
        {
          id: "s3",
          name: "Jamal Williams",
          email: "jamal.w@studentmail.com",
          grade: "10th Grade",
          enrollmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          progress: {
            overall: 65,
            byClass: {
              [classId]: classId === "class1" ? 70 : classId === "class2" ? 62 : 68
            }
          },
          metrics: {
            exercises: 28,
            notes: 12,
            readingTime: 240, // minutes
            loggedIn: 10 // times this month
          }
        },
        {
          id: "s4",
          name: "Emily Chen",
          email: "emily.c@studentmail.com",
          grade: "9th Grade",
          enrollmentDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          progress: {
            overall: 88,
            byClass: {
              [classId]: classId === "class1" ? 92 : classId === "class2" ? 87 : 85
            }
          },
          metrics: {
            exercises: 48,
            notes: 24,
            readingTime: 420, // minutes
            loggedIn: 18 // times this month
          }
        },
        {
          id: "s5",
          name: "Carlos Rodriguez",
          email: "carlos.r@studentmail.com",
          grade: "9th Grade",
          enrollmentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          progress: {
            overall: 72,
            byClass: {
              [classId]: classId === "class1" ? 68 : classId === "class2" ? 75 : 73
            }
          },
          metrics: {
            exercises: 35,
            notes: 14,
            readingTime: 300, // minutes
            loggedIn: 12 // times this month
          }
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.grade.toLowerCase().includes(searchLower)
    );
  });

  // Calculate progress statistics
  const calculateStats = () => {
    if (!students.length) return { average: 0, above90: 0, below70: 0 };
    
    const progressValues = students.map(s => s.progress.byClass[classId] || 0);
    const average = progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
    const above90 = progressValues.filter(val => val >= 90).length;
    const below70 = progressValues.filter(val => val < 70).length;
    
    return {
      average: Math.round(average),
      above90Percent: Math.round((above90 / progressValues.length) * 100),
      below70Percent: Math.round((below70 / progressValues.length) * 100)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Class not found</h2>
        <p className="text-muted-foreground mb-4">The class you are looking for does not exist or you don't have access to view it.</p>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Class Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm text-primary mb-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <School className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{classData.name}</h1>
                <p className="text-indigo-100">{classData.subject} • {classData.gradeLevel}</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <div className="bg-white/10 px-4 py-2 rounded-md backdrop-blur-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5 text-white/70" />
                  <span className="text-white font-medium">{classData.studentsEnrolled}</span>
                  <span className="text-white/70 ml-1 text-sm">students</span>
                </div>
              </div>
              
              <div className="bg-white/10 px-4 py-2 rounded-md backdrop-blur-sm">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1.5 text-white/70" />
                  <span className="text-white font-medium">{classData.overallProgress}%</span>
                  <span className="text-white/70 ml-1 text-sm">progress</span>
                </div>
              </div>
              
              <button className="bg-white text-indigo-700 hover:bg-indigo-50 transition-colors px-4 py-2 rounded-md font-medium text-sm">
                <Settings className="h-4 w-4 mr-1 inline-block" />
                Class Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Class Code and Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 neo-glass">
          <h2 className="text-xl font-semibold mb-4">Class Description</h2>
          <p className="text-slate-600 mb-4">{classData.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Created</p>
              <p className="font-medium">{formatDate(classData.createdAt)}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Last Activity</p>
              <p className="font-medium">{formatDate(classData.lastActive)}</p>
            </div>
          </div>
        </div>
        
        <div className="neo-glass">
          <h2 className="text-xl font-semibold mb-4">Enrollment Code</h2>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
            <p className="text-sm text-indigo-700 mb-2">Share this code with students to join this class:</p>
            <div className="bg-white border border-indigo-200 rounded-md p-3 font-mono text-center text-lg font-semibold text-indigo-800">
              {classData.enrollmentCode}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-md transition flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Students
            </button>
            <button className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-md transition flex items-center">
              Manage Access
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'students' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('students')}
          >
            <Users className="h-4 w-4 mr-2 inline-block" />
            Students
          </button>
          <button
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'analytics' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2 inline-block" />
            Analytics
          </button>
          <button
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'insights' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('insights')}
          >
            <Sparkles className="h-4 w-4 mr-2 inline-block" />
            Insights
          </button>
          <button
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'content' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            <BookOpen className="h-4 w-4 mr-2 inline-block" />
            Content
          </button>
        </nav>
      </div>
      
      {/* Students Tab Content */}
      {activeTab === 'students' && (
        <div>
          <div className="neo-glass mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold">Students</h2>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select className="border border-slate-200 rounded-md py-2 px-3 text-sm">
                  <option>Sort by Name</option>
                  <option>Sort by Progress</option>
                  <option>Sort by Last Active</option>
                </select>
                
                <button className="bg-primary text-white hover:bg-primary-dark transition-colors px-4 py-2 rounded-md font-medium text-sm">
                  <Plus className="h-4 w-4 mr-1 inline-block" />
                  Add Student
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Enrolled Students
                </h3>
                <p className="text-2xl font-semibold text-slate-700">{students.length}</p>
                <p className="text-xs text-blue-600">{classData.activeStudents} active in the last week</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-green-700 mb-1 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Average Progress
                </h3>
                <p className="text-2xl font-semibold text-slate-700">{stats.average}%</p>
                <p className="text-xs text-green-600">{stats.above90Percent}% of students above 90%</p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-amber-700 mb-1 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Performance Risk
                </h3>
                <p className="text-2xl font-semibold text-slate-700">{stats.below70Percent}%</p>
                <p className="text-xs text-amber-600">Students below 70% progress</p>
              </div>
            </div>
            
            {filteredStudents.length > 0 ? (
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <GraduationCap className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{student.name}</div>
                              <div className="text-xs text-slate-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-slate-700">{student.grade}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              student.progress.byClass[classId] >= 90 ? 'text-green-700' :
                              student.progress.byClass[classId] >= 70 ? 'text-blue-700' :
                              'text-amber-700'
                            }`}>
                              {student.progress.byClass[classId]}%
                            </span>
                            <div className="w-24 h-2 bg-slate-200 rounded-full ml-3">
                              <div 
                                className={`h-full rounded-full ${
                                  student.progress.byClass[classId] >= 90 ? 'bg-green-500' :
                                  student.progress.byClass[classId] >= 70 ? 'bg-blue-500' :
                                  'bg-amber-500'
                                }`}
                                style={{ width: `${student.progress.byClass[classId]}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                          {formatDate(student.lastActive)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/noospace/${student.id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            View Noospace
                          </Link>
                          <button className="text-slate-600 hover:text-slate-900">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium mb-1">No students match your search</p>
                    <p className="text-slate-500">Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-1">No students in this class</p>
                    <p className="text-slate-500 mb-4">Invite students to join this class</p>
                    <button className="bg-primary text-white hover:bg-primary-dark transition-colors px-4 py-2 rounded-md font-medium text-sm">
                      <Plus className="h-4 w-4 mr-1 inline-block" />
                      Add Students
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="neo-glass">
            <h2 className="text-xl font-semibold mb-4">Student Performance Metrics</h2>
            
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md">
                  Last 30 Days
                </button>
                <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 text-sm font-medium rounded-md">
                  Last Quarter
                </button>
                <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 text-sm font-medium rounded-md">
                  All Time
                </button>
              </div>
              
              <button className="flex items-center text-sm text-primary">
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </button>
            </div>
            
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Performance metrics chart will appear here</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Total Exercises Completed</p>
                <p className="text-2xl font-medium">209</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Notes Created</p>
                <p className="text-2xl font-medium">100</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Average Reading Time</p>
                <p className="text-2xl font-medium">360 min</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Avg Login Frequency</p>
                <p className="text-2xl font-medium">15.6/mo</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div className="text-center py-16">
          <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Analytics View Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Detailed analytics for this class will be available soon, showing student performance trends,
            engagement patterns, and learning outcomes.
          </p>
        </div>
      )}
      
      {/* Insights Tab Content */}
      {activeTab === 'insights' && (
        <div className="neo-glass">
          <h2 className="text-xl font-semibold mb-6">Learning Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-3 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-start">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-indigo-900 mb-1">Class Learning Patterns</h3>
                  <p className="text-indigo-700">
                    Based on student activity and performance data, we've identified key learning patterns
                    and opportunities to enhance outcomes for this class.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {classData.topInsights.map((insight, index) => (
            <div key={insight.id} className="mb-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${
                  index === 0 ? 'bg-purple-100 text-purple-600' : 
                  index === 1 ? 'bg-blue-100 text-blue-600' : 
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-slate-800">{insight.text}</p>
                  
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-100 transition-colors">
                      Apply to Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Content Tab Content */}
      {activeTab === 'content' && (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Class Content Manager Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Manage all learning materials, assignments, and resources for this class in one place.
            This feature will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}