import { useState } from 'react'
import { MdOutlineReceiptLong } from 'react-icons/md'

import './TotalExpenseCard.css'

import Card from '@/components/card/Card'
import EmptyState from '@/components/emptyState/EmptyState'
import ExpenseDetailModal from '@/pages/report/modals/ExpenseDetailModal'
import { ListContentSkeleton } from '../../ReportSkeleton'

type Item = {
  label: string
  amount: number
}

type Props = {
  totalAmount: number
  items: Item[]
  onCreateRecord: () => void
  isLoading?: boolean
}

const normalizeLabel = (label: string) => label.replace(/\s/g, '')

export default function TotalExpenseCard({
  totalAmount,
  items,
  onCreateRecord,
  isLoading = false,
}: Props) {
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
  const hasRecords = totalAmount > 0 || displayTotalAmount > 0

  return (
    <>
      <Card
        title="총 지출"
        width={330}
        height={324}
        backgroundColor="#ffffff"
        radius={20}
        buttonText={!isLoading && hasRecords ? '상세항목' : undefined}
        onButtonClick={() => setOpenExpense(true)}
      >
        {isLoading ? (
          <ListContentSkeleton />
        ) : hasRecords ? (
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
        ) : (
          <EmptyState
            title="아직 지출 기록이 없어요"
            description="운동 관련 지출을 기록하고 소비 흐름을 확인해보세요."
            icon={<MdOutlineReceiptLong />}
            actionLabel="지출 기록하기"
            onAction={onCreateRecord}
            variant="compact"
          />
        )}
      </Card>

      <ExpenseDetailModal
        open={openExpense}
        onClose={() => setOpenExpense(false)}
        items={safeItems}
      />
    </>
  )
}
