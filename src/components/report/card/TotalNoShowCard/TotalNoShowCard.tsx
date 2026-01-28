import './TotalNoShowCard.css'
import CheckIcon from '../../../common/icons/CheckIcon'

const noShowList = [
  { label: '발레', count: 2 },
  { label: '필라테스', count: 1 },
  { label: '수영', count: 1 },
  { label: '필라테스', count: 1 },
]

const VISIBLE_COUNT = 3

export default function TotalNoShowCard() {
  const totalLoss = 700000

  const restCount = Math.max(noShowList.length - VISIBLE_COUNT, 0)

  const maxCount = noShowList.length ? Math.max(...noShowList.map((i) => i.count)) : 0
  const maxItem = noShowList.find((i) => i.count === maxCount)
  const maxLabel = maxItem?.label

  return (
    <section className="total-noshow-card">
      <header className="card-header">
        <h2 className="card-title">총 노쇼</h2>
        <button className="action-btn" type="button">
          캘린더 메모 보기
        </button>
      </header>

      <div className="card-divider" />

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

              <span className={`count ${isMax ? 'count-red' : ''}`}>{item.count}회</span>
            </li>
          )
        })}
      </ul>

      {restCount > 0 && (
        <>
          <button className="more-btn" type="button">
            나머지 {restCount}개 항목 보기
          </button>
          <div className="more-underline" />
        </>
      )}

      <footer className="card-footer">
        <p className="summary-main">
          총 <span className="summary-number">{totalLoss.toLocaleString()}</span>원 잃었어요.
        </p>
        {maxLabel && <p className="summary-sub">{maxLabel}에서 노쇼 발생률이 높아요.</p>}
      </footer>
    </section>
  )
}