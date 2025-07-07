import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';
import Quill from 'quill';
import Mention from 'quill-mention';
import Select from 'react-select';
import axios from 'axios';

// Register the mention module with Quill
Quill.register('modules/mention', Mention);

const CreateTemplateModal = ({ show, onHide, onSave, template }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [databases, setDatabases] = useState([]);
  const [content, setContent] = useState(''); // This will store HTML content
  const [error, setError] = useState('');
  const quillRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const organizationId = user?.userId; // Use organizationId if available, fallback to userId
  const adminId = user?.userId; // Assuming adminId is the userId; adjust if different

  useEffect(() => {
    if (show) {
      if (template) {
        setName(template.name || '');
        setDatabases(
          Array.isArray(template.database)
            ? template.database.map(db => ({ value: db, label: db }))
            : template.database ? [{ value: template.database, label: template.database }] : []
        );
        setContent(template.content || ''); // Expecting content to be HTML
      } else {
        setName('');
        setDatabases([]);
        setContent('');
      }
      setError('');
      setStep(1);
    }
  }, [show, template]);

  const placeholders = {
    Candidates: [
      'candidate_firstName', 'candidate_lastName', 'candidate_email', 'candidate_phone',
      'candidate_dob', 'candidate_gender', 'candidate_address', 'candidate_city', 'candidate_zipCode',
      'candidate_appliedAt', 'interview_date', 'interview_time', 'interview_link'
    ],
    Job: [
      'job_position', 'job_office', 'job_department', 'job_jobType',
      'job_salaryFrom', 'job_salaryTo', 'job_status'
    ],
    Admin: [
      'admin_fullname', 'admin_email', 'admin_company_name'
    ],
  };

  const databaseOptions = [
    { value: 'Candidates', label: 'Candidates' },
    { value: 'Job', label: 'Job' },
    { value: 'Admin', label: 'Organisation' },
  ];

  const validatePlaceholders = (html) => {
    const regex = /\{([^}]+)\}/g;
    const matches = html.match(regex) || [];
    const allowedPlaceholders = databases.flatMap(db => placeholders[db.value] || []);
    const invalid = matches.some(placeholder => 
      !allowedPlaceholders.includes(placeholder.slice(1, -1))
    );
    if (invalid) {
      setError(`Unsupported placeholder detected. Use only: ${allowedPlaceholders.map(p => `{${p}}`).join(', ')}`);
      return false;
    } else {
      setError('');
      return true;
    }
  };

  useEffect(() => {
    if (step === 2 && content) {
      validatePlaceholders(content); // Validate HTML content
    } else if (step === 2 && !content) {
      setError('Content cannot be empty');
    }
  }, [content, databases, step]);

  const handleSave = async () => {
    if (!organizationId || !adminId) {
      setError('You must be logged in as an organization to save a template.');
      return;
    }

    const quillEditor = quillRef.current.getEditor();
    let htmlContent = quillEditor.root.innerHTML.trim(); // Get HTML content directly

    htmlContent = htmlContent.replace(/ {2,}/g, (match) => {
      return match.split('').map(() => '&nbsp;').join('');
    });
  
    console.log('Processed HTML content before saving:', htmlContent);


    if (!htmlContent || htmlContent === '<p><br></p>') {
      setError('Content cannot be empty');
      return;
    }

    if (!validatePlaceholders(htmlContent)) return;

    try {
      const databaseArray = databases.map(db => db.value);
      const data = { name, database: databaseArray, content: htmlContent, adminId, organizationId };
      console.log('Data being sent to backend:', data);
      if (template) {
        await axios.put(`http://localhost:5000/api/templates/${template._id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/templates', data);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error('Error saving template:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to save template. Please try again.');
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [['bold', 'italic', 'underline'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]],
    mention: {
      allowedChars: /^[A-Za-z_]*$/,
      mentionDenotationChars: ['{'],
      source: (searchTerm, renderList) => {
        const allowedPlaceholders = databases.flatMap(db => placeholders[db.value] || []);
        if (searchTerm.length === 0) {
          renderList(allowedPlaceholders.map(value => ({ id: value, value })), searchTerm);
        } else {
          const matches = allowedPlaceholders
            .filter(value => value.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(value => ({ id: value, value }));
          renderList(matches, searchTerm);
        }
      },
      renderItem: (item) => `{${item.value}}`,
      blotName: 'mention',
      dataAttributes: ['id', 'value'],
      onSelect: (item, insertItem) => {
        // Insert the full placeholder with opening and closing braces
        const fullPlaceholder = `{${item.id}}`;
        insertItem({ id: item.id, value: fullPlaceholder, denotationChar: '' });
        // Move cursor after the inserted placeholder
        const quillEditor = quillRef.current.getEditor();
        setTimeout(() => {
          const cursorPosition = quillEditor.getSelection()?.index || 0;
          quillEditor.setSelection(cursorPosition + fullPlaceholder.length);
        }, 0);
      },
    },
  }), [databases]);

  return (
    <>
      <style>{`
        .ql-mention-list-container,
        .ql-mention-list-container li {
          color: black !important;
          background-color: white !important;
        }
        .quill-editor-container {
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }
        .ql-container {
          height: 100%;
          min-height: 450px;
        }
        .ql-editor {
          min-height: 400px;
        }
      `}</style>
      <Modal show={show} onHide={onHide} size={step === 2 ? 'lg' : 'md'} centered>
        <Modal.Header closeButton className="bg-light border-0">
          <Modal.Title className="text-black">
            {template ? 'Edit Template' : 'Create New Template'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-light">
          {step === 1 && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Template Name / Email Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Offer Letter"
                  className="border-1 border-light rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Target Databases</Form.Label>
                <Select
                  isMulti
                  options={databaseOptions}
                  value={databases}
                  onChange={setDatabases}
                  placeholder="Select Databases"
                  className="text-dark basic-multi-select"
                  classNamePrefix="select"
                />
              </Form.Group>
            </Form>
          )}
          {step === 2 && (
            <div>
              <p className="text-black mb-3">
                {`Available Placeholders: ${
                  databases.length > 0
                    ? databases.flatMap(db => placeholders[db.value] || []).map(p => `{${p}}`).join(', ')
                    : 'Select at least one database first'
                } (Type '{' to see suggestions)`}
              </p>
              <div className="quill-editor-container">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  className="mb-3 bg-white border-1 border-light rounded"
                  theme="snow"
                />
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0">
          {step === 1 && (
            <Button
              variant="outline-primary"
              onClick={() => name && databases.length > 0 && setStep(2)}
              className="rounded"
            >
              Next
            </Button>
          )}
          {step === 2 && (
            <>
              <Button
                variant="outline-secondary"
                onClick={() => setStep(1)}
                className="rounded"
              >
                Back
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleSave}
                disabled={!!error}
                className="rounded"
              >
                Save
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateTemplateModal;