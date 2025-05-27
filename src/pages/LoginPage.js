import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('Starting authentication...');

    try {
      const { email, password, confirmPassword, userName, fullName } = formData;

      // Validation
      if (!email || !password || (!isLogin && (!userName || !fullName || !confirmPassword))) {
        throw new Error('Please fill in all required fields.');
      }

      if (!isLogin && password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      let token, refreshToken;

      if (isLogin) {
        setDebugInfo('Attempting login...');
        console.log('Login attempt with:', { email });
        
        const loginRes = await axios.post('https://localhost:5056/api/auth/login', { 
          email, 
          password 
        });
        
        console.log('Login response:', loginRes.data);
        setDebugInfo('Login successful, received token');
        
        token = loginRes.data.token;
        refreshToken = loginRes.data.refreshToken;
      } else {
        setDebugInfo('Attempting registration...');
        console.log('Registration attempt with:', { userName, email, fullName });
        
        await axios.post('https://localhost:5056/api/auth/register', {
          userName, 
          email, 
          password, 
          fullName, 
          role: 'User'
        });
        
        setDebugInfo('Registration successful, now logging in...');
        console.log('Registration successful, attempting login...');

        const loginRes = await axios.post('https://localhost:5056/api/auth/login', { 
          email, 
          password 
        });
        
        console.log('Post-registration login response:', loginRes.data);
        token = loginRes.data.token;
        refreshToken = loginRes.data.refreshToken;
      }

      if (token) {
        setDebugInfo('Storing token and fetching profile...');
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        try {
          const profileRes = await axios.get('https://localhost:5056/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Profile response:', profileRes.data);
          localStorage.setItem('user', JSON.stringify(profileRes.data));
          setDebugInfo('Profile fetched successfully, redirecting...');
        } catch (profileError) {
          console.log('Profile fetch failed, but continuing with login:', profileError);
          setDebugInfo('Login successful (profile fetch optional)');
        }

        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 100);
      } else {
        throw new Error('No token received from server');
      }

    } catch (err) {
      console.error('Auth Error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.title ||
                          err.message || 
                          'Authentication failed';
      
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '', password: '', confirmPassword: '', userName: '', fullName: ''
    });
    setError('');
    setDebugInfo('');
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {/* Debug Info - only visible during development */}
        {debugInfo && (
          <div className="debug-info">
            {debugInfo}
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Username</label>
              <input name="userName" value={formData.userName} onChange={handleChange} required />
              <label>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </>
          )}
          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          {!isLogin && (
            <>
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={toggleMode} className="view-button">
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;