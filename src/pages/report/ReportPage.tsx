import ReportHeader from './ReportHeader'

import SideNav from '../../components/sideNav/SideNav'
import SummaryCard from '../../components/report/SummaryCard'
import InsightCard from '../../components/report/InsightCard'
import ChartCard from '../../components/report/ChartCard'
import ExerciseBarChart from '../../components/report/charts/ExerciseBarChart'
import ExpenseBarChart from '../../components/report/charts/ExpenseBarChart'
import TotalExpenseCard from '../../components/report/card/TotalExpenseCard/TotalExpenseCard'
import TotalExerciseCard from '../../components/report/card/TotalExerciseCard/TotalExerciseCard'
import TotalNoShowCard from '../../components/report/card/TotalNoShowCard/TotalNoShowCard'
import styles from './Report.module.css'

export default function ReportPage() {
  return (
    <div className={styles.wrap}>
      <SideNav />

      <main className={styles.report}>
        <div className={styles.reportInner}>
          <ReportHeader />

          <div className={styles.reportGrid}>
            {/* 좌측 Summary */}
            <div className={styles.summarySection}>
              <SummaryCard />
            </div>

            {/* 상단 Insight */}
            <div className={styles.insightSection}>
              <InsightCard />
            </div>

            {/* 차트: 운동 기록 */}
            <ChartCard type="exercise" title="운동 기록">
              <ExerciseBarChart />
            </ChartCard>

            {/* 차트: 지출 기록 */}
            <ChartCard type="expense" title="지출 기록">
              <ExpenseBarChart />
            </ChartCard>

            {/* 하단 3개 카드 */}
            <div className={styles.listSection1}>
              <TotalNoShowCard />
            </div>

            <div className={styles.listSection2}>
              <TotalExerciseCard />
            </div>

            <div className={styles.listSection3}>
              <TotalExpenseCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}