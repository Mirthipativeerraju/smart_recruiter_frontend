import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import profileicon from "../../images/profileIcon.png";  
import teamicon from "../../images/teamIcon.png";
import templateicon from "../../images/templeteIcon.png";

function SettingsPage() {
  return (
    <Container className="mt-4">
      <Row className="g-3 justify-content-center">
        {/* Edit Profile Card */}
        <Col xs={12} sm={4}>
          <Link to="../edit-profile" className="text-decoration-none">
            <Card className="text-center p-3 shadow-sm">
              <Card.Img variant="top" src={profileicon} className="mx-auto" style={{ width:"100px" }} />
              <Card.Body>
                <Card.Title>Edit Profile</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        {/* Templates Card */}
        <Col xs={12} sm={4}>
          <Link to="../templates" className="text-decoration-none">
            <Card className="text-center p-3 shadow-sm">
              <Card.Img variant="top" src={templateicon} className="mx-auto" style={{ width:"100px" }} />
              <Card.Body>
                <Card.Title>Templates</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default SettingsPage;
