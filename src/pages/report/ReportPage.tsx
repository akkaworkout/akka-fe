import { useState } from 'react'

import ReportHeader from './ReportHeader'
import SideNav from '../../components/sideNav/SideNav'
import SummaryCard, {
  type Exercise,
} from '../../components/common/SummaryCard'
import InsightCard from '../../components/report/InsightCard'
import Card from '../../components/common/Card'
import BarChart from '../../components/report/charts/BarChart'
import TotalExpenseCard from '../../components/report/card/TotalExpenseCard/TotalExpenseCard'
import TotalExerciseCard from '../../components/report/card/TotalExerciseCard/TotalExerciseCard'
import TotalNoShowCard from '../../components/report/card/TotalNoShowCard/TotalNoShowCard'
import RingChart from '../../components/report/charts/RingChart'
import styles from './Report.module.css'

const EXERCISES: Exercise[] = [
  { id: 1, label: '발레', color: 'rgb(252, 215, 255)' },
  { id: 2, label: '헬스', color: '#DAD7FF' },
  { id: 3, label: '필라테스', color: '#FFE6CC' },
  { id: 4, label: '수영', color: '#E0F0FF' },
]

export default function ReportPage() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)

  const [selectedExercise, setSelectedExercise] = useState<Exercise>(
    EXERCISES[0]
  )

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
            <div className={styles.summarySection}>
              <Card
                title="운동별 목표 달성률"
                width="100%"
                height={412}
                radius={20}
                backgroundColor="#ffffff"
              >
                <SummaryCard
                  expenses={EXERCISES}
                  selected={selectedExercise}
                  onChange={setSelectedExercise}
                />

                <RingChart percent={75} />
              </Card>
            </div>

            <div className={styles.insightSection}>
              <InsightCard />
            </div>

            <Card
              title="운동 기록"
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

            <Card
              title="지출 기록"
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