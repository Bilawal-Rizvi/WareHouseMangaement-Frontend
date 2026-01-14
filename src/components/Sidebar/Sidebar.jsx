import { NavLink } from "react-router-dom";
import { 
  Store, 
  Package, 
  Scissors, 
  FileText, 
  Shirt 
} from "lucide-react";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { id: 'shop', path: '/shop', name: 'Shop Stoke', icon: Store },
    { id: 'packing', path: '/packing', name: 'Packing', icon: Package },
    { id: 'embroidery', path: '/embroidery', name: 'Embroidery Details', icon: Scissors },
    { id: 'reports', path: '/reports', name: 'Reports', icon: FileText },
    { id: 'fabric', path: '/fabric', name: 'Fabric Detail', icon: Shirt }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-linear-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Warehouse MS</h1>
          <p className="text-blue-200 text-sm mt-1">Inventory Management</p>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white text-blue-900 shadow-lg' 
                      : 'hover:bg-blue-700 text-blue-100'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};