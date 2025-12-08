import React, { useState } from 'react';
import './WorkshopForm.css';

function WorkshopForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    collegeName: '',
    branch: '',
    section: '',
    aboutWorkshop: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter valid 10-digit phone number';
    }
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
    if (!formData.aboutWorkshop.trim()) newErrors.aboutWorkshop = 'Please tell us about the workshop';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);
      setSubmitted(true);
      // Here you can add API call to submit data
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          studentName: '',
          phone: '',
          collegeName: '',
          branch: '',
          section: '',
          aboutWorkshop: ''
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="logo-placeholder">
          {/* Add logo here when available */}
          <h1>SPHERENEX</h1>
        </div>
        <h2>Workshop Registration Form</h2>
        <p>Please fill in your details to register</p>
      </div>

      {submitted && (
        <div className="success-message">
          <p>✓ Registration successful! Thank you for registering.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.studentName ? 'error-input' : ''}
          />
          {errors.studentName && <span className="error-text">{errors.studentName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            className={errors.phone ? 'error-input' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="collegeName">College Name *</label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            placeholder="Enter your college name"
            className={errors.collegeName ? 'error-input' : ''}
          />
          {errors.collegeName && <span className="error-text">{errors.collegeName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="branch">Branch *</label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={errors.branch ? 'error-input' : ''}
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="MECH">Mechanical Engineering</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="AI/ML">Artificial Intelligence & ML</option>
              <option value="Other">Other</option>
            </select>
            {errors.branch && <span className="error-text">{errors.branch}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="section">Section *</label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g., A, B, C"
              maxLength="2"
              className={errors.section ? 'error-input' : ''}
            />
            {errors.section && <span className="error-text">{errors.section}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="aboutWorkshop">About Workshop *</label>
          <textarea
            id="aboutWorkshop"
            name="aboutWorkshop"
            value={formData.aboutWorkshop}
            onChange={handleChange}
            placeholder="Tell us what you expect from this workshop..."
            rows="4"
            className={errors.aboutWorkshop ? 'error-input' : ''}
          />
          {errors.aboutWorkshop && <span className="error-text">{errors.aboutWorkshop}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Register Now
        </button>
      </form>
    </div>
  );
}

export default WorkshopForm;
