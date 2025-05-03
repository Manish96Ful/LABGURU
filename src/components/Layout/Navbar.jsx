import React from 'react';
import './Layout.css';

const Navbar = ({ onMenuToggle }) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const labName = userData.labName || 'Illusion Dental Laboratory';
  const fiscalYear = '2025-26';

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <span className="menu-icon">☰</span>
        </button>
      </div>
      <div className="navbar-center">
        Hi admin, You have logged into {labName} (FY {fiscalYear})
      </div>
      <div className="navbar-right">
        <div className="notification-icon">
          <span className="bell-icon">🔔</span>
        </div>
        <div className="user-profile">
          <img src="/assets/images/user-avatar.png" alt="User" className="user-avatar" />
        </div>
      </div>
    </div>
  );
};

export default Navbar; 