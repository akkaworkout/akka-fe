import Card from '@/components/card/Card'
import CheckIcon from '@/components/icons/CheckIcon'
import Skeleton from '@/components/skeleton/Skeleton'

import styles from '../workout/Workout.module.css'

type Props = {
  title: string
  items: string[]
  isLoading?: boolean
}

const RecordSummaryCard = ({ title, items, isLoading = false }: Props) => {
  return (
    <div className={styles.currentRecord}>
      <Card title={title} width="100%" height={227} radius={20} backgroundColor="#ffffff">
        <ul className={styles.recordPreview}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <li key={index} className={styles.recordSkeletonItem}>
                  <Skeleton width={20} height={20} borderRadius="50%" />
                  <Skeleton width={`${72 - index * 8}%`} height={16} />
                </li>
              ))
            : items.map((item, index) => (
                <li key={index} className={styles.recordItem}>
                  <span className={styles.checkIcon}>
                    <CheckIcon size={20} />
                  </span>

                  <span>{item}</span>
                </li>
              ))}
        </ul>
      </Card>
    </div>
  )
}

export default RecordSummaryCard
