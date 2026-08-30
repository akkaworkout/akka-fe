import { useState, useRef, type ChangeEvent } from 'react'

export const useProfileImage = () => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [profileError, setProfileError] = useState('')

  const handlePickProfile = () => fileRef.current?.click()

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일 확인
    if (!file.type.startsWith('image/')) {
      setProfileError('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    // 파일 크기 확인 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('이미지 용량은 5MB 이하만 가능합니다.')
      return
    }

    setProfileError('')
    setProfilePreview(URL.createObjectURL(file))
  }

  const resetProfile = () => {
    setProfilePreview(null)
    setProfileError('')
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  return {
    fileRef,
    profilePreview,
    profileError,
    handlePickProfile,
    handleProfileChange,
    resetProfile,
  }
}
