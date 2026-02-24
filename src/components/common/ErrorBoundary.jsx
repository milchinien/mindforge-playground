import { Component } from 'react'
import i18n from '../../i18n/index.js'
import { logError } from '../../utils/errorLogger'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logError(error, {
      componentStack: errorInfo?.componentStack,
      source: 'ErrorBoundary',
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const t = (key) => i18n.t(key)
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6" role="alert">
          <div className="bg-bg-secondary rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
            <span className="text-5xl block mb-4" aria-hidden="true">{'\u26A0\uFE0F'}</span>
            <h1 className="text-2xl font-bold text-text-primary mb-2">{t('errors.somethingWentWrong')}</h1>
            <p className="text-text-secondary mb-6">
              {t('errors.unexpectedError')}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs text-error bg-bg-card rounded-lg p-3 mb-6 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                {t('errors.retry')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-bg-card hover:bg-gray-600 text-text-secondary px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                {t('errors.reloadPage')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
