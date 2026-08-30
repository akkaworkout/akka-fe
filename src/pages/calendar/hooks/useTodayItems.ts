import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { type TodayItem } from '@/api/calendarApi'
import { useTodayItemsQuery } from '@/hooks/queries/useCalendarQuery'

import { getExerciseDetail } from '@/api/workoutApi'

export const useTodayItems = (
  navigate: ReturnType<typeof useNavigate>,
  initialDay: number,
  year: number,
  month: number,
) => {
  const [selectedDay, setSelectedDay] = useState(initialDay)
  const [selectedItem, setSelectedItem] = useState<TodayItem | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const date = useMemo(() => {
    const monthStr = String(month).padStart(2, '0')
    const dayStr = String(selectedDay).padStart(2, '0')

    return `${year}-${monthStr}-${dayStr}`
  }, [year, month, selectedDay])

  const { data: todayItems = [], isLoading } = useTodayItemsQuery(date)

  const handleSelectDay = (day: number) => {
    setSelectedDay(day)
  }

  const handleItemClick = async (item: TodayItem) => {
    if (item.status === '이용권 등록') {
      navigate('/ticket')
      return
    }

    if (item.status === '구매') {
      setSelectedItem(item)
      setIsModalOpen(true)
      return
    }

    try {
      const record = await getExerciseDetail(item.id)

      const modalItem: TodayItem = {
        id: record.id,
        date: record.exercise_date,
        name: item.name,
        status: record.is_success === 1 ? '성공' : '실패',
        color_code: record.color_code,
        amount: record.exercise_amount,
        memo: record.memo,
        image_url: record.image_url,
      }

      setSelectedItem(modalItem)
      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
      alert('이용권 등록에 실패했어요. 다시 시도해주세요.')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return {
    selectedDate: selectedDay,
    selectedItem,
    isModalOpen,
    todayItems,
    isLoading,
    setSelectedDate: setSelectedDay,
    handleSelectDay,
    handleItemClick,
    handleCloseModal,
  }
}
