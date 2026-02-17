import TicketModal from './TicketModal'
import SummaryCard, { type Exercise } from '../../common/SummaryCard'
import styles from '../../../pages/write/TicketHistory.module.css'

type Ticket = {
  id: number
  name: string
  color: string
  period: string
  count: string
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
  return (
    <TicketModal
      title={`이용권 종료 - ${ticket.name}`}
      buttonText="종료"
      onClose={onClose}
      onNext={onConfirm}
    >
      <div className={styles.field}>
        <label>사유*</label>
        <SummaryCard
          exercises={END_TYPES}
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
              placeholder="23,000"
              maxLength={8}
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