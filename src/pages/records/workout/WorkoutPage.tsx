// React / 외부 라이브러리
import { useSearchParams } from 'react-router-dom'

// API / 로직
import { useWorkoutForm } from '@/hooks/useWorkoutForm'
import { useImagePreview } from '@/hooks/useImagePreview'

// 컴포넌트
import RecordLayout from '../layout/RecordLayout';
import Button from '@/components/button/Button';
import RecordSummaryCard from '../components/RecordSummaryCard'

import WorkoutExerciseField from './components/WorkoutExerciseField';
import WorkoutDateField from './components/WorkoutDateField';
import WorkoutResultField from './components/WorkoutResultField'
import WorkoutImageField from './components/WorkoutImageField'
import WorkoutMemoField from './components/WorkoutMemoField';
import WorkoutFailReasonField from './components/WorkoutFailReasonField';

// 스타일
import styles from './Workout.module.css'

const WorkoutPage = () => {
  const [searchParams] = useSearchParams()

  const recordId = Number(
    searchParams.get('record_id')
  )

  const {
    form,
    setForm,
    mappedTickets,
    remainingCount,
    usedCount,
    pricePerSession,
    handleSubmit,
    handleUpdate,
    handleDelete,
    previewUrl,
    setPreviewUrl,
  } = useWorkoutForm(recordId)

  const {
    fileInputRef,
    handleFileChange,
  } = useImagePreview(setForm, setPreviewUrl)

  return (
    <RecordLayout title="운동 기록">
      <div className={styles.write}>
        <div className={styles.row}>
          <WorkoutDateField
            date={form.date}
            setForm={setForm}
          />

          <WorkoutExerciseField
            mappedTickets={mappedTickets}
            selectedExercise={form.exercise}
            recordId={recordId}
            setForm={setForm}
          />
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

        <WorkoutMemoField
          memo={form.memo}
          setForm={setForm}
        />

        {form.workoutResult === '실패' && (
          <WorkoutFailReasonField
            failReason={form.failReason}
            setForm={setForm}
          />
        )}

        <div className={styles.footer}>
          <span className={styles.required}>
            *는 필수 입력사항입니다.
          </span>

          {!recordId ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              완료
            </Button>
          ) : (
            <div className={styles.editButtons}>
              <Button
                variant="gray"
                onClick={handleDelete}
              >
                삭제
              </Button>

              <Button
                variant="primary"
                onClick={handleUpdate}
              >
                수정
              </Button>
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
    </RecordLayout>
  )
}

export default WorkoutPage