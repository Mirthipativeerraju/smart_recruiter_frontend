import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal, Alert } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './Applyform.css';

const JobApplyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    address: '', city: '', zipCode: '',
    education: [{ institute: '', level: '', majors: '', sessionFrom: '', sessionTo: '', errors: {} }],
    experience: [{ title: '', duration: '', company: '' }],
    email: '', phone: '', linkedin: '', github: '', profilePic: null, resume: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState([]); // Changed to array to hold multiple errors
  const [hasApplied, setHasApplied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');

  const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Other', label: 'Other' },
  ];

  const educationLevelOptions = [
    { value: 'Ph.D', label: 'PhD / Doctorate' },
    { value: 'Postgraduate', label: 'Postgraduate / Master’s (M.Tech, M.Sc, MBA, etc.)' },
    { value: 'Graduate', label: 'Graduate / Bachelor’s (B.Tech, B.Sc, BBA, etc.)' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Intermediate', label: 'Intermediate / 12th / HSC' },
    { value: 'Matriculation', label: 'Matriculation / 10th / SSC' },
  ];

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate('/userlogin');
      return;
    }

    const checkApplicationStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/candidates/user/${userId}`);
        const applications = await response.json();
        if (response.ok && applications.some(app => app.jobId.toString() === id)) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error('Error checking application status:', err);
        setGeneralError(['Failed to verify application status. Please try again.']);
      }
    };

    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await response.json();
        if (response.ok) {
          setJobTitle(data.position);
        }
      } catch (error) {
        console.error('Error fetching job title:', error);
      }
    };

    checkApplicationStatus();
    fetchJob();
  }, [id, isLoggedIn, userId, navigate]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File size exceeds 5MB limit for ${field}. Please upload a smaller file.`);
        return;
      }
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleChange = (e, index, section) => {
    const { id, value } = e.target;
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][id] = value;
      if (formSubmitted) {
        const updatedEducation = validateEducation(updatedSection);
        setFormData({ ...formData, education: updatedEducation });
      } else {
        setFormData({ ...formData, [section]: updatedSection });
      }
    } else if (id === 'profilePic' || id === 'resume') {
      handleFileChange(e, id);
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSelectChange = (selectedOption, id, index, section) => {
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][id] = selectedOption ? selectedOption.value : '';
      if (formSubmitted && section === 'education') {
        const updatedEducation = validateEducation(updatedSection);
        setFormData({ ...formData, education: updatedEducation });
      } else {
        setFormData({ ...formData, [section]: updatedSection });
      }
    } else {
      setFormData({ ...formData, [id]: selectedOption ? selectedOption.value : '' });
    }
  };

  const addSection = (section) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], section === 'education' ? { institute: '', level: '', majors: '', sessionFrom: '', sessionTo: '', errors: {} } : { title: '', duration: '', company: '' }],
    });
  };

  const removeSection = (index, section) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection.length ? updatedSection : [section === 'education' ? { institute: '', level: '', majors: '', sessionFrom: '', sessionTo: '', errors: {} } : { title: '', duration: '', company: '' }] });
  };

  const educationLevels = [
    'Ph.D', 'Postgraduate', 'Graduate', 'Diploma', 'Intermediate', 'Matriculation'
  ];

  const getTopEducationLevels = () => {
    const levels = formData.education.map(edu => edu.level).filter(level => level);
    const indices = levels.map(level => educationLevels.indexOf(level)).sort((a, b) => a - b);
    return indices.slice(0, 2).map(index => educationLevels[index]);
  };

  const getHighestEducationLevel = () => {
    let highestIndex = educationLevels.length;
    let highestLevel = '';
    formData.education.forEach((edu) => {
      const levelIndex = educationLevels.indexOf(edu.level);
      if (levelIndex !== -1 && levelIndex < highestIndex) {
        highestIndex = levelIndex;
        highestLevel = edu.level;
      }
    });
    return highestLevel;
  };

  const getAvailableEducationLevels = (index) => {
    const highestLevel = getHighestEducationLevel();
    const highestIndex = educationLevels.indexOf(highestLevel);
    if (index === 0 || highestIndex === -1) return educationLevelOptions;
    const excludeUpTo = highestIndex + 1;
    return educationLevelOptions.slice(excludeUpTo);
  };

  const validateEducation = (education) => {
    const currentYear = new Date().getFullYear();
    const topLevels = getTopEducationLevels();
    return education.map((edu, index) => {
      const eduErrors = {};
      if (edu.level && topLevels.includes(edu.level)) {
        if (!edu.institute) eduErrors.institute = 'Institute name is required';
        if (!edu.sessionFrom) eduErrors.sessionFrom = 'Session From is required';
        else if (isNaN(parseInt(edu.sessionFrom)) || parseInt(edu.sessionFrom) < 1900 || parseInt(edu.sessionFrom) > currentYear) {
          eduErrors.sessionFrom = `Session From must be between 1900 and ${currentYear}`;
        }
        if (!edu.sessionTo) eduErrors.sessionTo = 'Session To is required';
        else if (isNaN(parseInt(edu.sessionTo)) || parseInt(edu.sessionTo) < 1900 || parseInt(edu.sessionTo) > currentYear + 5) {
          eduErrors.sessionTo = `Session To must be between 1900 and ${currentYear + 5}`;
        }
        else if (parseInt(edu.sessionTo) < parseInt(edu.sessionFrom)) {
          eduErrors.sessionTo = 'Session To must be after Session From';
        }

        const currentLevelIndex = educationLevels.indexOf(edu.level);
        for (let i = 0; i < index; i++) {
          const prevEdu = education[i];
          const prevLevelIndex = educationLevels.indexOf(prevEdu.level);
          if (prevLevelIndex > currentLevelIndex && prevEdu.sessionTo && parseInt(edu.sessionFrom) < parseInt(prevEdu.sessionTo)) {
            eduErrors.sessionFrom = `Session From for ${edu.level} must be after Session To of ${prevEdu.level} (${prevEdu.sessionTo})`;
          }
        }
        for (let i = index + 1; i < education.length; i++) {
          const nextEdu = education[i];
          const nextLevelIndex = educationLevels.indexOf(nextEdu.level);
          if (nextLevelIndex < currentLevelIndex && nextEdu.sessionFrom && parseInt(edu.sessionTo) > parseInt(nextEdu.sessionFrom)) {
            eduErrors.sessionTo = `Session To for ${edu.level} must be before Session From of ${nextEdu.level} (${nextEdu.sessionFrom})`;
          }
        }
      }
      return { ...edu, errors: eduErrors };
    });
  };

  const validateForm = () => {
    const errors = [];
    const currentYear = new Date().getFullYear();

    // Personal Info Validation
    if (!formData.firstName) errors.push('First Name is required');
    if (!formData.lastName) errors.push('Last Name is required');
    if (!formData.dob) errors.push('Date of Birth is required');
    else if (new Date(formData.dob) > new Date()) errors.push('Date of Birth cannot be in the future');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.address) errors.push('Address is required');
    if (!formData.city) errors.push('City is required');
    if (!formData.zipCode) errors.push('Zip Code is required');
    else if (!/^\d{5,6}$/.test(formData.zipCode)) errors.push('Zip Code must be 5-6 digits');
    if (!formData.email) errors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push('Email format is invalid');
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) errors.push('Phone number must be 10-15 digits');
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin)) errors.push('LinkedIn URL is invalid');
    if (formData.github && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(formData.github)) errors.push('GitHub URL is invalid');
    if (!formData.profilePic) errors.push('Profile Picture is required');
    if (!formData.resume) errors.push('Resume is required');

    // Education Validation
    const topLevels = getTopEducationLevels();
    if (topLevels.length < 1) errors.push('Your top two education levels are required ');

    const requiredLevels = topLevels.length === 1 ? [topLevels[0], educationLevels[educationLevels.indexOf(topLevels[0]) + 1]] : topLevels;
    formData.education.forEach((edu) => {
      if (requiredLevels.includes(edu.level) && (!edu.institute || !edu.sessionFrom || !edu.sessionTo)) {
        errors.push(`Complete details for ${edu.level} are required as it is one of your top two levels`);
      }
    });

    const updatedEducation = validateEducation(formData.education);
    updatedEducation.forEach((edu, index) => {
      if (Object.keys(edu.errors).length > 0) {
        Object.values(edu.errors).forEach(error => errors.push(`Education ${index + 1}: ${error}`));
      }
    });
    setFormData({ ...formData, education: updatedEducation });

    return { isInvalid: errors.length > 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const { isInvalid, errors } = validateForm();

    if (isInvalid) {
      console.log('Submission blocked due to validation errors:', errors);
      setGeneralError(errors); // Set the specific errors
      return;
    }

    setLoading(true);
    setGeneralError([]);

    const submissionData = new FormData();
    submissionData.append('jobId', id);
    submissionData.append('userId', userId);
    submissionData.append('firstName', formData.firstName);
    submissionData.append('lastName', formData.lastName);
    submissionData.append('dob', formData.dob);
    submissionData.append('gender', formData.gender);
    submissionData.append('address', formData.address);
    submissionData.append('city', formData.city);
    submissionData.append('zipCode', formData.zipCode);
    submissionData.append('education', JSON.stringify(formData.education.map(({ errors, ...edu }) => edu)));
    submissionData.append('experience', JSON.stringify(formData.experience.filter(exp => exp.title || exp.duration || exp.company)));
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone);
    submissionData.append('linkedin', formData.linkedin);
    submissionData.append('github', formData.github);
    submissionData.append('profilePic', formData.profilePic);
    submissionData.append('resume', formData.resume);

    try {
      const response = await fetch('http://localhost:5000/api/candidates/apply', {
        method: 'POST',
        body: submissionData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Form submitted successfully');
        setShowSuccess(true);
      } else {
        console.error('Server error:', data);
        setGeneralError([data.error || `Submission failed with status ${response.status}`]);
      }
    } catch (error) {
      console.error('Network or submission error:', error);
      setGeneralError(['Failed to submit application. Please check your network and try again.']);
    } finally {
      setLoading(false);
    }
  };

  if (hasApplied) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-dark text-light">
        <NavigationBar />
        <Container className="flex-grow-1 py-5 mt-5">
          <div className="bg-dark text-white text-center py-4 mb-4 rounded shadow-sm">
            <h1 className="display-5 fw-bold">{jobTitle || 'Loading...'}</h1>
          </div>
          <Alert variant="info" className="text-center">
            <h4>You have already applied to this job.</h4>
            <p>Please check your application status or explore other opportunities.</p>
            <Button variant="primary" onClick={() => navigate('/jobpage')}>Back to Jobs</Button>
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <NavigationBar />
      <Container className="flex-grow-1 py-5 mt-5">
        <div className="bg-dark text-white text-center py-4 mb-4 rounded shadow-sm">
          <h1 className="display-5 fw-bold">{jobTitle || 'Loading...'}</h1>
        </div>
        <Form onSubmit={handleSubmit} className="bg-white text-dark p-4 rounded shadow form-container">
          {generalError.length > 0 && (
            <Alert variant="danger" className="mb-3">
              <strong>Please fix the following errors:</strong>
              <ul>
                {generalError.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          <h3 className="fw-bold mb-3"><i className="bi bi-person-fill me-2"></i> Personal Information</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control id="firstName" value={formData.firstName} onChange={handleChange} required isInvalid={formSubmitted && !formData.firstName} />
              <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control id="lastName" value={formData.lastName} onChange={handleChange} required isInvalid={formSubmitted && !formData.lastName} />
              <Form.Control.Feedback type="invalid">Last Name is required</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
              <Form.Control id="dob" type="date" value={formData.dob} onChange={handleChange} required isInvalid={formSubmitted && (!formData.dob || new Date(formData.dob) > new Date())} />
              <Form.Control.Feedback type="invalid">{!formData.dob ? 'Date of Birth is required' : 'Cannot be in the future'}</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
              <Select
                id="gender"
                options={genderOptions}
                value={genderOptions.find(option => option.value === formData.gender) || null}
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'gender')}
                placeholder="Select Gender"
                isClearable
                className={formSubmitted && !formData.gender ? 'is-invalid' : ''}
              />
              {formSubmitted && !formData.gender && (
                <div className="invalid-feedback d-block">Gender is required</div>
              )}
            </div>
            <div className="col-12">
              <Form.Label>Address <span className="text-danger">*</span></Form.Label>
              <Form.Control id="address" value={formData.address} onChange={handleChange} required isInvalid={formSubmitted && !formData.address} />
              <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>City <span className="text-danger">*</span></Form.Label>
              <Form.Control id="city" value={formData.city} onChange={handleChange} required isInvalid={formSubmitted && !formData.city} />
              <Form.Control.Feedback type="invalid">City is required</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Zip-Code <span className="text-danger">*</span></Form.Label>
              <Form.Control id="zipCode" type="number" value={formData.zipCode} onChange={handleChange} required isInvalid={formSubmitted && (!formData.zipCode || !/^\d{5,6}$/.test(formData.zipCode))} />
              <Form.Control.Feedback type="invalid">{!formData.zipCode ? 'Zip Code is required' : 'Must be 5-6 digits'}</Form.Control.Feedback>
            </div>
            <div className="col-12 text-center mt-3">
              <div className="upload-box">
                <i className="bi bi-camera-fill fs-3 d-block mb-2"></i>
                <Form.Label>Upload Profile Picture <span className="text-danger">*</span></Form.Label>
                <Form.Control type="file" accept="image/*" id="profilePic" onChange={handleChange} required isInvalid={formSubmitted && !formData.profilePic} />
                <Form.Text className="text-muted">Max 5MB</Form.Text>
                <Form.Control.Feedback type="invalid">Profile Picture is required</Form.Control.Feedback>
              </div>
            </div>
          </div>

          <h3 className="fw-bold mt-5 mb-3"><i className="bi bi-mortarboard-fill me-2"></i> Academic Qualification</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="row g-3 mb-3">
              <div className="col-md-4">
                <Form.Label>Institute {getTopEducationLevels().includes(edu.level) && <span className="text-danger">*</span>}</Form.Label>
                <Form.Control id="institute" value={edu.institute} onChange={(e) => handleChange(e, index, 'education')} placeholder="Enter institute name" isInvalid={formSubmitted && !!edu.errors.institute} />
                <Form.Control.Feedback type="invalid">{edu.errors.institute}</Form.Control.Feedback>
              </div>
              <div className="col-md-4">
                <Form.Label>Level</Form.Label>
                <Select
                  id="level"
                  options={getAvailableEducationLevels(index)}
                  value={educationLevelOptions.find(option => option.value === edu.level) || null}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, 'level', index, 'education')}
                  placeholder="Select Level"
                  isClearable
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Majors In</Form.Label>
                <Form.Control id="majors" value={edu.majors} onChange={(e) => handleChange(e, index, 'education')} placeholder="e.g., Computer Science" />
              </div>
              <div className="col-md-2">
                <Form.Label>Session From {getTopEducationLevels().includes(edu.level) && <span className="text-danger">*</span>}</Form.Label>
                <Form.Control id="sessionFrom" type="number" min="1900" max={new Date().getFullYear()} value={edu.sessionFrom} onChange={(e) => handleChange(e, index, 'education')} isInvalid={formSubmitted && !!edu.errors.sessionFrom} />
                <Form.Control.Feedback type="invalid">{edu.errors.sessionFrom}</Form.Control.Feedback>
              </div>
              <div className="col-md-2">
                <Form.Label>To {getTopEducationLevels().includes(edu.level) && <span className="text-danger">*</span>}</Form.Label>
                <Form.Control id="sessionTo" type="number" min="1900" max={new Date().getFullYear() + 5} value={edu.sessionTo} onChange={(e) => handleChange(e, index, 'education')} isInvalid={formSubmitted && !!edu.errors.sessionTo} />
                <Form.Control.Feedback type="invalid">{edu.errors.sessionTo}</Form.Control.Feedback>
              </div>
              {formData.education.length > 1 && (
                <div className="col-12 text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => removeSection(index, 'education')}>
                    <i className="bi bi-trash me-1"></i> Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
          <div className="text-center mt-3">
            <Button variant="outline-primary" onClick={() => addSection('education')}>
              <i className="bi bi-plus-circle me-2"></i> Add More
            </Button>
          </div>
          <div className="text-muted mt-2">
            Note: Your top two education levels (e.g., {getHighestEducationLevel() || 'Ph.D'} and {getTopEducationLevels()[1] || 'Postgraduate'}) are required and must follow the natural academic progression (e.g., Postgraduate before Ph.D). Diploma and below are optional.
          </div>

          <h3 className="fw-bold mt-5 mb-3"><i className="bi bi-briefcase-fill me-2"></i> Professional Experience (Optional)</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="row g-3 mb-3">
              <div className="col-md-5">
                <Form.Label>Title</Form.Label>
                <Form.Control id="title" value={exp.title} onChange={(e) => handleChange(e, index, 'experience')} placeholder="e.g., Software Engineer" />
              </div>
              <div className="col-md-3">
                <Form.Label>Duration (Years)</Form.Label>
                <Form.Control id="duration" type="number" min="0" max="50" value={exp.duration} onChange={(e) => handleChange(e, index, 'experience')} />
              </div>
              <div className="col-md-4">
                <Form.Label>Company Name</Form.Label>
                <Form.Control id="company" value={exp.company} onChange={(e) => handleChange(e, index, 'experience')} placeholder="e.g., Tech Corp" />
              </div>
              {formData.experience.length > 1 && (
                <div className="col-12 text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => removeSection(index, 'experience')}>
                    <i className="bi bi-trash me-1"></i> Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
          <div className="text-center mt-3">
            <Button variant="outline-primary" onClick={() => addSection('experience')}>
              <i className="bi bi-plus-circle me-2"></i> Add More
            </Button>
          </div>

          <h3 className="fw-bold mt-5 mb-3"><i className="bi bi-megaphone-fill me-2"></i> Contact / Social Handles</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
              <Form.Control id="email" type="email" value={formData.email} onChange={handleChange} required isInvalid={formSubmitted && (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))} />
              <Form.Control.Feedback type="invalid">{!formData.email ? 'Email is required' : 'Email format is invalid'}</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>Phone / WhatsApp Number</Form.Label>
              <Form.Control id="phone" type="tel" value={formData.phone} onChange={handleChange} isInvalid={formSubmitted && formData.phone && !/^\d{10,15}$/.test(formData.phone)} />
              <Form.Control.Feedback type="invalid">Phone number must be 10-15 digits</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>LinkedIn Profile</Form.Label>
              <Form.Control id="linkedin" type="url" value={formData.linkedin} onChange={handleChange} isInvalid={formSubmitted && formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin)} />
              <Form.Control.Feedback type="invalid">LinkedIn URL is invalid</Form.Control.Feedback>
            </div>
            <div className="col-md-6">
              <Form.Label>GitHub Profile</Form.Label>
              <Form.Control id="github" type="url" value={formData.github} onChange={handleChange} isInvalid={formSubmitted && formData.github && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(formData.github)} />
              <Form.Control.Feedback type="invalid">GitHub URL is invalid</Form.Control.Feedback>
            </div>
            <div className="col-12 text-center mt-3">
              <div className="upload-box">
                <i className="bi bi-file-earmark-text-fill fs-3 d-block mb-2"></i>
                <Form.Label>Upload Your Resume (PDF) <span className="text-danger">*</span></Form.Label>
                <Form.Control type="file" accept="application/pdf" id="resume" onChange={handleChange} required isInvalid={formSubmitted && !formData.resume} />
                <Form.Text className="text-muted">Max 5MB</Form.Text>
                <Form.Control.Feedback type="invalid">Resume is required</Form.Control.Feedback>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button type="submit" variant="primary" className="px-5 py-2 fw-bold" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </Container>

      <Modal show={showSuccess} onHide={() => navigate('/jobpage')} centered>
        <Modal.Body className="text-center bg-dark text-light rounded">
          <h4 className="fw-semibold text-primary">Congrats!</h4>
          <p>Your application is submitted successfully</p>
          <Button variant="primary" onClick={() => navigate('/jobpage')}>Back to Jobs</Button>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default JobApplyForm;