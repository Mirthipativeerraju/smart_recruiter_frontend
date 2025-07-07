import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPwd) {
      setError("*Both fields are required");
      return;
    }
    if (password !== confirmPwd) {
      setError("*Passwords must match");
      return;
    }

    fetch("https://smart-recruiter-backend.onrender.com/api/admin/fp/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Password updated successfully!");
          navigate("/recruiter");
        } else {
          setError(data.error || "An error occurred");
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
        <h3 style={{ marginBottom: "15px" }}>Enter New Password</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", paddingRight: "40px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button
              type="button"
              style={{ position: "absolute", right: "10px", top: "70%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
          <div style={{ marginBottom: "20px", textAlign: "left", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              style={{ width: "100%", padding: "10px", paddingRight: "40px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button
              type="button"
              style={{ position: "absolute", right: "10px", top: "70%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`bi bi-eye${showConfirmPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
          {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: "12px", background: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
