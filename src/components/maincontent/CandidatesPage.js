import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Custom styles for cards with light box shadow
const cardStyles = `
  .custom-card {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in-out;
    background: #fff;
    overflow: hidden;
    margin: auto;
    cursor: pointer;
  }
  .custom-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .card-title {
    color: #2D3748;
    font-size: 1.5rem;
    font-weight: 600;
  }
  .card-subtitle {
    color: #718096;
    font-size: 1rem;
  }
  .card-text {
    color: #4A5568;
    font-size: 1rem;
  }
  .badge {
    font-size: 0.85rem;
    padding: 0.35em 0.65em;
  }
  .department-badge {
    position: absolute;
    top: 10px;
    right: 20px;
  }
  .job-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

function CandidatesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [noJobsMessage, setNoJobsMessage] = useState("");
  const [appliedCounts, setAppliedCounts] = useState({}); // State for applied counts

  const navigate = useNavigate();

  // Retrieve userId from localStorage (which is also the organizationId)
  const user = localStorage.getItem("user");
  let userId;

  try {
    const parsedUser = user ? JSON.parse(user) : null;
    userId = parsedUser?.userId || null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    userId = null;
  }

  // Set organizationId and fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) {
        setError("User ID is missing from user data");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setOrganizationId(userId);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error fetching organization data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // Fetch jobs using organizationId
  useEffect(() => {
    const fetchJobs = async () => {
      if (!organizationId) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs?organizationId=${organizationId}`);
        const jobsData = response.data;

        if (Array.isArray(jobsData) && jobsData.length > 0) {
          setJobs(jobsData);
          setNoJobsMessage("");
          // Fetch applied counts for each job
          fetchAppliedCounts(jobsData);
        } else {
          setJobs([]);
          setNoJobsMessage("No jobs available for this organization.");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response?.status === 404) {
          setJobs([]);
          setNoJobsMessage("No jobs available for this organization.");
        } else {
          setError("Failed to fetch jobs: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [organizationId]);

  // Function to fetch applied counts for all jobs
  const fetchAppliedCounts = async (jobsData) => {
    try {
      const counts = {};
      await Promise.all(
        jobsData.map(async (job) => {
          const response = await axios.get(`http://localhost:5000/api/candidates/job/${job._id}`);
          counts[job._id] = response.data.length; // Number of candidates who applied
        })
      );
      setAppliedCounts(counts);
    } catch (error) {
      console.error("Error fetching applied counts:", error);
    }
  };

  // Handler for card click: navigate to selection process page with the job id
  const handleCardClick = (jobId) => {
    navigate(`/recruiter/dashboard/selection/${jobId}`);
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  if (!organizationId) {
    return (
      <div className="container mt-4">
        <p className="text-muted">
          No organization found. Please log in or create an account to view jobs.
        </p>
        <Button variant="primary">Log In</Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <style>{cardStyles}</style>

      <h2 className="mb-4">Available Jobs</h2>

      <Row xs={1} md={2} lg={3} className="g-4">
        {noJobsMessage ? (
          <Col>
            <p className="text-muted">{noJobsMessage}</p>
          </Col>
        ) : jobs.length === 0 ? (
          <Col>
            <p className="text-muted">No jobs found.</p>
          </Col>
        ) : (
          jobs.map((job) => (
            <Col key={job._id}>
              <Card
                className="custom-card h-100 position-relative px-3"
                onClick={() => handleCardClick(job._id)}
              >
                <Badge bg="info" className="department-badge">
                  {job.department || "N/A"}
                </Badge>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2">{job.position}</Card.Title>
                  <Card.Text>
                    <strong>Vacancies:</strong> {job.seats}
                  </Card.Text>
                  <img
                    src="https://media.istockphoto.com/id/1201845960/vector/business-hierarchy-ceo-organization-job-working-leadership.jpg?s=612x612&w=0&k=20&c=QTi2Ha-Q3kcdAldcJ3_NhMluaSczHn-ne5leHbHpV0k="
                    alt={job.position}
                    className="job-image my-2"
                  />
                  <Card.Text>
                    <strong>Applied:</strong> {appliedCounts[job._id] || 0}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}

export default CandidatesPage;
