import { useState, useEffect } from 'react'

import TicketModal from './TicketModal'
import DateSelect from '@/components/dateSelect/DateSelect'

import styles from '@/pages/records/ticket/Ticket.module.css'

import CheckIcon from '@/assets/icons/check.png'

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
  const isViewMode = mode === 'view'

  const [step, setStep] = useState(1)

  const [exerciseType, setExerciseType] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [targetCount, setTargetCount] = useState('')
  const [totalAmount, setTotalPrice] = useState('')

  const getOnlyNumber = (value: string) => value.replace(/[^0-9]/g, '')

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const isDirty =
    !isViewMode &&
    (
      exerciseType.trim() !== '' ||
      targetCount.trim() !== '' ||
      totalAmount.trim() !== ''
    )

  const isStep1Valid = exerciseType.trim() !== ''

  const isStep2Valid =
    targetCount.trim() !== '' &&
    totalAmount.trim() !== '' &&
    Number(targetCount) > 0 &&
    Number(totalAmount) > 0 &&
    startDate <= endDate

  const nextDisabled = isViewMode ? false : step === 1 ? !isStep1Valid : !isStep2Valid

  const handleNext = () => {
    if (step === 1) {
      if (!isStep1Valid) return

      setStep(2)
      return
    }

    if (isViewMode) {
      setStep(1)
      return
    }

    if (!isStep2Valid) return

    onConfirm({
      exerciseType,
      colorCode,
      ticketType:
        ticketType === '횟수권'
          ? 'COUNT'
          : 'PERIOD',

      targetCount: Number(targetCount),
      totalAmount: Number(totalAmount),

      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    })
  }

  const handleClose = () => {
    if (isDirty) {
      const ok = window.confirm(
        '작성 중인 내용이 사라집니다. 나가시겠습니까?',
      )

      if (!ok) return
    }

    onClose()
  }

  useEffect(() => {
    if (isViewMode && initialData) {
      setExerciseType(initialData.exerciseType)
      setTargetCount(String(initialData.targetCount))
      setTotalPrice(String(initialData.totalAmount))

      setStartDate(new Date(initialData.startDate))
      setEndDate(new Date(initialData.endDate))
    }
  }, [isViewMode, initialData])

  return (
    <TicketModal
      title={isViewMode ? '이용권 조회' : '이용권 등록'}
      buttonText={
        step === 1
          ? '다음'
          : isViewMode
            ? '이전'
            : '완료'
      }
      onClose={handleClose}
      onNext={handleNext}
      nextDisabled={nextDisabled}
    >
      <div className={isViewMode ? styles.readOnly : ''}>
        {step === 1 && (
          <>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>운동 종목</label>

                <input
                  className={styles.input}
                  value={exerciseType}
                  disabled={isViewMode}
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
                    disabled={isViewMode}
                    className={`${styles.ticketTypeButton} ${
                      ticketType === '횟수권'
                        ? styles.active
                        : ''
                    }`}
                    onClick={() => setTicketType('횟수권')}
                  >
                    횟수권
                  </button>

                  <button
                    type="button"
                    disabled={isViewMode}
                    className={`${styles.ticketTypeButton} ${
                      ticketType === '기간권'
                        ? styles.active
                        : ''
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
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={isViewMode}
                    className={`${styles.colorCircle} ${
                      colorCode === color
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
                  onChange={setStartDate}
                  disabled={isViewMode}
                />

                <span className={styles.periodText}>
                  ~
                </span>

                <DateSelect
                  value={endDate}
                  onChange={setEndDate}
                  disabled={isViewMode}
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
                    disabled={isViewMode}
                    onChange={(e) =>
                      setTargetCount(
                        getOnlyNumber(e.target.value),
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
                    disabled={isViewMode}
                    onChange={(e) =>
                      setTotalPrice(
                        getOnlyNumber(e.target.value),
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

            {isViewMode && isRefunded && (
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
                    disabled
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