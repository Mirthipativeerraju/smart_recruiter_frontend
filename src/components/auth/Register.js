import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import successGif from "../Animation - 1741411058723.gif"; // Adjust the path to your GIF file

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    company_name: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/org/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setShowModal(true);
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/recruiter");
  };

  // Toggle password visibility handlers
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container py-5">
        <div className="row shadow rounded-3 overflow-hidden bg-white mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="col-md-6 d-none d-md-flex align-items-stretch p-0" style={{ height: "618px" }}>
            <img
              src="https://images.unsplash.com/photo-1486175060817-5663aacc6655"
              alt="Background"
              className="img-fluid h-100 w-100"
              style={{ objectFit: "cover", height: "100%" }}
            />
          </div>

          <div className="col-12 col-md-6 p-5">
            <h2 className="text-center mb-3 fw-bold text-primary">Become A Part Of Smart Recruiter</h2>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Ali"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Company Inc"
                    required
                  />
                </div>
                <div className="col-md-6 position-relative">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="btn position-absolute end-0 translate-middle-y"
                    onClick={togglePasswordVisibility}
                    style={{ zIndex: 10,top: '73%' }}
                  >
                    <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                  </button>
                </div>
                <div className="col-md-6 position-relative">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control pe-5"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Enter password again"
                    required
                  />
                  <button
                    type="button"
                    className="btn position-absolute end-0 translate-middle-y"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ zIndex: 10,top: '73%' }}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                  </button>
                </div>

                {error && (
                  <div className="col-12 mt-2">
                    <div className="alert alert-danger">{error}</div>
                  </div>
                )}

                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                  <p className="text-center mt-2 text-muted">
                    Already have an account?{" "}
                    <Link to="/recruiter" className="text-decoration-none">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

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
              <img
                src={successGif}
                alt="Success Tick"
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "20px auto",
                  display: "block",
                }}
              />
              <h5
                style={{
                  margin: "15px 0",
                  color: "#28a745",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                We've sent an email confirmation! Please Verify
              </h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;