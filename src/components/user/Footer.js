// Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          {/* Copyright Text */}
          <Col xs={12} md={6} className="footer-text">
            <p className="mb-0">© 2025 JobFinder</p>
            <p className="mb-0">All rights reserved.</p>
          </Col>

          {/* Social Icons */}
          <Col xs={12} md={6} className="social-icons">
            <a href="https://www.facebook.com/" className="social-icon" target="_blank"><FaFacebook /></a>
            <a href="https://x.com/home?lang=en" className="social-icon" target="_blank"><FaTwitter /></a>
            <a href="https://in.linkedin.com/" className="social-icon" target="_blank"><FaLinkedin /></a>
            <a href="https://www.instagram.com/" className="social-icon" target="_blank"><FaInstagram /></a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;