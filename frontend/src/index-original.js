import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Conditionally load App based on mode
const isDemoMode = process.env.REACT_APP_DEMO === 'true';
const App = isDemoMode 
  ? require('./App-test-demo').default 
  : require('./App').default;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);