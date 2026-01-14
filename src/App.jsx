import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import { SectionView } from "./views/SectionView/SectionView";

import { PackingModel } from "./models/PackingModel";
import { ShopStokeModel } from "./models/ShopStokeModel";
import { EmbroideryModel } from "./models/EmbroideryModel";
import { ReportsModel } from "./models/ReportsModel";
import { FabricDetailModel } from "./models/FabricDetailModel";

import AuthPage from "./views/AuthPage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  // 🔒 Show login if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 📊 Authenticated dashboard with routing
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            setIsSidebarOpen={setIsSidebarOpen}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              {/* Default redirect to shop */}
              <Route path="/" element={<Navigate to="/shop" replace />} />
              
              {/* All routes */}
              <Route 
                path="/shop" 
                element={<SectionView title="Shop Stoke" model={ShopStokeModel} />} 
              />
              <Route 
                path="/packing" 
                element={<SectionView title="Packing" model={PackingModel} />} 
              />
              <Route 
                path="/embroidery" 
                element={<SectionView title="Embroidery Details" model={EmbroideryModel} />} 
              />
              <Route 
                path="/reports" 
                element={<SectionView title="Reports" model={ReportsModel} />} 
              />
              <Route 
                path="/fabric" 
                element={<SectionView title="Fabric Detail" model={FabricDetailModel} />} 
              />

              {/* 404 redirect */}
              <Route path="*" element={<Navigate to="/shop" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;