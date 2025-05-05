import { authService as realAuthService } from './api/authService';
import { bookService as realBookService } from './api/bookService';
import { authorService as realAuthorService } from './api/authorService';
import { categoryService as realCategoryService } from './api/categoryService';
import { publisherService as realPublisherService } from './api/publisherService';
import { reviewService as realReviewService } from './api/reviewService';

import { localAuthService } from './localStorage/localAuthService';
import { localBookService } from './localStorage/localBookService';
import { localAuthorService } from './localStorage/localAuthorService';
import { localCategoryService } from './localStorage/localCategoryService';
import { localPublisherService } from './localStorage/localPublisherService';
import { localReviewService } from './localStorage/localReviewService';

// Check if we should use local storage based on environment variable or local setting
const shouldUseLocalStorage = () => {
  // Check for explicit localStorage mode setting
  if (localStorage.getItem('useLocalStorage') === 'true') {
    return true;
  }
  
  // Check for environment variable
  const useLocalStorage = process.env.REACT_APP_USE_LOCAL_STORAGE === 'true';
  const hasApiUrl = !!process.env.REACT_APP_API_URL;
  
  return useLocalStorage || !hasApiUrl;
};

// Fallback mechanism - try real API first, fallback to localStorage if API call fails
const createFallbackService = (realService, localService, options = { useRealFirst: true }) => {
  const { useRealFirst } = options;
  
  if (shouldUseLocalStorage() && !useRealFirst) {
    // Always use localStorage if configured explicitly
    return localService;
  }
  
  // Create proxy methods that try real API first, then fallback to localStorage
  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof realService[prop] !== 'function') {
        return realService[prop] || localService[prop];
      }
      
      return async (...args) => {
        if (useRealFirst) {
          try {
            return await realService[prop](...args);
          } catch (error) {
            console.warn(`API call ${prop} failed, using localStorage fallback`, error);
            return localService[prop](...args);
          }
        } else {
          return localService[prop](...args);
        }
      };
    }
  });
};

// Export service instances with fallback capability
export const authService = createFallbackService(realAuthService, localAuthService);
export const bookService = createFallbackService(realBookService, localBookService);
export const authorService = createFallbackService(realAuthorService, localAuthorService);
export const categoryService = createFallbackService(realCategoryService, localCategoryService);
export const publisherService = createFallbackService(realPublisherService, localPublisherService);
export const reviewService = createFallbackService(realReviewService, localReviewService);

// Manually switch to localStorage mode
export const useLocalStorageMode = () => {
  localStorage.setItem('useLocalStorage', 'true');
  window.location.reload();
};

// Manually switch to API mode
export const useApiMode = () => {
  localStorage.removeItem('useLocalStorage');
  window.location.reload();
};

// Check which mode is active
export const isUsingLocalStorage = () => {
  return shouldUseLocalStorage();
};