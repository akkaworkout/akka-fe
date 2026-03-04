import TicketModal from './TicketModal'
import SummaryCard, { type Exercise } from '../../common/SummaryCard'
import styles from '../../../pages/write/TicketHistory.module.css'

type Ticket = {
  id: number
  exercise_type: string
  color: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count: number
  total_price: number
  start_date: string
  end_date: string
  status: string
}

type Props = {
  ticket: Ticket
  selectedEndType: Exercise
  setSelectedEndType: (value: Exercise) => void
  price: string
  setPrice: (value: string) => void
  onClose: () => void
  onConfirm: () => void
  END_TYPES: Exercise[]
}

const TicketEndModal = ({
  ticket,
  selectedEndType,
  setSelectedEndType,
  price,
  setPrice,
  onClose,
  onConfirm,
  END_TYPES,
}: Props) => {
  const isValid =
    selectedEndType.label !== '환불' ||
    (price.trim() !== '' && Number(price) > 0)

  const isModified =
    selectedEndType.label !== '' ||
    price.trim() !== ''

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
          selected={selectedEndType}
          onChange={setSelectedEndType}
        />
      </div>

      {selectedEndType.label === '환불' && (
        <div className={styles.field}>
          <label>환불 금액*</label>
          <div className={styles.priceInput}>
            <input
              className={styles.input}
              value={price}
              onChange={e =>
                setPrice(e.target.value.replace(/[^0-9]/g, ''))
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