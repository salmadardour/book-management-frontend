import React, { useState, useEffect } from 'react';
import { isUsingLocalStorage, useLocalStorageMode, useApiMode } from '../services/apiHelper';

const ApiModeToggle = () => {
  const [usingLocalStorage, setUsingLocalStorage] = useState(isUsingLocalStorage());

  // Update component state when localStorage changes
  useEffect(() => {
    const checkMode = () => {
      setUsingLocalStorage(isUsingLocalStorage());
    };

    // Set up an event listener for storage changes (in case mode is changed in another tab)
    window.addEventListener('storage', checkMode);
    
    return () => {
      window.removeEventListener('storage', checkMode);
    };
  }, []);

  const handleToggleChange = () => {
    if (usingLocalStorage) {
      // Switch to API mode
      useApiMode();
    } else {
      // Switch to localStorage mode
      useLocalStorageMode();
    }
    // Update the state after toggling
    setUsingLocalStorage(!usingLocalStorage);
  };

  return (
    <div className="api-mode-toggle mb-3 d-flex align-items-center justify-content-end">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="apiModeSwitch"
          checked={usingLocalStorage}
          onChange={handleToggleChange}
        />
        <label className="form-check-label" htmlFor="apiModeSwitch">
          {usingLocalStorage ? 'Using LocalStorage Mode' : 'Using Backend API Mode'}
        </label>
      </div>
      <span className="ms-2 badge bg-secondary" title="Local data will be used when backend is unavailable">
        {usingLocalStorage ? 'No backend required' : 'Requires backend'}
      </span>
    </div>
  );
};

export default ApiModeToggle;