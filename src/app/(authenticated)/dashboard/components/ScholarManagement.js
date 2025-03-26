'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Copy, GraduationCap, 
  MailPlus, X, Clock, AlertTriangle, RefreshCw,
  Users, ChevronRight, Plus, School, BookOpen
} from 'lucide-react';

export default function ScholarManagement({ sessionData }) {
  const [scholars, setScholars] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [copiedLinkCode, setCopiedLinkCode] = useState(false);
  const [copiedClassCode, setCopiedClassCode] = useState('');
  
  // Class creation state
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classGradeLevel, setClassGradeLevel] = useState('');

  // Mock class data
  const mockClasses = [
    {
      id: "class1",
      name: "Algebra I",
      subject: "Mathematics",
      gradeLevel: "9th Grade",
      enrollmentCode: "ALG-9X42-Z7",
      studentsEnrolled: 28,
      activeStudents: 26,
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: "class2",
      name: "Chemistry 101",
      subject: "Science",
      gradeLevel: "10th Grade",
      enrollmentCode: "CHEM-A72B-Y3",
      studentsEnrolled: 32,
      activeStudents: 30,
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: "class3",
      name: "World Literature",
      subject: "English",
      gradeLevel: "11th Grade",
      enrollmentCode: "LIT-C913-X8",
      studentsEnrolled: 24,
      activeStudents: 22,
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls to get scholars and classes
        await Promise.all([fetchScholars(), fetchClasses()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionData?.user?.id) {
      fetchData();
    }
  }, [sessionData]);

  const fetchScholars = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock scholar data - in a real app this would come from the API
      const mockScholars = [
        {
          id: "s1",
          name: "Alex Johnson",
          email: "alex.j@studentmail.com",
          grade: "9th Grade",
          status: "ACTIVE",
          verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          classes: ["class1", "class2"],
          progress: {
            overall: 78,
            byClass: {
              "class1": 82,
              "class2": 74
            }
          }
        },
        {
          id: "s2",
          name: "Maya Patel",
          email: "maya.p@studentmail.com",
          grade: "10th Grade",
          status: "ACTIVE",
          verifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          classes: ["class2", "class3"],
          progress: {
            overall: 92,
            byClass: {
              "class2": 95,
              "class3": 89
            }
          }
        },
        {
          id: "s3",
          name: "Jamal Williams",
          email: "jamal.w@studentmail.com",
          grade: "11th Grade",
          status: "PENDING",
          linkCode: "SCH-5XY2-Q8",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          classes: [],
          progress: {
            overall: 0,
            byClass: {}
          }
        }
      ];
      
      setScholars(mockScholars);
    } catch (error) {
      console.error('Error fetching scholars:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // In a real app, this would fetch classes from the API
      setClasses(mockClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteSuccess(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would send the invitation via API
      setInviteSuccess({
        success: true,
        linkCode: "SCH-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + 
                  Math.random().toString(36).substring(2, 4).toUpperCase(),
      });
      
      // Reset form
      setInviteEmail('');
      setInviteMessage('');
    } catch (error) {
      console.error('Error sending invitation:', error);
      setInviteSuccess({
        success: false,
        error: error.message || 'Failed to send invitation',
      });
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would create the class via API
      const newClass = {
        id: "class" + (classes.length + 1),
        name: className,
        subject: classSubject,
        gradeLevel: classGradeLevel,
        enrollmentCode: classSubject.substring(0, 4).toUpperCase() + "-" + 
                        Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + 
                        Math.random().toString(36).substring(2, 4).toUpperCase(),
        studentsEnrolled: 0,
        activeStudents: 0,
        lastActive: new Date(),
        createdAt: new Date(),
        description: classDescription
      };
      
      setClasses([...classes, newClass]);
      setShowClassModal(false);
      
      // Reset form
      setClassName('');
      setClassSubject('');
      setClassDescription('');
      setClassGradeLevel('');
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const copyLinkCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedLinkCode(true);
    setTimeout(() => setCopiedLinkCode(false), 2000);
  };

  const copyClassCode = (code, classId) => {
    navigator.clipboard.writeText(code);
    setCopiedClassCode(classId);
    setTimeout(() => setCopiedClassCode(''), 2000);
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

  // Get status badge style based on status
  const getStatusBadge = (status, expiresAt) => {
    let badgeClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    let icon = null;
    
    switch (status) {
      case 'PENDING':
        if (new Date(expiresAt) < new Date()) {
          badgeClasses += ' bg-red-100 text-red-800';
          icon = <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />;
          return { badgeClasses, icon, label: 'Expired' };
        }
        badgeClasses += ' bg-yellow-100 text-yellow-800';
        icon = <Clock className="h-3 w-3 mr-1 text-yellow-500" />;
        return { badgeClasses, icon, label: 'Pending' };
      case 'ACTIVE':
        badgeClasses += ' bg-green-100 text-green-800';
        icon = <Check className="h-3 w-3 mr-1 text-green-500" />;
        return { badgeClasses, icon, label: 'Active' };
      case 'DECLINED':
        badgeClasses += ' bg-red-100 text-red-800';
        icon = <X className="h-3 w-3 mr-1 text-red-500" />;
        return { badgeClasses, icon, label: 'Declined' };
      default:
        badgeClasses += ' bg-gray-100 text-gray-800';
        return { badgeClasses, icon: null, label: status };
    }
  };

  const getClassForScholar = (classId) => {
    return classes.find(c => c.id === classId) || { name: 'Unknown Class' };
  };

  return (
    <>
      {/* Classes Section */}
      <div className="neo-glass mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Classes</h2>
          <button 
            onClick={() => setShowClassModal(true)}
            className="neo-button text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Class
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div key={classItem.id} className="neo-card">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <School className="h-6 w-6 text-indigo-600" />
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
                          <button 
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={() => copyClassCode(classItem.enrollmentCode, classItem.id)}
                          >
                            {copiedClassCode === classItem.id ? 
                              <Check className="h-4 w-4" /> : 
                              <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                      <div className="bg-slate-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Students</p>
                        <p className="font-medium">{classItem.studentsEnrolled}</p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Active Students</p>
                        <p className="font-medium">{classItem.activeStudents}</p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Last Activity</p>
                        <p className="font-medium">{formatDate(classItem.lastActive)}</p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(classItem.createdAt)}</p>
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
                
                {/* Enrolled Students Preview */}
                {scholars.filter(s => s.classes.includes(classItem.id)).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-slate-500" />
                      Enrolled Students
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {scholars
                        .filter(s => s.classes.includes(classItem.id))
                        .slice(0, 3)
                        .map(student => (
                          <div key={student.id} className="flex items-center p-2 bg-slate-50 rounded-md">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                              <GraduationCap className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-slate-500">{student.grade}</div>
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                                <div className={`text-xs ${
                                  student.progress.byClass[classItem.id] >= 90 ? 'text-green-600' :
                                  student.progress.byClass[classItem.id] >= 70 ? 'text-blue-600' :
                                  'text-amber-600'
                                }`}>
                                  {student.progress.byClass[classItem.id] || 0}% progress
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {scholars.filter(s => s.classes.includes(classItem.id)).length > 3 && (
                      <div className="mt-2 text-center">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800">
                          View all {scholars.filter(s => s.classes.includes(classItem.id)).length} students
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 neo-card">
            <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
            <button 
              onClick={() => setShowClassModal(true)} 
              className="neo-button"
            >
              Create Your First Class
            </button>
          </div>
        )}
      </div>
      
      {/* Scholars Section */}
      <div className="neo-glass mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Students</h2>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="neo-button text-sm flex items-center"
          >
            <MailPlus className="h-4 w-4 mr-1" />
            Invite Student
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : scholars.length > 0 ? (
          <div className="space-y-4">
            {scholars.map((scholar) => {
              const statusBadge = getStatusBadge(scholar.status, scholar.expiresAt);
              
              return (
                <div key={scholar.id} className="neo-card">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-medium">{scholar.name || 'Unnamed Scholar'}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{scholar.email}</p>
                        </div>
                        <span className={statusBadge.badgeClasses}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        {scholar.status === 'ACTIVE' ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-3">
                              <div className="bg-slate-100 p-2 rounded-md">
                                <p className="text-xs text-muted-foreground">Grade Level</p>
                                <p className="font-medium">{scholar.grade}</p>
                              </div>
                              <div className="bg-slate-100 p-2 rounded-md">
                                <p className="text-xs text-muted-foreground">Verified At</p>
                                <p className="font-medium">{formatDate(scholar.verifiedAt)}</p>
                              </div>
                              <div className="bg-slate-100 p-2 rounded-md">
                                <p className="text-xs text-muted-foreground">Last Active</p>
                                <p className="font-medium">
                                  {scholar.lastActive ? formatDate(scholar.lastActive) : 'Not yet active'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Classes the student is enrolled in */}
                            {scholar.classes.length > 0 ? (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1 text-slate-500" />
                                  Enrolled Classes
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {scholar.classes.map(classId => {
                                    const classItem = getClassForScholar(classId);
                                    return (
                                      <div key={classId} className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm">
                                        {classItem.name}
                                        <div className="ml-2 h-1.5 w-1.5 rounded-full bg-indigo-300"></div>
                                        <span className="ml-1 text-xs">{scholar.progress.byClass[classId] || 0}%</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm bg-amber-50 text-amber-800 p-2 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                Not enrolled in any classes
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Link
                                href={`/noospace/${scholar.id}`}
                                className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition"
                              >
                                View Noospace
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="bg-yellow-50 p-3 rounded-md flex items-center justify-between">
                            <div>
                              <p className="text-sm text-yellow-800 font-medium">Invitation Pending</p>
                              <p className="text-xs text-yellow-600">
                                Expires on {formatDate(scholar.expiresAt)}
                              </p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-primary-700 bg-primary-50 hover:bg-primary-100"
                                onClick={() => copyLinkCode(scholar.linkCode)}
                              >
                                {copiedLinkCode ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copiedLinkCode ? 'Copied' : 'Copy Code'}
                              </button>
                              <button
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Resend
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 neo-card">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">You haven't linked with any students yet.</p>
            <button 
              onClick={() => setShowInviteModal(true)} 
              className="neo-button"
            >
              Invite a Student
            </button>
          </div>
        )}
      </div>
      
      {/* Invite Student Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" 
                 onClick={() => setShowInviteModal(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Invite a Student</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowInviteModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {inviteSuccess?.success ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Invitation Sent</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    An invitation has been sent to {inviteEmail}.
                  </p>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Link Code</p>
                    <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                      <code className="text-sm font-mono">{inviteSuccess.linkCode}</code>
                      <button 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => copyLinkCode(inviteSuccess.linkCode)}
                      >
                        {copiedLinkCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Share this code with the student to expedite the linking process.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">Assign to Class</h4>
                    <p className="text-xs text-indigo-600 mb-2">You can assign this student to a class once they've accepted the invitation.</p>
                    
                    <select
                      className="w-full p-2 text-sm border border-indigo-200 rounded-md bg-white"
                      disabled
                    >
                      <option value="">Select a class</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => setShowInviteModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInvite}>
                  {inviteSuccess?.success === false && (
                    <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
                      <p className="text-sm font-medium">{inviteSuccess.error || 'Failed to send invitation.'}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="scholarEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Student's Email
                    </label>
                    <input
                      type="email"
                      id="scholarEmail"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The student will receive an email with a link to connect with your account.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      id="inviteMessage"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to Class (Optional)
                    </label>
                    <select
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a class</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      The student will be automatically enrolled in this class when they accept the invitation.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      onClick={() => setShowInviteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Create Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" 
                 onClick={() => setShowClassModal(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Create New Class</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowClassModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateClass}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name*
                    </label>
                    <input
                      type="text"
                      id="className"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. Algebra I, Chemistry 101"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="classSubject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject*
                      </label>
                      <input
                        type="text"
                        id="classSubject"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={classSubject}
                        onChange={(e) => setClassSubject(e.target.value)}
                        placeholder="e.g. Mathematics"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="classGradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Grade Level*
                      </label>
                      <select
                        id="classGradeLevel"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={classGradeLevel}
                        onChange={(e) => setClassGradeLevel(e.target.value)}
                        required
                      >
                        <option value="">Select grade level</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                        <option value="9th Grade">9th Grade</option>
                        <option value="10th Grade">10th Grade</option>
                        <option value="11th Grade">11th Grade</option>
                        <option value="12th Grade">12th Grade</option>
                        <option value="College">College</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="classDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      id="classDescription"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                      value={classDescription}
                      onChange={(e) => setClassDescription(e.target.value)}
                      placeholder="Provide a brief description of this class..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-3 rounded-md mb-6">
                  <h4 className="text-sm font-medium text-indigo-700 mb-1">Class Code Generation</h4>
                  <p className="text-xs text-indigo-600">
                    A unique class enrollment code will be automatically generated when you create the class. 
                    Students can use this code to join your class.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setShowClassModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}