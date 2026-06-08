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

type SetFormType = React.Dispatch<
  React.SetStateAction<FormType>
>

export const useImagePreview = (
  setForm: SetFormType,
  setPreviewUrl: (
    value: string | null
  ) => void
) => {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setForm(prev => ({
      ...prev,
      imageFile: file,
    }))

    setPreviewUrl(
      URL.createObjectURL(file)
    )
  }

  useEffect(() => {
    return () => {
      if (
        fileInputRef.current?.value
      ) {
        URL.revokeObjectURL(
          fileInputRef.current.value
        )
      }
    }
  }, [])

  return {
    fileInputRef,
    handleFileChange,
  }
}