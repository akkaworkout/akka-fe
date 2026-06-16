import { useEffect, useState } from 'react'

import {
  getSummary,
  type Summary,
} from '@/api/calendarApi'

export const useSummary = (
  year: number,
  month: number
) => {
  const [summary, setSummary] =
    useState<Summary | null>(null)

  useEffect(() => {
    const fetchSummary =
      async () => {
        try {
          const data =
            await getSummary(
              year,
              month
            )

          setSummary(data)
        } catch (error) {
          console.log(error)
        }
      }

    fetchSummary()
  }, [year, month])

  return { summary }
}