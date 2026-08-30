import styles from './RecordLayout.module.css'

import WorkoutTabs from '../components/recordTabs/RecordTabs'

type Props = {
  title: string
  children: React.ReactNode
}

const RecordLayout = ({ title, children }: Props) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.writePage}>
        <div className={styles.writeInner}>
          <div className={styles.title}>{title}</div>

          <div className={styles.tabContainer}>
            <WorkoutTabs />
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default RecordLayout
