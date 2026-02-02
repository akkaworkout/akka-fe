import { useState } from 'react'

import ReportHeader from './ReportHeader'

import SideNav from '../../components/sideNav/SideNav'
import SummaryCard from '../../components/report/SummaryCard'
import InsightCard from '../../components/report/InsightCard'
import Card from '../../components/common/Card'
import BarChart from '../../components/report/charts/BarChart'
import TotalExpenseCard from '../../components/report/card/TotalExpenseCard/TotalExpenseCard'
import TotalExerciseCard from '../../components/report/card/TotalExerciseCard/TotalExerciseCard'
import TotalNoShowCard from '../../components/report/card/TotalNoShowCard/TotalNoShowCard'
import styles from './Report.module.css'

export default function ReportPage() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  return (
    <div className={styles.wrap}>
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.reportPage}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
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
            <Card
              title={"운동 기록"}
              width={330}
              height={289}
              backgroundColor="#ffffff"
              radius={20}
            >
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

            {/* 차트: 지출 기록 */}
            <Card
              title={"지출 기록"}
              width={330}
              height={289}
              backgroundColor="#ffffff"
              radius={20}
            >
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
    </div >
  )
}