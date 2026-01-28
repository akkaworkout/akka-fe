import './TotalExpenseCard.css'

const expenseList = [
  { label: '운동비', amount: 290000 },
  { label: '운동용품비', amount: 120000 },
  { label: '운동식품비', amount: 300000 },
  { label: '기타', amount: 20000 },
]

export default function TotalExpenseCard() {
  const totalAmount = expenseList.reduce((sum, item) => sum + item.amount, 0)
  const maxAmount = Math.max(...expenseList.map((item) => item.amount))
  const maxItem = expenseList.find((item) => item.amount === maxAmount)

  return (
    <section className="total-expense-card">
      {/* 헤더 */}
      <header className="card-header">
        <h2 className="card-title">총 지출</h2>
        <button className="detail-btn" type="button">
          상세항목
        </button>
      </header>

      {/* 선 */}
      <div className="card-divider" />

      {/* 선 ↔ 첫 카드 간격 19px: list가 margin-top을 가짐 */}
      <ul className="expense-list">
        {expenseList.map((item) => {
          const isMax = item.amount === maxAmount

          return (
            <li
              key={item.label}
              className={`expense-row ${isMax ? 'highlight' : ''}`}
            >
              <span className="label">{item.label}</span>

              {/* 최대 금액이면 글씨도 #FF5858 */}
              <span className={`amount ${isMax ? 'amount-max' : ''}`}>
                {item.amount.toLocaleString()}원
              </span>
            </li>
          )
        })}
      </ul>

      {/* 요약 */}
      <footer className="card-footer">
        <p className="summary-main">
          총 <span className="summary-number">{totalAmount.toLocaleString()}</span>원 사용했어요.
        </p>
        <p className="summary-sub">{maxItem?.label}에 가장 많이 썼어요.</p>
      </footer>
    </section>
  )
}