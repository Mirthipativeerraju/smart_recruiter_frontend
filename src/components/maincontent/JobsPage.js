import React, { useState, useEffect } from "react";
import { Button, Dropdown, Card, Col, Row, Badge, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select"; // Import react-select

// Custom styles for cards with light box shadow
const cardStyles = `
  .custom-card {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in-out;
    background: #fff;
  }
  .custom-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .card-title {
    color: #2D3748;
    font-size: 1.25rem;
    font-weight: 600;
  }
  .card-subtitle {
    color: #718096;
    font-size: 1rem;
  }
  .card-text {
    color: #4A5568;
    font-size: 0.9rem;
  }
  .badge {
    font-size: 0.75rem;
    padding: 0.35em 0.65em;
  }
`;

// Chakra UI-inspired styles for ReactQuill
const chakraStyles = `
  .ql-toolbar.ql-snow {
    background: #EDF2F7;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .ql-container.ql-snow {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: #fff;
    height: 200px;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .ql-editor {
    padding: 12px;
    font-size: 16px;
    line-height: 1.5;
    color: #000000;
    min-height: 150px;
    overflow-y: auto;
  }
`;

function JobsPage() {
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editJobData, setEditJobData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [noJobsMessage, setNoJobsMessage] = useState(""); // New state for no jobs message

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

        // Fetch departments and locations if needed
        const response = await axios.get(`http://localhost:5000/api/profiles/by-org/${userId}`);
        const result = response.data;
        if (response.status === 200 && result.success) {
          setDepartments(result.data.departments || []);
          setLocations(result.data.locations || []);
        } else {
          console.warn("Failed to fetch additional organization data:", result.message);
        }
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
          setJobs(jobsData); // Set jobs if data is returned
          setNoJobsMessage(""); // Clear any previous no-jobs message
        } else {
          setJobs([]); // Clear jobs
          setNoJobsMessage("No jobs available for this organization."); // Set message
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

  // Filter jobs based on selected status
  const filteredJobs = selectedStatus === "Active"
    ? jobs.filter(job => job.status === "active")
    : jobs.filter(job => job.status === "closed");

  // Handle opening the edit modal
  const handleEditJob = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setEditJobData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Failed to fetch job data: " + error.message);
    }
  };

  // Handle form changes in the edit modal
  const handleEditChange = (e) => {
    setEditJobData({ ...editJobData, [e.target.id]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setEditJobData({ ...editJobData, description: value });
  };

  // Handle submitting the edited job
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/jobs/${editJobData._id}`, editJobData);
      if (response.status === 200) {
        const updatedJob = response.data.data;
        setJobs(jobs.map(job => job._id === editJobData._id ? updatedJob : job));
        setShowEditModal(false);
      } else {
        alert("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("An error occurred while updating the job: " + error.message);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      ["clean"],
    ],
  };

  const quillFormats = ["header", "bold", "italic", "list", "bullet", "script"];

  // Options for react-select
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Closed", value: "closed" },
  ];
  const locationOptions = [
    ...locations.map((loc) => ({ label: loc, value: loc })),
    { label: "Multiple Locations", value: "Multiple Locations" },
    { label: "Pan India", value: "Pan India" },
  ];
  const departmentOptions = departments.map((dept) => ({ label: dept, value: dept }));
  const jobTypeOptions = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Remote", value: "Remote Based" },
    { label: "Project Based", value: "Project Based" },
    { label: "Hourly", value: "Hourly" },
  ];

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
        <Link to="/login">
          <Button variant="primary">Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <style>{cardStyles}</style>

      <div className="d-flex justify-content-between align-items-start mb-4">
        <Link to="/recruiter/dashboard/postjob">
          <Button variant="primary">Create New Job</Button>
        </Link>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">{selectedStatus}</Dropdown.Toggle>
          <Dropdown.Menu className="bg-white">
            <Dropdown.Item onClick={() => setSelectedStatus("Active")}>Active</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedStatus("Closed")}>Closed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {noJobsMessage ? (
          <Col>
            <p className="text-muted">{noJobsMessage}</p>
          </Col>
        ) : filteredJobs.length === 0 ? (
          <Col>
            <p className="text-muted">No jobs found for {selectedStatus} status.</p>
          </Col>
        ) : (
          filteredJobs.map((job) => (
            <Col key={job._id}>
              <Card className="custom-card h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{job.position}</Card.Title>
                    <Badge
                      bg={job.status === 'active' ? 'success' : 'danger'}
                      className="text-uppercase"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <Card.Subtitle className="mb-2">
                    <strong>Location:</strong> {job.office}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Seats:</strong> {job.seats}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditJob(job._id)}
                    >
                      Edit Job
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Edit Job Modal */}
      {editJobData && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="md">
          <Modal.Header closeButton style={{ backgroundColor: "#fff", color: "#000000" }}>
            <Modal.Title style={{ color: "#000000" }}>Edit Job</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#fff", color: "#000000" }}>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Status</Form.Label>
                <Select
                  id="status"
                  value={statusOptions.find(option => option.value === editJobData.status) || null}
                  onChange={(selectedOption) => setEditJobData({ ...editJobData, status: selectedOption ? selectedOption.value : "" })}
                  options={statusOptions}
                  placeholder="Select status"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "6px",
                      borderColor: "#E2E8F0",
                    }),
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Position</Form.Label>
                <Form.Control
                  type="text"
                  id="position"
                  value={editJobData.position}
                  onChange={handleEditChange}
                  style={{ color: "#000000" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Office</Form.Label>
                <Select
                  id="office"
                  value={locationOptions.find(option => option.value === editJobData.office) || null}
                  onChange={(selectedOption) => setEditJobData({ ...editJobData, office: selectedOption ? selectedOption.value : "" })}
                  options={locationOptions}
                  placeholder="Select office location"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "6px",
                      borderColor: "#E2E8F0",
                    }),
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Department</Form.Label>
                <Select
                  id="department"
                  value={departmentOptions.find(option => option.value === editJobData.department) || null}
                  onChange={(selectedOption) => setEditJobData({ ...editJobData, department: selectedOption ? selectedOption.value : "" })}
                  options={departmentOptions}
                  placeholder="Select Department"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "6px",
                      borderColor: "#E2E8F0",
                    }),
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Job Type</Form.Label>
                <Select
                  id="jobType"
                  value={jobTypeOptions.find(option => option.value === editJobData.jobType) || null}
                  onChange={(selectedOption) => setEditJobData({ ...editJobData, jobType: selectedOption ? selectedOption.value : "" })}
                  options={jobTypeOptions}
                  placeholder="Full / Part Time"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "6px",
                      borderColor: "#E2E8F0",
                    }),
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Seats</Form.Label>
                <Form.Control
                  type="number"
                  id="seats"
                  min="1"
                  value={editJobData.seats}
                  onChange={handleEditChange}
                  style={{ color: "#000000" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Salary Range From</Form.Label>
                <Form.Control
                  type="number"
                  id="salaryFrom"
                  min="1"
                  value={editJobData.salaryFrom}
                  onChange={handleEditChange}
                  style={{ color: "#000000" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Salary Range To</Form.Label>
                <Form.Control
                  type="number"
                  id="salaryTo"
                  min="1"
                  value={editJobData.salaryTo}
                  onChange={handleEditChange}
                  style={{ color: "#000000" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#000000" }}>Description</Form.Label>
                <style>{chakraStyles}</style>
                <ReactQuill
                  value={editJobData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default JobsPage;