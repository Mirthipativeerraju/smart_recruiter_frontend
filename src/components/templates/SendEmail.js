import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const SendEmail = () => {
  const [candidates, setCandidates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [candidateId, setCandidateId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminId = user.userId;

  useEffect(() => {
    fetchCandidates();
    fetchTemplates();
  }, [adminId]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/candidates');
      setCandidates(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates. Please check if the server is running and the endpoint exists.');
    }
  };

  const fetchTemplates = async () => {
    if (!adminId) {
      setError('Admin ID not found. Please log in.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/templates?adminId=${adminId}`);
      setTemplates(response.data.filter(t => t.database === 'Candidates'));
      setError('');
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please check server logs.');
    }
  };

  const updatePreview = () => {
    if (!candidateId || !templateId) {
      setPreview('');
      return;
    }
    const candidate = candidates.find(c => c._id === candidateId);
    const template = templates.find(t => t._id === templateId);
    if (candidate && template) {
      let content = template.content
        .replace('{candidate_firstName}', candidate.firstName || 'N/A')
        .replace('{candidate_lastName}', candidate.lastName || 'N/A')
        .replace('{candidate_email}', candidate.email || 'N/A')
        .replace('{candidate_phone}', candidate.phone || 'N/A')
        .replace('{candidate_dob}', candidate.dob || 'N/A')
        .replace('{candidate_gender}', candidate.gender || 'N/A')
        .replace('{candidate_address}', candidate.address || 'N/A')
        .replace('{candidate_city}', candidate.city || 'N/A')
        .replace('{candidate_zipCode}', candidate.zipCode || 'N/A')
        .replace('{candidate_appliedAt}', candidate.appliedAt || 'N/A')
        .replace('{interview_date}', new Date().toLocaleDateString())
        .replace('{job_position}', candidate.jobId?.position || 'N/A');
      setPreview(content);
    }
  };

  const handleSend = async () => {
    if (!candidateId || !templateId) {
      setError('Please select a candidate and template.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/templates/send', { candidateId, templateId });
      const candidate = candidates.find(c => c._id === candidateId);
      setMessage(`Email sent successfully to ${candidate?.firstName} ${candidate?.lastName}!`);
      setCandidateId('');
      setTemplateId('');
      setPreview('');
      setError('');
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      setMessage('');
      setError('Failed to send email: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(updatePreview, [candidateId, templateId]);

  return (
    <div className="p-3">
      <h2 className="text-black">Send Email</h2>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="text-black">Candidate</Form.Label>
          <Form.Select value={candidateId} onChange={e => setCandidateId(e.target.value)}>
            <option value="">Select Candidate</option>
            {candidates.map(c => (
              <option key={c._id} value={c._id}>
                {c.firstName} {c.lastName} - ID: {c._id}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-black">Template</Form.Label>
          <Form.Select value={templateId} onChange={e => setTemplateId(e.target.value)}>
            <option value="">Select Template</option>
            {templates.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-black">Preview</Form.Label>
          <Form.Control as="textarea" rows={5} value={preview} readOnly className="text-black" />
        </Form.Group>
        <Button variant="primary" onClick={handleSend} disabled={!candidateId || !templateId}>
          Send
        </Button>
      </Form>
      {message && (
        <Alert variant={message.includes('success') ? 'success' : 'danger'} className="mt-3">
          {message}
        </Alert>
      )}
    </div>
  );
};

export default SendEmail;