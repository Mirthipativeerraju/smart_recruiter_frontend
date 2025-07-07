import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css'; // Enhanced styles with modern UI

const AboutUs = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/userlogin');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-gradient-dark text-light">
      <NavigationBar />

      <Container className="flex-grow-1 py-5 mt-5">
        {/* Header Section */}
        <div className="text-center mb-5 animate-header">
          <h1 className="display-4 fw-bold text-uppercase text-light">
            About JobFinder
          </h1>
          <p className="lead text-light mt-3">
            Bridging the gap between talent and opportunity with a purpose-driven platform.
          </p>
        </div>

        {/* Core Purpose Section */}
        <Row className="mb-5 align-items-stretch">
          <Col xs={12} md={6} className="mb-4">
            <div className="about-card shadow-lg border-0 h-100 animate-card">
              <div className="card-body d-flex flex-column p-4">
                <h4 className="text-uppercase fw-bold text-primary">Our Purpose</h4>
                <p className="flex-grow-1 text-dark">
                  JobFinder is here to simplify the job search process, empowering job seekers to find meaningful work and enabling recruiters to discover top talent effortlessly. It’s about creating connections that matter—faster, smarter, and fairer.
                </p>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="mb-4">
            <div className="about-card shadow-lg border-0 h-100 animate-card">
              <div className="card-body d-flex flex-column p-4">
                <h4 className="text-uppercase fw-bold text-primary">The Core Idea</h4>
                <p className="flex-grow-1 text-dark">
                  This platform tackles the chaos of job hunting with a streamlined, tech-driven solution. It combines intuitive design with powerful functionality to cut through the noise and deliver results for users on both sides of the hiring process.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Key Features Section */}
        <div className="mb-5">
          <h3 className="fw-bold text-light text-center mb-4">How We Make a Difference</h3>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="feature-card shadow-lg border-0 h-100 animate-card">
                <div className="text-center d-flex flex-column p-4">
                  <div className="feature-icon mx-auto mb-3">
                    <span>🔗</span>
                  </div>
                  <h5 className="fw-semibold text-primary">Seamless Connections</h5>
                  <p className="flex-grow-1 text-dark">
                    Instantly link job seekers with employers through smart matching and real-time job updates, reducing the time from search to hire.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="feature-card shadow-lg border-0 h-100 animate-card">
                <div className="text-center d-flex flex-column p-4">
                  <div className="feature-icon mx-auto mb-3">
                    <span>📱</span>
                  </div>
                  <h5 className="fw-semibold text-primary">Accessible Anywhere</h5>
                  <p className="flex-grow-1 text-dark">
                    A responsive, user-friendly interface ensures job seekers and recruiters can connect anytime, anywhere—whether on mobile or desktop.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="feature-card shadow-lg border-0 h-100 animate-card">
                <div className="text-center d-flex flex-column p-4">
                  <div className="feature-icon mx-auto mb-3">
                    <span>⚙️</span>
                  </div>
                  <h5 className="fw-semibold text-primary">Efficiency at Scale</h5>
                  <p className="flex-grow-1 text-dark">
                    From job postings to applications and candidate tracking, JobFinder automates the process so users can focus on what matters: finding the right fit.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Origin Story */}
        <div className="mb-5 text-center">
          <h3 className="fw-bold text-light mb-4">Why JobFinder Exists</h3>
          <p className="text-light lead mx-auto" style={{ maxWidth: '800px' }}>
            Frustrated by slow, cluttered, and impersonal job platforms, JobFinder was created to offer a better way. It’s a streamlined solution designed to serve both job seekers and recruiters with equal care, born from a vision to make hiring simpler and more effective.
          </p>
        </div>

        {/* Meet the Creator */}
        <div className="mb-5 creator-section">
          <h3 className="fw-bold text-light mb-4 text-center">Meet the Creator</h3>
          <Row className="align-items-center animate-creator">
            <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
              <div className="creator-avatar mx-auto">
                <img
                  src="https://i.ibb.co/xtnsYRjj/Veerraju.png" // Replace with your actual image URL
                  alt="Mirthipati Veerraju"
                  className="rounded-circle shadow-sm"
                />
              </div>
            </Col>
            <Col xs={12} md={8}>
              <h4 className="fw-bold text-light mb-2">Mirthipati Veerraju</h4>
              <p className="text-light creator-text">
                JobFinder was single-handedly crafted by Mirthipati Veerraju, a passionate developer pursuing a Master’s in Computers at Aditya Engineering College. With a background in full-stack development and internships at TCS, IBM, and Franklin Tech, Mirthipati built this platform to solve real-world hiring challenges. Driven by a desire to empower others, this project reflects a blend of technical skill, creativity, and a commitment to making a difference.
              </p>
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-5">
          <Button
            variant="primary"
            className="text-uppercase fw-bold px-5 py-3 shadow-sm animate-button"
            onClick={() => navigate('/jobpage')}
          >
            Join the Journey – Explore Jobs Now
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default AboutUs;