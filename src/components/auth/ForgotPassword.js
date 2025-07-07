import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("*Email is required");
    } else {
      setError(null);
      setLoading(true);

      // Send OTP request to the backend
      fetch("http://localhost:5000/api/admin/fp/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message) {
            // Navigate to OTP verification page with email in state
            navigate("/otpverification", { state: { email } });
          } else {
            setError(data.error || "An error occurred");
          }
        })
        .catch((error) => {
          setLoading(false);
          setError("Network or server error");
          console.error(error);
        });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow" style={{ maxWidth: "500px", width: "100%", padding: "20px" }}>
        <div className="card-body text-center p-4">
          <h2 className="fw-bold text-dark">Forgot Password?</h2>
          <p className="text-muted">Enter your admin email to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <div className="text-danger mt-1">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div className="mt-3">
            <Link to="/recruiter" className="text-decoration-none">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;