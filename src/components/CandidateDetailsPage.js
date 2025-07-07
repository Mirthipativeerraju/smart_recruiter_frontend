import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select"; // Import react-select

function CandidateDetailsPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const BASE_URL = "http://localhost:5000";

  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "interview", label: "Interview" },
    { value: "hired", label: "Hired" },
    { value: "declined", label: "Declined" },
  ];

  useEffect(() => {
    async function fetchCandidate() {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/candidates/${candidateId}`);
        console.log("API Response:", response.data);
        setCandidate(response.data);
        setStatus(response.data.status);
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Error fetching candidate: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidate();
  }, [candidateId]);

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/candidates/${candidateId}/status`, { status });
      setCandidate((prev) => ({ ...prev, status }));
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Error updating status: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(`${BASE_URL}/api/candidates/${candidateId}`);
        const jobId = candidate.jobId?._id && typeof candidate.jobId._id === "string" ? candidate.jobId._id : "";
        navigate(jobId ? `/recruiter/dashboard/selection/${jobId}` : "/recruiter/dashboard");
      } catch (err) {
        console.error("Error deleting candidate:", err);
        setError("Error deleting candidate: " + err.message);
      }
    }
  };

  const handleViewResume = () => {
    if (candidate.resume) {
      window.open(`${BASE_URL}/${candidate.resume}`, "_blank");
    } else {
      alert("No resume available.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;
  if (!candidate) return <div>No candidate found.</div>;

  // Extract jobId from candidate.jobId._id safely
  const jobId = candidate.jobId?._id && typeof candidate.jobId._id === "string" ? candidate.jobId._id : null;
  console.log("Extracted jobId:", jobId);

  // Check if interview details are available
  const hasInterviewDetails = candidate.interviewDate || candidate.interviewTime || candidate.interviewLink;

  // Handle status change for react-select
  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption ? selectedOption.value : "");
  };

  // Find the selected option for react-select
  const selectedStatusOption = statusOptions.find(option => option.value === status);

  return (
    <div className="container mt-4">
      {/* Navigation Link with Safe jobId */}
      <div className="mb-3">
        <Link
          to={jobId ? `/recruiter/dashboard/selection/${jobId}` : "/recruiter/dashboard"}
          className="btn btn-outline-primary"
        >
          <i className="bi bi-arrow-left"></i> Back to Candidates
        </Link>
      </div>

      <div className="row">
        <div className="col-md-4 order-md-2 order-1">
          <div className="card mb-3">
            <div className="card-body">
              <h5>Update Status</h5>
              <div className="mb-3">
                <Select
                  options={statusOptions}
                  value={selectedStatusOption}
                  onChange={handleStatusChange}
                  placeholder="Select status..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <button className="btn btn-primary w-100 mb-2" onClick={handleStatusUpdate}>
                Update Status
              </button>
              <button className="btn btn-danger w-100" onClick={handleDelete}>
                Delete Candidate
              </button>
            </div>
          </div>

          {/* Interview Details Card (shown only if details are available) */}
          {hasInterviewDetails && (
            <div className="card mb-3">
              <div className="card-body">
                <h5>Interview Details</h5>
                <p>
                  <strong>Date:</strong>{" "}
                  {candidate.interviewDate
                    ? new Date(candidate.interviewDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Time:</strong> {candidate.interviewTime || "N/A"}
                </p>
                <p>
                  <strong>Link:</strong>{" "}
                  {candidate.interviewLink ? (
                    <a href={candidate.interviewLink} target="_blank" rel="noopener noreferrer">
                      {candidate.interviewLink}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="card mb-3">
            <div className="card-body">
              <h5>Address</h5>
              <p>
                {candidate.address || "N/A"}
                {candidate.city && `, ${candidate.city}`}
                {candidate.zipCode && `, ${candidate.zipCode}`}
              </p>
              <button className="btn btn-outline-success w-100" onClick={handleViewResume}>
                View Resume
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8 order-md-1 order-2">
          <div className="card mb-3">
            <div className="card-body d-flex flex-column flex-md-row align-items-center">
              <div className="me-md-3 mb-3 mb-md-0">
                <img
                  src={
                    candidate.profilePic
                      ? `${BASE_URL}/${candidate.profilePic}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={`${candidate.firstName}'s profile`}
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
              </div>
              <div>
                <h3>
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p>
                  <strong>Email:</strong> {candidate.email}
                </p>
                <p>
                  <strong>Phone:</strong> {candidate.phone || "N/A"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {candidate.dob ? new Date(candidate.dob).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {candidate.gender || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5>Education</h5>
              {candidate.education && candidate.education.length > 0 ? (
                candidate.education.map((edu, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>{edu.level}</strong> in {edu.majors} - {edu.institute}
                    </p>
                    <p>
                      {edu.sessionFrom} - {edu.sessionTo}
                    </p>
                  </div>
                ))
              ) : (
                <p>No education details provided.</p>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5>Professional Experience</h5>
              {candidate.experience && candidate.experience.length > 0 ? (
                candidate.experience.map((exp, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>{exp.title}</strong> - {exp.company}
                    </p>
                    <p>Duration: {exp.duration} years</p>
                  </div>
                ))
              ) : (
                <p>No experience details provided.</p>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5>Social Handles</h5>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {candidate.linkedin ? (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                    {candidate.linkedin}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                {candidate.github ? (
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer">
                    {candidate.github}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailsPage;