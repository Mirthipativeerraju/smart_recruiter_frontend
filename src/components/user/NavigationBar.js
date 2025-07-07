import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [fullName, setFullName] = useState(localStorage.getItem('fullName') || '');

  // Listen for login status changes
  useEffect(() => {
    const handleLoginStatusChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setFullName(localStorage.getItem('fullName') || '');
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    
    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('loginStatusChanged'));
    navigate('/userlogin');
  };

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      className="navbar-custom shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-typography">
          JobFinder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="me-4 text-uppercase fw-semibold nav-link-hover">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/jobpage" className="me-4 text-uppercase fw-semibold nav-link-hover">
                  Jobs
                </Nav.Link>
            <Nav.Link as={Link} to="/aboutus" className="me-4 text-uppercase fw-semibold nav-link-hover">
              About Us
            </Nav.Link>
            {isLoggedIn ? (
              <>

                <Nav.Link as={Link} to="/userprofile" className="me-4 text-uppercase fw-semibold nav-link-hover">
                  Profile
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  className="text-uppercase fw-semibold logout-button me-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <span className="text-light fw-semibold welcome-text">
                  Welcome, {fullName}
                </span>
              </>
            ) : (
              <Button 
                variant="primary" 
                className="text-uppercase fw-semibold login-button"
                onClick={() => navigate("/userlogin")}
              >
                Login / Signup
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;