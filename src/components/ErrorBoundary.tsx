import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'var(--bg-base)' }}>
          <div className="card-premium" style={{ maxWidth: 400, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Ops! Algo deu errado.</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Encontramos um erro inesperado. Nossa equipe já foi notificada. Tente recarregar a página.
              </p>
            </div>
            
            {this.state.error && (
              <div style={{ padding: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, width: '100%', overflow: 'auto', textAlign: 'left' }}>
                <code style={{ fontSize: 11, color: 'var(--color-danger)', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.message}
                </code>
              </div>
            )}

            <button 
              className="btn-primary" 
              onClick={() => window.location.reload()}
              style={{ width: '100%', marginTop: 8 }}
            >
              <RefreshCw size={18} />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
