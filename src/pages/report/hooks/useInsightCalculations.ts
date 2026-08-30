import { useMemo } from 'react'
import type { ReportData } from './useReportData'

const EMPTY_WEEK = [0, 0, 0, 0, 0, 0, 0]
const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

export const useInsightCalculations = (reportData: ReportData | null) => {
  return useMemo(() => {
    // exerciseByDow 추출
    const exerciseByDow =
      Array.isArray(reportData?.charts?.exerciseByDow) &&
      reportData?.charts?.exerciseByDow?.length === 7
        ? reportData.charts.exerciseByDow
        : EMPTY_WEEK

    // expenseByDow 추출
    const expenseByDow =
      Array.isArray(reportData?.charts?.expenseByDow) &&
      reportData?.charts?.expenseByDow?.length === 7
        ? reportData.charts.expenseByDow
        : EMPTY_WEEK

    // 집중요일 계산 (현재 가장 많이 운동하는 날)
    const maxValue = Math.max(...exerciseByDow)
    const maxIndex = maxValue > 0 ? exerciseByDow.indexOf(maxValue) : -1
    const 집중요일 = maxIndex >= 0 ? DAYS[maxIndex] : '데이터 없음'

    // 추천요일 계산 (반대 추천: 현재 집중도가 낮은 요일 추천)
    const 추천요일 = maxIndex >= 0 ? (maxIndex >= 5 ? '평일' : '주말') : '평일'

    // 추천횟수 계산
    const 추천횟수 = maxValue > 0 ? maxValue : 1

    return {
      exerciseByDow,
      expenseByDow,
      집중요일,
      추천요일,
      추천횟수,
    }
  }, [reportData])
}
