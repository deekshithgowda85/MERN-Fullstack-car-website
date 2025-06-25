import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Loginstyle.css';
import { authService } from '../services/api';

function Register() {
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [tempUserId, setTempUserId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.sendRegistrationOtp({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      setTempUserId(response.data.tempUserId);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      // If current input is empty and we're not at the first input, move to previous
      if (!otp[idx] && idx > 0) {
        inputRefs.current[idx - 1].focus();
        newOtp[idx - 1] = ''; // Clear the previous input
        setOtp(newOtp);
      } else {
        // Clear current input
        newOtp[idx] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const otpString = otp.join('');
      console.log('Submitting OTP:', {
        email: formData.email,
        otp: otpString,
        otpLength: otpString.length
      }); // Debug log

      if (otpString.length !== 6) {
        setError('Please enter all 6 digits of the OTP');
        return;
      }

      const response = await authService.verifyRegistrationOtp({
        email: formData.email,
        otp: otpString
      });

      console.log('OTP verification response:', response.data); // Debug log

      // Store the token
      localStorage.setItem('token', response.data.token);

      // Show success message
      alert('Registration successful! Redirecting to login...');

      // Redirect to login
      navigate('/login');
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.resendOtp(formData.email);
      alert('New OTP sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="login-root">
      <header>
        <div className="logo">
          <img src="logo.png" alt="" />
        </div>
        <h1>Create your account</h1>
        <p>Already have an account? <Link className="text-white" to="/login">Sign in</Link></p>
      </header>

      {step === 1 && (
        <form onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="Your username"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength="6"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
          <p>Password must be at least 6 characters</p>
          <button type="submit">Register</button>
          <p>
            By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>
      )}

      {step === 2 && (
        <form className="otp-Form" onSubmit={handleOtpSubmit}>
          {error && <div className="error-message">{error}</div>}
          <span className="mainHeading">Enter OTP</span>
          <p className="otpSubheading">We have sent a verification code to your email</p>
          <div className="inputContainer">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                required
                maxLength="1"
                type="text"
                className="otp-input"
                value={otp[idx]}
                onChange={e => handleOtpChange(e, idx)}
                onKeyDown={e => handleOtpKeyDown(e, idx)}
                onPaste={handleOtpPaste}
                ref={el => inputRefs.current[idx] = el}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          <button className="verifyButton" type="submit">Verify</button>
          <p className="resendNote">
            Didn't receive the code? <button type="button" className="resendBtn" onClick={handleResendOtp}>Resend Code</button>
          </p>
        </form>
      )}
    </div>
  );
}

export default Register;