import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Sidebar = ({ isCollapsed }) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const storedMenuData = localStorage.getItem('menuData');
    if (storedMenuData) {
      const menuData = JSON.parse(storedMenuData);
      // Sort menu items by SequenceNo
      const sortedMenuData = menuData.sort((a, b) => a.SequenceNo - b.SequenceNo);
      setMenuItems(sortedMenuData);
    }
  }, []);

  // Function to convert icon strings to emojis (temporary solution)
  const getIconComponent = (iconName) => {
    const iconMap = {
      'ti-agenda': '📋',
      'ti-dashboard': '📊',
      'ti-settings': '⚙️',
      'ti-folder': '📁',
      'ti-files': '📄',
      'ti-clipboard': '📎',
      'ti-bar-chart': '📈',
      'ti-user': '👤',
      // Add more icon mappings as needed
      'default': '📱'
    };

    return iconMap[iconName] || iconMap.default;
  };

  const toggleSubmenu = (title) => {
    setActiveMenu(activeMenu === title ? '' : title);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/assets/images/logo.png" alt="Logo" className="logo" />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <div 
              className={`menu-title ${activeMenu === item.menuName ? 'active' : ''}`}
              onClick={() => !isCollapsed && toggleSubmenu(item.menuName)}
              title={isCollapsed ? item.menuName : ''}
            >
              <span className="menu-icon">{getIconComponent(item.icon)}</span>
              {!isCollapsed && (
                <>
                  <span className="menu-text">{item.menuName}</span>
                  {item.setOfSubMenu && item.setOfSubMenu.length > 0 && (
                    <span className="submenu-arrow">
                      {activeMenu === item.menuName ? '▼' : '▶'}
                    </span>
                  )}
                </>
              )}
            </div>
            {item.setOfSubMenu && activeMenu === item.menuName && !isCollapsed && (
              <div className="submenu">
                {item.setOfSubMenu
                  .sort((a, b) => a.SequenceNo - b.SequenceNo)
                  .map((subItem) => (
                    <Link 
                      key={subItem.id}
                      to={subItem.routLink}
                      className="submenu-item"
                      title={subItem.menuName}
                    >
                      {subItem.icon && (
                        <span className="submenu-icon">
                          {getIconComponent(subItem.icon)}
                        </span>
                      )}
                      {subItem.menuName}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 