import type { WorkoutFormSetter } from '../types/workoutTypes'

import Button from '@/components/button/Button'

import styles from '../Workout.module.css'

type Props = {
  previewUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  setPreviewUrl: React.Dispatch<
    React.SetStateAction<string | null>
  >
  setForm: WorkoutFormSetter
}

const WorkoutImageField = ({
  previewUrl,
  fileInputRef,
  handleFileChange,
  setPreviewUrl,
  setForm,
}: Props) => {
  return (
    <div className={styles.field}>
      <label htmlFor='imageFile'>사진 첨부</label>

      <input
        id='imageFile'
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {!previewUrl ? (
        <Button
          type="button"
          variant="file"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          파일 업로드
        </Button>
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
              setForm((prev) => ({
                ...prev,
                imageFile: null,
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
  )
}

export default WorkoutImageField