"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, BookOpen, BrainCircuit, BarChart3, Network, Users,
  LightbulbIcon, Brain, FlaskConical, Building, GraduationCap,
  Search, FlameKindling, PlusCircle, Edit, Layout, ChevronRight,
  FileText, BookText, Sparkles, Zap, Clock, PanelLeft, Lightbulb,
  Settings, BookOpen as BookOpenIcon, CircleUser, Plus, Trash, 
  Check, EyeIcon, PencilRuler, Layers, Puzzle, 
  MoveDown, Dot, CopyPlus, ListTodo, ChevronDown, Book, BookMarked
} from 'lucide-react';
import { GripVertical as DragVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PedagogicalParagraph } from '@/components/pedagogy/PedagogicalParagraph';

export default function LearningStudio() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [lessonTemplates, setLessonTemplates] = useState([]);
  const [lessonMode, setLessonMode] = useState('browse'); // browse, create, edit
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [lessonModules, setLessonModules] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessonTitle, setLessonTitle] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedModule, setDraggedModule] = useState(null);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);

  // Mock course data
  const mockCourses = [
    {
      id: 'c1',
      title: "Advanced Mathematics",
      slug: "advanced-mathematics",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      students: 32,
      lessons: 18,
      progress: 65,
      lastUpdated: "2 days ago"
    },
    {
      id: 'c2',
      title: "Modern Literature",
      slug: "modern-literature",
      coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      students: 28,
      lessons: 24,
      progress: 72,
      lastUpdated: "Yesterday"
    },
    {
      id: 'c3',
      title: "Chemistry Fundamentals",
      slug: "chemistry-fundamentals",
      coverImage: "https://images.unsplash.com/photo-1616198814651-e71f960c3180?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      students: 45,
      lessons: 16,
      progress: 58,
      lastUpdated: "3 days ago"
    },
    {
      id: 'c4',
      title: "World History",
      slug: "world-history",
      coverImage: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      students: 36,
      lessons: 22,
      progress: 81,
      lastUpdated: "1 week ago"
    }
  ];

  // Mock recent lessons
  const mockRecentLessons = [
    {
      id: 'l1',
      title: "Matrix Operations and Applications",
      courseId: 'c1',
      courseName: "Advanced Mathematics",
      coverImage: "https://images.unsplash.com/photo-1621618961180-787881a18fec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      components: 6,
      insightBased: true,
      lastModified: "Yesterday",
      status: "Published",
      engagement: 87,
      retention: 78
    },
    {
      id: 'l2',
      title: "Modernist Literary Techniques",
      courseId: 'c2',
      courseName: "Modern Literature",
      coverImage: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      components: 8,
      insightBased: true,
      lastModified: "3 days ago",
      status: "Published",
      engagement: 92,
      retention: 84
    },
    {
      id: 'l3',
      title: "Chemical Reactions and Catalysts",
      courseId: 'c3',
      courseName: "Chemistry Fundamentals",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      components: 7,
      insightBased: false,
      lastModified: "1 week ago",
      status: "Draft",
      engagement: null,
      retention: null
    },
    {
      id: 'l4',
      title: "The French Revolution: Causes and Effects",
      courseId: 'c4',
      courseName: "World History",
      coverImage: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      components: 9,
      insightBased: true,
      lastModified: "2 days ago",
      status: "Published",
      engagement: 79,
      retention: 72
    }
  ];

  // Mock lesson templates
  const mockLessonTemplates = [
    {
      id: 't1',
      title: "Memory Palace Builder",
      description: "Create a spatial memory structure with interactive 3D elements for visual-spatial learners.",
      insightScore: 9.2,
      category: "Memory Structure",
      suitableFor: ["History", "Biology", "Literature"],
      components: ["3D viewer", "Attachment points", "Guided walkthrough"]
    },
    {
      id: 't2',
      title: "Concept Mapping Network",
      description: "Develop interconnected concept maps that reveal relationships between ideas and topics.",
      insightScore: 8.7,
      category: "Knowledge Organization",
      suitableFor: ["Science", "Mathematics", "Social Studies"],
      components: ["Node editor", "Relationship builder", "Hierarchical view"]
    },
    {
      id: 't3',
      title: "Pattern Recognition Challenge",
      description: "Create a sequence of pattern recognition exercises that trigger insight moments.",
      insightScore: 9.0,
      category: "Insight Driver",
      suitableFor: ["Mathematics", "Programming", "Logic"],
      components: ["Pattern generator", "Solution checking", "Progression system"]
    },
    {
      id: 't4',
      title: "Narrative Learning Journey",
      description: "Build a story-based learning experience that creates emotional connections to material.",
      insightScore: 8.5,
      category: "Engagement Booster",
      suitableFor: ["Literature", "History", "Ethics"],
      components: ["Narrative editor", "Character creation", "Decision points"]
    }
  ];

  // Mock insights
  const mockInsights = [
    {
      id: 1,
      title: "Memory Palace Effectiveness",
      description: "Students using memory palace techniques show 37% higher retention in history concepts.",
      discoveredAt: "2 days ago",
      category: "Memory Structure",
      impactScore: 9.2,
      appliedIn: 5,
      recommendedFor: ["World History", "Modern Literature"],
      implementationComponent: "3D Spatial Memory Navigation"
    },
    {
      id: 2,
      title: "Interval Repetition Patterns",
      description: "Optimal spacing of concept review follows a logarithmic pattern rather than linear intervals.",
      discoveredAt: "1 week ago",
      category: "Retention Strategy",
      impactScore: 8.7,
      appliedIn: 3,
      recommendedFor: ["Advanced Mathematics", "Chemistry Fundamentals"],
      implementationComponent: "Smart Review Scheduler"
    },
    {
      id: 3,
      title: "Group Discussion Impact",
      description: "Peer discussions before independent practice improve retention by 28% across all subjects.",
      discoveredAt: "3 days ago",
      category: "Learning Activity",
      impactScore: 8.4,
      appliedIn: 7,
      recommendedFor: ["All courses"],
      implementationComponent: "Virtual Discussion Environment"
    },
    {
      id: 4,
      title: "Multimodal Encoding Superiority",
      description: "Information encoded through multiple sensory channels shows 42% better recall than single-channel encoding.",
      discoveredAt: "Yesterday",
      category: "Content Presentation",
      impactScore: 9.5,
      appliedIn: 4,
      recommendedFor: ["Chemistry Fundamentals", "World History"],
      implementationComponent: "Visual-Auditory-Kinesthetic Module"
    }
  ];

  // Mock lesson module types
  const moduleTypes = [
    {
      id: "text",
      name: "Text Content",
      icon: <FileText className="h-4 w-4" />,
      description: "Basic text content with formatting options",
      category: "Content"
    },
    {
      id: "memory-palace",
      name: "Memory Palace",
      icon: <Building className="h-4 w-4" />,
      description: "3D spatial memory structure",
      category: "Memory Structure",
      insightBased: true,
      insightScore: 9.2
    },
    {
      id: "concept-map",
      name: "Concept Map",
      icon: <Network className="h-4 w-4" />,
      description: "Interactive concept mapping tool",
      category: "Knowledge Organization",
      insightBased: true,
      insightScore: 8.7
    },
    {
      id: "discussion",
      name: "Group Discussion",
      icon: <Users className="h-4 w-4" />,
      description: "Structured peer discussion activity",
      category: "Learning Activity",
      insightBased: true,
      insightScore: 8.4
    },
    {
      id: "multimodal",
      name: "Multimodal Content",
      icon: <Layers className="h-4 w-4" />,
      description: "Content presented through multiple sensory channels",
      category: "Content Presentation",
      insightBased: true,
      insightScore: 9.5
    },
    {
      id: "quiz",
      name: "Interactive Quiz",
      icon: <ListTodo className="h-4 w-4" />,
      description: "Knowledge check with feedback",
      category: "Assessment"
    },
    {
      id: "video",
      name: "Video Content",
      icon: <EyeIcon className="h-4 w-4" />,
      description: "Embedded video with interactive elements",
      category: "Content"
    }
  ];

  useEffect(() => {
    // Simulate API load
    const loadData = async () => {
      setLoading(true);
      
      // In a real application, this would be API calls
      setTimeout(() => {
        setCourses(mockCourses);
        setInsights(mockInsights);
        setRecentLessons(mockRecentLessons);
        setLessonTemplates(mockLessonTemplates);
        setSelectedCourse(mockCourses[0]);
        setLoading(false);
      }, 600);
    };
    
    loadData();
  }, []);

  // Filter recent lessons based on selected course
  const filteredLessons = selectedCourse 
    ? recentLessons.filter(lesson => lesson.courseId === selectedCourse.id)
    : recentLessons;

  // Handle new module addition
  const addModule = (moduleType) => {
    const newModule = {
      id: `module-${Date.now()}`,
      type: moduleType.id,
      name: moduleType.name,
      icon: moduleType.icon,
      content: "",
      insightBased: moduleType.insightBased || false,
      insightScore: moduleType.insightScore || null
    };
    
    setLessonModules([...lessonModules, newModule]);
  };

  // Handle module removal
  const removeModule = (moduleId) => {
    setLessonModules(lessonModules.filter(module => module.id !== moduleId));
  };

  // Start new lesson
  const startNewLesson = () => {
    setLessonTitle("");
    setLessonModules([]);
    setLessonMode('create');
    setActiveLesson(null);
    setSelectedTemplate(null);
    
    // Add default text module to get started
    addModule(moduleTypes.find(m => m.id === 'text'));
  };

  // Use a template
  const useTemplate = (template) => {
    setSelectedTemplate(template);
    setLessonTitle(`New ${template.title}`);
    
    // Create starter modules based on template
    const starterModules = template.components.map((component, index) => ({
      id: `module-${Date.now()}-${index}`,
      type: component.toLowerCase().replace(/\s+/g, '-'),
      name: component,
      icon: component.includes('3D') || component.includes('viewer') ? <Building className="h-4 w-4" /> :
            component.includes('Node') || component.includes('Relationship') ? <Network className="h-4 w-4" /> :
            component.includes('Pattern') || component.includes('Solution') ? <Lightbulb className="h-4 w-4" /> :
            component.includes('Narrative') || component.includes('Character') ? <BookText className="h-4 w-4" /> :
            <Puzzle className="h-4 w-4" />,
      content: "",
      insightBased: true,
      insightScore: template.insightScore
    }));
    
    setLessonModules(starterModules);
    setLessonMode('create');
    setActiveLesson(null);
  };

  // Edit existing lesson
  const editLesson = (lesson) => {
    setActiveLesson(lesson);
    setLessonTitle(lesson.title);
    
    // Create modules based on lesson components (mock for now)
    const mockModules = Array(lesson.components).fill().map((_, index) => {
      // Create a more varied set of module types for demonstration
      const moduleTypes = ['text', 'multimodal', 'memory-palace', 'concept-map', 'discussion'];
      const moduleType = moduleTypes[index % moduleTypes.length];
      
      const getIcon = (type) => {
        switch(type) {
          case 'text': return <FileText className="h-4 w-4" />;
          case 'multimodal': return <Layers className="h-4 w-4" />;
          case 'memory-palace': return <Building className="h-4 w-4" />;
          case 'concept-map': return <Network className="h-4 w-4" />;
          case 'discussion': return <Users className="h-4 w-4" />;
          default: return <Puzzle className="h-4 w-4" />;
        }
      };
      
      return {
        id: `existing-${index}`,
        type: moduleType,
        name: moduleType === 'text' ? 'Text Content' : 
              moduleType === 'multimodal' ? 'Multimodal Content' :
              moduleType === 'memory-palace' ? 'Memory Palace Structure' :
              moduleType === 'concept-map' ? 'Concept Mapping Tool' :
              'Group Discussion',
        icon: getIcon(moduleType),
        content: moduleType === 'text' ? "Sample text content for the lesson" : "",
        insightBased: moduleType !== 'text',
        insightScore: moduleType !== 'text' ? (8.5 + (index % 2)) : null
      };
    });
    
    setLessonModules(mockModules);
    setLessonMode('edit');
  };
  
  // Return to browse mode
  const exitLessonBuilder = () => {
    setLessonMode('browse');
  };
  
  // Add integration with PedagogicalParagraph component
  const integrateWithPedagogicalParagraph = (module) => {
    if (module.type !== 'text' || !module.content) return module;
    
    // Transform text content into a PedagogicalParagraph with feedback capabilities
    return {
      ...module,
      hasPedagogicalFeatures: true,
      // Additional pedagogical properties could be added here
    };
  };
  
  // Save lesson function
  const saveLesson = async () => {
    if (!lessonTitle.trim()) {
      alert('Please add a title for your lesson');
      return;
    }
    
    // Transform modules to include pedagogical features
    const enhancedModules = lessonModules.map(integrateWithPedagogicalParagraph);
    
    // In a real app, this would be an API call to save the lesson
    console.log('Saving lesson:', {
      title: lessonTitle,
      courseId: selectedCourse?.id,
      modules: enhancedModules,
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Show success animation
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
      saveButton.classList.add('bg-green-600');
      saveButton.innerHTML = '<svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Saved!';
      
      setTimeout(() => {
        saveButton.classList.remove('bg-green-600');
        saveButton.innerHTML = '<svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Save Lesson';
      }, 2000);
    }
    
    // Simulate API call completion
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <p className="mt-4 text-indigo-600 animate-pulse">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Studio Header */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 blur-[80px] opacity-30"></div>
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6 sm:px-8 lg:px-10 rounded-2xl shadow-xl border border-indigo-500/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-white">Learning Engineering Studio</h1>
              <p className="text-white max-w-2xl">
                Create interactive lessons powered by student insights for improved learning outcomes.
              </p>
            </div>
            {lessonMode === 'browse' && (
              <div className="mt-6 md:mt-0 flex gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-md"
                  onClick={startNewLesson}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Lesson
                </Button>
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-md border border-white/50">
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Student Insights
                </Button>
              </div>
            )}
          </div>
          
          {/* Glass decoration elements */}
          <div className="absolute top-6 right-12 w-40 h-40 rounded-full bg-purple-500 blur-[80px] opacity-20"></div>
          <div className="absolute bottom-5 left-1/4 w-24 h-24 rounded-full bg-indigo-500 blur-[60px] opacity-20"></div>
        </div>
      </div>

      {lessonMode === 'create' || lessonMode === 'edit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lesson Builder Interface */}
          <div className="lg:col-span-3">
            <div className="backdrop-blur-md bg-white/70 dark:bg-slate-900/70 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    onClick={exitLessonBuilder}
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    className="text-lg font-medium bg-transparent border-0 focus:outline-none focus:ring-0 w-full text-slate-900 dark:text-white"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-white">
                    <EyeIcon className="h-4 w-4 mr-1.5" />
                    Preview
                  </Button>
                  <Button 
                    id="saveButton"
                    size="sm" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-colors duration-300"
                    onClick={saveLesson}
                  >
                    {lessonMode === 'edit' ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5" />
                        Update Lesson
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1.5" />
                        Save Lesson
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {lessonModules.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200/50 dark:border-slate-700/50 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-800/30">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Plus className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium mb-3">Start Building Your Lesson</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-5 max-w-md mx-auto">
                      Add components from the sidebar to build your lesson. Use student insights to create more effective learning experiences.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                      {moduleTypes.slice(0, 3).map((module) => (
                        <Button 
                          key={module.id} 
                          variant="outline" 
                          size="sm"
                          className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70"
                          onClick={() => addModule(module)}
                        >
                          {typeof module.icon === 'function' ? module.icon() : module.icon}
                          <span className="ml-1.5">{module.name}</span>
                        </Button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        More Components
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessonModules.map((module, index) => (
                      <div 
                        key={module.id} 
                        className={`border border-slate-200/50 dark:border-slate-700/50 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow ${isDragging && 'relative'}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add('border-indigo-300', 'dark:border-indigo-700');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-indigo-300', 'dark:border-indigo-700');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-indigo-300', 'dark:border-indigo-700');
                          
                          const draggedId = e.dataTransfer.getData('moduleId');
                          if (!draggedId || draggedId === module.id) return;
                          
                          // Reorder modules
                          const newModules = [...lessonModules];
                          const draggedIndex = newModules.findIndex(m => m.id === draggedId);
                          const targetIndex = newModules.findIndex(m => m.id === module.id);
                          
                          if (draggedIndex !== -1 && targetIndex !== -1) {
                            const [removed] = newModules.splice(draggedIndex, 1);
                            newModules.splice(targetIndex, 0, removed);
                            setLessonModules(newModules);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50 rounded-t-lg backdrop-blur-sm">
                          <div className="flex items-center">
                            <button 
                              className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-move"
                              draggable={true}
                              onDragStart={(e) => {
                                setIsDragging(true);
                                setDraggedModule(module);
                                e.dataTransfer.setData('moduleId', module.id);
                                try {
                                  // Add a ghost drag image
                                  const dragPreview = document.createElement('div');
                                  dragPreview.className = 'p-2 bg-white/90 dark:bg-slate-800/90 rounded-md shadow-md backdrop-blur-sm';
                                  dragPreview.textContent = module.name;
                                  document.body.appendChild(dragPreview);
                                  e.dataTransfer.setDragImage(dragPreview, 0, 0);
                                  setTimeout(() => document.body.removeChild(dragPreview), 0);
                                } catch (err) {
                                  console.log('Drag preview not supported');
                                }
                              }}
                              onDragEnd={() => {
                                setIsDragging(false);
                                setDraggedModule(null);
                              }}
                            >
                              <DragVertical className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-1.5">
                              {typeof module.icon === 'function' ? module.icon() : module.icon}
                              <span className="font-medium text-sm">{module.name}</span>
                              {module.insightBased && (
                                <div className="ml-2 flex items-center text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-full backdrop-blur-sm">
                                  <BrainCircuit className="h-3 w-3 mr-1" />
                                  {module.insightScore ? `${module.insightScore}` : 'Insight'}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-700/70 backdrop-blur-sm">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-700/70 backdrop-blur-sm">
                              <CopyPlus className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100/70 dark:hover:bg-slate-700/70 backdrop-blur-sm"
                              onClick={() => removeModule(module.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          {module.type === 'text' ? (
                            <div className="min-h-[100px] border border-dashed border-slate-200/70 dark:border-slate-700/70 rounded-md p-4 text-sm text-slate-500 dark:text-slate-400 focus-within:border-indigo-300 dark:focus-within:border-indigo-600 transition-colors">
                              <div 
                                contentEditable="true" 
                                suppressContentEditableWarning={true}
                                className="outline-none focus:outline-none w-full min-h-[80px]"
                                role="textbox"
                                aria-multiline="true"
                                onInput={(e) => {
                                  const newModules = [...lessonModules];
                                  const index = newModules.findIndex(m => m.id === module.id);
                                  if (index !== -1) {
                                    newModules[index] = {
                                      ...newModules[index],
                                      content: e.currentTarget.innerHTML
                                    };
                                    setLessonModules(newModules);
                                  }
                                }}
                                dangerouslySetInnerHTML={{ __html: module.content || "Start typing your content here..." }}
                              />
                            </div>
                          ) : module.type === 'memory-palace' ? (
                            <div className="backdrop-blur-md bg-indigo-50/40 dark:bg-indigo-900/20 rounded-xl p-4 flex items-center gap-4 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm">
                              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500/80 to-indigo-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white shadow-md">
                                <Building className="h-10 w-10" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-base text-indigo-800 dark:text-indigo-300 mb-1">Memory Palace Structure</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">3D spatial memory organization with interactive elements</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-sm backdrop-blur-sm bg-white/50 dark:bg-indigo-900/30 border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300"
                                >
                                  Configure Memory Palace
                                </Button>
                              </div>
                            </div>
                          ) : module.type === 'concept-map' ? (
                            <div className="backdrop-blur-md bg-emerald-50/40 dark:bg-emerald-900/20 rounded-xl p-4 flex items-center gap-4 border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm">
                              <div className="h-20 w-20 bg-gradient-to-br from-emerald-500/80 to-emerald-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white shadow-md">
                                <Network className="h-10 w-10" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-base text-emerald-800 dark:text-emerald-300 mb-1">Concept Mapping Tool</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Interactive concept and relationship mapper</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-sm backdrop-blur-sm bg-white/50 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300"
                                >
                                  Configure Concept Map
                                </Button>
                              </div>
                            </div>
                          ) : module.type === 'multimodal' ? (
                            <div className="backdrop-blur-md bg-purple-50/40 dark:bg-purple-900/20 rounded-xl p-4 flex items-center gap-4 border border-purple-100/50 dark:border-purple-800/30 shadow-sm">
                              <div className="h-20 w-20 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white shadow-md">
                                <Layers className="h-10 w-10" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-base text-purple-800 dark:text-purple-300 mb-1">Multimodal Content Builder</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Create content that engages multiple sensory channels</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-sm backdrop-blur-sm bg-white/50 dark:bg-purple-900/30 border-purple-200/50 dark:border-purple-700/50 text-purple-700 dark:text-purple-300"
                                >
                                  Configure Content
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="min-h-[100px] border border-dashed border-slate-200/70 dark:border-slate-700/70 rounded-xl p-4 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 backdrop-blur-sm bg-white/30 dark:bg-slate-800/30">
                              <span className="opacity-70">Module configuration interface</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="relative">
                      <Button 
                        className="w-full py-5 border-2 border-dashed border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm hover:shadow-md"
                        variant="ghost"
                        onClick={() => {
                          const element = document.getElementById('moduleTypesDropdown');
                          if (element) {
                            element.classList.toggle('hidden');
                          }
                        }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Module
                      </Button>
                      
                      <div id="moduleTypesDropdown" className="absolute hidden left-0 right-0 mt-2 p-2 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg z-10">
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {moduleTypes.map((type) => (
                            <button
                              key={type.id}
                              className="flex items-center p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm text-left"
                              onClick={() => {
                                addModule(type);
                                document.getElementById('moduleTypesDropdown').classList.add('hidden');
                              }}
                            >
                              <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2 bg-gradient-to-br from-slate-500/80 to-slate-600/80 text-white">
                                {typeof type.icon === 'function' ? type.icon() : type.icon}
                              </div>
                              <div>
                                <div className="font-medium">{type.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{type.category}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar: Components & Insights */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-20">
              <Card className="shadow-md border-0 overflow-hidden backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50">
                <div className="bg-gradient-to-r from-indigo-600/90 to-indigo-700/90 p-3 border-b border-indigo-400/20 backdrop-blur-sm">
                  <h2 className="font-medium flex items-center text-white">
                    <Puzzle className="h-4 w-4 mr-2 text-indigo-200" />
                    Lesson Components
                  </h2>
                </div>
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search components..."
                      className="pl-8 py-1 text-sm backdrop-blur-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 focus:border-indigo-300 dark:focus:border-indigo-700 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs uppercase text-slate-500 dark:text-slate-400 font-medium mb-1.5">Content</h3>
                      <div className="space-y-1.5">
                        {moduleTypes.filter(m => m.category === 'Content').map(module => (
                          <button 
                            key={module.id}
                            className="w-full flex items-center justify-between p-2.5 backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-slate-200/30 dark:border-slate-700/30 rounded-lg text-left text-sm transition-all shadow-sm hover:shadow-md"
                            onClick={() => addModule(module)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-slate-500/80 to-slate-600/80 flex items-center justify-center mr-3 text-white shadow-sm">
                                {typeof module.icon === 'function' ? module.icon() : module.icon}
                              </div>
                              <span>{module.name}</span>
                            </div>
                            <Plus className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs uppercase text-slate-500 dark:text-slate-400 font-medium mb-1.5">Insight-Based</h3>
                      <div className="space-y-1.5">
                        {moduleTypes.filter(m => m.insightBased).map(module => (
                          <button 
                            key={module.id}
                            className="w-full flex items-center justify-between p-2.5 backdrop-blur-sm bg-amber-50/30 dark:bg-amber-900/20 hover:bg-amber-50/50 dark:hover:bg-amber-800/30 border border-amber-200/30 dark:border-amber-700/30 rounded-lg text-left text-sm transition-all shadow-sm hover:shadow-md"
                            onClick={() => addModule(module)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500/80 to-amber-600/80 flex items-center justify-center mr-3 text-white shadow-sm">
                                {typeof module.icon === 'function' ? module.icon() : module.icon}
                              </div>
                              <span>{module.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/80 text-white shadow-sm">{module.insightScore}</span>
                              <Plus className="h-3.5 w-3.5 text-amber-500 ml-2 hover:text-amber-600 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs uppercase text-slate-500 dark:text-slate-400 font-medium mb-1.5">Assessment</h3>
                      <div className="space-y-1.5">
                        {moduleTypes.filter(m => m.category === 'Assessment').map(module => (
                          <button 
                            key={module.id}
                            className="w-full flex items-center justify-between p-2.5 backdrop-blur-sm bg-blue-50/30 dark:bg-blue-900/20 hover:bg-blue-50/50 dark:hover:bg-blue-800/30 border border-blue-200/30 dark:border-blue-700/30 rounded-lg text-left text-sm transition-all shadow-sm hover:shadow-md"
                            onClick={() => addModule(module)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500/80 to-blue-600/80 flex items-center justify-center mr-3 text-white shadow-sm">
                                {typeof module.icon === 'function' ? module.icon() : module.icon}
                              </div>
                              <span>{module.name}</span>
                            </div>
                            <Plus className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="shadow-md border-0 overflow-hidden backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50">
                <div className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 p-3 border-b border-amber-400/20 backdrop-blur-sm">
                  <h2 className="font-medium flex items-center text-white">
                    <BrainCircuit className="h-4 w-4 mr-2 text-amber-200" />
                    Related Student Insights
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {insights.slice(0, 2).map(insight => (
                      <div key={insight.id} className="p-4 backdrop-blur-sm bg-amber-50/30 dark:bg-amber-900/20 rounded-lg border border-amber-200/30 dark:border-amber-700/30 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-gradient-to-br from-amber-500/80 to-amber-600/80 text-white flex-shrink-0 shadow-sm">
                            <Lightbulb className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-1.5 text-amber-800 dark:text-amber-300">{insight.title}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{insight.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-1 bg-amber-500/80 text-white rounded-full shadow-sm">
                                Impact: {insight.impactScore}
                              </span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 px-3 backdrop-blur-sm bg-white/50 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-800/30 transition-colors"
                                onClick={() => {
                                  setSelectedInsight(insight);
                                  setShowInsightDialog(true);
                                }}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-amber-200/50 dark:border-amber-700/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/30"
                    >
                      View All Insights
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Quick Create Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={startNewLesson}
              className="backdrop-blur-md bg-white/50 dark:bg-slate-900/50 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 group-hover:from-indigo-500/20 group-hover:to-indigo-600/20 transition-all"></div>
              <div className="relative p-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-indigo-900 dark:text-indigo-100">Create from Scratch</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Start with a blank canvas and build your lesson exactly how you want it.
                </p>
              </div>
            </div>
            
            <div 
              onClick={() => useTemplate(mockLessonTemplates[0])}
              className="backdrop-blur-md bg-white/50 dark:bg-slate-900/50 rounded-xl border border-amber-200/50 dark:border-amber-700/50 shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/10 group-hover:from-amber-500/20 group-hover:to-amber-600/20 transition-all"></div>
              <div className="relative p-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-amber-900 dark:text-amber-100">AI-Powered Lesson</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Create a lesson using student insights for improved learning outcomes.
                </p>
              </div>
            </div>
            
            <div 
              onClick={() => setLessonMode('templates')}
              className="backdrop-blur-md bg-white/50 dark:bg-slate-900/50 rounded-xl border border-purple-200/50 dark:border-purple-700/50 shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all"></div>
              <div className="relative p-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Layout className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-purple-900 dark:text-purple-100">Templates</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Start with a pre-built structure designed for specific learning objectives.
                </p>
              </div>
            </div>
          </div>
          
          {/* Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lesson Templates</h2>
              <Button className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400 dark:border-indigo-800/50 dark:hover:bg-slate-700">
                View All Templates
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonTemplates.slice(0, 3).map(template => (
                <div 
                  key={template.id} 
                  className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden hover:shadow-lg transition-all"
                  onClick={() => useTemplate(template)}
                >
                  <div className={`p-4 flex items-center justify-between ${
                    template.category === 'Memory Structure' ? 'bg-indigo-500/90 text-white' :
                    template.category === 'Knowledge Organization' ? 'bg-emerald-500/90 text-white' :
                    template.category === 'Insight Driver' ? 'bg-amber-500/90 text-white' :
                    'bg-purple-500/90 text-white'
                  }`}>
                    <h3 className="font-medium">{template.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm shadow-sm text-white`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-shrink-0">
                        <BrainCircuit className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Insight score: <span className="text-amber-600 dark:text-amber-400">{template.insightScore}/10</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.suitableFor.map((subject, index) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                      onClick={() => useTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Lessons */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Lessons</h2>
              <div className="relative">
                <select className="pr-8 py-1.5 pl-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <option value="recent">Recently Updated</option>
                  <option value="engagement">Highest Engagement</option>
                  <option value="retention">Best Retention</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentLessons.slice(0, 4).map(lesson => (
                <div key={lesson.id} className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex h-full">
                    <div className="w-1/3 relative">
                      <div className="absolute inset-0">
                        <Image 
                          src={lesson.coverImage} 
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {lesson.status === 'Draft' && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
                          Draft
                        </div>
                      )}
                      {lesson.insightBased && (
                        <div className="absolute bottom-3 left-3 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-md shadow-sm backdrop-blur-sm">
                          <BrainCircuit className="h-3 w-3 inline-block mr-1" />
                          AI Enhanced
                        </div>
                      )}
                    </div>
                    
                    <div className="w-2/3 p-4 flex flex-col">
                      <div className="mb-auto">
                        <h3 className="font-medium text-lg mb-1 text-slate-900 dark:text-white">{lesson.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{lesson.courseName}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <div className="flex items-center">
                            <Layout className="h-3.5 w-3.5 mr-1" />
                            {lesson.components} components
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {lesson.lastModified}
                          </div>
                        </div>
                        
                        {lesson.status === 'Published' && (
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-1.5">
                              <div className="text-xs text-slate-700 dark:text-slate-300 w-20">Engagement</div>
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full" 
                                  style={{ width: `${lesson.engagement}%` }}
                                ></div>
                              </div>
                              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{lesson.engagement}%</div>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <div className="text-xs text-slate-700 dark:text-slate-300 w-20">Retention</div>
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${lesson.retention}%` }}
                                ></div>
                              </div>
                              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{lesson.retention}%</div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-auto pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          onClick={() => editLesson(lesson)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          <EyeIcon className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Insight Highlights */}
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Insights</h2>
              <div className="ml-3 px-2 py-0.5 bg-amber-100/70 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm rounded-full">
                <BrainCircuit className="h-3.5 w-3.5 inline-block mr-1" />
                AI-Powered
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.slice(0, 3).map(insight => (
                <div key={insight.id} className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md overflow-hidden hover:shadow-lg transition-all">
                  <div className={`p-4 border-b border-slate-200/50 dark:border-slate-700/50 ${
                    insight.category === 'Memory Structure' ? 'bg-indigo-50/80 dark:bg-indigo-900/20' :
                    insight.category === 'Content Presentation' ? 'bg-purple-50/80 dark:bg-purple-900/20' :
                    insight.category === 'Retention Strategy' ? 'bg-amber-50/80 dark:bg-amber-900/20' :
                    'bg-emerald-50/80 dark:bg-emerald-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${
                          insight.category === 'Memory Structure' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800/70 dark:text-indigo-300' :
                          insight.category === 'Content Presentation' ? 'bg-purple-100 text-purple-700 dark:bg-purple-800/70 dark:text-purple-300' :
                          insight.category === 'Retention Strategy' ? 'bg-amber-100 text-amber-700 dark:bg-amber-800/70 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/70 dark:text-emerald-300'
                        }`}>
                          {insight.category === 'Memory Structure' ? <Building className="h-4 w-4" /> :
                           insight.category === 'Content Presentation' ? <Layers className="h-4 w-4" /> :
                           insight.category === 'Retention Strategy' ? <BrainCircuit className="h-4 w-4" /> :
                           <Users className="h-4 w-4" />}
                        </div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{insight.title}</h3>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded-full shadow-sm text-amber-700 dark:text-amber-400">
                        {insight.impactScore}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{insight.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {insight.category}
                      </div>
                      {insight.recommendedFor.slice(0, 2).map((course, index) => (
                        <div key={index} className="text-xs px-2 py-0.5 rounded-full bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {course}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => {
                        setSelectedInsight(insight);
                        setShowInsightDialog(true);
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Apply to Lesson
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    
      {/* Insight Dialog */}
      <Dialog open={showInsightDialog} onOpenChange={setShowInsightDialog}>
        <DialogContent className="max-w-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <BrainCircuit className="h-5 w-5 mr-2 text-amber-500" />
              {selectedInsight?.title || 'Learning Insight'}
            </DialogTitle>
          </DialogHeader>
        
        <div className="space-y-6 my-2">
          {selectedInsight && (
            <>
              <div className="p-4 backdrop-blur-md bg-amber-50/30 dark:bg-amber-900/20 rounded-xl border border-amber-200/30 dark:border-amber-700/30">
                <p className="text-base text-slate-700 dark:text-slate-300">{selectedInsight.description}</p>
                <div className="flex items-center mt-4">
                  <div className="text-sm px-3 py-1 bg-amber-500/80 text-white rounded-full shadow-sm">
                    Impact score: {selectedInsight.impactScore}/10
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">Apply to your lesson</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all text-left"
                    onClick={() => {
                      // Add a module based on the insight
                      const relevantModuleType = moduleTypes.find(m => 
                        m.category.toLowerCase().includes(selectedInsight.category.toLowerCase())
                      ) || moduleTypes.find(m => m.insightBased);
                      
                      if (relevantModuleType) {
                        addModule(relevantModuleType);
                        setShowInsightDialog(false);
                      }
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center mr-3">
                        <Plus className="h-5 w-5" />
                      </div>
                      <h4 className="font-medium">Add New Module</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Create a new module in your lesson based on this insight
                    </p>
                  </button>
                  
                  <button 
                    className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all text-left"
                    onClick={() => {
                      // Show success animation
                      setSelectedInsight(null);
                      setShowInsightDialog(false);
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mr-3">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h4 className="font-medium">Enhance Existing</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Apply this insight to enhance your existing modules
                    </p>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2 text-slate-900 dark:text-white">Recommended for</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInsight.recommendedFor.map((item, i) => (
                    <div key={i} className="text-sm px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowInsightDialog(false)}
            className="border-slate-200 dark:border-slate-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}