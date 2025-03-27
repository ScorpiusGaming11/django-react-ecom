import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [newsletterSubscription, setNewsletterSubscription] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Function to validate user inputs in register form
  const validateForm = () => {
    let isValid = true
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!firstName) {
      newErrors.firstName = 'First name is required.';
      isValid = false;
    } else if (!/^[A-Za-z\s-]+$/.test(firstName)) {
      newErrors.firstName = 'Invalid first name format.';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last name is required.';
      isValid = false;
    } else if (!/^[A-Za-z\s-]+$/.test(lastName)) {
      newErrors.lastName = 'Invalid last name format.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Format date of birth to YYYY-MM-DD (match backend)
        const formattedDOB = dateOfBirth ? new Date(dateOfBirth).toISOString().slice(0, 10) : null;

        const response = await axios.post('http://127.0.0.1:8000/register/', {
          user: {
            username: username,
            password: password,
            email: email,
            first_name: firstName,
            last_name: lastName,
          },
          phone_number: phoneNumber,
          date_of_birth: formattedDOB,
          gender: gender,
          newsletter_subscription: newsletterSubscription
        });

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        navigate('/');
        alert('Account created!');
      } catch (err) {
        setErrors({ form: 'Registration failed. Please check your details.' });
        console.error({'error': err});
      }
    }
  }

  return (
    <div className="form">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 display-3">Create a New Account</h2>
          {errors.form && (
            <div className="alert alert-danger">{errors.form}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Username</label>
              <input 
              type="text" 
              className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"/>
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Email</label>
              <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter email"/>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Password</label>
              <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"/>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">First Name</label>
              <input 
              type="text" 
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              placeholder="Enter first name"/>
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Last Name</label>
              <input 
              type="text" 
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Enter last name"/>
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Phone Number (<i>Optional</i>)</label>
              <input 
              type="tel" 
              className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`} 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="Enter phone number"/>
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Date of Birth (<i>Optional</i>)</label>
              <input 
              type="date" 
              className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} 
              value={dateOfBirth} 
              onChange={(e) => setDateOfBirth(e.target.value)} 
              placeholder="Enter date of birth"/>
              {errors.dateOfBirth && (
                <div className="invalid-feedback">{errors.dateOfBirth}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Gender (<i>Optional</i>)</label>
              <select 
              className={`form-select ${errors.gender ? 'is-invalid' : ''}`} 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}>
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <div className="invalid-feedback">{errors.gender}</div>
              )}
            </div>

            <div className="form-group mb-3">
              <div className="form-check">
                <input 
                type="checkbox" 
                className="form-check-input"
                checked={newsletterSubscription}
                onChange={(e) => setNewsletterSubscription(e.target.checked)}/>
                <label className="form-check-label">Subscribe to Newsletter</label>
              </div>
            </div>

            <div className="d-flex justify-content-center flex-column align-items-center">
              <button type="submit" className="btn btn-primary shadow mt-3 mb-2">
                Create Account
              </button>
              <Link to='/login' className="login-link">Already have an account? Login here.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;