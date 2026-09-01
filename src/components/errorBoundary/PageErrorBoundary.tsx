import type { ErrorInfo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ErrorBoundary,
  type ErrorBoundaryProps,
  type ErrorBoundaryPropsWithRender,
  type FallbackProps,
} from 'react-error-boundary'

import styles from './ErrorBoundary.module.css'

type PageErrorBoundaryProps =
  ErrorBoundaryProps | Omit<ErrorBoundaryPropsWithRender, 'fallbackRender'>

const PageErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate()

  const handleGoMain = () => {
    resetErrorBoundary()
    navigate('/')
  }

  return (
    <div className={styles.pageWrap} role="alert">
      <div className={styles.pageCard}>
        <strong className={styles.title}>이 페이지를 불러오지 못했어요</strong>

        <p className={styles.description}>
          일시적인 오류일 수 있어요. 다시 시도하거나 메인으로 이동해주세요.
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

const renderPageFallback = (props: FallbackProps) => <PageErrorFallback {...props} />

const handlePageError = (error: unknown, errorInfo: ErrorInfo) => {
  console.error('페이지 렌더링 오류:', error, errorInfo)
}

const PageErrorBoundary = (props: PageErrorBoundaryProps) => {
  const location = useLocation()
  const boundaryProps = {
    ...props,
    onError: props.onError ?? handlePageError,
    resetKeys: [location.pathname, ...(props.resetKeys ?? [])],
  }
  const hasCustomFallback =
    'fallback' in props || 'FallbackComponent' in props || 'fallbackRender' in props

  if (hasCustomFallback) {
    return <ErrorBoundary {...(boundaryProps as ErrorBoundaryProps)} />
  }

  const defaultBoundaryProps = {
    ...boundaryProps,
    fallbackRender: renderPageFallback,
  } as ErrorBoundaryProps

  return <ErrorBoundary {...defaultBoundaryProps} />
}

export default PageErrorBoundary
