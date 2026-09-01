import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getReport } from '@/api/reportApi'

export const reportQueryKeys = {
  all: ['reports'] as const,
  month: (year: number, month: number) => ['reports', year, month] as const,
  detail: (year: number, month: number, exerciseType: string) =>
    ['reports', year, month, exerciseType] as const,
}

const getDateKey = () => {
  const now = new Date()

  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

let reportCacheDateKey = getDateKey()

const getMillisecondsUntilTomorrow = () => {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  return tomorrow.getTime() - now.getTime() + 100
}

export const useReportQuery = (year: number, month: number, exerciseType?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const invalidateIfDateChanged = () => {
      const nextDateKey = getDateKey()

      if (reportCacheDateKey === nextDateKey) return

      reportCacheDateKey = nextDateKey
      void queryClient.invalidateQueries({ queryKey: reportQueryKeys.all })
    }

    const scheduleInvalidation = () => {
      timeoutId = setTimeout(() => {
        invalidateIfDateChanged()
        scheduleInvalidation()
      }, getMillisecondsUntilTomorrow())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        invalidateIfDateChanged()
      }
    }

    invalidateIfDateChanged()
    scheduleInvalidation()
    window.addEventListener('focus', invalidateIfDateChanged)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('focus', invalidateIfDateChanged)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [queryClient])

  return useQuery({
    queryKey: reportQueryKeys.detail(year, month, exerciseType ?? ''),
    queryFn: () => getReport(year, month, exerciseType!),
    enabled: Boolean(exerciseType),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  })
}
