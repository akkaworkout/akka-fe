import Card from '@/components/card/Card'
import CheckIcon from '@/components/icons/CheckIcon'

import styles from '../workout/Workout.module.css'

type Props = {
  title: string
  items: string[]
}

const RecordSummaryCard = ({ title, items }: Props) => {
  return (
    <div className={styles.currentRecord}>
      <Card title={title} width="100%" height={227} radius={20} backgroundColor="#ffffff">
        <ul className={styles.recordPreview}>
          {items.map((item, index) => (
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
