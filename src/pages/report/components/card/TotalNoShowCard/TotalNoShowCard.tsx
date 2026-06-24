import { useState } from 'react'
import './TotalNoShowCard.css'
import CheckIcon from '@/components/icons/CheckIcon'
import Card from '@/components/card/Card'
import DetailModal from '@/pages/report/modals/DetailModal'

type Item = {
  label: string
  count: number
}

type Exercise = {
  label: string
}

type Props = {
  totalCount: number
  lossAmount: number
  items: Item[]
  exercises: Exercise[]
  onOpenMemo: () => void
}

const VISIBLE_COUNT = 3

export default function TotalNoShowCard({
  lossAmount,
  items,
  exercises,
  onOpenMemo,
}: Props) {
  const [openDetail, setOpenDetail] = useState(false)

  // 등록된 운동 기준으로 노쇼 데이터 매칭
  const safeItems: Item[] =
    exercises && exercises.length
      ? exercises.map(ex => {
          const found = items.find(i => i.label === ex.label)

          return {
            label: ex.label,
            count: found ? found.count : 0,
          }
        })
      : []

  const restCount = Math.max(safeItems.length - VISIBLE_COUNT, 0)

  const maxCount = safeItems.length
    ? Math.max(...safeItems.map(i => i.count))
    : 0

  const maxItem = safeItems.find(i => i.count === maxCount)
  const maxLabel = maxItem?.label

  return (
    <>
      <Card
        title="총 노쇼"
        width={294}
        height={324}
        backgroundColor="#ffffff"
        radius={20}
        buttonText="캘린더 메모 보기"
        onButtonClick={onOpenMemo}
      >
        <section className="total-noshow-card">
          <ul className="noshow-list">
            {safeItems.slice(0, VISIBLE_COUNT).map((item, idx) => {
              const isMax = item.count === maxCount && maxCount > 0

              return (
                <li key={`${item.label}-${idx}`} className="noshow-row">
                  <span className="left">
                    <span className="check" aria-hidden="true">
                      <CheckIcon size={20} />
                    </span>
                    <span className="label">{item.label}</span>
                  </span>

                  <span className={`count ${isMax ? 'count-red' : ''}`}>
                    {item.count}회
                  </span>
                </li>
              )
            })}
          </ul>

          {restCount > 0 && (
            <>
              <button
                className="more-btn"
                type="button"
                onClick={() => setOpenDetail(true)}
              >
                나머지 {restCount}개 항목 보기
              </button>
              <div className="more-underline" />
            </>
          )}

          <footer className="card-footer">
            <p className="summary-main">
              총{' '}
              <span className="summary-number">
                {lossAmount.toLocaleString()}
              </span>
              원 잃었어요.
            </p>

            {maxCount > 0 && maxLabel && (
              <p className="summary-sub">
                {maxLabel}에서 노쇼 발생률이 높아요.
              </p>
            )}
          </footer>
        </section>
      </Card>

      <DetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        restCount={restCount}
        subject="노쇼"
        items={safeItems.slice(VISIBLE_COUNT)}
      />
    </>
  )
}