// React / 외부 라이브러리
import { useState, useRef, useEffect } from 'react'

// API / hooks / utils
import {
  getTickets,
  createTicket,
  deleteTicket,
  endTicket,
} from '@/api/ticketApi'

// 컴포넌트
import WorkoutTabs from "@/components/recordTabs/RecordTabs";
import TicketRow from './components/ticketRow/TicketRow'

// 모달
import ConfirmModal from './modal/ConfirmModal'
import TicketEndModal from './modal/TicketEndModal'
import TicketAddModal from './modal/TicketAddModal'

// 타입
import { type Exercise } from '@/components/summaryCard/SummaryCard'

// 스타일 
import styles from './Ticket.module.css'

const END_TYPES: Exercise[] = [
  { id: 1, label: '완료', color: '#E0F0FF' },
  { id: 2, label: '기간만료', color: '#FFE6CC' },
  { id: 3, label: '환불', color: '#FFDADA' },
  { id: 4, label: '기타', color: '#E5E5E8' },
]

const COLOR_OPTIONS = [
  '#FFD7D7',
  '#FFEAD7',
  '#FFF7D3',
  '#D7FFD3',
  '#D7EDFF',
  '#D5D3FF',
  '#FCD7FF',
  '#D7FFF3',
]

type Ticket = {
  id: number
  exercise_type: string
  color_code: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count: number
  total_amount: number
  start_date: string
  end_date: string
  status: string
  refund_amount?: number
}

const TicketPage = () => {
  // UI
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // 모달 / 액션
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null)
  const [endTargetIndex, setEndTargetIndex] = useState<number | null>(null)
  const [viewTargetIndex, setViewTargetIndex] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // 입력 상태
  const [ticketType, setTicketType] = useState<'횟수권' | '기간권'>('횟수권')
  const [colorCode, setColorCode] = useState(COLOR_OPTIONS[0])
  const [endReason, setEndReason] = useState<Exercise>(END_TYPES[0])
  const [refundAmount, setRefundAmount] = useState('')

  // 데이터
  const [ticketList, setTicketList] = useState<Ticket[]>([])

  const handleToggle = (index: number) => {
    setActiveDropdownIndex(prev => (prev === index ? null : index))
  }

  const handleDelete = async () => {
    try {
      if (deleteTargetIndex === null) return

      await deleteTicket(deleteTargetIndex)

      setTicketList(prev =>
        prev.filter(t => t.id !== deleteTargetIndex)
      )

      setDeleteTargetIndex(null)

      alert('이용권이 정상적으로 삭제되었습니다.')
    } catch (error) {
      console.log('DELETE 실패', error)
    }
  }

  const handleEnd = async () => {
    try {
      const ticketId = ticketList[endTargetIndex!].id

      await endTicket(
        ticketId,
        endReason,
        refundAmount
      )

      alert('이용권이 정상적으로 종료되었습니다.')

      setEndTargetIndex(null)
      setEndReason(END_TYPES[0])
      setRefundAmount('')

      fetchTickets()
    } catch (error) {
      console.log('PATCH 실패', error)
    }
  }

  const handleAddClose = () => {
    setIsAddModalOpen(false)

    setTicketType('횟수권')
    setColorCode(COLOR_OPTIONS[0])
  }

  const handleEndClose = () => {
    setEndTargetIndex(null)

    setEndReason(END_TYPES[0])
    setRefundAmount('')
  }

  const fetchTickets = async () => {
    try {
      const tickets = await getTickets()

      setTicketList(tickets)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateTicket = async (data: any) => {
    try {
      await createTicket(data)

      alert('이용권 등록이 완료되었습니다.')

      await fetchTickets()

      setIsAddModalOpen(false)
    } catch (error) {
      console.log('POST 실패:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdownIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className={styles.wrap}>
      <main className={styles.writePage}>
        <div className={styles.writeInner}>
          <div className={styles.title}>이용권 관리</div>

          <div className={styles.tabContainer}>
            <WorkoutTabs />
          </div>

          <div className={styles.write}>
            {ticketList.length === 0 ? (
              <div className={styles.emptyText}>
                등록된 티켓이 없어요
              </div>
            ) : (
              ticketList.map((ticket, index) => {
                const isActive = ticket.status === '진행 중'

                return (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    isActive={isActive}
                    openIndex={activeDropdownIndex}
                    onToggle={handleToggle}
                    onEnd={(i) => {
                      setEndTargetIndex(i)
                      setActiveDropdownIndex(null)
                    }}
                    onDelete={() => {
                      setDeleteTargetIndex(ticket.id)
                      setActiveDropdownIndex(null)
                    }}
                    onView={(i) => {
                      setViewTargetIndex(i)
                    }}
                    dropdownRef={dropdownRef}
                  />
                )
              })
            )}

            <div
              className={styles.addBtn}
              onClick={() => setIsAddModalOpen(true)}
            >
              +
            </div>
          </div>
        </div>
      </main>

      {deleteTargetIndex !== null && (
        <ConfirmModal
          onCancel={() => setDeleteTargetIndex(null)}
          onConfirm={handleDelete}
        />
      )}

      {endTargetIndex !== null && (
        <TicketEndModal
          ticket={ticketList[endTargetIndex]}
          endReason={endReason}
          setEndReason={setEndReason}
          refundAmount={refundAmount}
          setRefundAmount={setRefundAmount}
          END_TYPES={END_TYPES}
          onClose={handleEndClose}
          onConfirm={handleEnd}
        />
      )}

      {isAddModalOpen && (
        <TicketAddModal
          ticketType={ticketType}
          setTicketType={setTicketType}
          colorCode={colorCode}
          setSelectedColor={setColorCode}
          COLOR_OPTIONS={COLOR_OPTIONS}
          onClose={handleAddClose}
          onConfirm={handleCreateTicket}
        />
      )}

      {viewTargetIndex !== null && (
        <TicketAddModal
          mode="view"
          ticketType={
            ticketList[viewTargetIndex].ticket_type === 'COUNT'
              ? '횟수권'
              : '기간권'
          }
          setTicketType={setTicketType}
          colorCode={ticketList[viewTargetIndex].color_code}
          setSelectedColor={setColorCode}
          COLOR_OPTIONS={COLOR_OPTIONS}
          initialData={{
            exerciseType: ticketList[viewTargetIndex].exercise_type ?? '',
            colorCode: ticketList[viewTargetIndex].color_code,
            ticketType: ticketList[viewTargetIndex].ticket_type,
            targetCount: ticketList[viewTargetIndex].target_count,
            totalAmount: ticketList[viewTargetIndex].total_amount,
            startDate: ticketList[viewTargetIndex].start_date,
            endDate: ticketList[viewTargetIndex].end_date,
            refundAmount: ticketList[viewTargetIndex].refund_amount,
          }}
          onClose={() => setViewTargetIndex(null)}
          onConfirm={() => setViewTargetIndex(null)}
          isRefunded={ticketList[viewTargetIndex].status === '환불'}
        />
      )}

    </div>
  )
}

export default TicketPage