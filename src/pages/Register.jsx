// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../api/AxiosIntances';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await axiosInstance.post('/auth/send-otp', formData);
      setOtpSent(true);
      toast.success('OTP sent to your email.');
    } catch (error) {

      toast.error(error.response.data.message || 'Error sending OTP');
    }
  };

  const handleRegister = async () => {
    try {

      await axiosInstance.post('/auth/verify-otp', { ...formData, otp });

      toast.success('Registered successfully!');
      navigate("/login")
    } catch (error) {

      toast.error(error.response.data.message || 'Registration failed');
    }
  };

  return (

    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h3 className="text-center mb-4">Help Desk</h3>
        <h5 className="mb-3 text-center">Sign Up</h5>

        <input
          className="form-control mb-2"
          name="name"
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className="form-control mb-2"
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <select className="form-control mb-3" name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          {/* <option value="agent">Agent</option> */}
        </select>

        {otpSent ? (
          <>
            <input
              className="form-control mb-2"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleRegister}>
              Register
            </button>
          </>
        ) : (
          <button className="btn btn-warning w-100" onClick={sendOtp}>
            Send OTP
          </button>
        )}
      </div>
    </div>

  );
}

export default Register;
