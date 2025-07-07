import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Toast, Alert } from 'react-bootstrap';
import CreateTemplateModal from './CreateTemplateModal';
import axios from 'axios';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null); // Track template to edit
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const organizationId = user.userId; // Use organizationId if available, fallback to userId

  useEffect(() => {
    if (organizationId) {
      fetchTemplates();
    } else {
      setError('You must be logged in with an organization to view templates.');
    }
  }, [organizationId]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`https://smart-recruiter-backend.onrender.com/api/templates?organizationId=${organizationId}`);
      setTemplates(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching templates:', error.response?.data || error.message);
      setError('Failed to load templates. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`https://smart-recruiter-backend.onrender.com/api/templates/${id}`);
        setTemplates(templates.filter(t => t._id !== id));
        setToastMessage('Template deleted!');
        setShowToast(true);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleTemplateCreated = () => {
    fetchTemplates();
    setShowModal(false);
    setEditTemplate(null); // Reset edit template
    setToastMessage('Template saved!');
    setShowToast(true);
  };

  const openCreateModal = () => {
    setEditTemplate(null); // Ensure no template is passed for create
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setEditTemplate(template); // Pass the template to edit
    setShowModal(true);
  };

  if (error) {
    return (
      <div className="p-3">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-black">Templates</h2>
        <Button variant="primary" onClick={openCreateModal} disabled={!organizationId}>
          Create Template
        </Button>
      </div>
      <Row>
        {templates.map(template => (
          <Col key={template._id} xs={12} md={6} lg={4} className="mb-3">
            <Card className="shadow-sm h-100" style={{ transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <Card.Body>
                <Card.Title className="text-black">{template.name}</Card.Title>
                <Card.Text className="text-black">
                  Database: {Array.isArray(template.database) ? template.database.join(', ') : template.database}
                </Card.Text>
                <Card.Text className="text-black">Last Modified: {new Date(template.lastModified).toLocaleDateString()}</Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={() => openEditModal(template)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(template._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <CreateTemplateModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditTemplate(null); // Reset on close
        }}
        onSave={handleTemplateCreated}
        template={editTemplate}
      />
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{ position: 'fixed', top: 20, right: 20 }}
      >
        <Toast.Header>
          <strong className="me-auto text-black">Notification</strong>
        </Toast.Header>
        <Toast.Body className="text-black">{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default TemplateList;
