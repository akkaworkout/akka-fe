import { useSummaryQuery } from '@/hooks/queries/useCalendarQuery'

export const useSummary = (year: number, month: number) => {
  const { data: summary } = useSummaryQuery(year, month)

  return { summary }
}
