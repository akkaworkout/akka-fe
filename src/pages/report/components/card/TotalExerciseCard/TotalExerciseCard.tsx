import { useState } from 'react'
import { MdOutlineDirectionsRun } from 'react-icons/md'
import './TotalExerciseCard.css'
import Card from '@/components/card/Card'
import EmptyState from '@/components/emptyState/EmptyState'
import DetailModal from '@/pages/report/modals/DetailModal'
import { ListContentSkeleton } from '../../ReportSkeleton'

type Item = {
  label: string
  count: number
}

type Props = {
  totalCount: number
  items: Item[]
  onCreateRecord: () => void
  isLoading?: boolean
}

const VISIBLE_COUNT = 3

export default function TotalExerciseCard({
  totalCount,
  items,
  onCreateRecord,
  isLoading = false,
}: Props) {
  const [open, setOpen] = useState(false)

  const sortedItems = [...items].sort((a, b) => b.count - a.count)

  const restCount = Math.max(sortedItems.length - VISIBLE_COUNT, 0)

  const maxCount = sortedItems.length ? Math.max(...sortedItems.map((i) => i.count)) : 0

  const maxItem = sortedItems.find((i) => i.count === maxCount)
  const maxLabel = maxItem?.label
  const hasRecords = totalCount > 0 || sortedItems.some((item) => item.count > 0)

  return (
    <>
      <Card title="총 운동" width={330} height={324} backgroundColor="#ffffff" radius={20}>
        {isLoading ? (
          <ListContentSkeleton />
        ) : hasRecords ? (
          <section className="total-exercise-card">
            <ul className="exercise-list">
              {Array.from({ length: VISIBLE_COUNT }).map((_, idx) => {
                const item = sortedItems[idx]

                if (!item) {
                  return <li key={idx} className="exercise-row empty" />
                }

                const isMax = item.count === maxCount && maxCount > 0

                return (
                  <li key={idx} className={`exercise-row ${isMax ? 'highlight' : ''}`}>
                    <span className="label">{item.label}</span>

                    <span className={`count ${isMax ? 'count-max' : ''}`}>{item.count}회</span>
                  </li>
                )
              })}
            </ul>

            {restCount > 0 && (
              <button className="more-btn" type="button" onClick={() => setOpen(true)}>
                나머지 {restCount}개 항목 보기
              </button>
            )}

            <footer className="card-footer">
              <p className="summary-main">
                총 <span className="summary-number">{totalCount}</span>회 운동했어요.
              </p>

              {maxLabel && <p className="summary-sub">{maxLabel}를 가장 많이 운동했어요.</p>}
            </footer>
          </section>
        ) : (
          <EmptyState
            title="아직 운동 기록이 없어요"
            description="첫 운동을 기록하고 이번 달 변화를 만들어보세요."
            icon={<MdOutlineDirectionsRun />}
            actionLabel="운동 기록하기"
            onAction={onCreateRecord}
            variant="compact"
          />
        )}
      </Card>

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        restCount={restCount}
        subject="운동"
        items={sortedItems.slice(VISIBLE_COUNT)}
      />
    </>
  )
}
