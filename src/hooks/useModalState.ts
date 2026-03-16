import { useState } from 'react'
import type { TodayItem } from './useTodayItems'

export const useModalState = () => {
  const [selectedItem, setSelectedItem] = useState<TodayItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (item: TodayItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setIsModalOpen(false)
  }

  return {
    selectedItem,
    isModalOpen,
    openModal,
    closeModal
  }
}