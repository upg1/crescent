'use client'

import { useState } from 'react'

export function AccessControls({ session }) {
  // Mock data for access settings
  const [settings, setSettings] = useState({
    timeLimit: 120, // 2 hours in minutes
    contentFilters: ['advanced-topics'],
    notificationsEnabled: true,
    progressReports: true
  })
  
  // In a real app, these functions would update the database
  const updateTimeLimit = (minutes) => {
    setSettings({...settings, timeLimit: minutes})
  }
  
  const toggleContentFilter = (filter) => {
    const newFilters = settings.contentFilters.includes(filter)
      ? settings.contentFilters.filter(f => f !== filter)
      : [...settings.contentFilters, filter]
    
    setSettings({...settings, contentFilters: newFilters})
  }

  return (
    <div className="space-y-6">
      <div className="glassmorphism rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Access Controls</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Daily Time Limit</h3>
            <p className="opacity-70 mb-2">Limit how much time your scholar can spend on the platform each day</p>
            
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="30" 
                max="240" 
                step="30" 
                value={settings.timeLimit}
                onChange={(e) => updateTimeLimit(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="min-w-[80px] text-center">{settings.timeLimit} min</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Content Filters</h3>
            <p className="opacity-70 mb-2">Control which content categories are available to your scholar</p>
            
            <div className="space-y-2">
              {['advanced-topics', 'external-resources', 'social-features', 'challenges'].map(filter => (
                <label key={filter} className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={settings.contentFilters.includes(filter)}
                    onChange={() => toggleContentFilter(filter)}
                  />
                  <span className="capitalize">{filter.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Notifications</h3>
            <p className="opacity-70 mb-2">Choose what notifications you receive about your scholar's activity</p>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                />
                <span>Enable notifications</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={settings.progressReports}
                  onChange={() => setSettings({...settings, progressReports: !settings.progressReports})}
                />
                <span>Weekly progress reports</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-primary text-white rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}