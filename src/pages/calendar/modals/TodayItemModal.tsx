import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { buildApiUrl } from '@/api/api'

import Modal from '@/components/modal/Modal'

import styles from './TodayItemModal.module.css'

type Status = '성공' | '실패' | '구매' | '이용권 등록'

type Props = {
  item: {
    id: number
    date: string
    name: string
    status: Status
    amount: number
    memo?: string
    image_url?: string
  }
  onClose: () => void
}

const TodayItemModal = ({ item, onClose }: Props) => {
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()
  const hasMemo = Boolean(item.memo?.trim())

  const formatDate = (date: string) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${year}년 ${month}월 ${day}일`
  }

  const alertTextMap: Partial<Record<Status, (amount: number) => string>> = {
    성공: (amount) => `운동 성공: 오늘의 성공으로 ${amount.toLocaleString()}원에 다녀왔어요😆`,
    실패: (amount) => `운동 실패: ${amount.toLocaleString()}원이 날아갔어요🥲`,
    구매: (amount) => `구매 완료: ${amount.toLocaleString()}원 결제했어요 🛒`,
  }

  const alertClassMap: Record<Status, string> = {
    성공: styles.success,
    실패: styles.fail,
    구매: styles.purchase,
    '이용권 등록': styles.ticket,
  }

  const alertText =
    item.status === '이용권 등록'
      ? '이용권이 등록되었습니다 🎫'
      : (alertTextMap[item.status]?.(item.amount) ?? '')

  return (
    <Modal
      title={formatDate(item.date)}
      onClose={onClose}
      footer={
        <button className={styles.editBtn} onClick={() => navigate(`/write?record_id=${item.id}`)}>
          수정하러 가기
        </button>
      }
    >
      <div className={styles.images}>
        {item.image_url && !imageError ? (
          <img
            src={buildApiUrl(item.image_url)}
            alt="운동 기록"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.noImage} role="status">
            {imageError ? '이미지를 불러오지 못했어요' : '등록된 이미지가 없어요'}
          </div>
        )}
      </div>

      <div className={`${styles.alert} ${alertClassMap[item.status]}`}>{alertText}</div>

      <div className={styles.section}>
        <div className={styles.label}>{item.name}</div>
        {hasMemo ? (
          <div className={styles.memo}>{item.memo}</div>
        ) : (
          <p className={styles.emptyMemo}>작성된 메모가 없어요</p>
        )}
      </div>
    </Modal>
  )
}

export default TodayItemModal
