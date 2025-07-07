import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Card } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import './Jobpage.css';

const JobsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsResponse = await fetch('http://localhost:5000/api/jobs');
        const jobsData = await jobsResponse.json();
        if (!jobsResponse.ok) throw new Error(jobsData.error || 'Failed to fetch jobs');

        let appliedIds = [];
        if (isLoggedIn && userId) {
          const candidatesResponse = await fetch(`http://localhost:5000/api/candidates/user/${userId}`);
          const candidatesData = await candidatesResponse.json();
          console.log('Candidates Data:', candidatesData);
          if (!candidatesResponse.ok) throw new Error(candidatesData.error || 'Failed to fetch applied jobs');

          appliedIds = candidatesData
            .filter(candidate => candidate.jobId != null) // Exclude null jobIds
            .map(candidate => {
              // Extract the _id from the populated jobId object
              const jobId = candidate.jobId._id ? candidate.jobId._id.toString() : candidate.jobId.toString();
              return jobId;
            });
          console.log('Applied Job IDs:', appliedIds);
          setAppliedJobIds(appliedIds);
        }

        const availableJobs = jobsData.filter(job => !appliedIds.includes(job._id.toString()));
        console.log('Available Jobs:', availableJobs);
        setJobs(availableJobs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [isLoggedIn, userId, location.search]);

  const handleViewClick = (job) => {
    if (isLoggedIn) {
      navigate(`/job/${job._id}`);
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  const JobCard = ({ job }) => (
    <Card className="job-card shadow-sm text-dark border-0">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="text-uppercase fw-semibold mb-0">{job.position}</Card.Title>
          <span className={`badge job-type-badge ${job.jobType === 'Full-time' ? 'bg-primary' : 'bg-success'}`}>
            {job.jobType}
          </span>
        </div>
        <Card.Text className="mt-2 mb-1 text-dark">{job.office}</Card.Text>
        <Card.Text className="text-muted small">
          {job.salaryFrom && job.salaryTo 
            ? `₹${job.salaryFrom.toLocaleString()} - ₹${job.salaryTo.toLocaleString()}`
            : 'Salary not specified'}
        </Card.Text>
        <Button
          variant="outline-primary"
          className="text-uppercase fw-semibold mt-auto align-self-start"
          onClick={(e) => {
            e.stopPropagation();
            handleViewClick(job);
          }}
        >
          View Job
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavigationBar />
      <Container className="flex-grow-1 py-5 mt-5">
        <Row>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <Col xs={12} md={6} lg={4} key={job._id} className="mb-4">
                <JobCard job={job} />
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No available jobs to display.</p>
            </Col>
          )}
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title className="text-uppercase fw-semibold">Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Please log in to view job details.</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button variant="primary" href="/userlogin" className="text-uppercase fw-semibold">Login</Button>
          <Button variant="outline-light" onClick={handleClose} className="text-uppercase fw-semibold">Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default JobsPage;