import './TotalExerciseCard.css'
import Card from '../../../common/Card'

const exerciseList = [
  { label: '발레', count: 10 },
  { label: '헬스', count: 1 },
  { label: '필라테스', count: 7 },
  { label: '러닝', count: 2 },
]

const VISIBLE_COUNT = 3

export default function TotalExerciseCard() {
  const totalCount = exerciseList.reduce((sum, i) => sum + i.count, 0)
  const restCount = Math.max(exerciseList.length - VISIBLE_COUNT, 0)

  const maxCount = exerciseList.length
    ? Math.max(...exerciseList.map(i => i.count))
    : 0
  const maxItem = exerciseList.find(i => i.count === maxCount)
  const maxLabel = maxItem?.label

  return (
    <Card
      title="총 운동"
      width={330}
      height={324}
      backgroundColor="#ffffff"
      radius={20}
    >
      <section className="total-exercise-card">
        <ul className="exercise-list">
          {exerciseList.slice(0, VISIBLE_COUNT).map((item, idx) => {
            const isMax = item.count === maxCount && maxCount > 0
            return (
              <li
                key={`${item.label}-${idx}`}
                className={`exercise-row ${isMax ? 'highlight' : ''}`}
              >
                <span className="label">{item.label}</span>
                <span className={`count ${isMax ? 'count-max' : ''}`}>
                  {item.count}회
                </span>
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
            총 <span className="summary-number">{totalCount}</span>회 운동했어요.
          </p>
          {maxLabel && (
            <p className="summary-sub">
              {maxLabel}를 가장 많이 운동했어요.
            </p>
          )}
        </footer>
      </section>
    </Card>
  )
}