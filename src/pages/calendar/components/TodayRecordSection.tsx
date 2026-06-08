import Card from '@/components/card/Card'
import Spinner from '@/components/spinner/Spinner'

import type { TodayItem } from '@/hooks/useTodayItems'

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
          <ul className={styles.list}>
            {isLoading ? (
              <Spinner />
            ) : todayItems.length === 0 ? (
              <div className={styles.empty}>
                아직 기록이 없어요
              </div>
            ) : (
              todayItems.map((item) => (
                <li
                  key={item.id}
                  className={`
                    ${styles.item}
                    ${
                      item.status === '이용권 등록'
                        ? styles.ticketItem
                        : ''
                    }
                  `}
                  onClick={() => onItemClick(item)}
                >
                  <div className={styles.left}>
                    <span
                      className={styles.dot}
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <div>
                      <div className={styles.name}>
                        {item.name}
                      </div>

                      <div className={styles.status}>
                        {item.status}
                      </div>
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
                </li>
              ))
            )}
          </ul>

          <button className={styles.addBtn}>
            +
          </button>
        </div>
      </Card>
    </div>
  )
}

export default TodayRecordSection