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
  const [form, setForm] = useState({
    exerciseType: '',
    startDate: new Date(),
    endDate: new Date(),
    targetCount: '',
    totalAmount: '',
  })

  const getOnlyNumber = (value: string) => value.replace(/[^0-9]/g, '')

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  const isDirty =
    !isViewMode &&
    (
      form.exerciseType.trim() !== '' ||
      form.targetCount.trim() !== '' ||
      form.totalAmount.trim() !== ''
    )

  const isStep1Valid = form.exerciseType.trim() !== ''

  const isStep2Valid =
    form.targetCount.trim() !== '' &&
    form.totalAmount.trim() !== '' &&
    Number(form.targetCount) > 0 &&
    Number(form.totalAmount) > 0 &&
    form.startDate <= form.endDate

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
      exerciseType: form.exerciseType,
      colorCode,
      ticketType:
        ticketType === '횟수권'
          ? 'COUNT'
          : 'PERIOD',

      targetCount: Number(form.targetCount),
      totalAmount: Number(form.totalAmount),

      startDate: formatDate(form.startDate),
      endDate: formatDate(form.endDate),
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
    if (!isViewMode || !initialData) return

    setForm({
      exerciseType: initialData.exerciseType,
      targetCount: String(initialData.targetCount),
      totalAmount: String(initialData.totalAmount),
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
    })
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
                <label htmlFor="exerciseType">운동 종목</label>

                <input
                  id="exerciseType"
                  className={styles.input}
                  value={form.exerciseType}
                  disabled={isViewMode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exerciseType: e.target.value,
                    }))
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
                    className={`${styles.ticketTypeButton} ${ticketType === '횟수권'
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
                    className={`${styles.ticketTypeButton} ${ticketType === '기간권'
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
                  value={form.startDate}
                  onChange={(date) =>
                    setForm((prev) => ({
                      ...prev,
                      startDate: date,
                    }))
                  }
                  disabled={isViewMode}
                />

                <span className={styles.periodText}>
                  ~
                </span>

                <DateSelect
                  value={form.endDate}
                  onChange={(date) =>
                    setForm((prev) => ({
                      ...prev,
                      endDate: date,
                    }))
                  }
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="targetCount">목표 횟수</label>

                <div className={styles.priceInput}>
                  <input
                    id="targetCount"
                    className={styles.input}
                    value={form.targetCount}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        targetCount: getOnlyNumber(e.target.value),
                      }))
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
                <label htmlFor='totalAmount'>금액</label>

                <div className={styles.priceInput}>
                  <input
                    id='totalAmount'
                    className={styles.input}
                    value={form.totalAmount}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        totalAmount: getOnlyNumber(e.target.value),
                      }))
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
                <label htmlFor='refundAmount'>환불 금액</label>

                <div className={styles.priceInput}>
                  <input
                    id='refundAmount'
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