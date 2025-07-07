import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./TopBar.css";

const TopBar = ({ selectedMenu, toggleSidebar }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // Clear role from localStorage (if you are storing it)
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // Navigate to the home page after logout
    navigate("/recruiter");
  };

  return (
    <Navbar expand="lg" className="topbar">
      <Container fluid>
        {/* Hamburger icon on mobile */}
        <Button
          variant="link"
          className="d-lg-none me-2"
          onClick={toggleSidebar}
        >
          <FaBars size={24} color="black" />
        </Button>
        <Navbar.Brand className="topbar-brand">{selectedMenu}</Navbar.Brand>
        <Nav className="ms-auto">
          <NavDropdown
            title={<FaUserCircle size={30} style={{ cursor: "pointer" }} />}
            id="profile-dropdown"
            align="end"
            className="profile-dropdown"
          >
            <div className="dropdown-menu dropdown-menu-end">
              {/* Logout button that triggers handleLogout */}
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopBar;
