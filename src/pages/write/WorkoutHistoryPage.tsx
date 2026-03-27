import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../api/write'
import { TICKET_ENDPOINTS } from '../../api/write'
import { useNavigate, useSearchParams } from 'react-router-dom'

import WorkoutTabs from '../../components/write/WorkoutTabs'
import DateSelect from '../../components/write/DateSelect'
import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import Card from '../../components/common/Card'
import CheckIcon from '../../components/common/icons/CheckIcon'
import styles from './WorkoutHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'
import uploadIcon from '../../assets/icons/upload.png'

const WorkoutHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [date, setDate] = useState<Date>(new Date())
  const [result, setResult] = useState<'성공' | '실패'>('성공')
  const [memo, setMemo] = useState('')
  const [failReason, setFailReason] = useState('')

  const [tickets, setTickets] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise>({
    id: 0,
    label: '',
    color: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [remainingCount, setRemainingTime] = useState<number>(0)
  const [usedCount, setUsedCount] = useState<number>(0)
  const [pricePerSession, setPricePerSession] = useState<number>(0)

  const [searchParams] = useSearchParams()
  const recordId = searchParams.get('record_id')

  const navigate = useNavigate()

  const mappedTickets: Exercise[] = tickets.map((ticket) => ({
    id: ticket.ticket_id,
    label: ticket.exercise_type,
    color: ticket.color,
  }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const getExercise = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await axios.get(
        `${API_BASE_URL}/tickets/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setTickets(response.data)

      if (response.data.length > 0) {
        setSelectedExercise({
          id: response.data[0].ticket_id,
          label: response.data[0].exercise_type,
          color: response.data[0].color,
        })
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

  const handleBtnClick = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token || !selectedExercise) return

      const formData = new FormData()

      formData.append('exercise_date', formatDate(date))
      formData.append('success', result === '성공' ? 'true' : 'false')
      formData.append('memo', memo)
      formData.append('ticket_id', String(selectedExercise.id))

      if (result === '실패') {
        formData.append('fail_reason', failReason)
      }

      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await axios.post(
        `${API_BASE_URL}/exercise-record`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      alert('운동 기록이 완료되었습니다.')
      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    if (!recordId) return

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const formData = new FormData()

      formData.append('exercise_date', formatDate(date))
      formData.append('success', result === '성공' ? 'true' : 'false')
      formData.append('memo', memo)
      formData.append('ticket_id', String(selectedExercise.id))

      if (result === '실패') {
        formData.append('fail_reason', failReason)
      }

      if (imageFile) {
        formData.append('image', imageFile)
      }

      await axios.patch(
        `${API_BASE_URL}/exercise-record/${recordId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      const token = localStorage.getItem('accessToken')
      if (!token) return

      await axios.delete(
        `${API_BASE_URL}/exercise-record/${recordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('운동 기록이 삭제되었습니다.')
      navigate('/calendar')
    } catch (error) {
      console.log(error)
    }
  }

  const getSummary = async (ticketId: number) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const { data } = await axios.get(
        `${API_BASE_URL}${TICKET_ENDPOINTS.SUMMARY(ticketId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("summary data:", data)
      setRemainingTime(data.remainingCount);
      setUsedCount(data.usedCount);
      setPricePerSession(data.pricePerSession);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getExercise()
  }, [])

  useEffect(() => {
    if (!selectedExercise.id) return

    getSummary(selectedExercise.id)
  }, [selectedExercise])

  useEffect(() => {
    if (!recordId || tickets.length === 0) return

    const getRecord = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const { data } = await axios.get(`${API_BASE_URL}/exercise-record/${recordId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const isSuccess = data.success === 1 || data.success === true
        const exerciseDate = data.exercise_date ? new Date(data.exercise_date) : new Date()

        setDate(exerciseDate)
        setMemo(data.memo ?? '')
        setResult(isSuccess ? '성공' : '실패')
        setFailReason(data.fail_reason ?? '')

        const ticket = tickets.find(t => t.ticket_id === data.ticket_id)
        if (ticket) {
          setSelectedExercise({
            id: ticket.ticket_id,
            label: ticket.exercise_type,
            color: ticket.color,
          })
        }

        if (data.image_url) {
          setPreviewUrl(`${API_BASE_URL}${data.image_url}`)
          setImageFile(null)
        } else {
          setPreviewUrl(null)
          setImageFile(null)
        }

      } catch (error) {
        console.error(error)
      }
    }

    getRecord()
  }, [recordId, tickets])

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => {
          setIsSidebarFolded(prev => !prev)
        }}
      />

      <main
        className={styles.writePage}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
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
                  value={date}
                  onChange={(newDate) => {
                    setDate(newDate)
                  }}
                />
              </div>

              <div className={styles.field}>
                <label>운동 종목*</label>
                <SummaryCard<Exercise>
                  expenses={mappedTickets}
                  selected={selectedExercise}
                  disabled={!!recordId}
                  showAddButton={true}
                  onChange={(value) => {
                    if (recordId) return
                    setSelectedExercise(value)
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>결과*</label>
              <div className={styles.resultButtons}>
                <button
                  type="button"
                  className={`${styles.resultBtn} ${result === '성공' ? styles.success : ''}`}
                  onClick={() => {
                    if (
                      result === '실패' &&
                      failReason.trim() !== ''
                    ) {
                      const ok = window.confirm('작성 중인 실패 이유가 사라집니다. 계속하시겠습니까?')
                      if (!ok) return
                    }

                    setResult('성공')
                    setFailReason('')
                  }}
                >
                  성공
                </button>

                <button
                  type="button"
                  className={`${styles.resultBtn} ${result === '실패' ? styles.fail : ''}`}
                  onClick={() => {
                    setResult('실패')
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
                      setImageFile(null)
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
                value={memo}
                onChange={e => {
                  setMemo(e.target.value)
                }}
                placeholder="메모"
                maxLength={30}
              />
            </div>

            {result === '실패' && (
              <div className={styles.field}>
                <label>
                  실패 이유 <span className={styles.limit}>(7자 이하)</span>
                </label>
                <input
                  className={styles.input}
                  value={failReason}
                  onChange={e => {
                    setFailReason(e.target.value)
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
                  onClick={handleBtnClick}
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

export default WorkoutHistoryPage