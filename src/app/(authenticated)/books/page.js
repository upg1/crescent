'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNav } from '@/components/navigation/NavContext';
import { useBooks } from '@/hooks/useBooks';
import { Search, BookOpen, FilterX, ArrowUpDown, User, Clock } from 'lucide-react';

// Book cover images from Unsplash
const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2748&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2790&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2730&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2733&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2773&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?q=80&w=2787&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=2774&auto=format&fit=crop',
];

export default function BooksPage() {
  const { setBreadcrumbs } = useNav();
  const { books, loading, error } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeFilter, setActiveFilter] = useState('all');

  // Set breadcrumbs when component mounts
  useEffect(() => {
    setBreadcrumbs([
      { name: 'Books', href: '/books' }
    ]);
  }, [setBreadcrumbs]);

  // Filter books based on search term and active filter
  const filteredBooks = books
    ?.filter(book => {
      // Search filter
      const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           book.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesFilter = activeFilter === 'all' || book.category === activeFilter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      let comparison = 0;
      
      if (sortCriteria === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortCriteria === 'author') {
        comparison = (a.author || '').localeCompare(b.author || '');
      } else if (sortCriteria === 'date') {
        comparison = new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    }) || [];

  // Toggle sort direction
  const toggleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  // Assign a cover image to each book
  const getBooksWithCovers = (books) => {
    return books.map((book, index) => ({
      ...book,
      coverImage: book.coverImage || COVER_IMAGES[index % COVER_IMAGES.length]
    }));
  };

  const booksWithCovers = getBooksWithCovers(filteredBooks);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-indigo-900 py-12">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=3270&auto=format&fit=crop"
            alt="Library background"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            priority
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Crescent Library</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Explore our collection of books and start your reading journey
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-300" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, or keywords..."
                className="block w-full pl-10 pr-10 py-3 border border-indigo-700 rounded-lg bg-indigo-800/50 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FilterX className="h-5 w-5 text-indigo-300 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters and sorts */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Books
            </button>
            <button
              onClick={() => setActiveFilter('fiction')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeFilter === 'fiction'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Fiction
            </button>
            <button
              onClick={() => setActiveFilter('nonfiction')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeFilter === 'nonfiction'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Non-Fiction
            </button>
            <button
              onClick={() => setActiveFilter('textbook')}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeFilter === 'textbook'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Textbooks
            </button>
          </div>
          
          {/* Sort options */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('title')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                sortCriteria === 'title'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Title
              {sortCriteria === 'title' && (
                <ArrowUpDown className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </button>
            <button
              onClick={() => toggleSort('author')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                sortCriteria === 'author'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <User className="h-4 w-4" />
              Author
              {sortCriteria === 'author' && (
                <ArrowUpDown className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </button>
            <button
              onClick={() => toggleSort('date')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                sortCriteria === 'date'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              Date
              {sortCriteria === 'date' && (
                <ArrowUpDown className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Books grid with loading states */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-[340px] animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-60"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 dark:bg-gray-700 h-5 rounded w-3/4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg">Failed to load books</p>
            <button 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : booksWithCovers.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Books Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm 
                ? "No books match your search criteria." 
                : "There are no books available at the moment."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {booksWithCovers.map((book) => (
              <Link 
                href={`/books/${book.slug}`} 
                key={book.id} 
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:border dark:border-gray-700"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    width={300}
                    height={450}
                  />
                  {book.category && (
                    <span className="absolute top-2 right-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded">
                      {book.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {book.author}
                    </p>
                  )}
                  {book.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}