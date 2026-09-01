import Skeleton from '@/components/skeleton/Skeleton'

import styles from '../Report.module.css'

const BAR_HEIGHTS = [72, 108, 88, 142, 96, 125, 82]

export function GoalContentSkeleton() {
  return (
    <div className={styles.goalContentSkeleton}>
      <Skeleton width={250} height={49} borderRadius={10} />
      <div className={styles.goalDetailsSkeleton}>
        <Skeleton width={200} height={26} />
        <Skeleton width={154} height={18} />
        <Skeleton width={112} height={12} />
      </div>
    </div>
  )
}

export function InsightContentSkeleton() {
  return (
    <div className={styles.insightLinesSkeleton} role="status" aria-label="인사이트 불러오는 중">
      <Skeleton width="82%" height={18} />
      <Skeleton width="46%" height={18} />
    </div>
  )
}

export function ChartContentSkeleton() {
  return (
    <div className={styles.chartContentSkeleton} role="status" aria-label="차트 불러오는 중">
      <div className={styles.chartBarsSkeleton}>
        {BAR_HEIGHTS.map((height, index) => (
          <Skeleton key={index} width={18} height={height} borderRadius="6px 6px 0 0" />
        ))}
      </div>
      <Skeleton width="100%" height={2} borderRadius={0} />
    </div>
  )
}

export function ListContentSkeleton() {
  return (
    <div className={styles.listContentSkeleton} role="status" aria-label="목록 불러오는 중">
      <Skeleton height={38} borderRadius={12} />
      <Skeleton height={38} borderRadius={12} />
      <Skeleton height={38} borderRadius={12} />
      <div className={styles.listFooterSkeleton}>
        <Skeleton width="76%" height={16} />
        <Skeleton width="58%" height={12} />
      </div>
    </div>
  )
}
