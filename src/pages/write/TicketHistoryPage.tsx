// React / 외부 라이브러리
import { useState, useRef, useEffect } from 'react'

// API / hooks / utils
import api from '../../api/client'
import { ticketApi } from '../../api/ticket'

// 컴포넌트
import SideNav from '../../components/sideNav/SideNav'
import WorkoutTabs from '../../components/write/WorkoutTabs'
import ConfirmModal from '../../components/write/modal/ConfirmModal'
import TicketEndModal from '../../components/write/modal/TicketEndModal'
import TicketAddModal from '../../components/write/modal/TicketAddModal'
import TicketRow from '../../components/write/TicketRow'

// 타입
import { type Exercise } from '../../components/common/SummaryCard'

// 스타일 
import styles from './TicketHistory.module.css'

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
  color: string
  ticket_type: 'COUNT' | 'PERIOD'
  target_count: number
  total_price: number
  start_date: string
  end_date: string
  status: string
  refund_price?: number
}

const TicketHistoryPage = () => {
  // UI
  const [isSidebarFolded, setIsSidebarFolded] = useState(false) // 사이드바 상태
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
      const ticketId = ticketList[deleteTargetIndex!].id

      await api.delete(ticketApi.DETAIL(ticketId))

      if (deleteTargetIndex === null) return
      setTicketList(prev => prev.filter((_, i) => i !== deleteTargetIndex))
      setDeleteTargetIndex(null)

      alert('이용권이 정상적으로 삭제되었습니다.')

    } catch (error) {
      console.log('DELETE 실패', error)
    }
  }

  const handleEnd = async () => {
    try {
      const ticketId = ticketList[endTargetIndex!].id

      await api.patch(
        ticketApi.END(ticketId),
        {
          end_reason:
            endReason.label === '완료'
              ? 'COMPLETED'
              : endReason.label === '기간만료'
                ? 'EXPIRED'
                : endReason.label === '환불'
                  ? 'REFUNDED'
                  : 'ETC',
          refund_price:
            endReason.label === '환불'
              ? Number(refundAmount)
              : null,
        }
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

  const mapTicket = (item: any): Ticket => {
    const statusMap: Record<string, string> = {
      COMPLETED: '완료',
      EXPIRED: '기간만료',
      REFUNDED: '환불',
    }

    const formattedStatus =
      item.status === 'ENDED'
        ? statusMap[item.end_reason] ?? '기타'
        : '진행 중'

    return {
      id: item.ticket_id,
      exercise_type: item.exerciseType,
      color: item.color,
      ticket_type: item.ticket_type,
      target_count: item.target_count,
      total_price: item.total_price,
      start_date: item.start_date.split('T')[0],
      end_date: item.end_date.split('T')[0],
      status: formattedStatus,
      refund_price: item.refund_price,
    }
  }

  const fetchTickets = async () => {
    try {
      const { data } = await api.get(ticketApi.BASE)
      setTicketList(data.map(mapTicket))
    } catch (error) {
      console.log('GET 실패', error)
    }
  }

  const createTicket = async (data: any) => {
    try {
      await api.post(ticketApi.BASE, {
        exerciseType: data.exercise_type,
        color: data.color,
        ticket_type: data.ticket_type,
        target_count: data.target_count,
        total_price: data.total_price,
        start_date: data.start_date,
        end_date: data.end_date,
      })

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
      <SideNav
        folded={isSidebarFolded}
        onToggle={() => setIsSidebarFolded(prev => !prev)}
      />

      <main
        className={styles.writePage}
        style={{ marginLeft: isSidebarFolded ? 74 : 220 }}
      >
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
                    onDelete={(i) => {
                      setDeleteTargetIndex(i)
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
          onConfirm={createTicket}
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
          colorCode={ticketList[viewTargetIndex].color}
          setSelectedColor={setColorCode}
          COLOR_OPTIONS={COLOR_OPTIONS}
          initialData={{
            exerciseType: ticketList[viewTargetIndex].exercise_type ?? '', // ⭐ 핵심
            color: ticketList[viewTargetIndex].color,
            ticket_type: ticketList[viewTargetIndex].ticket_type,
            target_count: ticketList[viewTargetIndex].target_count,
            total_price: ticketList[viewTargetIndex].total_price,
            start_date: ticketList[viewTargetIndex].start_date,
            end_date: ticketList[viewTargetIndex].end_date,
            refund_price: ticketList[viewTargetIndex].refund_price,
          }}
          onClose={() => setViewTargetIndex(null)}
          onConfirm={() => setViewTargetIndex(null)}
          isRefunded={ticketList[viewTargetIndex].status === '환불'}
        />
      )}

    </div>
  )
}

export default TicketHistoryPage