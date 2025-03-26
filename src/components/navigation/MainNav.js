'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useBooks } from '@/hooks/useBooks';
import { useCourses } from '@/hooks/useCourses';
import { Search, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export function MainNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const { books, loading: booksLoading } = useBooks();
  const { courses, loading: coursesLoading } = useCourses();
  
  // State for navigation
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  
  // State for search functionality
  const [courseSearch, setCourseSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  
  // Refs for handling clicks outside
  const userMenuRef = useRef(null);
  const coursesDropdownRef = useRef(null);
  const booksDropdownRef = useRef(null);
  
  // Filtered lists
  const filteredCourses = courses?.filter(
    course => course.title.toLowerCase().includes(courseSearch.toLowerCase())
  ) || [];
  
  const filteredBooks = books?.filter(
    book => book.title.toLowerCase().includes(bookSearch.toLowerCase())
  ) || [];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(e.target)) {
        setShowCoursesDropdown(false);
      }
      if (booksDropdownRef.current && !booksDropdownRef.current.contains(e.target)) {
        setShowBooksDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setShowCoursesDropdown(false);
    setShowBooksDropdown(false);
    setShowUserMenu(false);
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Studio', href: '/studio' },
    { label: 'Notebook', href: '/notebook' },
    { label: 'Staff', href: '/staff' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleCoursesDropdown = () => {
    setShowCoursesDropdown(!showCoursesDropdown);
    setShowBooksDropdown(false);
    setShowUserMenu(false);
    // Reset search when opening
    if (!showCoursesDropdown) setCourseSearch('');
  };
  const toggleBooksDropdown = () => {
    setShowBooksDropdown(!showBooksDropdown);
    setShowCoursesDropdown(false);
    setShowUserMenu(false);
    // Reset search when opening
    if (!showBooksDropdown) setBookSearch('');
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-indigo-900/95 backdrop-blur-sm shadow-lg shadow-indigo-500/20' 
          : 'bg-indigo-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl text-white relative">
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Crescent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'text-cyan-400'
                        : 'text-gray-200 hover:text-cyan-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Courses Dropdown */}
                <div className="relative" ref={coursesDropdownRef}>
                  <button
                    onClick={toggleCoursesDropdown}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      pathname.startsWith('/courses')
                        ? 'text-cyan-400'
                        : 'text-gray-200 hover:text-cyan-400'
                    }`}
                    aria-expanded={showCoursesDropdown}
                    aria-haspopup="true"
                  >
                    <span>Courses</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showCoursesDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCoursesDropdown && (
                    <div className="absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-indigo-800 border border-indigo-700 shadow-cyan-500/20 z-10 overflow-hidden">
                      <div className="p-2 border-b border-indigo-700">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-indigo-700/50 border border-indigo-600 rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                          />
                          {courseSearch && (
                            <button 
                              onClick={() => setCourseSearch('')} 
                              className="absolute right-2.5 top-2.5"
                            >
                              <X className="h-4 w-4 text-gray-400 hover:text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="py-1 max-h-[300px] overflow-y-auto">
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map(course => (
                            <Link
                              key={course.id || course.slug}
                              href={`/courses/${course.slug}`}
                              className="block px-4 py-2 text-sm text-gray-100 hover:bg-indigo-700 hover:text-cyan-400"
                              onClick={() => setShowCoursesDropdown(false)}
                            >
                              {course.title}
                            </Link>
                          ))
                        ) : coursesLoading ? (
                          <div className="px-4 py-6 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-cyan-400 my-1"></div>
                            <p className="text-sm text-gray-400 mt-2">Loading courses...</p>
                          </div>
                        ) : courseSearch ? (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">No matching courses</div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">No courses available</div>
                        )}
                        <div className="border-t border-indigo-700 my-1"></div>
                        <Link
                          href="/courses"
                          className="block px-4 py-2 text-sm text-cyan-400 font-medium hover:bg-indigo-700"
                          onClick={() => setShowCoursesDropdown(false)}
                        >
                          View all courses →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Books Dropdown */}
                <div className="relative" ref={booksDropdownRef}>
                  <button
                    onClick={toggleBooksDropdown}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      pathname.startsWith('/books')
                        ? 'text-cyan-400'
                        : 'text-gray-200 hover:text-cyan-400'
                    }`}
                    aria-expanded={showBooksDropdown}
                    aria-haspopup="true"
                  >
                    <span>Books</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showBooksDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showBooksDropdown && (
                    <div className="absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-indigo-800 border border-indigo-700 shadow-cyan-500/20 z-10 overflow-hidden">
                      <div className="p-2 border-b border-indigo-700">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full bg-indigo-700/50 border border-indigo-600 rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={bookSearch}
                            onChange={(e) => setBookSearch(e.target.value)}
                          />
                          {bookSearch && (
                            <button 
                              onClick={() => setBookSearch('')} 
                              className="absolute right-2.5 top-2.5"
                            >
                              <X className="h-4 w-4 text-gray-400 hover:text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="py-1 max-h-[300px] overflow-y-auto">
                        {filteredBooks.length > 0 ? (
                          filteredBooks.map(book => (
                            <Link
                              key={book.id || book.slug}
                              href={`/books/${book.slug}`}
                              className="block px-4 py-2 text-sm text-gray-100 hover:bg-indigo-700 hover:text-cyan-400"
                              onClick={() => setShowBooksDropdown(false)}
                            >
                              {book.title}
                            </Link>
                          ))
                        ) : booksLoading ? (
                          <div className="px-4 py-6 text-center">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-cyan-400 my-1"></div>
                            <p className="text-sm text-gray-400 mt-2">Loading books...</p>
                          </div>
                        ) : bookSearch ? (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">No matching books</div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">No books available</div>
                        )}
                        <div className="border-t border-indigo-700 my-1"></div>
                        <Link
                          href="/books"
                          className="block px-4 py-2 text-sm text-cyan-400 font-medium hover:bg-indigo-700"
                          onClick={() => setShowBooksDropdown(false)}
                        >
                          View all books →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-gray-200 hover:text-cyan-400 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* User Menu or Sign In Button */}
          {user ? (
            <div className="hidden md:flex items-center" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className="relative h-8 w-8 rounded-full flex items-center justify-center bg-indigo-700 hover:bg-indigo-600 transition-colors border border-indigo-600"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-cyan-400">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-4 top-16 w-64 rounded-md shadow-lg bg-indigo-800 border border-indigo-700 shadow-cyan-500/20 z-10 overflow-hidden">
                  <div className="p-4 border-b border-indigo-700">
                    <p className="font-medium text-white">{user.name || 'User'}</p>
                    {user.email && (
                      <p className="text-sm text-gray-400 truncate">
                        {user.email}
                      </p>
                    )}
                    {user.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-700 text-cyan-400 mt-2">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-100 hover:bg-indigo-700 hover:text-cyan-400"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/books" 
                      className="block px-4 py-2 text-sm text-gray-100 hover:bg-indigo-700 hover:text-cyan-400"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Books
                    </Link>
                    <Link 
                      href="/notebook" 
                      className="block px-4 py-2 text-sm text-gray-100 hover:bg-indigo-700 hover:text-cyan-400"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Notes
                    </Link>
                    <div className="border-t border-indigo-700 my-1"></div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-indigo-700"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-200 hover:text-cyan-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-cyan-400 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-indigo-800 border-t border-indigo-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname.startsWith(item.href)
                      ? 'bg-indigo-700 text-cyan-400'
                      : 'text-gray-200 hover:bg-indigo-700 hover:text-cyan-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/courses"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname.startsWith('/courses')
                    ? 'bg-indigo-700 text-cyan-400'
                    : 'text-gray-200 hover:bg-indigo-700 hover:text-cyan-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/books"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname.startsWith('/books')
                    ? 'bg-indigo-700 text-cyan-400'
                    : 'text-gray-200 hover:bg-indigo-700 hover:text-cyan-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Books
              </Link>
            </>
          ) : (
            <Link
              href="/auth/signup"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-indigo-700 hover:text-cyan-400"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          )}
        </div>
        
        {/* Mobile user menu or sign in */}
        {user ? (
          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center border border-indigo-600">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-cyan-400">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user.name}</div>
                <div className="text-sm font-medium text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-indigo-700 hover:text-cyan-400"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/books"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-indigo-700 hover:text-cyan-400"
                onClick={() => setIsOpen(false)}
              >
                My Books
              </Link>
              <Link
                href="/notebook"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-indigo-700 hover:text-cyan-400"
                onClick={() => setIsOpen(false)}
              >
                My Notes
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-indigo-700"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className="px-2">
              <Link
                href="/auth/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}