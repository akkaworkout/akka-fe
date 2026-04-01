import { useState, useEffect } from 'react'
import TicketModal from './TicketModal'
import DateSelect from '../../write/DateSelect'
import styles from '../../../pages/write/TicketHistory.module.css'
import CheckIcon from '../../../assets/icons/check.png'

type Payload = {
  exercise_type: string
  color: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count: number
  total_price: number
  start_date: string
  end_date: string
  refund_price?: number
}

type Props = {
  ticketType: '횟수권' | '기간권'
  setTicketType: (value: '횟수권' | '기간권') => void
  selectedColor: string
  setSelectedColor: (value: string) => void
  COLOR_OPTIONS: string[]
  onClose: () => void
  onConfirm: (data: Payload) => void
  mode?: 'create' | 'view'
  initialData?: Payload
  isRefunded?: boolean
  refund_price?: number
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
  initialData,
  isRefunded = false,
}: Props) => {
  const [step, setStep] = useState(1)

  const [exercise_type, setExerciseType] = useState('')
  const [start_date, setStartDate] = useState(new Date())
  const [end_date, setEndDate] = useState(new Date())
  const [target_count, setTargetCount] = useState('')
  const [total_price, setTotalPrice] = useState('')
  const isDirty =
    mode !== 'view' &&
    (
      exercise_type.trim() !== '' ||
      target_count.trim() !== '' ||
      total_price.trim() !== ''
    )

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isStep1Valid = exercise_type.trim() !== ''

  const isStep2Valid =
    target_count.trim() !== '' &&
    total_price.trim() !== '' &&
    Number(target_count) > 0 &&
    Number(total_price) > 0 &&
    start_date <= end_date

  const handleNext = () => {
    if (step === 1) {
      if (!isStep1Valid) return
      setStep(2)
      return
    }

    if (mode === 'view') {
      setStep(1)
      return
    }

    if (!isStep2Valid) return

    onConfirm({
      exercise_type,
      color: selectedColor,
      ticket_type:
        ticketType === '횟수권' ? 'COUNT' : 'PERIOD',
      target_count: Number(target_count),
      total_price: Number(total_price),
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
    })
  }

  const handleClose = () => {
    if (isDirty) {
      const ok = window.confirm(
        '작성 중인 내용이 사라집니다. 나가시겠습니까?'
      )
      if (!ok) return
    }

    onClose()
  }

  const nextDisabled =
    mode === 'view'
      ? false
      : step === 1
        ? !isStep1Valid
        : !isStep2Valid

  useEffect(() => {
    if (mode === 'view' && initialData) {
      setExerciseType(initialData.exercise_type)
      setTargetCount(String(initialData.target_count))
      setTotalPrice(String(initialData.total_price))
      setStartDate(new Date(initialData.start_date))
      setEndDate(new Date(initialData.end_date))
    }
  }, [mode, initialData])

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
      onClose={handleClose}
      onNext={handleNext}
      nextDisabled={nextDisabled}
    >
      <div className={mode === 'view' ? styles.readOnly : ''}>
        {step === 1 && (
          <>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>운동 종목</label>
                <input
                  className={styles.input}
                  value={exercise_type}
                  disabled={mode === 'view'}
                  onChange={(e) =>
                    setExerciseType(e.target.value)
                  }
                  placeholder="헬스"
                />
              </div>

              <div className={styles.field}>
                <label>이용권 선택</label>
                <div className={styles.ticketTypeButtons}>
                  <button
                    type="button"
                    disabled={mode === 'view'}
                    className={`${styles.ticketTypeButton} ${ticketType === '횟수권'
                      ? styles.active
                      : ''
                      }`}
                    onClick={() =>
                      setTicketType('횟수권')
                    }
                  >
                    횟수권
                  </button>

                  <button
                    type="button"
                    disabled={mode === 'view'}
                    className={`${styles.ticketTypeButton} ${ticketType === '기간권'
                      ? styles.active
                      : ''
                      }`}
                    onClick={() =>
                      setTicketType('기간권')
                    }
                  >
                    기간권
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label>색상</label>
              <div className={styles.colorPalette}>
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={mode === 'view'}
                    className={`${styles.colorCircle} ${selectedColor === color
                      ? styles.selected
                      : ''
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setSelectedColor(color)
                    }
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
                  value={start_date}
                  onChange={(date) =>
                    setStartDate(date)
                  }
                  disabled={mode === 'view'}
                />
                <span className={styles.periodText}>
                  ~
                </span>
                <DateSelect
                  value={end_date}
                  onChange={(date) =>
                    setEndDate(date)
                  }
                  disabled={mode === 'view'}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>목표 횟수</label>
                <div className={styles.priceInput}>
                  <input
                    className={styles.input}
                    value={target_count}
                    disabled={mode === 'view'}
                    onChange={(e) =>
                      setTargetCount(
                        e.target.value.replace(
                          /[^0-9]/g,
                          ''
                        )
                      )
                    }
                    placeholder="24"
                    maxLength={3}
                  />
                  <span className={styles.unit}>
                    회
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <label>금액</label>
                <div className={styles.priceInput}>
                  <input
                    className={styles.input}
                    value={total_price}
                    disabled={mode === 'view'}
                    onChange={(e) =>
                      setTotalPrice(
                        e.target.value.replace(
                          /[^0-9]/g,
                          ''
                        )
                      )
                    }
                    placeholder="480000"
                    maxLength={8}
                  />
                  <span className={styles.unit}>
                    원
                  </span>
                </div>
              </div>
            </div>

            {mode === 'view' && isRefunded && (
              <div className={styles.field}>
                <label>환불 금액</label>
                <div className={styles.priceInput}>
                  <input
                    className={styles.input}
                    value={
                      initialData?.refund_price !== undefined
                        ? String(initialData.refund_price)
                        : ''
                    }
                    disabled={mode === 'view'}
                    placeholder="0"
                    maxLength={8}
                  />
                  <span className={styles.unit}>
                    원
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TicketModal>
  )
}

export default TicketAddModal