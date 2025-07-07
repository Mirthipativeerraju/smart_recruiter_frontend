import React, { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else if (!data.fullName || !data.userId) {
        setError("Invalid response from server: Missing fullName or userId.");
      } else {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('userId', data.userId);
        window.dispatchEvent(new Event('loginStatusChanged'));
        
        setEmail("");
        setPassword("");
        navigate('/');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <Container
        className="login-container mt-4 flex-grow-1 d-flex align-items-center justify-content-center"
        fluid
      >
        <div className="login-box shadow-lg">
          <h2 className="login-title text-center">Login to JobFinder</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="login-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-2">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="login-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup.Text
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <div className="text-end mb-4">
              <a href="/userforgotpassword" className="forgot-password-link fw-semibold">
                Forgot Password?
              </a>
            </div>

            {error && <div className="text-danger mb-3">{error}</div>}

            <Button
              variant="primary"
              type="submit"
              className="login-button w-100 text-uppercase fw-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Don’t have an account?{" "}
              <a href="/UserRegister" className="create-account-link fw-semibold">
                Create Now
              </a>
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Login;