import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getTodayItems,
  type TodayItem,
} from '@/api/calendarApi'

import { getExerciseDetail } from '@/api/exerciseApi'

export const useTodayItems = (
  navigate: ReturnType<typeof useNavigate>,
  initialYear: number,
  initialMonth: number,
  initialDay: number
) => {
  const [selectedDate, setSelectedDate] =
    useState(initialDay)

  const [selectedItem, setSelectedItem] =
    useState<TodayItem | null>(null)

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [todayItems, setTodayItems] =
    useState<TodayItem[]>([])

  const [isLoading, setIsLoading] =
    useState(false)

  const handleSelectDay = async (
    day: number,
    year: number,
    month: number
  ) => {
    setSelectedDate(day)
    setIsLoading(true)

    try {
      const monthStr = String(month + 1)
        .padStart(2, '0')

      const dayStr = String(day)
        .padStart(2, '0')

      const date =
        `${year}-${monthStr}-${dayStr}`

      const data =
        await getTodayItems(date)

      setTodayItems(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = async (
    item: TodayItem
  ) => {
    if (item.status === '이용권 등록') {
      navigate('/ticket')

      return
    }

    try {
      const record =
        await getExerciseDetail(item.id)

      const modalItem: TodayItem = {
        id: record.record_id,
        date: record.exercise_date,
        name: item.name,

        status:
          record.success === 1
            ? '성공'
            : '실패',

        color: record.color,
        amount: record.cost,
        memo: record.memo,
        image_url: record.image_url,
      }

      setSelectedItem(modalItem)
      setIsModalOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return {
    selectedDate,
    selectedItem,
    isModalOpen,
    todayItems,
    isLoading,
    setSelectedDate,
    handleSelectDay,
    handleItemClick,
    handleCloseModal,
  }
}