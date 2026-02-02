import { useState } from 'react'
import Card from '../../components/common/Card'
import ExerciseItemSelect from '../../components/common/ExerciseItemSelect'
import styles from './SummaryCard.module.css'

export default function SummaryCard() {
  const [percent, setPercent] = useState(75)

  return (
    <Card
      title="운동별 목표 달성률"
      width="100%"
      height={412}
      radius={20}
      backgroundColor="#ffffff"
    >
      <div className={styles.summaryCard}>
        <ExerciseItemSelect
          id={1}
          label="발레"
          dotColor="rgb(252, 215, 255)"
          // onClick={id => setSelectedExerciseId(id)}
        />

        <div className={styles.ringWrap}>
          <div
            className={styles.ring}
            style={{ '--p': percent } as React.CSSProperties}
          >
            <div className={styles.ringCenter}>
              <div className={styles.percent}>{percent}%</div>
              <div className={styles.sub}>이번 달 목표 달성률</div>
            </div>
          </div>
        </div>

        <div className={styles.foot}>*개인 설정목표 기준</div>
      </div>
    </Card>
  )
}