import type { ErrorInfo } from 'react'
import {
  ErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorBoundaryPropsWithRender,
  type FallbackProps,
} from 'react-error-boundary'

import logoSymbol from '@/assets/brand/akka-logo-symbol.png'

import styles from './ErrorBoundary.module.css'

type AppErrorBoundaryProps =
  ErrorBoundaryProps | Omit<ErrorBoundaryPropsWithRender, 'fallbackRender'>

const AppErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  const handleGoMain = () => {
    resetErrorBoundary()
    window.location.assign('/')
  }

  return (
    <div className={styles.wrap} role="alert">
      <div className={styles.card}>
        <img src={logoSymbol} alt="Akkaworkout" className={styles.logo} />

        <strong className={styles.title}>잠시 문제가 생겼어요</strong>

        <p className={styles.description}>
          화면을 불러오는 중 오류가 발생했어요. 다시 시도하거나 메인으로 이동해주세요.
        </p>

        <div className={styles.actions}>
          <button type="button" onClick={resetErrorBoundary} className={styles.primaryButton}>
            다시 시도
          </button>

          <button type="button" onClick={handleGoMain} className={styles.secondaryButton}>
            메인으로
          </button>
        </div>
      </div>
    </div>
  )
}

const renderAppFallback = (props: FallbackProps) => <AppErrorFallback {...props} />

const handleAppError = (error: unknown, errorInfo: ErrorInfo) => {
  console.error('애플리케이션 렌더링 오류:', error, errorInfo)
}

const AppErrorBoundary = (props: AppErrorBoundaryProps) => {
  const boundaryProps = {
    ...props,
    onError: props.onError ?? handleAppError,
  }
  const hasCustomFallback =
    'fallback' in props || 'FallbackComponent' in props || 'fallbackRender' in props

  if (hasCustomFallback) {
    return <ErrorBoundary {...(boundaryProps as ErrorBoundaryProps)} />
  }

  const defaultBoundaryProps = {
    ...boundaryProps,
    fallbackRender: renderAppFallback,
  } as ErrorBoundaryProps

  return <ErrorBoundary {...defaultBoundaryProps} />
}

export default AppErrorBoundary
