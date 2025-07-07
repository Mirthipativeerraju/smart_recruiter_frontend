import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import recruiterlogo from "../../images/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Reset success message

    try {
      const response = await fetch("http://localhost:5000/api/org/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        fullName: data.fullName,
        userId: data.userId,
      }));
      
      // Set success message before navigation
      setSuccess("Login successful! Redirecting to dashboard...");
      console.log('Logged in with userId:', data.userId);
      
      // Delay navigation slightly to show success message
      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 1000); // 1 second delay

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row shadow-lg rounded-3 bg-white overflow-hidden">
              <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                <img
                  src={recruiterlogo}
                  width="50%"
                  className="d-block mx-auto mt-3"
                  alt="Logo"
                />
                <form className="mt-4" onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@domain.com"
                      required
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <label className="form-label">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 translate-middle-y"
                      onClick={togglePasswordVisibility}
                      style={{ zIndex: 10, top: '73%' }}
                    >
                      <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                    </button>
                  </div>
                  {error && <p className="text-danger text-center">{error}</p>}
                  {success && <p className="text-success text-center">{success}</p>} {/* Success message display */}
                  <div className="mt-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="keepLogin" />
                      <label className="form-check-label" htmlFor="keepLogin">
                        Keep me logged in
                      </label>
                    </div>
                    <Link to="/forgotpassword" className="text-decoration-none mt-2 mt-md-0">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 border-0"
                      disabled={success !== ""} // Disable button when success message is shown
                    >
                      Login
                    </button>
                  </div>
                </form>
                <hr className="my-4 w-50 mx-auto" />
                <p className="text-center text-secondary">
                  Don't have an account yet?{" "}
                  <Link to="/register" className="ms-2 text-decoration-none text-dark">
                    Signup
                  </Link>
                </p>
              </div>
              <div className="col-md-6 d-none d-md-block p-0">
                <img
                  src="https://www.atheneum.ai/wp-content/uploads/2019/07/Atheneum-Product-Corporate.png"
                  alt="Side visual"
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;