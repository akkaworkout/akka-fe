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
import MemoDetailModal from '../report/modals/MemoDetailModal'
import Spinner from '../../components/common/Spinner'


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
    charts?: {
      exerciseByDow?: number[]
      expenseByDow?: number[]
    }
    breakdown?: {
      exercise?: { label: string; count: number }[]
      noshow?: { label: string; count: number }[]
      expense?: { label: string; amount: number }[]
      failMemo?: { date: string; category: string; reason: string }[]
    }
    summary?: any
  }
}

const EMPTY_WEEK = [0, 0, 0, 0, 0, 0, 0]

export default function ReportPage() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(EXERCISES[0])
  const [ticketExercises, setTicketExercises] = useState<Exercise[]>([])
  const [ringPercent, setRingPercent] = useState(0)
  const [reportData, setReportData] = useState<ReportsResponse['data'] | null>(null)
  const [openMemo, setOpenMemo] = useState(false)
  const [loading, setLoading] = useState(true)

  const API_BASE = useMemo(() => {
    const v = import.meta.env.VITE_API_URL
    return typeof v === 'string' && v.length ? v.replace(/\/$/, '') : 'http://localhost:3000'
  }, [])

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

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
        console.error(err)
        setRingPercent(0)
        setReportData(null)
        setLoading(false)
      }
    }

    fetchTickets()
  }, [API_BASE])

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setRingPercent(0)
          setReportData(null)
          setLoading(false)
          return
        }

        const url =
          `${API_BASE}/reports?year=${year}&month=${month}&exerciseType=${encodeURIComponent(selectedExercise.label)}`

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json: ReportsResponse = await res.json()
        console.log("RAW JSON", json)

        const data = json?.data ?? null

        console.log("API data", data)
        console.log("breakdown", data?.breakdown)
        console.log("failMemo", data?.breakdown?.failMemo)

        setReportData(data)


        const percent = Number(data?.goal?.exerciseAchievementRate ?? 0)
        setRingPercent(Number.isFinite(percent) ? percent : 0)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setRingPercent(0)
        setReportData(null)
        setLoading(false)
      }
    }

    fetchReport()
  }, [API_BASE, year, month, selectedExercise])

  const exerciseOptions = ticketExercises.length ? ticketExercises : EXERCISES

  const totalExerciseCount = reportData?.kpi?.totalExerciseCount ?? 0
  const totalExpenseAmount = reportData?.kpi?.totalExpenseAmount ?? 0
  const noShowCount = reportData?.kpi?.noShowCount ?? 0
  const noshowLossAmount = reportData?.kpi?.noshowLossAmount ?? 0

  const exerciseByDow =
    Array.isArray(reportData?.charts?.exerciseByDow) && reportData!.charts!.exerciseByDow!.length === 7
      ? reportData!.charts!.exerciseByDow!
      : EMPTY_WEEK

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

  const maxValue = Math.max(...exerciseByDow)

  const maxIndex = maxValue > 0 ? exerciseByDow.indexOf(maxValue) : -1

  const 집중요일 = maxIndex >= 0 ? days[maxIndex] : '데이터 없음'

  const 추천요일 =
    maxIndex >= 0
      ? maxIndex >= 5
        ? '평일'
        : '주말'
      : '평일'

  const 추천횟수 = maxValue > 0 ? maxValue : 1

  const expenseByDow =
    Array.isArray(reportData?.charts?.expenseByDow) && reportData!.charts!.expenseByDow!.length === 7
      ? reportData!.charts!.expenseByDow!
      : EMPTY_WEEK

  const exerciseItems = reportData?.breakdown?.exercise ?? []
  const noshowItems = reportData?.breakdown?.noshow ?? []
  const expenseItems = reportData?.breakdown?.expense ?? []
  const failMemoRows = useMemo(() => {
    return (
      reportData?.breakdown?.failMemo?.map(m => ({
        date: m.date,
        label: m.category,
        reason: m.reason,
      })) ?? []
    )
  }, [reportData])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spinner size={50} />
      </div>
    )
  }


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
              <Card title="운동별 목표 달성률" width="100%" height={412} radius={20} backgroundColor="#ffffff">
                <SummaryCard
                  expenses={exerciseOptions}
                  selected={selectedExercise}
                  onChange={setSelectedExercise}
                />
                <RingChart percent={ringPercent} />
              </Card>
            </div>

            <div className={styles.insightSection}>
              <InsightCard
                집중요일={집중요일}
                추천요일={추천요일}
                추천횟수={추천횟수}
                noshowLoss={noshowLossAmount}
              />
            </div>

            <Card title="운동 기록" width={330} height={289} backgroundColor="#ffffff" radius={20}>
              <BarChart
                values={exerciseByDow}
                labels={['월', '화', '수', '목', '금', '토', '일']}
                unit="회"
                activeColor="#4F46E5"
                normalColor="#C7D2FE"
                bubbleColor="#4F46E5"
                bubbleTextColor="#FFFFFF"
                gridColor="#EEF2FF"
              />
            </Card>

            <Card title="지출 기록" width={330} height={289} backgroundColor="#ffffff" radius={20}>
              <BarChart
                values={expenseByDow}
                labels={['월', '화', '수', '목', '금', '토', '일']}
                unit="원"
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
                items={noshowItems}
                exercises={exerciseOptions}
                onOpenMemo={() => setOpenMemo(true)}
              />
            </div>

            <div className={styles.listSection2}>
              <TotalExerciseCard
                totalCount={totalExerciseCount}
                items={exerciseItems}
              />
            </div>

            <div className={styles.listSection3}>
              <TotalExpenseCard
                totalAmount={reportData?.kpi?.totalExpenseAmount ?? 0}
                items={reportData?.breakdown?.expense ?? []}
              />
            </div>
          </div>
        </div>

        <MemoDetailModal
          open={openMemo}
          onClose={() => setOpenMemo(false)}
          monthText={`${year}.${String(month).padStart(2, '0')}`}
          rows={failMemoRows}
        />
      </main>
    </div>
  )
}