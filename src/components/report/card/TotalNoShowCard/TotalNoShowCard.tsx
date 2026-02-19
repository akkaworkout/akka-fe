import { useState } from 'react'
import './TotalNoShowCard.css'
import CheckIcon from '../../../common/icons/CheckIcon'
import Card from '../../../common/Card'
import DetailModal from '../../../../pages/report/modals/DetailModal'
import MemoDetailModal from '../../../../pages/report/modals/MemoDetailModal'

const noShowList = [
  { label: '발레', count: 2 },
  { label: '필라테스', count: 1 },
  { label: '수영', count: 1 },
  { label: '필라테스', count: 1 },
]

const VISIBLE_COUNT = 3

export default function TotalNoShowCard() {
  const [openDetail, setOpenDetail] = useState(false)
  const [openMemo, setOpenMemo] = useState(false)

  const totalLoss = 700000

  const restCount = Math.max(noShowList.length - VISIBLE_COUNT, 0)

  const maxCount = noShowList.length
    ? Math.max(...noShowList.map(i => i.count))
    : 0
  const maxItem = noShowList.find(i => i.count === maxCount)
  const maxLabel = maxItem?.label

  // ✅ 메모 모달에 보여줄 더미 데이터 (피그마 예시)
  const memoRows = [
    { date: '1/3', category: '발레', reason: '늦잠을 자버렸다' },
    { date: '1/4', category: '발레', reason: '늦잠을 자버렸다' },
  ]

  return (
    <>
      <Card
        title="총 노쇼"
        width={294}
        height={324}
        backgroundColor="#ffffff"
        radius={20}
        buttonText="캘린더 메모 보기"
        onButtonClick={() => setOpenMemo(true)}
      >
        <section className="total-noshow-card">
          <ul className="noshow-list">
            {noShowList.slice(0, VISIBLE_COUNT).map((item, idx) => {
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
                {totalLoss.toLocaleString()}
              </span>
              원 잃었어요.
            </p>
            {maxLabel && (
              <p className="summary-sub">
                {maxLabel}에서 노쇼 발생률이 높아요.
              </p>
            )}
          </footer>
        </section>
      </Card>

      {/* 나머지 N개 항목 보기 (pill 모달) */}
      <DetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        restCount={restCount}
        subject="노쇼"
        items={noShowList.slice(VISIBLE_COUNT)}
      />

      {/* 캘린더 메모 보기 (표 모달) */}
      <MemoDetailModal
        open={openMemo}
        onClose={() => setOpenMemo(false)}
        monthText="2026.01"
        rows={memoRows}
      />
    </>
  )
}