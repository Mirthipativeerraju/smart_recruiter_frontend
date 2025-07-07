import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Form, Button, InputGroup, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import "./UserRegister.css";

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOtpChange = (e, idx) => {
    const { value } = e.target;
    if (value.length > 1) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[idx] = value;
      return newOtp;
    });

    if (value && idx < otp.length - 1) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
  };

  // This will handle OTP sending and verification from backend
  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://smart-recruiter-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setShowOtpInput(true); // Show OTP input
        setLoading(false);
      } else {
        setError(data.error || "Error sending OTP");
        setLoading(false);
      }
    } catch (error) {
      setError("Error sending OTP.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const otpInput = otp.join("");
      const response = await fetch("https://smart-recruiter-backend.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpInput }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setIsEmailVerified(true); // OTP is verified
        setError("");
        setLoading(false);
        console.log("OTP verified successfully");
      } else {
        setError(data.error || "Invalid OTP.");
        setLoading(false);
      }
    } catch (error) {
      setError("Error verifying OTP.");
      setLoading(false);
    }
  };

  const isFormComplete = () => {
    return (
      formData.fullname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirm_password.trim() !== "" &&
      formData.password === formData.confirm_password &&
      isEmailVerified
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError("Please verify your email first.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (!isFormComplete()) {
      setError("Please fill out all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://smart-recruiter-backend.onrender.com/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setShowModal(true); // Show success modal
        setLoading(false);
      } else {
        setError(data.error || "Error completing registration.");
        setLoading(false);
      }
    } catch (error) {
      setError("Error completing registration.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar isLoggedIn={false} />
      <Container className="register-container mt-5 pb-5 flex-grow-1 d-flex justify-content-center" fluid>
        <div className="register-box">
          <h2 className="register-title text-center">Register with JobFinder</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName" className="mb-4">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="register-input"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="register-input"
                  required
                  disabled={isEmailVerified}
                />
                {!isEmailVerified && (
                  <Button
                    variant="outline-primary"
                    onClick={handleVerifyEmail}
                    disabled={loading || !formData.email}
                    className="verify-button"
                  >
                    {loading ? "Sending..." : "Verify"}
                  </Button>
                )}
              </InputGroup>
            </Form.Group>

            {showOtpInput && !isEmailVerified && (
              <Form.Group controlId="formOtp" className="mb-4">
                <Form.Label className="fw-semibold mb-3">Enter OTP</Form.Label>
                <div className="d-flex justify-content-center gap-4 mb-3">
                  {otp.map((digit, idx) => (
                    <Form.Control
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      className="otp-input text-center"
                      required
                    />
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length !== 4}
                  className="w-100 verify-button"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Form.Group>
            )}

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="register-input"
                  required
                />
                <InputGroup.Text onClick={togglePasswordVisibility} className="toggle-password">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-4">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="register-input"
                  required
                />
                <InputGroup.Text onClick={togglePasswordVisibility} className="toggle-password">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <Button
              variant="primary"
              type="submit"
              className="register-button w-100 text-uppercase fw-semibold"
              disabled={loading || !isFormComplete()}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account?{" "}
                <Link to="/userlogin" className="login-link fw-semibold">
                  Login
                </Link>
              </p>
            </div>
          </Form>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Account Created Successfully</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="lead">Your account has been created successfully!</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => navigate("/userlogin")}>
                Login
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Register;
