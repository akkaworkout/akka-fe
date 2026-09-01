import Skeleton from '@/components/skeleton/Skeleton'

import styles from '../MyPage.module.css'

export function ProfileFormContentSkeleton() {
  return (
    <div role="status" aria-label="개인 정보 불러오는 중">
      <div className={styles.profileContentSkeleton}>
        <Skeleton width={84} height={84} borderRadius="50%" />
      </div>
      <div className={styles.formContentSkeleton}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.formRowSkeleton}>
            <Skeleton width={index === 1 ? 52 : 92} height={16} />
            <Skeleton width={333} height={46} borderRadius={9} />
            {index < 2 && <Skeleton width={100} height={46} borderRadius={10} />}
          </div>
        ))}
        <div className={styles.submitContentSkeleton}>
          <Skeleton width={333} height={46} borderRadius={10} />
        </div>
      </div>
    </div>
  )
}

export function GoalSettingsContentSkeleton() {
  return (
    <div className={styles.goalContentSkeleton} role="status" aria-label="개인 목표 불러오는 중">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className={styles.goalBlockSkeleton}>
          <Skeleton width={index === 0 ? 120 : 160} height={14} />
          <div className={styles.goalInputSkeleton}>
            <Skeleton width="88%" height={46} borderRadius={9} />
            <Skeleton width={18} height={14} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PremiumContentSkeleton() {
  return (
    <div
      className={styles.premiumContentSkeleton}
      role="status"
      aria-label="프리미엄 정보 불러오는 중"
    >
      <Skeleton width={72} height={20} />
      <Skeleton width="100%" height={310} borderRadius={12} />
    </div>
  )
}
