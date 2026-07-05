import styles from './RingChart.module.css'

type RingChartProps = {
  percent: number
}

export default function RingChart({ percent }: RingChartProps) {
  const safePercent = Math.min(Math.max(percent, 0), 100)

  return (
    <div className={styles.wrapper}>
      <div className={styles.ringWrap}>
        <div
          className={styles.ring}
          style={{ '--p': safePercent } as React.CSSProperties}
        >
          <div className={styles.ringCenter}>
            <div className={styles.percent}>{safePercent}%</div>
            <div className={styles.sub}>이번 달 목표 달성률</div>
          </div>
        </div>
      </div>

      <div className={styles.foot}>*개인 설정목표 기준</div>
    </div>
  )
}