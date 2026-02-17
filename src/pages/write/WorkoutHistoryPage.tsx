import { useState, useRef } from 'react'

import WorkoutTabs from '../../components/write/WorkoutTabs'
import DateSelect from '../../components/write/DateSelect'
import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import Card from '../../components/common/Card'
import CheckIcon from '../../components/common/icons/CheckIcon'
import styles from './WorkoutHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'
import uploadIcon from '../../assets/icons/upload.png'

const EXERCISES: Exercise[] = [
  { id: 1, label: '발레', color: 'rgb(252, 215, 255)' },
  { id: 2, label: '헬스', color: '#DAD7FF' },
  { id: 3, label: '필라테스', color: '#FFE6CC' },
  { id: 4, label: '수영', color: '#E0F0FF' },
]

const WorkoutHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [date, setDate] = useState<Date>(new Date())
  const [result, setResult] = useState<'성공' | '실패'>('성공')
  const [memo, setMemo] = useState('')
  const [failReason, setFailReason] = useState('')

  const [selectedExercise, setSelectedExercise] = useState<Exercise>(
    EXERCISES[0]
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [remainingCount, setRemainingCount] = useState<number>(24) // 목표 잔여 횟수
  const [totalCount, setTotalCount] = useState<number>(15) // 누적 운동 횟수
  const [pricePerSession, setPricePerSession] = useState<number>(20000) // 회당 금액

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
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
                <DateSelect value={date} onChange={setDate} />
              </div>

              <div className={styles.field}>
                <label>운동 종목*</label>
                <SummaryCard
                  exercises={EXERCISES}
                  selected={selectedExercise}
                  onChange={setSelectedExercise}
                  showAddButton
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>결과*</label>
              <div className={styles.resultButtons}>
                <button
                  type="button"
                  className={`${styles.resultBtn} ${result === '성공' ? styles.success : ''
                    }`}
                  onClick={() => setResult('성공')}
                >
                  성공
                </button>

                <button
                  type="button"
                  className={`${styles.resultBtn} ${result === '실패' ? styles.fail : ''
                    }`}
                  onClick={() => setResult('실패')}
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
                onChange={e => setMemo(e.target.value)}
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
                  onChange={e => setFailReason(e.target.value)}
                  placeholder="실패 이유"
                  maxLength={7}
                />
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.required}>
                *는 필수 입력사항입니다.
              </span>
              <button className={styles.submitBtn}>완료</button>
            </div>
          </div>

          <div className={styles.currentRecord}>
            <Card
              title="이번 기록으로 이렇게 반영돼요"
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
                  <span>누적 운동 횟수: {totalCount}회</span>
                </li>

                <li className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>
                  <span>
                    회당 금액:{' '}
                    {pricePerSession.toLocaleString()}원
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