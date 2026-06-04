// React / 외부 라이브러리
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// API / 로직
import {
  getActiveTickets,
  getExerciseSummary,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseDetail,
} from '@/api/exerciseApi'

// 컴포넌트
import WorkoutTabs from "@/components/recordTabs/RecordTabs";
import DateSelect from "@/components/dateSelect/DateSelect";
import SummaryCard, { type Exercise } from '@/components/summaryCard/SummaryCard'
import RecordSummaryCard from '../components/RecordSummaryCard'
import WorkoutResultField from './components/WorkoutResultField'
import WorkoutImageField from './components/WorkoutImageField'

// 스타일
import styles from './Workout.module.css'

type Ticket = {
  id: number
  exercise_type: string
  color_code: string
}

const WorkoutPage = () => {
  // 라우팅 / 외부 값
  const [searchParams] = useSearchParams()
  const recordId = Number(searchParams.get('record_id'))
  const navigate = useNavigate()

  // UI 상태
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 핵심 데이터 (form)
  const [form, setForm] = useState({
    date: new Date(),
    workoutResult: '성공' as '성공' | '실패',
    memo: '',
    failReason: '',
    exercise: {
      id: 0,
      label: '',
      color: '',
    },
    imageFile: null as File | null,
  })

  // 서버 데이터
  const [ticketList, setTicketList] = useState<Ticket[]>([])

  // 파생 UI 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 요약 데이터
  const [remainingCount, setRemainingTime] = useState<number>(0)
  const [usedCount, setUsedCount] = useState<number>(0)
  const [pricePerSession, setPricePerSession] = useState<number>(0)

  const mappedTickets: Exercise[] = ticketList.map((ticket) => ({
    id: ticket.id,
    label: ticket.exercise_type,
    color: ticket.color_code,
  }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(prev => ({
      ...prev,
      imageFile: file
    }))
    setPreviewUrl(URL.createObjectURL(file))
  }

  const getExercise = async () => {
    try {
      const tickets = await getActiveTickets()

      setTicketList(tickets)

      if (tickets.length > 0) {
        setForm(prev => ({
          ...prev,
          exercise: {
            id: tickets[0].id,
            label: tickets[0].exercise_type,
            color: tickets[0].color_code,
          }
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      await createExercise(form)

      alert('운동 기록이 완료되었습니다.')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    if (!recordId) return

    try {
      await updateExercise(recordId, form)

      alert('운동 기록이 수정되었습니다.')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    if (!recordId) return

    const ok = window.confirm(
      '정말 삭제하시겠습니까?'
    )

    if (!ok) return

    try {
      await deleteExercise(recordId)

      alert('운동 기록이 삭제되었습니다.')

      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const getSummary = async (ticketId: number) => {
    try {
      const data = await getExerciseSummary(ticketId)

      console.log('summary data:', data)

      setRemainingTime(data.remainingCount)
      setUsedCount(data.usedCount)
      setPricePerSession(data.amountPerSession ?? 0)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getExercise()
  }, [])

  useEffect(() => {
    if (!form.exercise.id) return
    getSummary(form.exercise.id)
  }, [form.exercise.id])

  useEffect(() => {
    if (!recordId || ticketList.length === 0) return

    const getRecord = async () => {
      try {
        const data = await getExerciseDetail(recordId)

        const isSuccess =
          data.success === 1 ||
          data.success === true

        const exerciseDate = data.exercise_date
          ? new Date(data.exercise_date)
          : new Date()

        setForm(prev => ({
          ...prev,
          date: exerciseDate,
          memo: data.memo ?? '',
          workoutResult: isSuccess ? '성공' : '실패',
          failReason: data.fail_reason ?? '',
        }))

        const ticket = ticketList.find(
          t => t.id === data.ticket_id
        )

        if (ticket) {
          setForm(prev => ({
            ...prev,
            exercise: {
              id: ticket.id,
              label: ticket.exercise_type,
              color: ticket.color_code,
            }
          }))
        }

        if (data.image_url) {
          setPreviewUrl(
            `${import.meta.env.VITE_API_URL}${data.image_url}`
          )

          setForm(prev => ({
            ...prev,
            imageFile: null
          }))
        } else {
          setPreviewUrl(null)

          setForm(prev => ({
            ...prev,
            imageFile: null
          }))
        }

      } catch (error) {
        console.error(error)
      }
    }

    getRecord()
  }, [recordId, ticketList])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className={styles.wrap}>
      <main className={styles.writePage}>
        <div className={styles.writeInner}>
          <div className={styles.title}>운동 기록</div>

          <div className={styles.tabContainer}>
            <WorkoutTabs />
          </div>

          <div className={styles.write}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>날짜*</label>
                <DateSelect
                  value={form.date}
                  onChange={(newDate) => {
                    setForm(prev => ({
                      ...prev,
                      date: newDate
                    }))
                  }}
                />
              </div>

              <div className={styles.field}>
                <label>운동 종목*</label>
                <SummaryCard<Exercise>
                  expenses={mappedTickets}
                  selected={form.exercise}
                  disabled={!!recordId}
                  showAddButton={true}
                  onChange={(value) => {
                    if (recordId) return
                    setForm(prev => ({
                      ...prev,
                      exercise: value
                    }))
                  }}
                />
              </div>
            </div>

            <WorkoutResultField
              workoutResult={form.workoutResult}
              failReason={form.failReason}
              setForm={setForm}
            />

            <WorkoutImageField
              previewUrl={previewUrl}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              setPreviewUrl={setPreviewUrl}
              setForm={setForm}
            />

            <div className={styles.field}>
              <label>메모</label>
              <input
                className={styles.input}
                value={form.memo}
                onChange={e => {
                  setForm(prev => ({
                    ...prev,
                    memo: e.target.value
                  }))
                }}
                placeholder="메모"
                maxLength={30}
              />
            </div>

            {form.workoutResult === '실패' && (
              <div className={styles.field}>
                <label>
                  실패 이유 <span className={styles.limit}>(7자 이하)</span>
                </label>
                <input
                  className={styles.input}
                  value={form.failReason}
                  onChange={e => {
                    setForm(prev => ({
                      ...prev,
                      failReason: e.target.value
                    }))
                  }}
                  placeholder="실패 이유"
                  maxLength={7}
                />
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.required}>
                *는 필수 입력사항입니다.
              </span>

              {!recordId ? (
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                >
                  완료
                </button>
              ) : (
                <div className={styles.editButtons}>
                  <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                  <button
                    className={styles.submitBtn}
                    onClick={handleUpdate}
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          </div>

          <RecordSummaryCard
            title="현재 이용권 상태는 다음과 같아요"
            items={[
              `목표 잔여 횟수: ${remainingCount}회 남음`,
              `누적 운동 횟수: ${usedCount}회`,
              `회당 금액: ${pricePerSession.toLocaleString()}원`,
            ]}
          />
        </div>
      </main>
    </div>
  )
}

export default WorkoutPage