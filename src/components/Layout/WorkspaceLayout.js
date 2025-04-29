'use client';

import Sidebar from './Sidebar'; // Import the new Sidebar component

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar /> {/* Use the Sidebar component */}

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Page content goes here */}
        {children}
      </main>
    </div>
  );
}
