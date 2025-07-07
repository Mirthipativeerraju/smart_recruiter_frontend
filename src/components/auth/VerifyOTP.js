import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
  const [inputCode, setInputCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  const { email } = location.state || {}; // Get email from state

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

    fetch("http://localhost:5000/api/admin/fp/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          navigate("/newpassword", { state: { email } });
        } else {
          setError(data.error || "Invalid OTP");
        }
      })
      .catch((error) => {
        setError("Network or server error");
        console.error(error);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8f9fa", padding: "20px" }}>
      <div style={{ padding: "30px", background: "white", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", borderRadius: "8px", textAlign: "center", width: "100%", maxWidth: "400px" }}>
        <h3>Email Verification</h3>
        <p>Enter the 4-digit code sent to your admin email.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            {inputCode.map((code, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                style={{ width: "50px", height: "50px", textAlign: "center", fontSize: "22px", padding: "10px" }}
                value={code}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
              />
            ))}
          </div>
          {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
          <button type="submit" style={{ padding: "12px 25px", background: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;