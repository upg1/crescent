'use client'

import { useState } from 'react'
import { BarChart, Activity, Users } from 'lucide-react'

export default function NotesView() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">School Activity</h2>
        <span className="text-sm text-gray-500">Last 30 days</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-md">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md mr-3">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Active Students</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">85% attendance rate</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">487</p>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md mr-3">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Assignments Completed</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">+12% from last month</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">1,243</p>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md mr-3">
              <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Average Grade</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">+3% improvement</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">B+</p>
        </div>
      </div>
    </div>
  )
}