// SuccessPopup.js
import React, { useState } from "react";
import success from "./Animation - 1741411058723.gif";

function SuccessPopup() {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  // Handler for submit button
  const handleSubmit = () => {
    setShowModal(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f2f5"
    }}>
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Submit
      </button>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Close Button */}
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
              }}
              onClick={handleCloseModal}
            >
              ×
            </button>

            {/* Tick Mark GIF */}
            <img
              src={success}
              alt="Success Tick"
              style={{
                width: "100px",
                height: "100px",
                margin: "20px auto",
                display: "block",
              }}
            />

            {/* Success Message */}
            <h5 style={{ 
              margin: "15px 0", 
              color: "#28a745",
              fontFamily: "Arial, sans-serif",
            }}>
              Success!
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuccessPopup;