// Auth selectors for accessing auth state from components

// Get the current user from state
export const selectCurrentUser = (state) => state.auth.user;

// Get authentication status
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Get loading state for auth operations
export const selectAuthLoading = (state) => state.auth.loading;

// Get error state for auth operations
export const selectAuthError = (state) => state.auth.error;

// Get user role (with fallback to 'user' if not defined)
export const selectUserRole = (state) => state.auth.user?.role || 'user';

// Check if user is admin
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';

// Get auth token
export const selectAuthToken = (state) => state.auth.token;