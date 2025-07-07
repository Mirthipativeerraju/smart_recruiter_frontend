import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationTabs from "../CandidateNavigation";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";

function SelectionProcessPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem("activeTab");
    const validTabs = ["applied", "interview", "interviewing", "hired", "declined", "withdraw"];
    return storedTab && validTabs.includes(storedTab) ? storedTab : "applied";
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [searchQuery, setSearchQuery] = useState(""); // Search state for non-applied tabs
  const [showFilter, setShowFilter] = useState(false); // State to toggle filters on mobile

  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [sending, setSending] = useState(false);

  const BASE_URL = "https://smart-recruiter-backend.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));
  const organizationId = user?.userId;

  // Filter states (only for "applied" status)
  const [educationFilters, setEducationFilters] = useState({
    "Ph.D": false,
    Postgraduate: false,
    Graduate: false,
    Diploma: false,
    Intermediate: false,
    Matriculation: false,
  });
  const [experience, setExperience] = useState(0);
  const [city, setCity] = useState("");
  const [genderFilters, setGenderFilters] = useState({
    Male: false,
    Female: false,
    Other: false,
  });
  const [majors, setMajors] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [hasLinkedIn, setHasLinkedIn] = useState(false);
  const [hasGitHub, setHasGitHub] = useState(false);
  const [passedOutYear, setPassedOutYear] = useState("");

  const educationLevels = ["Ph.D", "Postgraduate", "Graduate", "Diploma", "Intermediate", "Matriculation"];

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/candidates/job/${jobId}`);
        setCandidates(response.data);
      } catch (err) {
        setError("Error fetching candidates: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) fetchCandidates();
  }, [jobId]);

  useEffect(() => {
    async function fetchTemplates() {
      if (!organizationId) {
        setTemplatesError("No organization ID found. Please log in.");
        setTemplatesLoading(false);
        return;
      }
      try {
        setTemplatesLoading(true);
        setTemplatesError(null);
        const response = await axios.get(
          `${BASE_URL}/api/templates?organizationId=${organizationId}`
        );
        setTemplates(response.data);
      } catch (err) {
        setTemplatesError("Error fetching templates: " + err.message);
      } finally {
        setTemplatesLoading(false);
      }
    }
    fetchTemplates();
  }, [organizationId]);

  const getTopEducationLevel = (education) => {
    if (!education || education.length === 0) return null;
    return education.reduce((top, current) => {
      const topIndex = educationLevels.indexOf(top.level);
      const currentIndex = educationLevels.indexOf(current.level);
      return currentIndex < topIndex ? current : top;
    }).level;
  };

  const displayCandidates = candidates
    .filter((candidate) => candidate.status === activeTab)
    .filter((candidate) => {
      // Apply search only for non-"applied" statuses
      if (activeTab !== "applied" && searchQuery.trim() !== "") {
        const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
        if (!fullName.includes(searchQuery.trim().toLowerCase())) {
          return false;
        }
      }

      // Apply filters only for "applied" status
      if (activeTab === "applied") {
        const selectedEducations = Object.keys(educationFilters).filter(
          (key) => educationFilters[key]
        );
        if (selectedEducations.length > 0) {
          const topEducation = getTopEducationLevel(candidate.education);
          if (!topEducation || !selectedEducations.includes(topEducation)) {
            return false;
          }
        }

        const totalExperience = candidate.experience && candidate.experience.length > 0
          ? candidate.experience.reduce((sum, exp) => sum + (parseInt(exp.duration, 10) || 0), 0)
          : 0;
        if (totalExperience < experience) {
          return false;
        }

        if (city.trim() !== "" && candidate.city) {
          if (!candidate.city.toLowerCase().includes(city.trim().toLowerCase())) {
            return false;
          }
        }

        const selectedGenders = Object.keys(genderFilters).filter(
          (key) => genderFilters[key]
        );
        if (selectedGenders.length > 0 && candidate.gender) {
          if (!selectedGenders.includes(candidate.gender)) {
            return false;
          }
        }

        if (majors.trim() !== "" && candidate.education && candidate.education.length > 0) {
          const candidateMajors = candidate.education.map((edu) => edu.majors?.toLowerCase());
          if (!candidateMajors.some((m) => m?.includes(majors.trim().toLowerCase()))) {
            return false;
          }
        }

        if (zipCode.trim() !== "" && candidate.zipCode) {
          if (!candidate.zipCode.startsWith(zipCode.trim())) {
            return false;
          }
        }

        if (hasLinkedIn && (!candidate.linkedin || candidate.linkedin.trim() === "")) {
          return false;
        }

        if (hasGitHub && (!candidate.github || candidate.github.trim() === "")) {
          return false;
        }

        if (passedOutYear.trim() !== "" && candidate.education && candidate.education.length > 0) {
          const topEducation = candidate.education.reduce((top, current) => {
            const topIndex = educationLevels.indexOf(top.level);
            const currentIndex = educationLevels.indexOf(current.level);
            return currentIndex < topIndex ? current : top;
          });
          const sessionTo = parseInt(topEducation.sessionTo, 10);
          const filterYear = parseInt(passedOutYear, 10);
          if (isNaN(sessionTo) || sessionTo !== filterYear) {
            return false;
          }
        }
      }

      return true;
    });

  const renderFilterUI = () => {
    return (
      <div className="card card-body">
        <h5 className="mb-3">Filter Profiles</h5>
        <div className="mb-3">
          <label className="form-label">Top Education</label>
          {Object.keys(educationFilters).map((level) => (
            <div className="form-check" key={level}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`${level}Checkbox`}
                checked={educationFilters[level]}
                onChange={() =>
                  setEducationFilters((prev) => ({
                    ...prev,
                    [level]: !prev[level],
                  }))
                }
              />
              <label className="form-check-label" htmlFor={`${level}Checkbox`}>
                {level}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label className="form-label">Passed Out Year</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g., 2023"
            value={passedOutYear}
            onChange={(e) => setPassedOutYear(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 5}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Minimum Total Experience (years): {experience}</label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="50"
            step="1"
            value={experience}
            onChange={(e) => setExperience(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          {Object.keys(genderFilters).map((gender) => (
            <div className="form-check" key={gender}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`${gender}Checkbox`}
                checked={genderFilters[gender]}
                onChange={() =>
                  setGenderFilters((prev) => ({
                    ...prev,
                    [gender]: !prev[gender],
                  }))
                }
              />
              <label className="form-check-label" htmlFor={`${gender}Checkbox`}>
                {gender}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label className="form-label">Majors</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Computer Science"
            value={majors}
            onChange={(e) => setMajors(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Zip Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Zip Code prefix"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="linkedinCheckbox"
              checked={hasLinkedIn}
              onChange={() => setHasLinkedIn(!hasLinkedIn)}
            />
            <label className="form-check-label" htmlFor="linkedinCheckbox">
              Has LinkedIn Profile
            </label>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="githubCheckbox"
              checked={hasGitHub}
              onChange={() => setHasGitHub(!hasGitHub)}
            />
            <label className="form-check-label" htmlFor="githubCheckbox">
              Has GitHub Profile
            </label>
          </div>
        </div>
      </div>
    );
  };

  const handleEllipsisClick = (e, candidateId) => {
    e.stopPropagation();
    navigate(`/recruiter/dashboard/candidate/${candidateId}`);
  };

  const handleCardClick = (candidateId) => {
    navigate(`/recruiter/dashboard/candidate/${candidateId}`);
  };

  const handleSendEmail = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCandidates([]);
    setSelectedTemplate(null);
    setInterviewDate("");
    setInterviewTime("");
    setInterviewLink("");
    setSending(false);
  };

  const candidateOptions = displayCandidates.map((candidate) => ({
    value: candidate._id,
    label: `${candidate.firstName} ${candidate.lastName} (${candidate.email || "No Email"})`,
  }));

  const templateOptions = templates.map((template) => ({
    value: template._id,
    label: template.name,
  }));

  const handleSendEmails = async () => {
    if (!selectedCandidates.length || !selectedTemplate) {
      alert("Please select at least one candidate and a template.");
      return;
    }

    if (activeTab === "interview") {
      const hasInterviewDetails = interviewDate || interviewTime || interviewLink;
      if (hasInterviewDetails && !(interviewDate && interviewTime && interviewLink)) {
        alert("Please provide all interview details (date, time, and link) or none at all.");
        return;
      }
    }

    setSending(true);

    try {
      for (const candidate of selectedCandidates) {
        const payload = {
          candidateId: candidate.value,
          templateId: selectedTemplate.value,
        };
        if (activeTab === "interview") {
          payload.interviewDate = interviewDate || undefined;
          payload.interviewTime = interviewTime || undefined;
          payload.interviewLink = interviewLink || undefined;
        }

        const emailResponse = await axios.post(`${BASE_URL}/api/templates/send`, payload);
        console.log(emailResponse.data.message);

        if (activeTab === "interview") {
          await axios.put(`${BASE_URL}/api/candidates/${candidate.value}/status`, {
            status: "interviewing",
            interviewDate: interviewDate || undefined,
            interviewTime: interviewTime || undefined,
            interviewLink: interviewLink || undefined,
          });
        }
      }
      alert("Emails sent successfully!");
      const response = await axios.get(`${BASE_URL}/api/candidates/job/${jobId}`);
      setCandidates(response.data);
      handleCloseModal();
    } catch (err) {
      alert("Failed to send emails: " + (err.response?.data?.error || err.message));
      setSending(false);
    }
  };

  const renderCandidateCard = (candidate) => {
    const totalExperience = candidate.experience && candidate.experience.length > 0
      ? candidate.experience.reduce((sum, exp) => sum + (parseInt(exp.duration, 10) || 0), 0)
      : 0;
    const topEducation = getTopEducationLevel(candidate.education) || "N/A";

    return (
      <div
        key={candidate._id}
        className="card mb-3"
        style={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "center",
          padding: "15px",
          cursor: "pointer",
        }}
        onClick={() => handleCardClick(candidate._id)}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            marginBottom: isMobile ? "15px" : "0",
            marginRight: isMobile ? "0" : "15px",
          }}
        >
          <img
            src={
              candidate.profilePic
                ? `${BASE_URL}/${candidate.profilePic}`
                : "https://via.placeholder.com/100"
            }
            alt={`${candidate.firstName}'s profile`}
            className="rounded-circle"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100";
            }}
          />
        </div>

        <div
          className="card-body"
          style={{ flex: 1, width: isMobile ? "100%" : "auto" }}
        >
          {isMobile ? (
            <>
              <div className="text-center mb-2">
                <span className="badge bg-secondary" style={{ color: "white" }}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>
              <h5 className="card-title text-center mb-3" style={{ color: "black" }}>
                {candidate.firstName} {candidate.lastName}
              </h5>
              <div className="d-flex flex-column align-items-center">
                <button
                  className="btn btn-sm btn-outline-primary mb-2 px-3 py-2 w-100"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  Top Education: <br /> {topEducation}
                </button>
                <button
                  className="btn btn-sm btn-outline-info mb-2 px-3 py-2 w-100"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  Total Experience: <br /> {totalExperience} years
                </button>
                <button
                  className="btn btn-sm btn-outline-success mb-2 px-3 py-2 w-100"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  City: <br /> {candidate.city || "N/A"}
                </button>
                {(candidate.status === "interview" || candidate.status === "interviewing") && (
                  <button
                    className="btn btn-sm btn-outline-warning mb-2 px-3 py-2 w-100"
                    style={{ color: "black", fontWeight: "bold" }}
                    disabled
                  >
                    Interview: <br />
                    {candidate.interviewDate
                      ? `${new Date(candidate.interviewDate).toLocaleDateString()} ${
                          candidate.interviewTime || ""
                        }`
                      : "Not Scheduled"}
                    {candidate.interviewLink && (
                      <>
                        <br />
                        <a href={candidate.interviewLink} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </>
                    )}
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-success px-3 py-2"
                  style={{ color: "black", width: "35%" }}
                  onClick={(e) => handleEllipsisClick(e, candidate._id)}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0" style={{ color: "black" }}>
                  {candidate.firstName} {candidate.lastName}
                </h5>
                <span className="badge bg-secondary" style={{ color: "white" }}>
                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-outline-primary me-4 px-3 py-2 w-25"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  Top Education: <br /> {topEducation}
                </button>
                <button
                  className="btn btn-sm btn-outline-info me-4 px-3 py-2 w-25"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  Total Experience: <br /> {totalExperience} years
                </button>
                <button
                  className="btn btn-sm btn-outline-success me-4 px-3 py-2 w-25"
                  style={{ color: "black", fontWeight: "bold" }}
                  disabled
                >
                  City: <br /> {candidate.city || "N/A"}
                </button>
                {(candidate.status === "interview" || candidate.status === "interviewing") && (
                  <button
                    className="btn btn-sm btn-outline-warning me-4 px-3 py-2 w-25"
                    style={{ color: "black", fontWeight: "bold" }}
                    disabled
                  >
                    Interview: <br />
                    {candidate.interviewDate
                      ? `${new Date(candidate.interviewDate).toLocaleDateString()} ${
                          candidate.interviewTime || ""
                        }`
                      : "Not Scheduled"}
                    {candidate.interviewLink && (
                      <>
                        <br />
                        <a href={candidate.interviewLink} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </>
                    )}
                  </button>
                )}
                <button
                  className="btn btn-sm me-4 px-3 py-2"
                  style={{ color: "black" }}
                  onClick={(e) => handleEllipsisClick(e, candidate._id)}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />
      <div className="row">
        {activeTab === "applied" && (
          isMobile ? (
            <div className="col-12 mb-3">
              <button
                className="btn btn-secondary w-100 mb-2"
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? "Hide Filters" : "Show Filters"}
              </button>
              {showFilter && renderFilterUI()}
            </div>
          ) : (
            <div className="col-md-3">{renderFilterUI()}</div>
          )
        )}
        <div className={isMobile || activeTab !== "applied" ? "col-12" : "col-md-9"}>
          <div className={`mb-3 d-flex ${isMobile ? "flex-column" : "justify-content-between align-items-center"}`}>
            {activeTab !== "applied" && (
              <div className={`input-group ${isMobile ? "mb-2" : ""}`} style={{ maxWidth: "300px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by candidate name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            )}
            {!loading && !error && displayCandidates.length > 0 && (
              <button className="btn btn-primary" onClick={handleSendEmail}>
                <i className="bi bi-envelope me-2"></i>
                Send Email
              </button>
            )}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">Error: {error}</div>
          ) : displayCandidates.length === 0 ? (
            <p>
              No candidates found for the "{activeTab}" status
              {activeTab === "applied" ? " with applied filters" : ""}.
            </p>
          ) : (
            <div className="candidate-list">
              {displayCandidates.map(renderCandidateCard)}
            </div>
          )}
        </div>
      </div>

      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-body text-dark"
              style={{ backgroundColor: "white", borderRadius: "10px", border: "none" }}
            >
              <button
                type="button"
                className="btn-close float-end"
                onClick={handleCloseModal}
              ></button>
              <div className="text-center mb-4">
                <h5>Send Email</h5>
              </div>
              <div className="mb-3">
                <label className="form-label">Select Candidates</label>
                <Select
                  isMulti
                  options={candidateOptions}
                  value={selectedCandidates}
                  onChange={setSelectedCandidates}
                  placeholder="Select candidates..."
                  isDisabled={sending}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Select Template</label>
                {templatesLoading ? (
                  <p>Loading templates...</p>
                ) : templatesError ? (
                  <p className="text-danger">{templatesError}</p>
                ) : templates.length === 0 ? (
                  <p>No templates available for your organization.</p>
                ) : (
                  <Select
                    options={templateOptions}
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                    placeholder="Select a template..."
                    isDisabled={sending}
                  />
                )}
              </div>
              {activeTab === "interview" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Interview Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      disabled={sending}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      disabled={sending}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      placeholder="e.g., https://zoom.us/j/123456789"
                      disabled={sending}
                    />
                  </div>
                </>
              )}
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={handleSendEmails}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectionProcessPage;
