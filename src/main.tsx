import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { queryClient } from './lib/queryClient';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={8}
            toastOptions={{
              duration: 3500,
              className: 'nc-toast',
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 600,
                padding: '12px 18px',
                boxShadow:
                  '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0f172a',
                },
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
