import ReportHeader from './ReportHeader'

import SummaryCard from '../../components/report/SummaryCard'
import InsightCard from '../../components/report/InsightCard'
import ChartCard from '../../components/report/ChartCard'
import ListCard from '../../components/report/ListCard'
import SideNav from '../../components/sideNav/SideNav'

import styles from './Report.module.css'

export default function ReportPage() {
  return (
    <div className={styles.wrap}>
      <SideNav />
      {/* 메인 */}
      <main className={styles.report}>
        <div className={styles.reportInner}>
          {/* 헤더 */}
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

            {/* 차트 */}
            <ChartCard type="exercise" title="운동 기록">
              <div />
            </ChartCard>

            <ChartCard type="expense" title="지출 기록">
              <div />
            </ChartCard>

            {/* 하단 리스트 */}
            <div className={styles.listSection1}>
              <ListCard type="totalNoShow" />
            </div>
            <div className={styles.listSection2}>
              <ListCard type="totalExercise" />
            </div>
            <div className={styles.listSection3}>
              <ListCard type="totalExpense" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}