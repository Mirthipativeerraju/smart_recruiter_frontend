import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"; // Add useLocation
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home"); // Default to "Home"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // Get current location

  // Toggle Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle menu selection
  const handleMenuSelect = (menu) => setSelectedMenu(menu);

  // Check if we're at the base dashboard route
  const isBaseDashboardRoute =
    location.pathname === "/recruiter/dashboard" ||
    location.pathname === "/recruiter/dashboard/";

  return (
    <div className="dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
      />
      <div className="main-content">
        <TopBar selectedMenu={selectedMenu} toggleSidebar={toggleSidebar} />
        <div className="content-area p-3">
          <Outlet /> {/* Dynamic content goes here */}
          {/* Redirect to /recruiter/dashboard/home if at base route */}
          {isBaseDashboardRoute && <Navigate to="/recruiter/dashboard/home" replace />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;