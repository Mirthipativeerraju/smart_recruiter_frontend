import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Button } from "react-bootstrap";
import success from "./Animation - 1741411058723.gif";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select

// Chakra UI-inspired styles (unchanged)
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
    color: #2D3748;
    min-height: 150px;
    overflow-y: auto;
  }
  .ql-toolbar .ql-formats {
    margin-right: 8px;
  }
  .ql-toolbar button {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 4px 8px;
    color: #4A5568;
    transition: all 0.2s;
  }
  .ql-toolbar button.ql-active {
    color: #fff;
    border-color: #3182CE;
  }
  .ql-picker {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    color: #4A5568;
  }
  .ql-picker-options {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .chakra-card {
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: #fff;
  }
`;

const PostJob = () => {
  const [formData, setFormData] = useState({
    position: "",
    office: "",
    department: "",
    jobType: "",
    seats: 1,
    salaryFrom: "",
    salaryTo: "",
    description: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Retrieve userId from localStorage (consistent with Home component)
  const user = localStorage.getItem("user");
  let userId;

  try {
    const parsedUser = user ? JSON.parse(user) : null;
    userId = parsedUser?.userId || null; // Use userId instead of organizationId
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    userId = null;
  }

  // Fetch departments and locations from the profile API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("User ID is missing from user data");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/profiles/by-org/${userId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setDepartments(result.data.departments || []);
          setLocations(result.data.locations || []);
        } else {
          console.error("API Error:", result);
          setError(result.message || "Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error fetching profile data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.position || !formData.office || !formData.department) {
      alert("Please fill all required fields (Position, Office, Department)");
      return;
    }

    if (formData.salaryFrom && formData.salaryTo && parseInt(formData.salaryFrom) > parseInt(formData.salaryTo)) {
      alert("Salary 'from' must be less than or equal to 'to'");
      return;
    }

    if (formData.seats < 1) {
      alert("Seats must be at least 1");
      return;
    }

    try {
      const jobData = { ...formData, organizationId: userId };
      const response = await fetch("http://localhost:5000/api/jobs/create-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Job created successfully:", data.job);
        setShowSuccessModal(true);
      } else {
        alert(data.error || "Error creating job");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setFormData({
      position: "",
      office: "",
      department: "",
      jobType: "",
      seats: 1,
      salaryFrom: "",
      salaryTo: "",
      description: "",
    });
    navigate("/recruiter/dashboard/jobs-page");
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

  // Transform department, location, and job type into the options format for react-select
  const departmentOptions = departments.map((dept) => ({ label: dept, value: dept }));
  const locationOptions = [
    ...locations.map((loc) => ({ label: loc, value: loc })),
    { label: "Multiple Locations", value: "Multiple Locations" },
    { label: "Pan India", value: "Pan India" },
  ];
  const jobTypeOptions = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Remote", value: "Remote Based" },
    { label: "Project Based", value: "Project Based" },
    { label: "Hourly", value: "Hourly" },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container my-5 relative">
      <div className="chakra-card mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4" style={{ color: "#2D3748" }}>
            Create New Job
          </h2>
          <p className="text-center mb-4" style={{ color: "#718096" }}>
            A job represents a new opening, an open position or a vacancy listing.
            Creating a job will allow you to add candidates to that job and advertise it on your career page and job boards.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="position" className="form-label" style={{ color: "#4A5568" }}>
                  Position
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="position"
                  placeholder="Digital Marketing"
                  value={formData.position}
                  onChange={handleChange}
                  style={{ borderRadius: "6px", borderColor: "#E2E8F0" }}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="office" className="form-label" style={{ color: "#4A5568" }}>
                  Office
                </label>
                <Select
                  id="office"
                  value={formData.office ? { label: formData.office, value: formData.office } : null}
                  onChange={(selectedOption) => setFormData({ ...formData, office: selectedOption ? selectedOption.value : "" })}
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
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="department" className="form-label" style={{ color: "#4A5568" }}>
                  Select Department
                </label>
                <Select
                  id="department"
                  value={formData.department ? { label: formData.department, value: formData.department } : null}
                  onChange={(selectedOption) => setFormData({ ...formData, department: selectedOption ? selectedOption.value : "" })}
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
              </div>
              <div className="col-md-6">
                <label htmlFor="jobType" className="form-label" style={{ color: "#4A5568" }}>
                  Job Type
                </label>
                <Select
                  id="jobType"
                  value={formData.jobType ? { label: formData.jobType, value: formData.jobType } : null}
                  onChange={(selectedOption) => setFormData({ ...formData, jobType: selectedOption ? selectedOption.value : "" })}
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
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="seats" className="form-label" style={{ color: "#4A5568" }}>
                  Seats
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="seats"
                  placeholder="1"
                  min="1"
                  value={formData.seats}
                  onChange={handleChange}
                  style={{ borderRadius: "6px", borderColor: "#E2E8F0" }}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="salaryFrom" className="form-label" style={{ color: "#4A5568" }}>
                  Salary Range from
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="salaryFrom"
                  placeholder="60000"
                  min="1"
                  value={formData.salaryFrom}
                  onChange={handleChange}
                  style={{ borderRadius: "6px", borderColor: "#E2E8F0" }}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="salaryTo" className="form-label" style={{ color: "#4A5568" }}>
                  To (max)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="salaryTo"
                  placeholder="1200000"
                  min="1"
                  value={formData.salaryTo}
                  onChange={handleChange}
                  style={{ borderRadius: "6px", borderColor: "#E2E8F0" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label" style={{ color: "#4A5568" }}>
                Description
              </label>
              <style>{chakraStyles}</style>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter your job description"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                style={{
                  background: "#3182CE",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  border: "none",
                  transition: "background 0.2s",
                  fontWeight: "500",
                }}
                onMouseOver={(e) => (e.target.style.background = "#2B6CB0")}
                onMouseOut={(e) => (e.target.style.background = "#3182CE")}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Body 
          className="text-center" 
          style={{ 
            backgroundColor: "#fff",
            padding: "20px", 
            borderRadius: "8px",
            position: "relative" 
          }}
        >
          <span
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              cursor: "pointer",
              fontSize: "24px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            x
          </span>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <img
              src={success}
              alt="Success Tick Mark"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <p 
            className="lead" 
            style={{ 
              color: "black",
              marginBottom: "20px", 
              fontSize: "20px"
            }}
          >
            Job Posted Successfully
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostJob;