import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../redux/selectors/authSelectors';
import { login, logout, register, fetchUserProfile } from '../redux/slices/AuthSlice';

/**
 * Custom hook for authentication operations and state
 * Provides a unified interface for auth-related functionality
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // Login function
  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      navigate('/');
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [dispatch, navigate]);
  
  // Register function
  const handleRegister = useCallback(async (userData) => {
    try {
      const result = await dispatch(register(userData)).unwrap();
      navigate('/login');
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [dispatch, navigate]);
  
  // Logout function
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);
  
  // Get user profile
  const getUserProfile = useCallback(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    getUserProfile
  };
};

export default useAuth;