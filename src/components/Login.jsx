import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import { encryptData, decryptData } from '../utils/utilservice';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    getIpAddress();
  }, []);

  const getIpAddress = async () => {
    try {
      // First try to get IP from ipify API
      const response = await axios.get('https://api.ipify.org?format=json');
      setIpAddress(response.data.ip);
    } catch (error) {
      console.error('Error getting IP from ipify:', error);
      try {
        // Fallback to ipapi.co
        const response = await axios.get('https://ipapi.co/json/');
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error('Error getting IP from ipapi:', error);
        // If both APIs fail, use localhost
        setIpAddress('127.0.0.1');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const param = {
        'Code': formData.loginId,
        'Password': formData.password,
        'Ip': ipAddress
      };
      console.log("Sending login with:", param);
      const formDataToSend = new FormData();
      const encryptedParam = encryptData(param);
      formDataToSend.append('data', encryptedParam);

      console.log("Sending login with:", formDataToSend);

      const response = await axios.post(
        'https://uat.illusiondentallab.com/API_2020/api/Login/PostLogin_Revised',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data) {
        const decryptedData = decryptData(response.data.data);
        console.log('Login successful:', decryptedData);
        
        const menuData = decryptedData.Menu_Data;
        console.log('Menu data:', menuData);

        // Sort menu items by SequenceNo
        const sortedMenuData = menuData.sort((a, b) => a.SequenceNo - b.SequenceNo);
        
        // Store user data and menu data separately in localStorage
        localStorage.setItem('userData', JSON.stringify({
          ...decryptedData,
          Menu_Data: undefined // Remove menu data from user data
        }));
        localStorage.setItem('menuData', JSON.stringify(sortedMenuData));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {  
        // Handle error response
        console.error('Login failed:', response.data);
        setError(response.data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/assets/images/logo.png" alt="Labguru Logo" className="login-logo" />
      </div>
      <div className="login-right">
        <h1 className="login-title">Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginId">
              Login ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              placeholder="Login ID"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          <a href="#" className="forgot-password">Forgot Password?</a>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 