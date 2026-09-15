import { useEffect, useState } from 'react'
import { type Notice } from '@/utils/notify'
import styles from './NoticeCenter.module.css'

export default function NoticeCenter() {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    const onNotice = (event: Event) => {
      const notice = (event as CustomEvent<Notice>).detail
      setNotices((current) => [...current.slice(-2), notice])
      window.setTimeout(
        () => setNotices((current) => current.filter((item) => item.id !== notice.id)),
        4000,
      )
    }
    window.addEventListener('akka:notice', onNotice)
    return () => window.removeEventListener('akka:notice', onNotice)
  }, [])

  return (
    <div className={styles.center} aria-live="polite" aria-atomic="false">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className={`${styles.notice} ${styles[notice.tone]}`}
          role={notice.tone === 'error' ? 'alert' : 'status'}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={() => setNotices((current) => current.filter((item) => item.id !== notice.id))}
            aria-label="알림 닫기"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
