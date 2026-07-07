import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AuthModalProvider } from './contexts/AuthModalContext.tsx';

// Optional: register the PWA service worker automatically
if ('serviceWorker' in navigator) {
  // @ts-ignore
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {
    // Ignore errors in dev or if unsupported
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
    </AuthProvider>
  </StrictMode>,
);
