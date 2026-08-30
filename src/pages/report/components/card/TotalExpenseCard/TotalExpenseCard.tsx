import { useState } from 'react'

import './TotalExpenseCard.css'

import Card from '@/components/card/Card'
import ExpenseDetailModal from '@/pages/report/modals/ExpenseDetailModal'

type Item = {
  label: string
  amount: number
}

type Props = {
  totalAmount: number
  items: Item[]
}

const normalizeLabel = (label: string) => label.replace(/\s/g, '')

export default function TotalExpenseCard({ items }: Props) {
  const [openExpense, setOpenExpense] = useState(false)

  const baseItems: Item[] = [
    { label: '운동비', amount: 0 },
    { label: '운동용품비', amount: 0 },
    { label: '운동식품비', amount: 0 },
    { label: '기타', amount: 0 },
  ]

  const safeItems = baseItems.map((base) => {
    const found = items?.find((item) => normalizeLabel(item.label) === normalizeLabel(base.label))

    return {
      ...base,
      amount: found?.amount ?? 0,
    }
  })

  const maxAmount = Math.max(...safeItems.map((item) => item.amount), 0)

  const maxItem = safeItems.find((item) => item.amount === maxAmount)

  const displayTotalAmount = safeItems.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)

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
            {safeItems.map((item) => {
              const isMax = item.amount === maxAmount && maxAmount > 0

              return (
                <li key={item.label} className={`expense-row ${isMax ? 'highlight' : ''}`}>
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
              총 <span className="summary-number">{displayTotalAmount.toLocaleString()}</span>원
              사용했어요.
            </p>

            {maxItem && maxAmount > 0 && (
              <p className="summary-sub">{maxItem.label}에 가장 많이 썼어요.</p>
            )}
          </footer>
        </section>
      </Card>

      <ExpenseDetailModal
        open={openExpense}
        onClose={() => setOpenExpense(false)}
        items={safeItems}
      />
    </>
  )
}
