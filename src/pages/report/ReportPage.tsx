import { useEffect, useMemo, useState } from 'react'

import ReportHeader from './ReportHeader'
import SideNav from '../../components/sideNav/SideNav'
import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import InsightCard from '../../components/report/InsightCard'
import Card from '../../components/common/Card'
import BarChart from '../../components/report/charts/BarChart'
import TotalExpenseCard from '../../components/report/card/TotalExpenseCard/TotalExpenseCard'
import TotalExerciseCard from '../../components/report/card/TotalExerciseCard/TotalExerciseCard'
import TotalNoShowCard from '../../components/report/card/TotalNoShowCard/TotalNoShowCard'
import RingChart from '../../components/report/charts/RingChart'
import styles from './Report.module.css'

// fallback(티켓 로딩 전/실패 시)
const EXERCISES: Exercise[] = [
  { id: 1, label: '발레', color: 'rgb(252, 215, 255)' },
  { id: 2, label: '헬스', color: '#DAD7FF' },
  { id: 3, label: '필라테스', color: '#FFE6CC' },
  { id: 4, label: '수영', color: '#E0F0FF' },
]

type ReportsResponse = {
  success: boolean
  message?: string
  data?: {
    period?: { year: number; month: number }
    kpi?: {
      totalExerciseCount?: number
      noShowCount?: number
      noshowLossAmount?: number
      totalExpenseAmount?: number
    }
    goal?: {
      exerciseAchievementRate?: number
    }
    charts?: any
    summary?: any
  }
}

export default function ReportPage() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const [selectedExercise, setSelectedExercise] = useState<Exercise>(EXERCISES[0])

  // 드롭다운 옵션 (티켓 기반)
  const [ticketExercises, setTicketExercises] = useState<Exercise[]>([])

  // 링 차트 퍼센트(API 연동)
  const [ringPercent, setRingPercent] = useState(0)

  // /reports 전체 데이터(상단 KPI 등에서 재사용)
  const [reportData, setReportData] = useState<ReportsResponse['data'] | null>(null)

  const API_BASE = useMemo(() => {
    const v = import.meta.env.VITE_API_URL
    return typeof v === 'string' && v.length ? v.replace(/\/$/, '') : 'http://localhost:3000'
  }, [])

  //  ReportHeader에서 끌어올린 연/월 state
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(2) // 1~12

  const handlePrevMonth = () => {
    setMonth(prev => {
      if (prev === 1) {
        setYear(y => y - 1)
        return 12
      }
      return prev - 1
    })
  }

  const handleNextMonth = () => {
    setMonth(prev => {
      if (prev === 12) {
        setYear(y => y + 1)
        return 1
      }
      return prev + 1
    })
  }

  // 1) tickets에서 운동 종목 목록 만들기
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const res = await fetch(`${API_BASE}/tickets`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json: any = await res.json()

        // { success, data: [...] } 또는 [...] 둘 다 대응
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []

        const unique = new Map<string, Exercise>()

        list.forEach((t: any, idx: number) => {
          const label = String(t?.exercise_type || '').trim()
          if (!label) return
          if (unique.has(label)) return

          unique.set(label, {
            id: idx + 1,
            label,
            color: t?.color || '#DAD7FF',
          })
        })

        const exercises = Array.from(unique.values())

        if (exercises.length) {
          setTicketExercises(exercises)

          setSelectedExercise(prev => {
            const found = exercises.find(e => e.label === prev.label)
            return found || exercises[0]
          })
        }
      } catch (err) {
        console.error('❌ tickets fetch error:', err)
      }
    }

    fetchTickets()
  }, [API_BASE])

  // 2) reports로 리포트 데이터 가져오기 (달성률 + 상단 KPI)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setRingPercent(0)
          setReportData(null)
          return
        }

        const url =
          `${API_BASE}/reports` +
          `?year=${year}&month=${month}` +
          `&exerciseType=${encodeURIComponent(selectedExercise.label)}`

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json: ReportsResponse = await res.json()

        setReportData(json?.data ?? null)

        const percent = Number(json?.data?.goal?.exerciseAchievementRate ?? 0)
        setRingPercent(Number.isFinite(percent) ? percent : 0)
      } catch (err) {
        console.error('❌ reports fetch error:', err)
        setRingPercent(0)
        setReportData(null)
      }
    }

    fetchReport()
  }, [API_BASE, year, month, selectedExercise])

  //  드롭다운에 실제로 뿌릴 배열(티켓 우선, 없으면 fallback)
  const exerciseOptions = ticketExercises.length ? ticketExercises : EXERCISES

  // 상단 KPI 값 (없으면 0)
  const totalExerciseCount = reportData?.kpi?.totalExerciseCount ?? 0
  const totalExpenseAmount = reportData?.kpi?.totalExpenseAmount ?? 0
  const noShowCount = reportData?.kpi?.noShowCount ?? 0
  const noshowLossAmount = reportData?.kpi?.noshowLossAmount ?? 0

  return (
    <div className={styles.wrap}>
      <SideNav folded={isSidebarFolded} onToggle={() => setIsSidebarFolded(prev => !prev)} />

      <main className={styles.reportPage} style={{ marginLeft: isSidebarFolded ? 74 : 220 }}>
        <div className={styles.reportInner}>
          <ReportHeader
            year={year}
            month={month}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            totalExerciseCount={totalExerciseCount}
            totalExpenseAmount={totalExpenseAmount}
            noShowCount={noShowCount}
          />

          <div className={styles.reportGrid}>
            <div className={styles.summarySection}>
              <Card
                title="운동별 목표 달성률"
                width="100%"
                height={412}
                radius={20}
                backgroundColor="#ffffff"
              >
                <SummaryCard
                  expenses={exerciseOptions}
                  selected={selectedExercise}
                  onChange={setSelectedExercise}
                />

                <RingChart percent={ringPercent} />
              </Card>
            </div>

            <div className={styles.insightSection}>
              <InsightCard />
            </div>

            <Card title="운동 기록" width={330} height={289} backgroundColor="#ffffff" radius={20}>
              <BarChart
                values={[2, 4, 2, 2, 1, 10, 2]}
                labels={['월', '화', '수', '목', '금', '토', '일']}
                activeColor="#4F46E5"
                normalColor="#C7D2FE"
                bubbleColor="#4F46E5"
                bubbleTextColor="#FFFFFF"
                gridColor="#EEF2FF"
              />
            </Card>

            <Card title="지출 기록" width={330} height={289} backgroundColor="#ffffff" radius={20}>
              <BarChart
                values={[2, 4, 2, 10, 1, 5, 2]}
                labels={['월', '화', '수', '목', '금', '토', '일']}
                activeColor="#FFC227"
                normalColor="#FFE7AA"
                bubbleColor="#FFC227"
                bubbleTextColor="#FFFFFF"
                gridColor="#EEF2FF"
              />
            </Card>

            <div className={styles.listSection1}>
              <TotalNoShowCard
                totalCount={noShowCount}
                lossAmount={noshowLossAmount}
              />
            </div>

            <div className={styles.listSection2}>
              <TotalExerciseCard
                totalCount={totalExerciseCount}
              />
            </div>

            <div className={styles.listSection3}>
              <TotalExpenseCard
                totalAmount={totalExpenseAmount}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}