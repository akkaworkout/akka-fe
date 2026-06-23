import TicketModal from './TicketModal'

import SummaryCard, { type Exercise } from '@/components/summaryCard/SummaryCard'

import type { TicketItem } from '@/hooks/useTickets'

import styles from './TicketModal.module.css'

type Props = {
  ticket: TicketItem
  endReason: Exercise
  setEndReason: (value: Exercise) => void
  refundAmount: string
  setRefundAmount: (value: string) => void
  onClose: () => void
  onConfirm: () => void
  END_TYPES: Exercise[]
}

const TicketEndModal = ({
  ticket,
  endReason,
  setEndReason,
  refundAmount,
  setRefundAmount,
  onClose,
  onConfirm,
  END_TYPES,
}: Props) => {
  const isValid =
    endReason.label !== '환불' ||
    (refundAmount.trim() !== '' && Number(refundAmount) > 0)

  const isModified =
    endReason.label !== '' ||
    refundAmount.trim() !== ''

  const handleClose = () => {
    if (isModified) {
      const ok = window.confirm(
        '작성 중인 내용이 사라집니다. 나가시겠습니까?'
      )
      if (!ok) return
    }

    onClose()
  }

  const handleConfirm = () => {
    if (!isValid) return

    onConfirm()
  }

  return (
    <TicketModal
      title={`이용권 종료 - ${ticket.exercise_type}`}
      buttonText="종료"
      onClose={handleClose}
      onNext={handleConfirm}
      nextDisabled={!isValid}
    >
      <div className={styles.field}>
        <label>사유*</label>
        <SummaryCard
          expenses={END_TYPES}
          selected={endReason}
          onChange={setEndReason}
        />
      </div>

      {endReason.label === '환불' && (
        <div className={styles.field}>
          <label htmlFor='refundAmount'>환불 금액*</label>
          <div className={styles.priceInput}>
            <input
              id='refundAmount'
              className={styles.input}
              value={refundAmount}
              onChange={e =>
                setRefundAmount(e.target.value.replace(/[^0-9]/g, ''))
              }
              placeholder="23000"
              maxLength={8}
              autoFocus
            />
            <span className={styles.unit}>원</span>
          </div>
        </div>
      )}

      <span className={styles.alert}>
        *한번 종료된 이용권은 복구할 수 없습니다.
      </span>
    </TicketModal>
  )
}

export default TicketEndModal