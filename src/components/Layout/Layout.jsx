import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="layout">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar onMenuToggle={toggleSidebar} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 