import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <Container>
        <Row className="hero-row align-items-center">
          {/* Image */}
          <Col lg={6} md={12} className="hero-image-col">
            <img 
              src="/assets/images/job.png"
              alt="Job Search Illustration" 
              className="hero-image img-fluid"
            />
          </Col>

          {/* Text Content */}
          <Col lg={6} md={12} className="hero-text">
            <h1 className="hero-title">
              Find Your Dream Job Today
            </h1>
            <p className="hero-subtitle">
              Discover exciting career opportunities that match your skills and aspirations. 
              Explore thousands of job listings from top companies and take the next step 
              in your professional journey.
            </p>
            <Button 
              variant="primary" 
              className="hero-button"
              href="#jobs"
            >
              Explore Jobs
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;