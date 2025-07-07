import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Card, Spinner } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null); // From User model
  const [appliedJobs, setAppliedJobs] = useState([]); // From Candidate model
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate('/userlogin');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user data from User model
        const userResponse = await fetch(`https://smart-recruiter-backend.onrender.com/api/auth/${userId}`);
        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error(userData.error || 'Failed to fetch user data');
        console.log('Fetched user data:', userData); // Debug log
        setUserData(userData);

        // Fetch applied jobs from Candidate model
        const candidatesResponse = await fetch(`https://smart-recruiter-backend.onrender.com/api/candidates/user/${userId}`);
        const candidatesData = await candidatesResponse.json();
        if (!candidatesResponse.ok) throw new Error(candidatesData.error || 'Failed to fetch applied jobs');
        console.log('Fetched applied jobs:', candidatesData); // Debug log
        setAppliedJobs(candidatesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, userId, navigate]);

  const handleWithdrawClick = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      const response = await fetch(`https://smart-recruiter-backend.onrender.com/api/candidates/withdraw/${selectedCandidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to withdraw');

      setAppliedJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === selectedCandidateId ? { ...job, status: 'withdraw' } : job
        )
      );
      setShowWithdrawModal(false);
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const JobCard = ({ candidate }) => (
    <Card className="job-card shadow-sm text-dark border-0">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="text-uppercase fw-semibold mb-0">{candidate.jobId.position}</Card.Title>
            <Card.Text className="mt-2 mb-1 text-dark">{candidate.jobId.office}</Card.Text>
            <Card.Text className="text-muted small">
              Applied on {formatDate(candidate.appliedAt)}
            </Card.Text>
          </div>
          <div className="text-end">
            <span className={`badge ${candidate.status === 'withdraw' ? 'bg-danger' : 'bg-warning'} text-white`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </span>
            {candidate.status !== 'withdraw' && (
              <Button
                variant="outline-danger"
                className="text-uppercase fw-semibold mt-2"
                onClick={() => handleWithdrawClick(candidate._id)}
              >
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-dark text-light">
        <NavigationBar />
        <Container className="flex-grow-1 py-5 mt-5 text-center">
          <Spinner animation="border" variant="light" />
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavigationBar />
      <Container className="flex-grow-1 py-5 mt-5">
        {userData ? (
          <>
            {/* Profile Header */}
            <div className="text-center mb-5">
              <div className="profile-avatar mx-auto mb-3">
                <span>{userData.fullname.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="fw-bold">{userData.fullname}</h2>
              <p className="text-light">
                Member since {formatDate(userData.createdAt)}
              </p>
            </div>

            {/* Applied Jobs Section */}
            <div className="mb-3 d-flex align-items-center">
              <h3 className="fw-bold text-light me-2">Applied Jobs</h3>
              <span className="badge bg-success">{appliedJobs.length}</span>
            </div>
            <hr className="border-light" />
            <Row>
              {appliedJobs.length > 0 ? (
                appliedJobs.map((candidate) => (
                  <Col xs={12} md={6} lg={4} key={candidate._id} className="mb-4">
                    <JobCard candidate={candidate} />
                  </Col>
                ))
              ) : (
                <Col>
                  <p className="text-center">No applied jobs yet.</p>
                </Col>
              )}
            </Row>
          </>
        ) : (
          <p className="text-center">No user data available.</p>
        )}
      </Container>

      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light border-0">
          <Modal.Title className="text-uppercase fw-semibold">Confirm Withdrawal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>We will not proceed with your application further.</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button variant="outline-light" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleWithdrawConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default UserProfile;
