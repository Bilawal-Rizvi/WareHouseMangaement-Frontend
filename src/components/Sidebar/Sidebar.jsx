import React from 'react';
import { Package, Store, Scissors, FileText, Shirt } from 'lucide-react';

export const Sidebar = ({ activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { id: 'shop', name: 'Shop Stoke', icon: Store },
    { id: 'packing', name: 'Packing', icon: Package },
    { id: 'embroidery', name: 'Embroidery Details', icon: Scissors },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'fabric', name: 'Fabric Detail', icon: Shirt }
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-linear-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Warehouse MS</h1>
          <p className="text-blue-200 text-sm mt-1">Inventory Management</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'hover:bg-blue-700 text-blue-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
