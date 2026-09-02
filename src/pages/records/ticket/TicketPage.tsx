// React / 외부 라이브러리
import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

// hooks
import { useTickets } from '../hooks/useTickets'

// 컴포넌트
import RecordLayout from '../layout/RecordLayout'
import TicketRow from './components/ticketRow/TicketRow'
import Skeleton from '@/components/skeleton/Skeleton'

// 모달
import ConfirmModal from './modals/ConfirmModal'
import TicketEndModal from './modals/TicketEndModal'
import TicketAddModal from './modals/TicketAddModal'

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

const TICKET_SKELETON_ROW_COUNT = 10

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

  const {
    tickets: ticketList,
    handleCreateTicket,
    handleDeleteTicket,
    handleEndTicket,
    loading,
    error,
  } = useTickets()

  const handleToggle = (index: number) => {
    setActiveDropdownIndex((prev) => (prev === index ? null : index))
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>이용권 관리 | Akkaworkout</title>
        <meta
          name="description"
          content="운동 이용권의 기간, 횟수, 금액과 남은 이용 현황을 관리해 보세요."
        />
      </Helmet>

      <RecordLayout title="이용권 관리">
        <div className={styles.write}>
          {loading ? (
            <div className={styles.ticketSkeleton} role="status" aria-label="이용권 불러오는 중">
              {Array.from({ length: TICKET_SKELETON_ROW_COUNT }).map((_, index) => (
                <div key={index} className={styles.ticketSkeletonRow}>
                  <Skeleton width={42} height={42} borderRadius={12} />
                  <div className={styles.ticketSkeletonText}>
                    <Skeleton width={140} height={17} />
                    <Skeleton width={220} height={12} />
                  </div>
                  <Skeleton width={90} height={32} borderRadius={10} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={styles.emptyText}>티켓을 불러오지 못했어요</div>
          ) : ticketList.length === 0 ? (
            <div className={styles.emptyText}>등록된 티켓이 없어요</div>
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
            aria-label="이용권 추가"
          >
            +
          </div>
        </div>

        {deleteTargetIndex !== null && (
          <ConfirmModal
            onCancel={() => setDeleteTargetIndex(null)}
            onConfirm={async () => {
              if (deleteTargetIndex === null) return

              await handleDeleteTicket(deleteTargetIndex, () => {
                setDeleteTargetIndex(null)
              })
            }}
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
            onConfirm={async () => {
              if (endTargetIndex === null) return

              const ticketId = ticketList[endTargetIndex].id

              await handleEndTicket(ticketId, endReason, refundAmount, () => {
                setEndTargetIndex(null)
                setEndReason(END_TYPES[0])
                setRefundAmount('')
              })
            }}
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
            initialData={{
              exerciseType: ticketList[viewTargetIndex].exercise_type,
              colorCode: ticketList[viewTargetIndex].color_code,
              ticketType: ticketList[viewTargetIndex].ticket_type,
              targetCount: ticketList[viewTargetIndex].target_count ?? 0,
              totalAmount: ticketList[viewTargetIndex].total_amount ?? 0,
              startDate: ticketList[viewTargetIndex].start_date ?? '',
              endDate: ticketList[viewTargetIndex].end_date ?? '',
              refundAmount: ticketList[viewTargetIndex].refund_amount,
            }}
            ticketType={ticketList[viewTargetIndex].ticket_type === 'COUNT' ? '횟수권' : '기간권'}
            setTicketType={setTicketType}
            colorCode={ticketList[viewTargetIndex].color_code}
            setSelectedColor={setColorCode}
            COLOR_OPTIONS={COLOR_OPTIONS}
            onClose={() => {
              setViewTargetIndex(null)
            }}
            onConfirm={() => {}}
            isRefunded={ticketList[viewTargetIndex].status === 'ENDED'}
          />
        )}
      </RecordLayout>
    </>
  )
}

export default TicketPage
