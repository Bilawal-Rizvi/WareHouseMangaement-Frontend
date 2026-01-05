import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { SectionView } from './views/SectionView/SectionView';

import { PackingModel } from './models/PackingModel';
import { ShopStokeModel } from './models/ShopStokeModel';
import { EmbroideryModel } from './models/EmbroideryModel';
import { ReportsModel } from './models/ReportsModel';
import { FabricDetailModel } from './models/FabricDetailModel';

import Login from './views/Login'; // 👈 LOGIN PAGE

const App = () => {
  const [activeSection, setActiveSection] = useState('shop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false); // 🔐 AUTH STATE

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const sections = {
    shop: { title: 'Shop Stoke', model: ShopStokeModel },
    packing: { title: 'Packing', model: PackingModel },
    embroidery: { title: 'Embroidery Details', model: EmbroideryModel },
    reports: { title: 'Reports', model: ReportsModel },
    fabric: { title: 'Fabric Detail', model: FabricDetailModel }
  };

  // 🔓 LOGIN SCREEN
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 🔐 AUTHENTICATED APP (tumhara existing layout)
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
       <Header
  setIsSidebarOpen={setIsSidebarOpen}
  onLogout={() => {
    localStorage.removeItem("token"); // clear token
    setIsAuthenticated(false);        // redirect to login
  }}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <SectionView
            key={activeSection}
            title={sections[activeSection].title}
            model={sections[activeSection].model}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
