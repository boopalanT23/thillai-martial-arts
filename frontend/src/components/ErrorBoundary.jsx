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
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#F9F7F7]">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#DBE2EF] p-8 shadow-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#DBE2EF] text-[#3F72AF] flex items-center justify-center text-3xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="font-sans text-sm text-[#112D4E]/70 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this page. You can reload the page or return to the home screen.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-left text-xs text-rose-700 font-mono overflow-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary justify-center text-xs font-semibold py-2.5 px-5"
              >
                RELOAD PAGE
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-secondary justify-center text-xs font-semibold py-2.5 px-5"
              >
                GO TO HOME
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
