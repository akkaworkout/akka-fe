import { useMemo, useState } from 'react'
import Modal from './Modal'
import styles from './ExpenseDetailModal.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

type TabKey = 'workout' | 'gear' | 'food' | 'etc'

type ExpenseItem = {
  name: string
  amount: number
}

type ExpenseGroup = {
  date: string // e.g. "1/12"
  items: ExpenseItem[]
}

const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`

export default function ExpenseDetailModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('workout')

  //더미 데이터 (나중에 API/상태로 교체)
  const dataByTab: Record<TabKey, ExpenseGroup[]> = useMemo(
    () => ({
      workout: [
        {
          date: '1/12',
          items: [
            { name: '닭가슴살', amount: 10000 },
            { name: '프로틴 세트', amount: 480000 },
            { name: '곤약젤리', amount: 118000 },
          ],
        },
        {
          date: '1/15',
          items: [
            { name: 'PT 10회', amount: 290000 },
            { name: '스트레칭 클래스', amount: 20000 },
          ],
        },
      ],
      gear: [
        {
          date: '1/10',
          items: [
            { name: '러닝화', amount: 190000 },
            { name: '요가매트', amount: 45000 },
          ],
        },
      ],
      food: [
        {
          date: '1/08',
          items: [
            { name: '닭가슴살', amount: 32000 },
            { name: '단백질바', amount: 18000 },
          ],
        },
      ],
      etc: [
        {
          date: '1/03',
          items: [{ name: '기타 지출', amount: 50000 }],
        },
      ],
    }),
    []
  )

  const tabs = useMemo(
    () => [
      { key: 'workout' as const, label: '운동비' },
      { key: 'gear' as const, label: '운동용품비' },
      { key: 'food' as const, label: '운동식품비' },
      { key: 'etc' as const, label: '기타' },
    ],
    []
  )

  const activeGroups = dataByTab[activeTab]

  const tabSums: Record<TabKey, number> = useMemo(() => {
    const sum = (groups: ExpenseGroup[]) =>
      groups.reduce(
        (acc, g) => acc + g.items.reduce((s, it) => s + it.amount, 0),
        0
      )

    return {
      workout: sum(dataByTab.workout),
      gear: sum(dataByTab.gear),
      food: sum(dataByTab.food),
      etc: sum(dataByTab.etc),
    }
  }, [dataByTab])

  const total = tabSums.workout + tabSums.gear + tabSums.food + tabSums.etc

  return (
    <Modal open={open} onClose={onClose} size="lg">
      {/* 공통 Modal body padding 제거용 래퍼 */}
      <div className={styles.resetBody}>
        <div className={styles.root}>
          {/* ===== Header (고정) ===== */}
          <div className={styles.header}>
            <h2 className={styles.title}>2026.01 상세지출</h2>

            <p className={styles.ment}>
              이번 달 지출 내역을 항목별로 확인할 수 있어요
            </p>

            <div className={styles.total}>
              총 {formatWon(total)}
            </div>

            {/* 탭 영역 */}
            <div className={styles.tabs} role="tablist" aria-label="지출 항목">
              {tabs.map(t => {
                const isActive = t.key === activeTab
                return (
                  <button
                    key={t.key}
                    type="button"
                    className={styles.tabBtn}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(t.key)}
                  >
                    <div
                      className={`${styles.tabLabel} ${
                        isActive ? styles.tabLabelActive : styles.tabLabelInactive
                      }`}
                    >
                      {t.label}
                    </div>

                    <div className={styles.tabAmount}>
                      {formatWon(tabSums[t.key])}
                    </div>

                    <div
                      className={`${styles.tabBar} ${
                        isActive ? styles.tabBarActive : styles.tabBarInactive
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* ===== List (스크롤) ===== */}
          <div className={styles.listArea}>
            {activeGroups.map((group, gi) => (
              <div key={`${group.date}-${gi}`} className={styles.group}>
                {group.items.map((item, idx) => (
                  <div key={`${group.date}-${idx}`} className={styles.rowBlock}>
                    <div className={styles.row}>
                      {/* 날짜는 덩어리당 1번만 */}
                      <div className={styles.date}>
                        {idx === 0 ? group.date : ''}
                      </div>

                      <div className={styles.itemName}>{item.name}</div>

                      <div className={styles.amount}>
                        {formatWon(item.amount)}
                      </div>
                    </div>

                    {/* 텍스트 → 16 → 줄 → 16 → 다음 텍스트 */}
                    <div className={styles.divider} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}