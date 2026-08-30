import { useNavigate } from 'react-router-dom'

import type { TodayItem } from '@/api/calendarApi'

import Card from '@/components/card/Card'
import Spinner from '@/components/spinner/Spinner'

import styles from '../Calendar.module.css'

type Props = {
  year: number
  month: number
  selectedDate: number
  todayItems: TodayItem[]
  isLoading: boolean
  onItemClick: (item: TodayItem) => void
}

const TodayRecordSection = ({
  year,
  month,
  selectedDate,
  todayItems,
  isLoading,
  onItemClick,
}: Props) => {
  const navigate = useNavigate()

  return (
    <div className={styles.today}>
      <Card
        title={`${year}년 ${month + 1}월 ${selectedDate}일`}
        width={445}
        height={307}
        backgroundColor="#ffffff"
        radius={20}
      >
        <div className={styles.summary}>
          <ul className={styles.list} aria-live="polite">
            {isLoading ? (
              <li className={styles.stateItem}>
                <Spinner />
              </li>
            ) : todayItems.length === 0 ? (
              <li className={`${styles.stateItem} ${styles.empty}`}>
                아직 기록이 없어요. <br /> 하단 버튼을 클릭하고 운동 기록을 작성해보세요!
              </li>
            ) : (
              todayItems.map((item) => (
                <li key={item.id} className={styles.item}>
                  <button
                    type="button"
                    className={styles.itemButton}
                    onClick={() => onItemClick(item)}
                  >
                    <div className={styles.left}>
                      <span
                        className={styles.dot}
                        style={{
                          backgroundColor: item.color_code,
                        }}
                      />

                      <div>
                        <div className={styles.name}>{item.name}</div>

                        <div className={styles.status}>{item.status}</div>
                      </div>
                    </div>

                    <span
                      className={
                        item.status === '성공'
                          ? styles.success
                          : item.status === '실패'
                            ? styles.fail
                            : styles.purchase
                      }
                    >
                      {(item.amount ?? 0).toLocaleString()}원
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <button
            type="button"
            className={styles.addBtn}
            aria-label="기록 추가"
            onClick={() => navigate('/write')}
          >
            +
          </button>
        </div>
      </Card>
    </div>
  )
}

export default TodayRecordSection
