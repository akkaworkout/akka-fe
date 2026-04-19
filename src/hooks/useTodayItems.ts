import { useState } from 'react'
import { apiFetch } from '../api/api'
import { CALENDAR_ENDPOINTS } from '../api/calendar'
import { exerciseApi } from '../api/exercise'
import { useNavigate } from 'react-router-dom'

export type TodayItem = {
  id: number
  date: string
  name: string
  status: '성공' | '실패' | '구매' | '이용권 등록'
  color: string
  amount: number
  memo?: string
  image_url?: string
}

export const useTodayItems = (navigate: ReturnType<typeof useNavigate>, initialYear: number, initialMonth: number, initialDay: number) => {
  const [selectedDate, setSelectedDate] = useState(initialDay)
  const [selectedItem, setSelectedItem] = useState<TodayItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [todayItems, setTodayItems] = useState<TodayItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectDay = async (day: number, year: number, month: number) => {
    setSelectedDate(day)
    setIsLoading(true)
    try {
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      const date = `${year}-${monthStr}-${dayStr}`

      const res = await apiFetch(CALENDAR_ENDPOINTS.DATE(date), { method: 'GET' })
      const records = res.data.records

      const mappedItems: TodayItem[] = records.map((item: any) => {
        if (item.type === 'exercise') return {
          id: item.id,
          date: item.date,
          name: item.exercise_type,
          status: item.success === 1 ? '성공' : '실패',
          color: item.color,
          amount: item.cost,
          memo: item.memo
        }
        if (item.type === 'expense') return {
          id: item.id,
          date: item.date,
          name: item.title,
          status: '구매',
          color: item.color,
          amount: item.amount
        }
        if (item.type === 'ticket') return {
          id: item.id,
          date: item.date,
          name: item.exercise_type,
          status: '이용권 등록',
          color: item.color,
          amount: 0
        }
        return null
      }).filter(Boolean) as TodayItem[]

      setTodayItems(mappedItems)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = async (item: TodayItem) => {
    if (item.status === '이용권 등록') {
      navigate('/ticket')
      return
    }

    try {
      const res = await apiFetch(exerciseApi.DETAIL(item.id), { method: 'GET' })
      const record = res

      const modalItem: TodayItem = {
        id: record.record_id,
        date: record.exercise_date,
        name: item.name,
        status: record.success === 1 ? '성공' : '실패',
        color: record.color,
        amount: record.cost,
        memo: record.memo,
        image_url: record.image_url
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
    handleCloseModal
  }
}