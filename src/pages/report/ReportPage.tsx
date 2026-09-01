import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import {
  MdOutlineConfirmationNumber,
  MdOutlineDirectionsRun,
  MdOutlineReceiptLong,
} from 'react-icons/md'

import SummaryCard, { type Exercise } from '@/components/summaryCard/SummaryCard'

import BarChart from './components/charts/BarChart'
import RingChart from './components/charts/RingChart'

import Card from '@/components/card/Card'
import EmptyState from '@/components/emptyState/EmptyState'

import ReportHeader from './components/ReportHeader'
import { ChartContentSkeleton, GoalContentSkeleton } from './components/ReportSkeleton'
import InsightCard from './components/card/InsightCard'
import TotalExpenseCard from './components/card/TotalExpenseCard/TotalExpenseCard'
import TotalExerciseCard from './components/card/TotalExerciseCard/TotalExerciseCard'
import TotalNoShowCard from './components/card/TotalNoShowCard/TotalNoShowCard'

import styles from '@/pages/report/Report.module.css'

import MemoDetailModal from '@/pages/report/modals/MemoDetailModal'

import { useTickets } from '@/pages/records/hooks/useTickets'
import { useReportQuery } from '@/hooks/queries/useReportQuery'
import { useExerciseOptions } from './hooks/useExerciseOptions'
import { useInsightCalculations } from './hooks/useInsightCalculations'
import { useReportMetrics } from './hooks/useReportMetrics'

export default function ReportPage() {
  const navigate = useNavigate()
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [openMemo, setOpenMemo] = useState(false)

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const isNextMonthDisabled =
    year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth() + 1)

  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets()

  const exerciseOptions = useExerciseOptions(tickets, year, month)

  const currentExercise =
    exerciseOptions.find((exercise) => exercise.label === selectedExercise?.label) ??
    exerciseOptions[0] ??
    null

  const {
    data: reportData = null,
    isLoading: reportLoading,
    error: reportQueryError,
  } = useReportQuery(year, month, currentExercise?.label)

  const insights = useInsightCalculations(reportData)
  const metrics = useReportMetrics(reportData, currentExercise?.label)
  const reportError = reportQueryError ? '리포트 데이터를 불러오지 못했습니다.' : null
  const isReportLoading = ticketsLoading || reportLoading
  const hasExerciseRecords =
    metrics.totalExerciseCount > 0 || insights.exerciseByDow.some((value) => value > 0)
  const hasExpenseRecords =
    metrics.totalExpenseAmount > 0 || insights.expenseByDow.some((value) => value > 0)

  const handlePrevMonth = () => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1)
        return 12
      }
      return prev - 1
    })
  }

  const handleNextMonth = () => {
    const currentDate = new Date()
    const isCurrentOrFutureMonth =
      year > currentDate.getFullYear() ||
      (year === currentDate.getFullYear() && month >= currentDate.getMonth() + 1)

    if (isCurrentOrFutureMonth) return

    setMonth((prev) => {
      if (prev === 12) {
        setYear((y) => y + 1)
        return 1
      }
      return prev + 1
    })
  }

  return (
    <>
      <Helmet>
        <title>운동 리포트 | Akkaworkout</title>
        <meta
          name="description"
          content="운동 횟수, 노쇼 손실, 운동 지출을 리포트로 확인해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.reportPage}>
          <section className={styles.reportInner}>
            <ReportHeader
              year={year}
              month={month}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              isNextMonthDisabled={isNextMonthDisabled}
              totalExerciseCount={metrics.totalExerciseCount}
              totalExpenseAmount={metrics.totalExpenseAmount}
              noShowCount={metrics.noShowCount}
            />

            {ticketsError && (
              <div className={styles.errorMessage}>이용권 정보를 불러오지 못했습니다.</div>
            )}

            {reportError && <div className={styles.errorMessage}>{reportError}</div>}

            <div className={styles.reportGrid} aria-busy={isReportLoading}>
              <div className={styles.summarySection}>
                <Card
                  title="운동별 목표 달성률"
                  width="100%"
                  height={412}
                  radius={20}
                  backgroundColor="#ffffff"
                >
                  {isReportLoading ? (
                    <GoalContentSkeleton />
                  ) : currentExercise ? (
                    <>
                      <SummaryCard
                        expenses={exerciseOptions}
                        selected={currentExercise}
                        onChange={setSelectedExercise}
                      />
                      {hasExerciseRecords ? (
                        <RingChart percent={metrics.ringPercent} />
                      ) : (
                        <EmptyState
                          title="아직 운동 기록이 없어요"
                          description="첫 운동을 기록하면 목표 달성률을 바로 확인할 수 있어요."
                          icon={<MdOutlineDirectionsRun />}
                          actionLabel="운동 기록하기"
                          onAction={() => navigate('/write')}
                          variant="compact"
                        />
                      )}
                    </>
                  ) : (
                    <EmptyState
                      title="등록된 이용권이 없어요"
                      description="이용권을 등록하면 운동별 목표 달성률을 확인할 수 있어요."
                      icon={<MdOutlineConfirmationNumber />}
                      actionLabel="이용권 등록하기"
                      onAction={() => navigate('/ticket')}
                    />
                  )}
                </Card>
              </div>

              <div className={styles.insightSection}>
                <InsightCard
                  isLoading={isReportLoading}
                  집중요일={insights.집중요일}
                  추천요일={insights.추천요일}
                  추천횟수={insights.추천횟수}
                  noshowLoss={metrics.noshowLossAmount}
                />
              </div>

              <Card
                title="운동 기록"
                width={330}
                height={289}
                backgroundColor="#ffffff"
                radius={20}
              >
                {isReportLoading ? (
                  <ChartContentSkeleton />
                ) : hasExerciseRecords ? (
                  <BarChart
                    values={insights.exerciseByDow}
                    labels={['월', '화', '수', '목', '금', '토', '일']}
                    unit="회"
                    activeColor="#4F46E5"
                    normalColor="#C7D2FE"
                    bubbleColor="#4F46E5"
                    bubbleTextColor="#FFFFFF"
                    gridColor="#EEF2FF"
                  />
                ) : (
                  <EmptyState
                    title="이번 달 운동이 0회예요"
                    description="가볍게 시작하고 첫 운동 기록을 남겨볼까요?"
                    icon={<MdOutlineDirectionsRun />}
                    actionLabel="운동하러 가기"
                    onAction={() => navigate('/write')}
                    variant="compact"
                  />
                )}
              </Card>

              <Card
                title="지출 기록"
                width={330}
                height={289}
                backgroundColor="#ffffff"
                radius={20}
              >
                {isReportLoading ? (
                  <ChartContentSkeleton />
                ) : hasExpenseRecords ? (
                  <BarChart
                    values={insights.expenseByDow}
                    labels={['월', '화', '수', '목', '금', '토', '일']}
                    unit="원"
                    activeColor="#FFC227"
                    normalColor="#FFE7AA"
                    bubbleColor="#FFC227"
                    bubbleTextColor="#FFFFFF"
                    gridColor="#EEF2FF"
                  />
                ) : (
                  <EmptyState
                    title="이번 달 지출 기록이 없어요"
                    description="운동 관련 지출을 남기면 소비 흐름을 보여드려요."
                    icon={<MdOutlineReceiptLong />}
                    actionLabel="지출 기록하기"
                    onAction={() => navigate('/expense')}
                    variant="compact"
                  />
                )}
              </Card>

              <div className={styles.listSection1}>
                <TotalNoShowCard
                  totalCount={metrics.noShowCount}
                  lossAmount={metrics.noshowLossAmount}
                  items={metrics.noshowItems}
                  exercises={exerciseOptions}
                  onOpenMemo={() => setOpenMemo(true)}
                  isLoading={isReportLoading}
                />
              </div>

              <div className={styles.listSection2}>
                <TotalExerciseCard
                  totalCount={metrics.totalExerciseCount}
                  items={metrics.exerciseItems}
                  onCreateRecord={() => navigate('/write')}
                  isLoading={isReportLoading}
                />
              </div>

              <div className={styles.listSection3}>
                <TotalExpenseCard
                  totalAmount={metrics.totalExpenseAmount}
                  items={metrics.expenseItems}
                  onCreateRecord={() => navigate('/expense')}
                  isLoading={isReportLoading}
                />
              </div>
            </div>
          </section>

          <MemoDetailModal
            open={openMemo}
            onClose={() => setOpenMemo(false)}
            monthText={`${year}.${String(month).padStart(2, '0')}`}
            rows={metrics.failMemoRows}
          />
        </div>
      </div>
    </>
  )
}
