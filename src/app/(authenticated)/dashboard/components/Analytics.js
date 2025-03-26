'use client';

import { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, BookOpen, 
  Calendar, ChevronDown, Download, Filter,
  GraduationCap, Brain, Award, PieChart
} from 'lucide-react';

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState('lastMonth');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('all');

  // Dummy class data
  const classes = [
    { id: 'ap-physics', name: 'AP Physics', gradeLevel: '11-12' },
    { id: 'world-lit', name: 'World Literature', gradeLevel: '10' },
    { id: 'algebra2', name: 'Algebra II', gradeLevel: '9-10' },
    { id: 'us-history', name: 'US History', gradeLevel: '11' }
  ];

  // Advanced analytics data with standardized test predictions
  const classPerformanceData = {
    'all': {
      knowledgeRetention: 82,
      collegeReadiness: 78,
      standardizedTests: {
        sat: { average: 1280, range: [1180, 1380] },
        act: { average: 27, range: [25, 29] }
      },
      improvementRate: 12,
      topChallenges: ['Complex equations', 'Literary analysis', 'Critical thinking'],
      strengths: ['Memorization', 'Group discussion', 'Vocabulary']
    },
    'ap-physics': {
      knowledgeRetention: 86,
      collegeReadiness: 89,
      standardizedTests: {
        sat: { average: 1350, range: [1270, 1430] },
        act: { average: 29, range: [27, 31] }
      },
      improvementRate: 15,
      topChallenges: ['Wave mechanics', 'Thermodynamics', 'Relativity'],
      strengths: ['Force calculations', 'Lab work', 'Problem-solving']
    },
    'world-lit': {
      knowledgeRetention: 79,
      collegeReadiness: 76,
      standardizedTests: {
        sat: { average: 1260, range: [1170, 1350] },
        act: { average: 26, range: [24, 28] }
      },
      improvementRate: 9,
      topChallenges: ['Literary analysis', 'Theme identification', 'Comparative writing'],
      strengths: ['Vocabulary', 'Reading comprehension', 'Historical context']
    },
    'algebra2': {
      knowledgeRetention: 83,
      collegeReadiness: 74,
      standardizedTests: {
        sat: { average: 1240, range: [1150, 1330] },
        act: { average: 25, range: [23, 27] }
      },
      improvementRate: 11,
      topChallenges: ['Complex equations', 'Word problems', 'Functions'],
      strengths: ['Basic operations', 'Linear equations', 'Graphing']
    },
    'us-history': {
      knowledgeRetention: 80,
      collegeReadiness: 77,
      standardizedTests: {
        sat: { average: 1270, range: [1180, 1360] },
        act: { average: 26, range: [24, 28] }
      },
      improvementRate: 10,
      topChallenges: ['Primary source analysis', 'Cause-effect relationships', 'Era transitions'],
      strengths: ['Chronological understanding', 'Key figures', 'Major events']
    }
  };

  // Memory retention trends (showing how knowledge decays over time)
  const memoryRetentionTrends = {
    '1day': 95,
    '7days': 82,
    '30days': 68,
    '90days': 54,
    '180days': 43
  };

  // Get data for currently selected class
  const currentClassData = classPerformanceData[selectedClass];

  // Function to handle time period changes
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setShowDatePicker(period === 'custom');
  };

  // Function to get label for the current time period
  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case 'lastMonth':
        return 'Last 30 Days';
      case 'lastQuarter':
        return 'Last 90 Days';
      case 'lastYear':
        return 'Last 12 Months';
      case 'custom':
        return dateRange.start && dateRange.end 
          ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
          : 'Custom Range';
      default:
        return 'Last 30 Days';
    }
  };

  return (
    <>
      <div className="neo-glass mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Class Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-1">Comprehensive insights across all learning activities</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select 
                className="neo-select min-w-[180px] bg-indigo-900/20 border-indigo-800/30"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <button 
                className="neo-button-outline text-sm flex items-center bg-purple-900/20 border-purple-800/30"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                {getTimePeriodLabel()}
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 z-10 border border-gray-800">
                  <div className="py-1">
                    <button 
                      className={`block px-4 py-2 text-sm text-left w-full ${timePeriod === 'lastMonth' ? 'text-indigo-400' : 'text-gray-300'} hover:bg-gray-800`}
                      onClick={() => handleTimePeriodChange('lastMonth')}
                    >
                      Last 30 Days
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm text-left w-full ${timePeriod === 'lastQuarter' ? 'text-indigo-400' : 'text-gray-300'} hover:bg-gray-800`}
                      onClick={() => handleTimePeriodChange('lastQuarter')}
                    >
                      Last 90 Days
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm text-left w-full ${timePeriod === 'lastYear' ? 'text-indigo-400' : 'text-gray-300'} hover:bg-gray-800`}
                      onClick={() => handleTimePeriodChange('lastYear')}
                    >
                      Last 12 Months
                    </button>
                    <button 
                      className={`block px-4 py-2 text-sm text-left w-full ${timePeriod === 'custom' ? 'text-indigo-400' : 'text-gray-300'} hover:bg-gray-800`}
                      onClick={() => handleTimePeriodChange('custom')}
                    >
                      Custom Range
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="neo-button-outline text-sm flex items-center bg-teal-900/20 border-teal-800/30 text-teal-400">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </button>
          </div>
        </div>
        
        {/* Key metrics dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="dashboard-stat-card flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Knowledge Retention</h3>
              <div className="h-10 w-10 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline">
                <p className="text-3xl font-bold">{currentClassData.knowledgeRetention}%</p>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">
                  ↑ {currentClassData.improvementRate}%
                </span>
              </div>
              <div className="w-full bg-emerald-900/20 h-2 rounded-full mt-3">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${currentClassData.knowledgeRetention}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-stat-card flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">College Readiness</h3>
              <div className="h-10 w-10 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline">
                <p className="text-3xl font-bold">{currentClassData.collegeReadiness}%</p>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/30">Predicted</span>
              </div>
              <div className="w-full bg-blue-900/20 h-2 rounded-full mt-3">
                <div 
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${currentClassData.collegeReadiness}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-stat-card flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Projected SAT</h3>
              <div className="h-10 w-10 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline">
                <p className="text-3xl font-bold">{currentClassData.standardizedTests.sat.average}</p>
                <span className="ml-2 text-xs text-indigo-400 whitespace-nowrap">
                  {currentClassData.standardizedTests.sat.range[0]}-{currentClassData.standardizedTests.sat.range[1]}
                </span>
              </div>
              <div className="w-full flex items-center gap-1 mt-3">
                <div className="bg-indigo-900/20 h-1 rounded-full flex-grow"></div>
                <div className="bg-indigo-600/50 h-3 rounded-full flex-grow-[2]"></div>
                <div className="bg-indigo-500 h-5 rounded-full flex-grow-[3]"></div>
                <div className="bg-indigo-600/50 h-3 rounded-full flex-grow-[2]"></div>
                <div className="bg-indigo-900/20 h-1 rounded-full flex-grow"></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-stat-card flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Projected ACT</h3>
              <div className="h-10 w-10 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline">
                <p className="text-3xl font-bold">{currentClassData.standardizedTests.act.average}</p>
                <span className="ml-2 text-xs text-purple-400 whitespace-nowrap">
                  {currentClassData.standardizedTests.act.range[0]}-{currentClassData.standardizedTests.act.range[1]}
                </span>
              </div>
              <div className="w-full flex items-center gap-1 mt-3">
                <div className="bg-purple-900/20 h-1 rounded-full flex-grow"></div>
                <div className="bg-purple-600/50 h-3 rounded-full flex-grow-[2]"></div>
                <div className="bg-purple-500 h-5 rounded-full flex-grow-[3]"></div>
                <div className="bg-purple-600/50 h-3 rounded-full flex-grow-[2]"></div>
                <div className="bg-purple-900/20 h-1 rounded-full flex-grow"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Memory retention chart */}
        <div className="neo-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <Brain className="mr-2 h-5 w-5 text-emerald-600" />
              Knowledge Retention Over Time
            </h3>
            <div className="flex gap-2">
              <div className="text-xs py-1 px-2 bg-emerald-100 text-emerald-800 rounded-full">
                Active Recall ↑
              </div>
              <div className="text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">
                Spaced Repetition ↑
              </div>
            </div>
          </div>
          <div className="h-[200px] flex items-end mb-2 gap-2">
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-emerald-500 w-full h-[95%] rounded-t-md"></div>
              <span className="text-xs mt-1">1 day</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-emerald-500 w-full h-[82%] rounded-t-md"></div>
              <span className="text-xs mt-1">7 days</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-emerald-500 w-full h-[68%] rounded-t-md"></div>
              <span className="text-xs mt-1">30 days</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-emerald-500 w-full h-[54%] rounded-t-md"></div>
              <span className="text-xs mt-1">90 days</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-emerald-500 w-full h-[43%] rounded-t-md"></div>
              <span className="text-xs mt-1">180 days</span>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Percentage of material retained after initial learning
          </div>
        </div>
        
        {/* Strengths and challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="neo-card">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-medium">Class Strengths</h3>
            </div>
            <div className="space-y-3">
              {currentClassData.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="neo-card">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <PieChart className="h-4 w-4 text-amber-600" />
              </div>
              <h3 className="font-medium">Learning Challenges</h3>
            </div>
            <div className="space-y-3">
              {currentClassData.topChallenges.map((challenge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span>{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Improvement opportunities */}
        <div className="neo-card mb-0 p-4 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Improvement Opportunity</h3>
              <p className="text-sm">
                {selectedClass === 'all' 
                  ? 'Implementing spaced repetition across all classes could improve retention by an estimated 18% over the next quarter.'
                  : `Focused review sessions on ${currentClassData.topChallenges[0].toLowerCase()} could improve overall class performance by 15-20%.`
                }
              </p>
            </div>
            <div className="ml-auto">
              <button className="neo-button-sm">Take Action</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Student-level insights */}
      <div className="neo-glass">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Student-Level Insights</h2>
          <button className="neo-button-sm">
            View All Students
          </button>
        </div>
        
        {/* Student cards with metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* These would be real students in production */}
          <div className="neo-card">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                <span className="text-lg font-bold">JD</span>
              </div>
              <div>
                <h3 className="font-medium">Jessica Davis</h3>
                <p className="text-sm text-muted-foreground mb-2">Grade 11 • 3 Classes</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Knowledge Retention</span>
                      <span className="font-medium">93%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: '93%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Projected SAT</span>
                      <span className="font-medium">1380</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>College Readiness</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: '87%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="neo-card">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                <span className="text-lg font-bold">MT</span>
              </div>
              <div>
                <h3 className="font-medium">Marcus Thompson</h3>
                <p className="text-sm text-muted-foreground mb-2">Grade 10 • 4 Classes</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Knowledge Retention</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Projected SAT</span>
                      <span className="font-medium">1240</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: '72%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>College Readiness</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="neo-card">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                <span className="text-lg font-bold">AR</span>
              </div>
              <div>
                <h3 className="font-medium">Alicia Rodriguez</h3>
                <p className="text-sm text-muted-foreground mb-2">Grade 11 • 3 Classes</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Knowledge Retention</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: '88%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Projected SAT</span>
                      <span className="font-medium">1350</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: '83%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>College Readiness</span>
                      <span className="font-medium">84%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: '84%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}