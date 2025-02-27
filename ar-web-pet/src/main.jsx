import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app');

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element with ID "app" not found!');
  }
});