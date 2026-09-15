import React from 'react'

export default function Footer() {

  return (
    
    <div>

   <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
      <div className="flex items-center space-x-2">
        <i data-lucide="bus" className="w-5 h-5 text-brand-500"></i>
        <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200">DriveBus Systems</span>
      </div>
      <p>&copy; 2026 DriveBus Logistics Inc. All rights reserved. Designed with premium visual ergonomics.</p>
    </div>
  </footer>

    </div>
  )
}
