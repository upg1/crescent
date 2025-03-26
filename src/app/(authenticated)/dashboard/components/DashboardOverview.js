'use client';

import Link from 'next/link';
import { ArrowRight, Book, BookOpen, Clock, Star, TrendingUp } from 'lucide-react';

export default function DashboardOverview({ stats, recentBooks, session }) {
  return (
    <>
      <div className="neo-glass mb-8">
        <h2 className="text-xl font-semibold mb-6">Reading Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Books Read</h3>
              <div className="h-10 w-10 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-400">
                <Book className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3">{stats.booksRead}</p>
            <div className="mt-2 h-1 w-full bg-indigo-900/30 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+3 from last month</p>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Pages Read</h3>
              <div className="h-10 w-10 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3">{stats.pagesRead}</p>
            <div className="mt-2 h-1 w-full bg-purple-900/30 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{width: '75%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+125 from last month</p>
          </div>
          
          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Reading Time</h3>
              <div className="h-10 w-10 rounded-full bg-pink-900/40 flex items-center justify-center text-pink-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3">{stats.minutesRead} <span className="text-base font-normal text-muted-foreground">min</span></p>
            <div className="mt-2 h-1 w-full bg-pink-900/30 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full" style={{width: '45%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+45 minutes from last month</p>
          </div>
        </div>
      </div>

      <div className="neo-glass mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Continue Reading</h2>
          <Link href="/books" className="neo-button-outline text-sm flex items-center">
            View Library <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="neo-grid">
          {recentBooks.length > 0 ? (
            recentBooks.map((book) => (
              <Link href={`/books/${book.slug}`} key={book.id}>
                <div className="neo-card h-full flex flex-col">
                  <div className="aspect-[2/3] relative mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={book.coverImage || '/placeholder-book.jpg'} 
                      alt={book.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      {book.rating || '—'}
                    </div>
                  </div>
                  <h3 className="font-medium mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                  <div className="mt-auto">
                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-purple))] h-full rounded-full"
                        style={{ width: `${book.progress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{book.progress || 0}% complete</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 neo-card">
              <p className="text-muted-foreground mb-4">You haven't started reading any books yet.</p>
              <Link href="/books" className="neo-button">
                Explore Books
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="neo-glass">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Reading Insights</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            <TrendingUp className="mr-1 h-4 w-4" />
            Last 30 days
          </div>
        </div>
        
        <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center">
          <p className="text-muted-foreground">Reading insights visualization will appear here</p>
        </div>
      </div>
    </>
  );
}