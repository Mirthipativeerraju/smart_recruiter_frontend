import React from "react";
import { Button } from "react-bootstrap";
import { FaTimes, FaHome, FaUserFriends, FaBriefcase, FaChartBar, FaCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import recruiterlogo from "../../images/logo.png";

const Sidebar = ({ sidebarOpen, toggleSidebar, activeMenu, onMenuSelect }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "home", icon: <FaHome /> },
    { name: "Candidates", path: "candidates-page", icon: <FaUserFriends /> },
    { name: "Jobs", path: "jobs-page", icon: <FaBriefcase /> },
    { name: "Settings", path: "settings-page", icon: <FaCog /> },
  ];

  const getActiveMenu = (path) => (location.pathname === path ? "active" : "");

  const handleClick = (itemName) => {
    onMenuSelect(itemName);
    if (window.innerWidth < 992) {
      toggleSidebar();
    }
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src={recruiterlogo} alt="Logo" className="sidebar-logo" />
        <Button
          variant="link"
          className="close-btn d-lg-none"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} color="black" />
        </Button>
      </div>
      <br /><br />
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={getActiveMenu(item.path)}
            onClick={() => handleClick(item.name)}
          >
            <Link to={item.path}>
              {item.icon} <span className="menu-text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="view-jobs-container">
        <Link to="/jobpage" className="view-jobs-btn">
          View Jobs
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
