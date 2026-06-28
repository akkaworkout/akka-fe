import { useQuery } from '@tanstack/react-query';

import { getCalendar, getGoals, getSummary, getTodayItems } from '@/api/calendarApi'

// 월 전체 운동 기록 조회
export const useCalendarQuery = (
    year: number,
    month: number
) => {
    return useQuery({
        queryKey: ['calendar', year, month],
        queryFn: () => getCalendar(year, month)
    });
}

// 월 목표 조회
export const useGoalsQuery = (
    year: number,
    month: number
) => {
    return useQuery({
        queryKey: ['goals', year, month],
        queryFn: () => getGoals(year, month)
    })
}

// 월 요약 정보 조회
export const useSummaryQuery = (
    year: number,
    month: number
) => {
    return useQuery({
        queryKey: ['summary', year, month],
        queryFn: () => getSummary(year, month)
    })
}

// 특정 날짜 기록 조회
export const useTodayItemsQuery = (
    date: string
) => {
    return useQuery({
        queryKey: ['todayItems', date],
        queryFn: () => getTodayItems(date),
        enabled: !!date,
    })
}