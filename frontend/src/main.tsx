import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Global stylesheets. These were previously never imported anywhere, which left
// every CSS custom property undefined at runtime — so inline styles such as
// `var(--max-width-site)`, `var(--space-lg)` and `var(--font-heading)` (used
// across nearly every component) silently resolved to nothing. Importing them
// here restores the intended design tokens without changing any component.
// globals.css itself @imports variables.css.
import './styles/globals.css';
import './styles/responsive.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found in index.html');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
