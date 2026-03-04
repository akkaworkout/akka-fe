import { useState } from 'react'
import './TotalExpenseCard.css'
import Card from '../../../common/Card'
import ExpenseDetailModal from '../../../../pages/report/modals/ExpenseDetailModal'

type Props = {
  totalAmount: number
}

const expenseList = [
  { label: '운동비', amount: 290000 },
  { label: '운동용품비', amount: 420000 },
  { label: '운동식품비', amount: 300000 },
  { label: '기타', amount: 20000 },
]

export default function TotalExpenseCard({ totalAmount }: Props) {
  const [openExpense, setOpenExpense] = useState(false)

  const maxAmount = Math.max(...expenseList.map(item => item.amount))
  const maxItem = expenseList.find(item => item.amount === maxAmount)

  return (
    <>
      <Card
        title="총 지출"
        width={330}
        height={324}
        backgroundColor="#ffffff"
        radius={20}
        buttonText="상세항목"
        onButtonClick={() => setOpenExpense(true)}
      >
        <section className="total-expense-card">
          <ul className="expense-list">
            {expenseList.map(item => {
              const isMax = item.amount === maxAmount

              return (
                <li
                  key={item.label}
                  className={`expense-row ${isMax ? 'highlight' : ''}`}
                >
                  <span className="label">{item.label}</span>
                  <span className={`amount ${isMax ? 'amount-max' : ''}`}>
                    {item.amount.toLocaleString()}원
                  </span>
                </li>
              )
            })}
          </ul>

          <footer className="card-footer">
            <p className="summary-main">
              총{' '}
              <span className="summary-number">
                {totalAmount.toLocaleString()}
              </span>
              원 사용했어요.
            </p>
            <p className="summary-sub">
              {maxItem?.label}에 가장 많이 썼어요.
            </p>
          </footer>
        </section>
      </Card>

      <ExpenseDetailModal
        open={openExpense}
        onClose={() => setOpenExpense(false)}
      />
    </>
  )
}