import { useMemo, useState } from 'react'
import Modal from './Modal'
import styles from './ExpenseDetailModal.module.css'

type ExpenseItem = {
  label: string
  amount: number
}

type Props = {
  open: boolean
  onClose: () => void
  items: ExpenseItem[]
}

type TabKey = 'workout' | 'gear' | 'food' | 'etc'

type Group = {
  date: string
  items: { name: string; amount: number }[]
}

const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`

export default function ExpenseDetailModal({ open, onClose, items }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('workout')

  const tabs = useMemo(
    () => [
      { key: 'workout' as const, label: '운동비' },
      { key: 'gear' as const, label: '운동용품비' },
      { key: 'food' as const, label: '운동식품비' },
      { key: 'etc' as const, label: '기타' },
    ],
    [],
  )

  const dataByTab: Record<TabKey, Group[]> = useMemo(() => {
    const map: Record<TabKey, Group[]> = {
      workout: [],
      gear: [],
      food: [],
      etc: [],
    }

    items.forEach((i) => {
      let key: TabKey = 'etc'

      // 카테고리 매칭 순서 중요
      if (i.label.includes('운동비')) key = 'workout'
      else if (i.label.includes('용품')) key = 'gear'
      else if (i.label.includes('식품')) key = 'food'
      else key = 'etc'

      map[key].push({
        date: '',
        items: [{ name: i.label, amount: i.amount }],
      })
    })

    return map
  }, [items])

  const activeGroups = dataByTab[activeTab]

  const tabSums: Record<TabKey, number> = useMemo(() => {
    const sum = (groups: Group[]) =>
      groups.reduce((acc, g) => acc + g.items.reduce((s, it) => s + it.amount, 0), 0)

    return {
      workout: sum(dataByTab.workout),
      gear: sum(dataByTab.gear),
      food: sum(dataByTab.food),
      etc: sum(dataByTab.etc),
    }
  }, [dataByTab])

  const total = tabSums.workout + tabSums.gear + tabSums.food + tabSums.etc

  const isEmpty = total === 0

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className={styles.resetBody}>
        <div className={styles.root}>
          <div className={styles.header}>
            <h2 className={styles.title}>상세지출</h2>

            <p className={styles.ment}>이번 달 지출 내역을 항목별로 확인할 수 있어요</p>

            <div className={styles.total}>총 {formatWon(total)}</div>

            <div className={styles.tabs} role="tablist">
              {tabs.map((t) => {
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

                    <div className={styles.tabAmount}>{formatWon(tabSums[t.key])}</div>

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

          <div className={styles.listArea}>
            {isEmpty ? (
              <div className={styles.empty}>이번 달 지출 내역이 없습니다</div>
            ) : (
              activeGroups.map((group, gi) => (
                <div key={gi} className={styles.group}>
                  {group.items.map((item, idx) => (
                    <div key={idx} className={styles.rowBlock}>
                      <div className={styles.row}>
                        <div className={styles.date}>{idx === 0 ? group.date : ''}</div>

                        <div className={styles.itemName}>{item.name}</div>

                        <div className={styles.amount}>{formatWon(item.amount)}</div>
                      </div>

                      <div className={styles.divider} />
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
