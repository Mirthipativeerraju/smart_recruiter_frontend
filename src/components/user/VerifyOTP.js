import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

function VOTP() {
  const { state } = useLocation();
  const [inputCode, setInputCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, idx) => {
    const { value } = e.target;
    if (value.length > 1) return;

    setInputCode((prev) => {
      const newCode = [...prev];
      newCode[idx] = value;
      return newCode;
    });

    if (value && idx < inputCode.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !inputCode[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputCode.join("");
    // Verify OTP with the backend
    fetch("http://localhost:5000/api/fp/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          // Navigate to new password screen
          navigate("/usernewpassword", { state: { email: state.email } });
        } else {
          alert("Invalid OTP");
        }
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <NavigationBar />

      <div
        className="d-flex justify-content-center align-items-center flex-grow-1"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "350px",
            width: "100%",
            minHeight: "250px",
            height: "auto",
          }}
        >
          <div className="card-body text-center">
            <h3 className="fw-bold text-dark">Email Verification</h3>
            <p className="text-muted">Enter the 4-digit code sent to your email.</p>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {inputCode.map((code, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    value={code}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "22px",
                      padding: "10px",
                    }}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ padding: "12px 25px", fontSize: "16px" }}>
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default VOTP;
