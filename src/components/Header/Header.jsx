import React from 'react';
import { Menu, LogOut } from 'lucide-react';    

export const Header = ({ setIsSidebarOpen, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Sidebar toggle button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-800"
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Warehouse Management System</span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};
