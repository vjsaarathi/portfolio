import React, { Component, ErrorInfo } from 'react';
import { moduleTracker } from '@impossible-resume/runtime-tracker';
import { eventBus } from '@impossible-resume/event-bus';

interface Props {
  moduleName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, retryCount: 0 };
  private unsubscribers: Array<() => void> = [];

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidMount() {
    this.unsubscribers.push(
      eventBus.subscribe('ops:failure_recovered', 'devtools', (payload: any) => {
        const module = payload.data?.module ?? payload.module;
        if (module === this.props.moduleName && this.state.hasError) {
          this.handleRetry();
        }
      })
    );
    this.unsubscribers.push(
      eventBus.subscribe('ops:all_recovered', 'devtools', () => {
        if (this.state.hasError) this.handleRetry();
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribers.forEach(unsub => unsub());
  }


  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    moduleTracker.addEvent(
      'module_error',
      this.props.moduleName,
      `Error boundary caught: ${error.message}`
    );
    eventBus.emit('module:error', this.props.moduleName, {
      error: error.message,
      stack: errorInfo.componentStack,
    });
  }

  handleRetry = (): void => {
    moduleTracker.addEvent(
      'module_load',
      this.props.moduleName,
      `Retrying ${this.props.moduleName} (attempt ${this.state.retryCount + 1})...`
    );
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary-fallback glass-card" style={{ margin: '2rem', padding: '2rem', textAlign: 'center' }}>
          <div className="error-boundary-icon" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-error)' }}>⚠</div>
          <h3 className="error-boundary-title" style={{ marginBottom: '0.5rem' }}>
            {this.props.moduleName} failed to load
          </h3>
          <p className="error-boundary-message" style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="error-boundary-retry"
            onClick={this.handleRetry}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent-primary)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Retry ({this.state.retryCount} attempts)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
