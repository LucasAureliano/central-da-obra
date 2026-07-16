import { Toaster, toast } from 'react-hot-toast';

export function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: 'var(--bg-glass)',
          color: 'var(--text-main)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: "'Roboto', sans-serif",
          boxShadow: 'var(--shadow-elevated)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--bg-base)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--bg-base)',
          },
        },
      }}
    />
  );
}

// Re-export toast for easy usage anywhere in the app
export { toast };
