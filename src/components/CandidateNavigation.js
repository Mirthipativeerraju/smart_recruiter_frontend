import React from "react";
import Select from "react-select";
import "bootstrap-icons/font/bootstrap-icons.css";

const CandidateNavigation = ({ activeTab, setActiveTab, isMobile }) => {
  const statusOptions = [
    { value: "applied", label: "Applied Candidates" },
    { value: "interview", label: "Interview" },
    { value: "interviewing", label: "Interviewing" },
    { value: "hired", label: "Hired" },
    { value: "declined", label: "Declined" },
    { value: "withdraw", label: "Withdraw" },
  ];

  const customSelectStyles = {
    container: (provided) => ({
      ...provided,
      width: "80%",
      margin: "0 auto",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "50px",
      fontSize: "1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "1rem",
    }),
  };

  const renderNavigation = () => {
    if (isMobile) {
      return (
        <div className="my-3">
          <Select
            value={statusOptions.find((opt) => opt.value === activeTab)}
            onChange={(selectedOption) => setActiveTab(selectedOption.value)}
            options={statusOptions}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>
      );
    } else {
      return (
        <div
          className="d-flex my-3"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "10px", // Reduced padding to save space
            borderRadius: "8px",
            justifyContent: "space-between", // Changed to space-between for even distribution
            alignItems: "center",// Prevent wrapping to ensure single line
          }}
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              style={{
                backgroundColor:
                  activeTab === option.value ? "#28a745" : "#0d6efd", // Green for active, blue for inactive
                color: "white",
                border: "none",
                fontFamily: "Times New Roman",
                fontSize: "1.4rem", // Reduced font size from default to fit more buttons
                padding: "8px 12px", // Reduced padding for compactness
                margin: "0 5px", // Reduced margin to fit buttons closer together
                flex: "1 1 auto", // Allow buttons to shrink if needed
                minWidth: "100px", // Ensure a minimum width for readability
                transition: "background-color 0.3s ease", // Smooth transition for color change
              }}
              className={`btn ${
                activeTab === option.value ? "active" : ""
              }`}
              onClick={() => setActiveTab(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }
  };

  return <>{renderNavigation()}</>;
};

export default CandidateNavigation;