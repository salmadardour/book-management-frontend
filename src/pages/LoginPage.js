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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { email, password, confirmPassword, userName, fullName } = formData;

      if (!email || !password || (!isLogin && (!userName || !fullName || !confirmPassword))) {
        throw new Error('Please fill in all required fields.');
      }

      if (!isLogin && password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      let token, refreshToken;

      if (isLogin) {
        const loginRes = await axios.post('https://localhost:5056/api/auth/login', { email, password });
        token = loginRes.data.token;
        refreshToken = loginRes.data.refreshToken;
      } else {
        await axios.post('https://localhost:5056/api/auth/register', {
          userName, email, password, fullName, role: 'User'
        });

        const loginRes = await axios.post('https://localhost:5056/api/auth/login', { email, password });
        token = loginRes.data.token;
        refreshToken = loginRes.data.refreshToken;
      }

      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        const profileRes = await axios.get('https://localhost:5056/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('user', JSON.stringify(profileRes.data));
      }

      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.response?.data?.message || 'Login or registration failed.');
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
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
