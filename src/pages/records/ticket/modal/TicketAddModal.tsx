import { useState, useEffect } from "react";
import TicketModal from "./TicketModal";
import DateSelect from "@/components/records/DateSelect";
import styles from "@/pages/records/ticket/Ticket.module.css";
import CheckIcon from "@/assets/icons/check.png";

type Payload = {
  exerciseType: string
  colorCode: string
  ticketType: 'COUNT' | 'PERIOD'
  targetCount: number
  totalAmount: number
  startDate: string
  endDate: string
  refundAmount?: number
}

type Props = {
  ticketType: '횟수권' | '기간권'
  setTicketType: (value: '횟수권' | '기간권') => void
  colorCode: string
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
  colorCode,
  setSelectedColor,
  COLOR_OPTIONS,
  onClose,
  onConfirm,
  mode = 'create',
  initialData,
  isRefunded = false,
}: Props) => {
  const [step, setStep] = useState(1)

  const [exerciseType, setExerciseType] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [targetCount, setTargetCount] = useState('')
  const [totalAmount, setTotalPrice] = useState('')
  const isDirty =
    mode !== 'view' &&
    (
      exerciseType.trim() !== '' ||
      targetCount.trim() !== '' ||
      totalAmount.trim() !== ''
    )

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isStep1Valid = exerciseType.trim() !== ''

  const isStep2Valid =
    targetCount.trim() !== '' &&
    totalAmount.trim() !== '' &&
    Number(targetCount) > 0 &&
    Number(totalAmount) > 0 &&
    startDate <= endDate

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
      exerciseType,
      colorCode,
      ticketType: ticketType === '횟수권' ? 'COUNT' : 'PERIOD',
      targetCount: Number(targetCount),
      totalAmount: Number(totalAmount),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
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
      setExerciseType(initialData.exerciseType)
      setTargetCount(String(initialData.targetCount))
      setTotalPrice(String(initialData.totalAmount))
      setStartDate(new Date(initialData.startDate))
      setEndDate(new Date(initialData.endDate))
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
                  value={exerciseType}
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
                    className={`${styles.colorCircle} ${colorCode === color
                      ? styles.selected
                      : ''
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                  >
                    {colorCode === color && (
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
                  onChange={(date) =>
                    setStartDate(date)
                  }
                  disabled={mode === 'view'}
                />
                <span className={styles.periodText}>
                  ~
                </span>
                <DateSelect
                  value={endDate}
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
                    value={targetCount}
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
                    value={totalAmount}
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
                      initialData?.refundAmount !== undefined
                        ? String(initialData.refundAmount)
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