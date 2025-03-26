"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, Book, BookOpen, Clock, Star, TrendingUp, 
  BarChart3, Users, GraduationCap, Brain, Medal,
  Plus, Copy, ChevronRight, Search, Filter, BellRing
} from 'lucide-react';
import DashboardOverview from './components/DashboardOverview';
import NotesView from './components/NotesView';
import ScholarManagement from './components/ScholarManagement';
import Analytics from './components/Analytics';

export default function Dashboard() {
  const { data: session } = useSession();
  const [recentBooks, setRecentBooks] = useState([]);
  const [stats, setStats] = useState({ booksRead: 0, pagesRead: 0, minutesRead: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recentBooksRes, statsRes, studentsRes, classesRes] = await Promise.all([
          fetch('/api/books/recent'),
          fetch('/api/user/stats'),
          session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN' || session?.user?.role === 'STAFF' 
            ? fetch('/api/scholars/list')
            : Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
          session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN' || session?.user?.role === 'STAFF' 
            ? fetch('/api/classes')
            : Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
        ]);

        if (recentBooksRes.ok && statsRes.ok) {
          const [recentBooksData, statsData, studentsData, classesData] = await Promise.all([
            recentBooksRes.json(),
            statsRes.json(),
            studentsRes.ok ? studentsRes.json() : [],
            classesRes.ok ? classesRes.json() : []
          ]);

          setRecentBooks(recentBooksData);
          setStats(statsData);
          setStudents(studentsData);
          setClasses(classesData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  // Filter classes based on search query
  const filteredClasses = classes.filter(classItem => 
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.gradeLevel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter students based on search query and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesClass = 
      filterClass === 'all' || 
      (student.classes && student.classes.some(cls => cls.id === filterClass));
      
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Determine which tabs to show based on user role
  const isStaff = ['ADMIN', 'TEACHER', 'STAFF'].includes(session?.user?.role);
  const isParent = session?.user?.role === 'PARENT' && session?.user?.scholarChild?.length > 0;

  return (
    <div className="animate-fade-in">
      <header className="mb-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/30 p-6 rounded-2xl border border-indigo-800/30 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isStaff ? 'School analytics & student management' : 'Your personal learning dashboard'}
            </p>
          </div>
          
          {isStaff && (
            <div className="flex gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students, classes..."
                  className="neo-input pl-10 pr-4 py-2 w-full sm:w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="neo-button-outline p-2 flex items-center justify-center relative">
                <BellRing className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          )}
        </div>
        
        {isStaff && (
          <div className="flex items-center justify-between mt-6 bg-black/20 p-3 px-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                <span>Students: <strong>{students.length}</strong></span>
              </div>
              <div className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg flex items-center">
                <BookOpen className="h-4 w-4 mr-1.5" />
                <span>Classes: <strong>{classes.length}</strong></span>
              </div>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" /> Last updated: Just now
            </div>
          </div>
        )}
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <div className="mb-8 overflow-x-auto pb-2">
          <TabsList className="dashboard-nav">  
            <TabsTrigger value="overview" className="dashboard-nav-item">
              <Book className="h-4 w-4" />
              Overview
            </TabsTrigger>
            
            {isStaff && (
              <TabsTrigger value="classes" className="dashboard-nav-item">
                <BookOpen className="h-4 w-4" />
                Classes
              </TabsTrigger>
            )}
            
            {isStaff && (
              <TabsTrigger value="students" className="dashboard-nav-item">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
            )}
            
            <TabsTrigger value="notes" className="dashboard-nav-item">
              <Brain className="h-4 w-4" />
              Memory
            </TabsTrigger>
            
            {isParent && (
              <TabsTrigger value="scholars" className="dashboard-nav-item">
                <GraduationCap className="h-4 w-4" />
                Scholars
              </TabsTrigger>
            )}
            
            {isStaff && (
              <TabsTrigger value="analytics" className="dashboard-nav-item">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DashboardOverview 
                stats={stats} 
                recentBooks={recentBooks} 
                session={session} 
              />
            </div>
            
            {isStaff && (
              <div className="neo-glass">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/dashboard/class/new" className="dashboard-quick-action-btn">
                    <div className="h-10 w-10 rounded-full bg-indigo-900/40 flex items-center justify-center mr-4 text-indigo-400">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Class</p>
                      <p className="text-xs text-muted-foreground">Create a class for your students</p>
                    </div>
                  </Link>
                  
                  <Link href="/studio" className="dashboard-quick-action-btn">
                    <div className="h-10 w-10 rounded-full bg-purple-900/40 flex items-center justify-center mr-4 text-purple-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Learning Analysis</p>
                      <p className="text-xs text-muted-foreground">Analyze student performance</p>
                    </div>
                  </Link>
                  
                  <Link href="/feedback" className="dashboard-quick-action-btn">
                    <div className="h-10 w-10 rounded-full bg-pink-900/40 flex items-center justify-center mr-4 text-pink-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Student Feedback</p>
                      <p className="text-xs text-muted-foreground">Review and provide feedback</p>
                    </div>
                  </Link>
                </div>
                
                <div className="mt-6 pt-5 border-t border-gray-800/30">
                  <h3 className="font-medium mb-3 flex items-center">
                    <BellRing className="h-4 w-4 mr-2 text-amber-400" />
                    Recent Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-xl text-sm">
                      <p className="font-medium text-indigo-300">5 new students joined your classes</p>
                      <p className="text-xs text-indigo-400/80 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-amber-900/20 border border-amber-800/30 rounded-xl text-sm">
                      <p className="font-medium text-amber-300">Assignment deadline approaching</p>
                      <p className="text-xs text-amber-400/80 mt-1">Tomorrow at 11:59 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0">
          <NotesView userId={session?.user?.id} />
        </TabsContent>
        
        {isStaff && (
          <TabsContent value="classes" className="mt-0">
            <div className="neo-glass mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">My Classes</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search classes..."
                      className="neo-input pl-10 pr-4 py-2 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Link href="/dashboard/class/new" className="neo-button text-sm flex items-center whitespace-nowrap">
                    <Plus className="mr-1 h-4 w-4" /> New Class
                  </Link>
                </div>
              </div>
              
              {filteredClasses.length > 0 ? (
                <div className="space-y-6">
                  {filteredClasses.map((classItem) => (
                    <div key={classItem.id} className="neo-card transition-all hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-indigo-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                            <div>
                              <h3 className="font-medium text-lg">{classItem.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {classItem.subject} • {classItem.gradeLevel}
                              </p>
                            </div>
                            
                            <div className="bg-indigo-50 px-3 py-1.5 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-slate-500">Class Code:</div>
                                <div className="font-mono text-sm font-medium">{classItem.enrollmentCode}</div>
                                <button className="text-indigo-600 hover:text-indigo-800">
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                            <div className="bg-slate-50 p-2 rounded-md flex flex-col">
                              <p className="text-xs text-muted-foreground">Students</p>
                              <p className="font-medium">{classItem.studentsEnrolled}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md flex flex-col">
                              <p className="text-xs text-muted-foreground">Active Students</p>
                              <p className="font-medium">{classItem.activeStudents || 0}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md flex flex-col">
                              <p className="text-xs text-muted-foreground">Knowledge Retention</p>
                              <p className="font-medium">{classItem.knowledgeRetention || 82}%</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md flex flex-col">
                              <p className="text-xs text-muted-foreground">Avg. Projected SAT</p>
                              <p className="font-medium">{classItem.projectedSAT || 1280}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-md transition">
                              Class Settings
                            </button>
                            <Link
                              href={`/dashboard/class/${classItem.id}`}
                              className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-md transition flex items-center"
                            >
                              View Class
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {/* Student Preview */}
                      {classItem.students && classItem.students.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Users className="h-4 w-4 mr-1 text-slate-500" />
                            Enrolled Students
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {classItem.students
                              .slice(0, 3)
                              .map(student => (
                                <div key={student.id} className="flex items-center p-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{student.name}</p>
                                    <div className="flex items-center gap-2">
                                      <div className="text-xs text-slate-500 truncate max-w-[120px]">{student.email}</div>
                                      {student.progress !== undefined && (
                                        <div className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                          {student.progress}%
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          {classItem.students.length > 3 && (
                            <div className="mt-2 text-center">
                              <Link href={`/dashboard/class/${classItem.id}`} className="text-sm text-indigo-600 hover:underline hover:text-indigo-800 transition-colors">
                                View all {classItem.students.length} students
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 neo-card">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {searchQuery ? (
                    <>
                      <p className="text-muted-foreground mb-4">No classes matching "{searchQuery}"</p>
                      <button 
                        className="neo-button-sm"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
                      <Link href="/dashboard/class/new" className="neo-button">
                        Create Your First Class
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        )}
        
        {isStaff && (
          <TabsContent value="students" className="mt-0">
            <div className="neo-glass mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">Student Dashboard</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="neo-input pl-10 pr-4 py-2 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    className="neo-select"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="all">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  
                  <Link href="/studio" className="neo-button-outline text-sm flex items-center whitespace-nowrap">
                    Advanced <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="neo-card hover:shadow-md transition-all">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground mb-1">{student.email}</p>
                            
                            <div className="space-y-2 mt-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Knowledge Retention</span>
                                  <span className="font-medium">{student.knowledgeRetention || 78}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                  <div 
                                    className="bg-emerald-500 h-full rounded-full"
                                    style={{ width: `${student.knowledgeRetention || 78}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>College Readiness</span>
                                  <span className="font-medium">{student.collegeReadiness || 75}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                  <div 
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{ width: `${student.collegeReadiness || 75}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Projected SAT</span>
                                  <span className="font-medium">{student.projectedSAT || 1260}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                  <div 
                                    className="bg-indigo-500 h-full rounded-full"
                                    style={{ width: `${((student.projectedSAT || 1260) - 950) / 8}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            {student.classes && student.classes.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-slate-500 mb-1">Classes:</p>
                                <div className="flex flex-wrap gap-1">
                                  {student.classes.slice(0, 2).map(cls => (
                                    <span key={cls.id} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                                      {cls.name}
                                    </span>
                                  ))}
                                  {student.classes.length > 2 && (
                                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                                      +{student.classes.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between gap-2">
                          <Link 
                            href={`/noospace/${student.id}`}
                            className="flex-1 text-center text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition"
                          >
                            View Noospace
                          </Link>
                          <Link 
                            href={`/studio?student=${student.id}`}
                            className="flex-1 text-center text-xs px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition"
                          >
                            Learning Analysis
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 neo-card">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {searchQuery || filterClass !== 'all' ? (
                    <>
                      <p className="text-muted-foreground mb-4">No students found matching your filters.</p>
                      <button 
                        className="neo-button-sm"
                        onClick={() => {setSearchQuery(''); setFilterClass('all');}}
                      >
                        Clear Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-4">No students found or linked to your account.</p>
                      <Link href="/studio" className="neo-button">
                        Go to Studio
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        )}
        
        {isParent && (
          <TabsContent value="scholars" className="mt-0">
            <ScholarManagement sessionData={session} />
          </TabsContent>
        )}
        
        {isStaff && (
          <TabsContent value="analytics" className="mt-0">
            <Analytics />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}