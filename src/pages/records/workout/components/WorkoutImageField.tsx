import styles from '../Workout.module.css'

import uploadIcon from '@/assets/icons/upload.png'

type Props = {
  previewUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  setPreviewUrl: React.Dispatch<
    React.SetStateAction<string | null>
  >
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >
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
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <img
            src={uploadIcon}
            alt="upload_icon"
          />
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
              setForm((prev: any) => ({
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