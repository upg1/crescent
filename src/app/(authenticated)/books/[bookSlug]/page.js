"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useNav } from '@/components/navigation/NavContext';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Bookmark, ChevronDown, 
  MessageSquare, Settings, Sun, Moon, 
  PenTool, Flag, Users, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";

export default function BookPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams();
  const { setBreadcrumbs } = useNav();
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  
  // Core state
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionContent, setSectionContent] = useState([]); // Combined paragraphs, exercises, and figures
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("read");
  const [activePanel, setActivePanel] = useState("chapters");
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showZettelDialog, setShowZettelDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  
  // Note taking state
  const [paragraphNotes, setParagraphNotes] = useState({});
  const [summaryNotes, setSummaryNotes] = useState({});
  const [zettelInput, setZettelInput] = useState({ title: '', content: '', tags: '' });
  const [summaryInput, setSummaryInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState({
    type: 'suggestion',
    content: '',
    forRole: 'all'
  });

  // Add this useEffect after your state declarations
useEffect(() => {
  const fetchBook = async () => {
    if (!params.bookSlug) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/books/${params.bookSlug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch book data');
      }
      
      const bookData = await response.json();
      setBook(bookData);
      
      // Set active chapter and section if available
      if (bookData.chapters && bookData.chapters.length > 0) {
        const firstChapter = bookData.chapters[0];
        setActiveChapter(firstChapter);
        
        if (firstChapter.sections && firstChapter.sections.length > 0) {
          const firstSection = firstChapter.sections[0];
          setActiveSection(firstSection);
          
          // Combine and sort section content (paragraphs, exercises, figures)
          const combinedContent = [
            ...(firstSection.paragraphs || []).map(p => ({ ...p, contentType: 'paragraph' })),
            ...(firstSection.exercises || []).map(e => ({ ...e, contentType: 'exercise' })),
            ...(firstSection.figures || []).map(f => ({ ...f, contentType: 'figure' }))
          ];
          
          // Sort by order field
          combinedContent.sort((a, b) => a.order - b.order);
          setSectionContent(combinedContent);
        }
      }
      
      // Set breadcrumbs
      setBreadcrumbs([
        { name: 'Books', href: '/books' },
        { name: bookData.title, href: `/books/${params.bookSlug}` }
      ]);
      
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchBook();
}, [params.bookSlug, setBreadcrumbs]);

  // Function to handle chapter change
  const handleChapterChange = (chapter) => {
    setActiveChapter(chapter);
    
    if (chapter.sections && chapter.sections.length > 0) {
      const firstSection = chapter.sections[0];
      setActiveSection(firstSection);
      
      // Combine and sort section content
      const combinedContent = [
        ...(firstSection.paragraphs || []).map(p => ({ ...p, contentType: 'paragraph' })),
        ...(firstSection.exercises || []).map(e => ({ ...e, contentType: 'exercise' })),
        ...(firstSection.figures || []).map(f => ({ ...f, contentType: 'figure' }))
      ];
      
      combinedContent.sort((a, b) => a.order - b.order);
      setSectionContent(combinedContent);
    } else {
      setActiveSection(null);
      setSectionContent([]);
    }
    
    window.scrollTo(0, 0);
  };
  
  // Function to handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    // Combine and sort section content
    const combinedContent = [
      ...(section.paragraphs || []).map(p => ({ ...p, contentType: 'paragraph' })),
      ...(section.exercises || []).map(e => ({ ...e, contentType: 'exercise' })),
      ...(section.figures || []).map(f => ({ ...f, contentType: 'figure' }))
    ];
    
    combinedContent.sort((a, b) => a.order - b.order);
    setSectionContent(combinedContent);
    
    window.scrollTo(0, 0);
  };

  // Function to handle paragraph click - shows the paragraph action panel
  const handleParagraphClick = (paragraphId) => {
    setSelectedParagraph(paragraphId);
  };

  // Function to create a new Zettel note
  const createZettelNote = async () => {
    if (!selectedParagraph || !zettelInput.content) return;
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: zettelInput.title || 'Untitled Note',
          content: zettelInput.content,
          tags: zettelInput.tags.split(',').map(tag => tag.trim()),
          sourceId: selectedParagraph,
          sourceType: 'paragraph',
          bookId: book.id,
          chapterId: activeChapter.id,
          userId: session.user.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to create note');
      
      // Update local state with new note
      const newNote = await response.json();
      setParagraphNotes(prev => ({
        ...prev,
        [selectedParagraph]: [...(prev[selectedParagraph] || []), newNote]
      }));
      
      // Reset inputs
      setZettelInput({ title: '', content: '', tags: '' });
      setShowZettelDialog(false);
    } catch (error) {
      console.error('Error creating zettel note:', error);
    }
  };

  // Function to create a paragraph summary
  const createSummaryNote = async () => {
    if (!selectedParagraph || !summaryInput) return;
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Summary',
          content: summaryInput,
          tags: ['summary'],
          sourceId: selectedParagraph,
          sourceType: 'paragraph',
          bookId: book.id,
          chapterId: activeChapter.id,
          userId: session.user.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to create summary');
      
      // Update local state with new summary
      setSummaryNotes(prev => ({
        ...prev,
        [selectedParagraph]: summaryInput
      }));
      
      // Reset input
      setSummaryInput('');
      setShowSummaryDialog(false);
    } catch (error) {
      console.error('Error creating summary:', error);
    }
  };

  // Function to submit feedback
  const submitFeedback = async () => {
    if (!feedbackInput.content) return;
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackInput.type,
          content: feedbackInput.content,
          forRole: feedbackInput.forRole,
          sourceId: selectedParagraph,
          sourceType: 'paragraph',
          bookId: book.id,
          chapterId: activeChapter?.id,
          userId: session.user.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit feedback');
      
      // Reset input
      setFeedbackInput({
        type: 'suggestion',
        content: '',
        forRole: 'all'
      });
      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // The main reader component
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isDarkMode 
        ? "dark bg-[#1c1917] text-[#f5f5f4]" 
        : "bg-[#f8f4e8] text-[#1c1917]"
    )}>
      {/* Elegant minimal header */}
      <header className="border-b border-[#e7e5e4]/20 dark:border-[#44403c]/20 sticky top-0 z-10 backdrop-blur-xl bg-[#f8f4e8]/90 dark:bg-[#1c1917]/90 py-4">
        <div className="max-w-3xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/books')}
              className="rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="text-xs text-[#78716c] dark:text-[#a8a29e] uppercase tracking-wider font-medium">
                {activeChapter?.title ? `Chapter ${book?.chapters?.findIndex(c => c.id === activeChapter.id) + 1}` : ''}
                {activeSection?.title ? ` - ${activeSection.title}` : ''}
              </div>
              <div className="text-xs text-[#a8a29e] dark:text-[#78716c]">
                {book?.title}
              </div>
            </div>
            
            {/* Font size adjustment */}
            <div className="relative group">
              <Tooltip content="Text Size">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
                >
                  <span className="font-serif text-[10px] leading-none mr-[2px]">A</span>
                  <span className="font-serif text-[14px] leading-none">A</span>
                </Button>
              </Tooltip>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-[#f8f4e8]/90 dark:bg-[#1c1917]/90 backdrop-blur-xl p-2 rounded-lg border border-[#e7e5e4]/30 dark:border-[#44403c]/30 shadow-md">
                <div className="flex flex-col gap-2 w-[180px]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#78716c] dark:text-[#a8a29e]">Text Size</span>
                    <span className="text-xs font-medium text-[#44403c] dark:text-[#d6d3d1]">{fontSize}px</span>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                      disabled={fontSize <= 14}
                      className="h-7 w-7 p-0 flex items-center justify-center rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
                    >
                      <span className="text-lg font-medium">-</span>
                    </Button>
                    
                    <div className="flex-1 mx-1">
                      <input 
                        type="range" 
                        min="14" 
                        max="24" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#d6d3d1] dark:bg-[#44403c] rounded-full appearance-none cursor-pointer accent-[#a8a29e] dark:accent-[#78716c]"
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      disabled={fontSize >= 24}
                      className="h-7 w-7 p-0 flex items-center justify-center rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
                    >
                      <span className="text-lg font-medium">+</span>
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-[#78716c] dark:text-[#a8a29e]">Line Spacing</span>
                    <span className="text-xs font-medium text-[#44403c] dark:text-[#d6d3d1]">{lineSpacing.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLineSpacing(Math.max(1.2, lineSpacing - 0.1))}
                      disabled={lineSpacing <= 1.2}
                      className="h-7 w-7 p-0 flex items-center justify-center rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 mx-1">
                      <input 
                        type="range" 
                        min="1.2" 
                        max="2.0" 
                        step="0.1"
                        value={lineSpacing} 
                        onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-[#d6d3d1] dark:bg-[#44403c] rounded-full appearance-none cursor-pointer accent-[#a8a29e] dark:accent-[#78716c]"
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLineSpacing(Math.min(2.0, lineSpacing + 0.1))}
                      disabled={lineSpacing >= 2.0}
                      className="h-7 w-7 p-0 flex items-center justify-center rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Tooltip content={isDarkMode ? "Light Mode" : "Dark Mode"}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full hover:bg-[#e7e5e4]/70 dark:hover:bg-[#292524]/70 text-[#78716c] dark:text-[#a8a29e]"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </Tooltip>
          </div>
        </div>
      </header>
      
      {/* Beautiful reading experience */}
      <div className="flex-1 flex relative">
        {/* Main reading pane - beautiful and elegant */}
        <main className="w-full flex-1">
          <div 
            className="max-w-2xl mx-auto px-8 py-16 md:px-16 md:py-20"
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: 1.7,
              fontFamily: "'Libre Baskerville', 'Georgia', serif"
            }}
          >
            {loading ? (
              <div className="h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-[#a8a29e]/30 dark:border-[#78716c]/30"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-[#a8a29e] dark:border-[#78716c] animate-spin"></div>
                  </div>
                  <p className="text-[#a8a29e] dark:text-[#78716c] animate-pulse italic">Preparing your book...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="inline-flex h-20 w-20 rounded-full bg-[#fef2f2]/50 dark:bg-[#7f1d1d]/20 items-center justify-center border border-[#fee2e2] dark:border-[#b91c1c]/30">
                    <Flag className="h-10 w-10 text-[#b91c1c] dark:text-[#fca5a5]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#1c1917] dark:text-[#f5f5f4]">Unable to load this book</h3>
                  <p className="text-[#78716c] dark:text-[#a8a29e] max-w-md">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-[#44403c] hover:bg-[#292524] text-[#f5f5f4] dark:bg-[#a8a29e] dark:hover:bg-[#78716c] dark:text-[#1c1917]"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : !activeChapter ? (
              <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <BookOpen className="h-16 w-16 mx-auto text-[#a8a29e] dark:text-[#78716c] opacity-60" />
                  <p className="text-xl italic font-medium text-[#44403c] dark:text-[#e7e5e4]">Select a chapter to begin reading</p>
                  <div className="flex flex-wrap gap-3 justify-center mt-8">
                    {book?.chapters?.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        className="px-4 py-2 text-sm bg-[#e7e5e4]/50 dark:bg-[#292524]/50 hover:bg-[#d6d3d1]/80 dark:hover:bg-[#44403c]/80 rounded-md text-[#44403c] dark:text-[#d6d3d1] transition-colors border border-[#d6d3d1]/40 dark:border-[#44403c]/40"
                        onClick={() => handleChapterChange(chapter)}
                      >
                        Chapter {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : !activeSection ? (
              <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <BookOpen className="h-16 w-16 mx-auto text-[#a8a29e] dark:text-[#78716c] opacity-60" />
                  <p className="text-xl italic font-medium text-[#44403c] dark:text-[#e7e5e4]">
                    Chapter {book?.chapters?.findIndex(c => c.id === activeChapter.id) + 1}: {activeChapter.title}
                  </p>
                  <p className="text-lg text-[#78716c] dark:text-[#a8a29e]">Select a section to begin reading</p>
                  <div className="flex flex-wrap gap-3 justify-center mt-8">
                    {activeChapter?.sections?.map((section, index) => (
                      <button
                        key={section.id}
                        className="px-4 py-2 text-sm bg-[#e7e5e4]/50 dark:bg-[#292524]/50 hover:bg-[#d6d3d1]/80 dark:hover:bg-[#44403c]/80 rounded-md text-[#44403c] dark:text-[#d6d3d1] transition-colors border border-[#d6d3d1]/40 dark:border-[#44403c]/40"
                        onClick={() => handleSectionChange(section)}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Chapter and section information */}
                <div className="mb-14 text-center">
                  <div className="mb-1 text-[#78716c] dark:text-[#a8a29e] text-sm uppercase tracking-widest">
                    Chapter {book?.chapters?.findIndex(c => c.id === activeChapter.id) + 1}
                  </div>
                  <h2 className="text-3xl font-medium mb-3 text-[#292524] dark:text-[#e7e5e4] tracking-tight">
                    {activeChapter.title}
                  </h2>
                  <h3 className="text-xl font-medium mb-3 text-[#44403c] dark:text-[#d6d3d1]">
                    {activeSection.title}
                  </h3>
                  {activeSection.description && (
                    <p className="text-md text-[#78716c] dark:text-[#a8a29e] mb-4 max-w-xl mx-auto">
                      {activeSection.description}
                    </p>
                  )}
                  <div className="w-12 h-0.5 bg-[#a8a29e]/30 dark:bg-[#78716c]/30 mx-auto"></div>
                </div>
                
                {/* Book content */}
                <div className="space-y-8" ref={contentRef}>
                  {sectionContent.map((item) => {
                    // Paragraph rendering
                    if (item.contentType === 'paragraph') {
                      return (
                        <div 
                          key={item.id}
                          id={`para-${item.id}`}
                          className={cn(
                            "paragraph-container relative group rounded-sm transition-colors duration-300",
                            selectedParagraph === item.id 
                              ? "bg-[#e7e5e4]/30 dark:bg-[#292524]/30 ring-1 ring-[#d6d3d1]/20 dark:ring-[#44403c]/20" 
                              : "hover:bg-[#e7e5e4]/20 dark:hover:bg-[#292524]/20"
                          )}
                          onClick={() => handleParagraphClick(item.id)}
                        >
                          {/* Paragraph content */}
                          <p className="px-4 py-4 text-[#292524] dark:text-[#f8f7f6] leading-relaxed first-letter:text-xl first-letter:font-medium">
                            {item.content}
                          </p>
                          
                          {/* Paragraph interaction buttons that fade in on hover/selection */}
                          <div className={cn(
                            "absolute right-3 top-3 transition-all duration-300 flex gap-1.5",
                            selectedParagraph === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-90" 
                          )}>
                            {/* Zettel Note button */}
                            <Tooltip content="Create Note">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-full bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 shadow-sm backdrop-blur-sm hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917] border border-[#e7e5e4]/50 dark:border-[#292524]/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowZettelDialog(true);
                                }}
                              >
                                <PenTool className="h-3.5 w-3.5 text-[#78716c] dark:text-[#a8a29e]" />
                              </Button>
                            </Tooltip>
                            
                            {/* Summary button */}
                            <Tooltip content="Add Summary">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-full bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 shadow-sm backdrop-blur-sm hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917] border border-[#e7e5e4]/50 dark:border-[#292524]/50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowSummaryDialog(true);
                                }}
                              >
                                <Lightbulb className="h-3.5 w-3.5 text-[#78716c] dark:text-[#a8a29e]" />
                              </Button>
                            </Tooltip>
                            
                            {/* Feedback button (only for admins, staff, parents) */}
                            {session?.user?.role && ['admin', 'staff', 'parent'].includes(session.user.role) && (
                              <Tooltip content="Provide Feedback">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 shadow-sm backdrop-blur-sm hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917] border border-[#e7e5e4]/50 dark:border-[#292524]/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFeedback(true);
                                  }}
                                >
                                  <Flag className="h-3.5 w-3.5 text-[#78716c] dark:text-[#a8a29e]" />
                                </Button>
                              </Tooltip>
                            )}
                          </div>
                          
                          {/* Summary note display (if exists) */}
                          {summaryNotes[item.id] && (
                            <div className="mt-3 p-4 bg-yellow-50/80 dark:bg-yellow-900/30 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-700/50 border-l-4 border-l-yellow-400 dark:border-l-yellow-600 rounded-md font-sans shadow-sm">
                              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1 flex items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5" />
                                Summary
                              </h4>
                              <p className="text-sm text-yellow-900 dark:text-yellow-100">{summaryNotes[item.id]}</p>
                            </div>
                          )}
                          
                          {/* Zettel notes display (if exist) */}
                          {paragraphNotes[item.id]?.length > 0 && (
                            <div className="mt-3 space-y-3 font-sans">
                              {paragraphNotes[item.id].map((note, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-4 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 border-l-4 border-l-blue-400 dark:border-l-blue-600 rounded-md shadow-sm"
                                >
                                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                                    <PenTool className="h-3.5 w-3.5" />
                                    {note.title || 'Note'}
                                  </h4>
                                  <p className="text-sm text-blue-900 dark:text-blue-100">{note.content}</p>
                                  {note.tags?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {note.tags.map((tag, tagIdx) => (
                                        <span 
                                          key={tagIdx}
                                          className="px-2 py-0.5 text-xs rounded-full bg-blue-100/90 dark:bg-blue-800/90 backdrop-blur-sm text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    } 
                    // Exercise rendering
                    else if (item.contentType === 'exercise') {
                      return (
                        <div 
                          key={item.id}
                          id={`exercise-${item.id}`}
                          className="exercise-container relative rounded-md p-5 bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100/70 dark:border-indigo-800/50"
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                              {item.difficultyLevel?.charAt(0).toUpperCase() + item.difficultyLevel?.slice(1) || "Exercise"} 
                            </span>
                            {item.type && (
                              <span className="text-xs font-medium ml-2 px-2 py-0.5 rounded-full bg-indigo-100/70 dark:bg-indigo-800/70 text-indigo-700 dark:text-indigo-300">
                                {item.type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                              </span>
                            )}
                          </div>
                          <div 
                            className="text-indigo-900 dark:text-indigo-100 font-medium text-lg mb-3"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          
                          {/* Solution toggle */}
                          {item.solution && (
                            <div className="mt-4">
                              <details className="group">
                                <summary className="list-none flex items-center cursor-pointer">
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    <span className="group-open:rotate-90 transition-transform">▶</span> 
                                    Show Solution
                                  </div>
                                </summary>
                                <div className="pl-5 mt-3 border-l-2 border-indigo-200 dark:border-indigo-700">
                                  <div 
                                    className="text-indigo-800 dark:text-indigo-200 text-sm"
                                    dangerouslySetInnerHTML={{ __html: item.solution }}
                                  />
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      );
                    } 
                    // Figure rendering
                    else if (item.contentType === 'figure') {
                      return (
                        <div 
                          key={item.id}
                          id={`figure-${item.id}`}
                          className="figure-container relative rounded-md overflow-hidden bg-[#f8f9fa] dark:bg-[#1f2329] border border-[#e7e8ea]/70 dark:border-[#35383d]/70"
                        >
                          <div className="relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title || 'Figure'} 
                              className="w-full object-cover max-h-[400px]"
                            />
                            {item.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/70 dark:bg-[#0f172a]/80 p-3 text-white font-medium">
                                {item.title}
                              </div>
                            )}
                          </div>
                          {item.caption && (
                            <div className="p-3 text-sm text-[#4b5563] dark:text-[#9ca3af] italic">
                              {item.caption}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Chapter navigation at the bottom */}
        <div className="fixed bottom-6 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {/* Previous section button */}
            {activeChapter && activeSection && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full px-4 py-2 bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 backdrop-blur-lg border border-[#e7e5e4]/50 dark:border-[#44403c]/50 shadow-md text-[#44403c] dark:text-[#d6d3d1] hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917]",
                  (activeChapter.sections?.findIndex(s => s.id === activeSection.id) === 0 && 
                   book.chapters.findIndex(c => c.id === activeChapter.id) === 0) && 
                  "opacity-50 pointer-events-none"
                )}
                onClick={() => {
                  const currentSectionIndex = activeChapter.sections.findIndex(s => s.id === activeSection.id);
                  const currentChapterIndex = book.chapters.findIndex(c => c.id === activeChapter.id);
                  
                  if (currentSectionIndex > 0) {
                    // Go to previous section in the same chapter
                    handleSectionChange(activeChapter.sections[currentSectionIndex - 1]);
                  } else if (currentChapterIndex > 0) {
                    // Go to last section of the previous chapter
                    const prevChapter = book.chapters[currentChapterIndex - 1];
                    handleChapterChange(prevChapter);
                    if (prevChapter.sections && prevChapter.sections.length > 0) {
                      handleSectionChange(prevChapter.sections[prevChapter.sections.length - 1]);
                    }
                  }
                }}
                disabled={(activeChapter.sections?.findIndex(s => s.id === activeSection.id) === 0 && 
                          book.chapters.findIndex(c => c.id === activeChapter.id) === 0)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            
            {/* Chapters and sections dropdown button */}
            <Tooltip content="Navigation">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 backdrop-blur-lg border border-[#e7e5e4]/50 dark:border-[#44403c]/50 shadow-md text-[#44403c] dark:text-[#d6d3d1] hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917] flex items-center justify-center"
                onClick={() => {
                  const navEl = document.createElement('div');
                  navEl.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6';
                  
                  // Create a modal with navigation UI
                  const modal = document.createElement('div');
                  modal.className = 'bg-[#f8f4e8] dark:bg-[#1c1917] rounded-xl p-6 max-w-md w-full';
                  
                  // Create HTML for the navigation modal
                  let navHTML = `<h3 class="text-lg font-medium mb-4 text-[#292524] dark:text-[#e7e5e4]">Table of Contents</h3>`;
                  
                  book?.chapters?.forEach((chapter, chapIdx) => {
                    const isActiveChapter = activeChapter?.id === chapter.id;
                    
                    navHTML += `
                      <div class="mb-4">
                        <button 
                          class="w-full text-left px-3 py-2 rounded-md text-sm font-medium mb-1 ${
                            isActiveChapter
                              ? 'bg-[#d6d3d1]/50 dark:bg-[#44403c]/50 text-[#292524] dark:text-[#e7e5e4]' 
                              : 'hover:bg-[#e7e5e4]/50 dark:hover:bg-[#292524]/50 text-[#44403c] dark:text-[#d6d3d1] bg-[#e7e5e4]/20 dark:bg-[#292524]/20'
                          }"
                          data-chapter-id="${chapter.id}"
                        >
                          Chapter ${chapIdx + 1}: ${chapter.title}
                        </button>
                        
                        <div class="pl-4 space-y-1 ${isActiveChapter ? 'block' : 'hidden'}">
                          ${chapter.sections?.map((section, secIdx) => `
                            <button 
                              class="w-full text-left px-3 py-1.5 rounded-md text-xs ${
                                isActiveChapter && activeSection?.id === section.id
                                  ? 'bg-[#d6d3d1]/50 dark:bg-[#44403c]/50 text-[#292524] dark:text-[#e7e5e4] font-medium' 
                                  : 'hover:bg-[#e7e5e4]/50 dark:hover:bg-[#292524]/50 text-[#44403c] dark:text-[#d6d3d1]'
                              }"
                              data-section-id="${section.id}"
                              data-chapter-id="${chapter.id}"
                            >
                              ${section.title}
                            </button>
                          `).join('')}
                        </div>
                      </div>
                    `;
                  });
                  
                  modal.innerHTML = navHTML;
                  navEl.appendChild(modal);
                  document.body.appendChild(navEl);
                  
                  // Handle clicks
                  navEl.addEventListener('click', (e) => {
                    if (e.target === navEl) {
                      document.body.removeChild(navEl);
                    }
                    
                    // Handle chapter selection
                    const chapterButton = e.target.closest('[data-chapter-id]:not([data-section-id])');
                    if (chapterButton) {
                      const chapterId = chapterButton.getAttribute('data-chapter-id');
                      const chapter = book.chapters.find(c => c.id === chapterId);
                      
                      if (chapter) {
                        // Toggle showing sections for this chapter
                        const sectionsDiv = chapterButton.nextElementSibling;
                        const allSectionDivs = modal.querySelectorAll('div.pl-4');
                        
                        allSectionDivs.forEach(div => {
                          if (div !== sectionsDiv) div.classList.add('hidden');
                        });
                        
                        sectionsDiv.classList.toggle('hidden');
                        
                        // If we're showing sections and there are sections to show, don't navigate yet
                        if (!sectionsDiv.classList.contains('hidden') && chapter.sections?.length > 0) {
                          return;
                        }
                        
                        // Otherwise, navigate to the chapter
                        handleChapterChange(chapter);
                        document.body.removeChild(navEl);
                      }
                    }
                    
                    // Handle section selection
                    const sectionButton = e.target.closest('[data-section-id]');
                    if (sectionButton) {
                      const sectionId = sectionButton.getAttribute('data-section-id');
                      const chapterId = sectionButton.getAttribute('data-chapter-id');
                      
                      const chapter = book.chapters.find(c => c.id === chapterId);
                      if (chapter) {
                        const section = chapter.sections?.find(s => s.id === sectionId);
                        if (section) {
                          if (activeChapter?.id !== chapter.id) {
                            handleChapterChange(chapter);
                          }
                          handleSectionChange(section);
                          document.body.removeChild(navEl);
                        }
                      }
                    }
                  });
                }}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            {/* Next section button */}
            {activeChapter && activeSection && book?.chapters && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full px-4 py-2 bg-[#f8f4e8]/80 dark:bg-[#1c1917]/80 backdrop-blur-lg border border-[#e7e5e4]/50 dark:border-[#44403c]/50 shadow-md text-[#44403c] dark:text-[#d6d3d1] hover:bg-[#f8f4e8] dark:hover:bg-[#1c1917]",
                  (activeChapter.sections?.findIndex(s => s.id === activeSection.id) === activeChapter.sections?.length - 1 && 
                   book.chapters.findIndex(c => c.id === activeChapter.id) === book.chapters.length - 1) && 
                  "opacity-50 pointer-events-none"
                )}
                onClick={() => {
                  const currentSectionIndex = activeChapter.sections?.findIndex(s => s.id === activeSection.id);
                  const currentChapterIndex = book.chapters.findIndex(c => c.id === activeChapter.id);
                  
                  if (currentSectionIndex < activeChapter.sections?.length - 1) {
                    // Go to next section in the same chapter
                    handleSectionChange(activeChapter.sections[currentSectionIndex + 1]);
                  } else if (currentChapterIndex < book.chapters.length - 1) {
                    // Go to first section of the next chapter
                    const nextChapter = book.chapters[currentChapterIndex + 1];
                    handleChapterChange(nextChapter);
                    if (nextChapter.sections && nextChapter.sections.length > 0) {
                      handleSectionChange(nextChapter.sections[0]);
                    }
                  }
                }}
                disabled={(activeChapter.sections?.findIndex(s => s.id === activeSection.id) === activeChapter.sections?.length - 1 && 
                          book.chapters.findIndex(c => c.id === activeChapter.id) === book.chapters.length - 1)}
              >
                Next
                <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Zettel Note Dialog */}
      <Dialog open={showZettelDialog} onOpenChange={setShowZettelDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#f8f4e8]/95 dark:bg-[#1c1917]/95 backdrop-blur-xl border border-[#e7e5e4]/30 dark:border-[#44403c]/30 shadow-xl">
          <DialogHeader className="border-b border-[#e7e5e4]/30 dark:border-[#44403c]/30 pb-3">
            <DialogTitle className="text-[#292524] dark:text-[#e7e5e4] font-medium">Create Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="zettel-title" className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Title (Optional)</Label>
              <Input 
                id="zettel-title" 
                value={zettelInput.title}
                onChange={(e) => setZettelInput({...zettelInput, title: e.target.value})}
                placeholder="Give your note a title"
                className="bg-white/60 dark:bg-[#292524]/60 border-[#e7e5e4]/60 dark:border-[#44403c]/60 focus:ring-2 focus:ring-[#a8a29e]/30 dark:focus:ring-[#78716c]/30 text-[#44403c] dark:text-[#d6d3d1]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zettel-content" className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Note Content</Label>
              <Textarea 
                id="zettel-content" 
                value={zettelInput.content}
                onChange={(e) => setZettelInput({...zettelInput, content: e.target.value})}
                placeholder="Write your thoughts about this passage..."
                rows={5}
                className="bg-white/60 dark:bg-[#292524]/60 border-[#e7e5e4]/60 dark:border-[#44403c]/60 focus:ring-2 focus:ring-[#a8a29e]/30 dark:focus:ring-[#78716c]/30 text-[#44403c] dark:text-[#d6d3d1] font-serif resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zettel-tags" className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Tags (Optional)</Label>
              <Input 
                id="zettel-tags" 
                value={zettelInput.tags}
                onChange={(e) => setZettelInput({...zettelInput, tags: e.target.value})}
                placeholder="idea, question, connection (comma separated)"
                className="bg-white/60 dark:bg-[#292524]/60 border-[#e7e5e4]/60 dark:border-[#44403c]/60 focus:ring-2 focus:ring-[#a8a29e]/30 dark:focus:ring-[#78716c]/30 text-[#44403c] dark:text-[#d6d3d1]"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-[#e7e5e4]/30 dark:border-[#44403c]/30 pt-3">
            <Button 
              variant="outline" 
              onClick={() => setShowZettelDialog(false)}
              className="rounded-full border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={createZettelNote}
              className="rounded-full bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#f8f4e8]/95 dark:bg-[#1c1917]/95 backdrop-blur-xl border border-[#e7e5e4]/30 dark:border-[#44403c]/30 shadow-xl">
          <DialogHeader className="border-b border-[#e7e5e4]/30 dark:border-[#44403c]/30 pb-3">
            <DialogTitle className="text-[#292524] dark:text-[#e7e5e4] font-medium">Paragraph Summary</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Textarea 
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="Write a concise summary of this paragraph..."
              rows={5}
              className="bg-white/60 dark:bg-[#292524]/60 border-[#e7e5e4]/60 dark:border-[#44403c]/60 focus:ring-2 focus:ring-[#a8a29e]/30 dark:focus:ring-[#78716c]/30 text-[#44403c] dark:text-[#d6d3d1] font-serif resize-none"
            />
          </div>
          <DialogFooter className="border-t border-[#e7e5e4]/30 dark:border-[#44403c]/30 pt-3">
            <Button 
              variant="outline" 
              onClick={() => setShowSummaryDialog(false)}
              className="rounded-full border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={createSummaryNote}
              className="rounded-full bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
            >
              Save Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-[500px] bg-[#f8f4e8]/95 dark:bg-[#1c1917]/95 backdrop-blur-xl border border-[#e7e5e4]/30 dark:border-[#44403c]/30 shadow-xl">
          <DialogHeader className="border-b border-[#e7e5e4]/30 dark:border-[#44403c]/30 pb-3">
            <DialogTitle className="text-[#292524] dark:text-[#e7e5e4] font-medium">Provide Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Feedback Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={feedbackInput.type === 'suggestion' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, type: 'suggestion'})}
                  className={cn(
                    "rounded-full",
                    feedbackInput.type === 'suggestion'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Suggestion
                </Button>
                <Button 
                  variant={feedbackInput.type === 'issue' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, type: 'issue'})}
                  className={cn(
                    "rounded-full",
                    feedbackInput.type === 'issue'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Issue
                </Button>
                <Button 
                  variant={feedbackInput.type === 'praise' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, type: 'praise'})}
                  className={cn(
                    "rounded-full",
                    feedbackInput.type === 'praise'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Praise
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Visible To</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  variant={feedbackInput.forRole === 'all' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, forRole: 'all'})}
                  className={cn(
                    "text-xs rounded-full",
                    feedbackInput.forRole === 'all'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  All
                </Button>
                <Button 
                  variant={feedbackInput.forRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, forRole: 'admin'})}
                  className={cn(
                    "text-xs rounded-full",
                    feedbackInput.forRole === 'admin'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Admins
                </Button>
                <Button 
                  variant={feedbackInput.forRole === 'staff' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, forRole: 'staff'})}
                  className={cn(
                    "text-xs rounded-full",
                    feedbackInput.forRole === 'staff'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Staff
                </Button>
                <Button 
                  variant={feedbackInput.forRole === 'parent' ? 'default' : 'outline'}
                  onClick={() => setFeedbackInput({...feedbackInput, forRole: 'parent'})}
                  className={cn(
                    "text-xs rounded-full",
                    feedbackInput.forRole === 'parent'
                      ? "bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
                      : "border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
                  )}
                >
                  Parents
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-content" className="text-[#44403c] dark:text-[#d6d3d1] text-sm">Feedback</Label>
              <Textarea 
                id="feedback-content" 
                value={feedbackInput.content}
                onChange={(e) => setFeedbackInput({...feedbackInput, content: e.target.value})}
                placeholder="Provide detailed feedback about this paragraph..."
                rows={5}
                className="bg-white/60 dark:bg-[#292524]/60 border-[#e7e5e4]/60 dark:border-[#44403c]/60 focus:ring-2 focus:ring-[#a8a29e]/30 dark:focus:ring-[#78716c]/30 text-[#44403c] dark:text-[#d6d3d1] font-serif resize-none"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-[#e7e5e4]/30 dark:border-[#44403c]/30 pt-3">
            <Button 
              variant="outline" 
              onClick={() => setShowFeedback(false)}
              className="rounded-full border-[#d6d3d1]/50 dark:border-[#78716c]/50 text-[#78716c] dark:text-[#a8a29e] hover:bg-[#e7e5e4]/50 dark:hover:bg-[#44403c]/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitFeedback}
              className="rounded-full bg-[#44403c] hover:bg-[#292524] text-[#e7e5e4] dark:bg-[#d6d3d1] dark:hover:bg-[#a8a29e] dark:text-[#292524]"
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}