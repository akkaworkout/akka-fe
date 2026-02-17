import { useState } from 'react'
import TicketModal from './TicketModal'
import DateSelect from '../../write/DateSelect'
import styles from '../../../pages/write/TicketHistory.module.css'
import CheckIcon from '../../../assets/icons/check.png'

type Props = {
  ticketType: '횟수권' | '기간권'
  setTicketType: (value: '횟수권' | '기간권') => void
  selectedColor: string
  setSelectedColor: (value: string) => void
  COLOR_OPTIONS: string[]
  onClose: () => void
  onConfirm: () => void
  mode?: 'create' | 'view'
}

const TicketAddModal = ({
  ticketType,
  setTicketType,
  selectedColor,
  setSelectedColor,
  COLOR_OPTIONS,
  onClose,
  onConfirm,
  mode = 'create',
}: Props) => {
  const [step, setStep] = useState(1)

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const [goalCount, setGoalCount] = useState('')
  const [price, setPrice] = useState('')

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      if (mode === 'view') {
        setStep(1)
      } else {
        onConfirm()
      }
    }
  }

  return (
    <TicketModal
      title={mode === 'view' ? '이용권 조회' : '이용권 등록'}
      buttonText={
        step === 1
          ? '다음'
          : mode === 'view'
          ? '이전'
          : '완료'
      }
      onClose={onClose}
      onNext={handleNext}
    >
      <div className={mode === 'view' ? styles.readOnly : ''}>
        {step === 1 && (
          <>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>운동 종목</label>
                <input
                  className={styles.input}
                  placeholder="헬스"
                />
              </div>

              <div className={styles.field}>
                <label>이용권 선택</label>
                <div className={styles.ticketTypeButtons}>
                  <button
                    type="button"
                    className={`${styles.ticketTypeButton} ${
                      ticketType === '횟수권' ? styles.active : ''
                    }`}
                    onClick={() => setTicketType('횟수권')}
                  >
                    횟수권
                  </button>

                  <button
                    type="button"
                    className={`${styles.ticketTypeButton} ${
                      ticketType === '기간권' ? styles.active : ''
                    }`}
                    onClick={() => setTicketType('기간권')}
                  >
                    기간권
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label>색상</label>

              <div className={styles.colorPalette}>
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.colorCircle} ${
                      selectedColor === color ? styles.selected : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <img
                        src={CheckIcon}
                        alt="selected"
                        className={styles.checkIcon}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.field}>
              <label>목표 기간</label>

              <div className={styles.periodRow}>
                <DateSelect
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />

                <span className={styles.periodText}>~</span>

                <DateSelect
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>목표 횟수</label>
                <div className={styles.priceInput}>
                  <input
                    className={styles.input}
                    value={goalCount}
                    onChange={e =>
                      setGoalCount(
                        e.target.value.replace(/[^0-9]/g, '')
                      )
                    }
                    placeholder="24"
                    maxLength={3}
                  />
                  <span className={styles.unit}>회</span>
                </div>
              </div>

              <div className={styles.field}>
                <label>금액</label>
                <div className={styles.priceInput}>
                  <input
                    className={styles.input}
                    value={price}
                    onChange={e =>
                      setPrice(
                        e.target.value.replace(/[^0-9]/g, '')
                      )
                    }
                    placeholder="480,000"
                    maxLength={8}
                  />
                  <span className={styles.unit}>원</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TicketModal>
  )
}

export default TicketAddModal