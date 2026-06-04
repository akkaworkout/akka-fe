// React / 외부 라이브러리
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// API / 로직
import api from '@/api/client'
import { ticketApi } from '@/api/ticket'
import { exerciseApi } from '@/api/exercise'

// 컴포넌트
import WorkoutTabs from '@/components/records/WorkoutTabs'
import DateSelect from '@/components/records/DateSelect'
import SummaryCard, { type Exercise } from '@/components/common/SummaryCard'
import Card from '@/components/common/Card'
import CheckIcon from '@/components/common/icons/CheckIcon'

// 에셋
import uploadIcon from '@/assets/icons/upload.png'

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

      const response = await api.get(`${ticketApi.BASE}/active`)

      setTicketList(response.data)

      if (response.data.length > 0) {
        setForm(prev => ({
          ...prev,
          exercise: {
            id: response.data[0].id,
            label: response.data[0].exercise_type,
            color: response.data[0].color_code,
          }
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleSubmit = async () => {
    try {

      const formData = buildFormData()

      await api.post(exerciseApi.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('운동 기록이 완료되었습니다.')
      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const buildFormData = () => {
    const formData = new FormData()

    formData.append('exercise_date', formatDate(form.date))
    formData.append('success', form.workoutResult === '성공' ? 'true' : 'false')
    formData.append('memo', form.memo)
    formData.append('ticket_id', String(form.exercise.id))

    if (form.workoutResult === '실패') {
      formData.append('fail_reason', form.failReason)
    }

    if (form.imageFile) {
      formData.append('image', form.imageFile)
    }

    return formData
  }

  const handleUpdate = async () => {
    if (!recordId) return

    try {

      const formData = buildFormData()

      await api.patch(
        exerciseApi.DETAIL(recordId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      alert('운동 기록이 수정되었습니다.')
      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    if (!recordId) return

    const ok = window.confirm('정말 삭제하시겠습니까?')
    if (!ok) return

    try {
      await api.delete(exerciseApi.DETAIL(recordId))

      alert('운동 기록이 삭제되었습니다.')
      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const getSummary = async (ticketId: number) => {
    try {
      const { data } = await api.get(
        ticketApi.SUMMARY(ticketId)
      )

      console.log("summary data:", data)
      setRemainingTime(data.remainingCount);
      setUsedCount(data.usedCount);
      setPricePerSession(data.amountPerSession ?? 0);

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
        const { data } = await api.get(
          exerciseApi.DETAIL(recordId)
        )

        const isSuccess = data.success === 1 || data.success === true
        const exerciseDate = data.exercise_date ? new Date(data.exercise_date) : new Date()

        setForm(prev => ({
          ...prev,
          date: exerciseDate,
          memo: data.memo ?? '',
          workoutResult: isSuccess ? '성공' : '실패',
          failReason: data.fail_reason ?? '',
        }))

        const ticket = ticketList.find(t => t.id === data.ticket_id)
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
          setPreviewUrl(`${import.meta.env.VITE_API_URL}${data.image_url}`)
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

            <div className={styles.field}>
              <label>결과*</label>
              <div className={styles.resultButtons}>
                <button
                  type="button"
                  className={`${styles.resultBtn} ${form.workoutResult === '성공' ? styles.success : ''}`}
                  onClick={() => {
                    if (
                      form.workoutResult === '실패' &&
                      form.failReason.trim() !== ''
                    ) {
                      const ok = window.confirm('작성 중인 실패 이유가 사라집니다. 계속하시겠습니까?')
                      if (!ok) return
                    }

                    setForm(prev => ({
                      ...prev,
                      workoutResult: '성공',
                      failReason: ''
                    }))
                  }}
                >
                  성공
                </button>

                <button
                  type="button"
                  className={`${styles.resultBtn} ${form.workoutResult === '실패' ? styles.fail : ''}`}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      workoutResult: '실패'
                    }))
                  }}
                >
                  실패
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label>사진 첨부</label>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {!previewUrl ? (
                <button
                  type="button"
                  className={styles.uploadBox}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img src={uploadIcon} alt="upload_icon" />
                  파일 업로드
                </button>
              ) : (
                <div className={styles.imagePreviewBox}>
                  <img
                    src={previewUrl}
                    alt="preview"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        imageFile: null
                      }))
                      setPreviewUrl(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

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

          <div className={styles.currentRecord}>
            <Card
              title="현재 이용권 상태는 다음과 같아요"
              width={386}
              height={227}
              radius={20}
              backgroundColor="#ffffff"
            >
              <ul className={styles.recordPreview}>
                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>목표 잔여 횟수: {remainingCount}회 남음</span>
                </li>

                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>누적 운동 횟수: {usedCount}회</span>
                </li>

                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>
                    회당 금액: {pricePerSession.toLocaleString()}원
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default WorkoutPage