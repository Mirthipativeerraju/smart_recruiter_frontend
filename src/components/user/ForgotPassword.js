import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function FPassword() {
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
      fetch("http://localhost:5000/api/fp/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.message) {
            // Navigate to OTP verification page
            navigate("/userverifyotp", { state: { email } });
          } else {
            setError(data.error || "An error occurred");
          }
        })
        .catch((error) => {
          setLoading(false);
          setError("Network or server error");
        });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <NavigationBar />
      <div className="d-flex flex-grow-1 justify-content-center align-items-center mt-5 pt-5">
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "370px",
            width: "100%",
            minHeight: "250px",
            height: "auto",
          }}
        >
          <div className="card-body text-center">
            <h2 className="fw-bold text-dark">Forgot Password?</h2>
            <p className="text-muted">Enter your email to reset your password.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label text-dark">Email</label>
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
              <Link to="/userlogin" className="text-decoration-none text-dark">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FPassword;
