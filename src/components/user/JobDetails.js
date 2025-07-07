import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useParams, useNavigate } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/userlogin');
    } else {
      const fetchJob = async () => {
        try {
          console.log(`Fetching job with ID: ${id}`);
          const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
          const data = await response.json();
          console.log('Response:', response.ok, data);
          if (response.ok) {
            setJob(data);
          } else {
            setError(data.error || 'Failed to fetch job');
          }
        } catch (error) {
          setError('Error fetching job details');
          console.error('Fetch error:', error);
        }
      };
      fetchJob();
    }
  }, [id, isLoggedIn, navigate]);

  const handleApplyClick = () => {
    navigate(`/applyform/${id}`); // Redirect to apply form with job ID
  };

  if (!isLoggedIn) return null;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!job) return <div className="text-light text-center py-5">Loading...</div>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavigationBar />
      <Container className="flex-grow-1 text-dark py-5 mt-5">
        <h1 className="text-uppercase fw-semibold mb-2">{job.position}</h1>
        <h3 className="text-light mb-3">{job.office}</h3>
        <div className="job-details">
          <p><strong>Department:</strong> {job.department}</p>
          <p><strong>Job Type:</strong> {job.jobType}</p>
          <p><strong>Seats:</strong> {job.seats}</p>
          <p><strong>Salary Range:</strong> ₹{job.salaryFrom} - ₹{job.salaryTo}</p>
          <p><strong>Description:</strong> <div dangerouslySetInnerHTML={{ __html: job.description }} /></p>
        </div>
        <Button variant="primary" className="text-uppercase fw-semibold mt-2" onClick={handleApplyClick}>
          Apply Now
        </Button>
        <Button variant="outline-light" className="text-uppercase fw-semibold mt-2 ms-2" onClick={() => navigate('/jobpage')}>
          Back to Jobs
        </Button>
      </Container>
      <Footer />
    </div>
  );
};

export default JobDetails;