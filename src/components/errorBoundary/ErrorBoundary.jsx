import { Component } from 'react';
import { Button } from '../common/Button.jsx';

/**
 * Catches render-time errors in the subtree and shows a recovery UI instead of
 * a blank white screen. Class component because error boundaries require it.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real app this would report to Sentry / a logging service.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: 'var(--space-6) 0' }}>
          <div className="card" role="alert">
            <h1>Something went wrong</h1>
            <p>
              An unexpected error occurred while rendering this page. You can
              try again — your data is safe.
            </p>
            <Button onClick={this.handleReset}>Try again</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
