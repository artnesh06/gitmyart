import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
        }}>
          <h1>Oops! Something went wrong</h1>
          <p style={{ marginTop: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
