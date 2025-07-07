import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

function NPassword() {
  const { state } = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

    fetch("https://smart-recruiter-backend.onrender.com/api/fp/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.email, newPassword: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Password updated successfully!");
          navigate("/userlogin");
        } else {
          setError(data.error || "Error updating password");
        }
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <NavigationBar />

      <div className="d-flex justify-content-center align-items-center flex-grow-1 mt-5">
        <div
          className="card shadow-lg p-4 d-flex justify-content-center align-items-center"
          style={{
            maxWidth: "350px",
            width: "100%",
            minHeight: "300px",
            height: "auto",
            background: "#fff",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          <div className="card-body text-center">
            <h3 className="fw-bold text-dark">Enter New Password</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start position-relative">
                <label className="fw-bold">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control pe-5"
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 10,top: '70%' }}
                >
                  <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                </button>
              </div>
              <div className="mb-3 text-start position-relative">
                <label className="fw-bold">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="form-control pe-5"
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 translate-middle-y"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ zIndex: 10,top: '70%' }}
                >
                  <i className={`bi bi-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                </button>
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NPassword;
