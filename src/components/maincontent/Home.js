// Home.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import img from "../../images/home.svg";

const Home = () => {
  const [profileExists, setProfileExists] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [orgName, setOrgName] = useState(""); // Added to store organization name
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/profiles/by-org/${user.userId}`);
        const profile = response.data.data;

        if (profile) {
          setProfileExists(true);
          setDepartments(profile.departments || []);
          setOrgName(profile.name || ""); // Set organization name from profile
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Check if user is not logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.userId) {
    return (
      <Container className="text-center mt-5">
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Card className="p-4 shadow text-center">
              <h2 className="mt-3">Login Required</h2>
              <p className="mt-3">Please login to access your dashboard</p>
              <Button
                variant="primary"
                className="mt-3 px-3 py-3"
                style={{ fontSize: "1rem" }}
                onClick={() => navigate("/recruiter")}
              >
                Go to Login
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <h3>Loading...</h3>
      </Container>
    );
  }

  if (!profileExists) {
    return (
      <Container className="text-center mt-5">
        <h1 className="fw-bold text-dark">Welcome to Smart Cruiter</h1>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Card className="p-4 shadow text-center">
              <h2 className="mt-3">Start setting up your company account</h2>
              <img
                src={img}
                alt="Setup Company"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <Link to="/recruiter/dashboard/profilecreation">
                <Button variant="primary" className="mt-3 px-4 py-3" style={{ fontSize: "1.2rem" }}>
                  Let's Get Started
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="text-center mt-5">
      <h1 className="fw-bold text-dark">
        Welcome, {orgName}
      </h1>
      {departments.length > 0 && (
        <p className="mt-2" style={{ fontSize: "0.9rem" }}>
          Your organization departments are
        </p>
      )}
      <Row className="justify-content-center mt-4">
        {departments.length > 0 ? (
          departments.map((department, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{department}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No departments found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Home;