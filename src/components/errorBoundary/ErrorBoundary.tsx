import { Component, type ErrorInfo, type ReactNode } from 'react'

import logoSymbol from '@/assets/brand/akka-logo-symbol.png'

import styles from './ErrorBoundary.module.css'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('렌더링 에러:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoMain = () => {
    window.location.href = '/main'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <div className={styles.card}>
            <img src={logoSymbol} alt="Akkaworkout" className={styles.logo} />

            <strong className={styles.title}>잠시 문제가 생겼어요</strong>

            <p className={styles.description}>
              화면을 불러오는 중 오류가 발생했어요. 새로고침 후 다시 시도해주세요.
            </p>

            <div className={styles.actions}>
              <button type="button" onClick={this.handleReload} className={styles.primaryButton}>
                새로고침
              </button>

              <button type="button" onClick={this.handleGoMain} className={styles.secondaryButton}>
                메인으로
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
