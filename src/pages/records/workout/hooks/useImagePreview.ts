import { useEffect, useRef } from 'react'

type FormType = {
  date: Date
  workoutResult: '성공' | '실패'
  memo: string
  failReason: string
  exercise: {
    id: number
    label: string
    color: string
  }
  imageFile: File | null
}

type SetFormType = React.Dispatch<React.SetStateAction<FormType>>

export const useImagePreview = (
  setForm: SetFormType,
  setPreviewUrl: (value: string | null) => void,
) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const previewObjectUrlRef = useRef<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = objectUrl

    setForm((prev) => ({
      ...prev,
      imageFile: file,
    }))

    setPreviewUrl(objectUrl)
  }

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  return {
    fileInputRef,
    handleFileChange,
  }
}
