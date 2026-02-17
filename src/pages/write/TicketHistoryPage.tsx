import { useState, useRef, useEffect } from 'react'
import styles from './TicketHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'
import WorkoutTabs from '../../components/write/WorkoutTabs'
import ConfirmModal from '../../components/write/modal/ConfirmModal'
import TicketEndModal from '../../components/write/modal/TicketEndModal'
import TicketAddModal from '../../components/write/modal/TicketAddModal'

import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import TicketRow from '../../components/write/TicketRow'

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

const TicketHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)
  const [endIndex, setEndIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [ticketType, setTicketType] = useState<'횟수권' | '기간권'>('횟수권')
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])
  const [selectedEndType, setSelectedEndType] = useState<Exercise>(END_TYPES[0])
  const [price, setPrice] = useState('')
  const [viewIndex, setViewIndex] = useState<number | null>(null)

  const [ticketList, setTicketList] = useState([
    {
      id: 1,
      name: '발레',
      color: '#FCD7FF',
      period: '2026.01.05 - 2026.03.05',
      count: '24회',
      status: '진행 중',
    },
    {
      id: 2,
      name: '헬스',
      color: '#D5D3FF',
      period: '2026.01.05 - 2026.03.05',
      count: '24회',
      status: '완료',
    },
  ])

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDelete = () => {
    if (confirmIndex === null) return
    setTicketList(prev => prev.filter((_, i) => i !== confirmIndex))
    setConfirmIndex(null)
  }

  const handleEnd = () => {
    if (endIndex === null) return

    setTicketList(prev =>
      prev.map((item, i) =>
        i === endIndex
          ? { ...item, status: selectedEndType.label }
          : item
      )
    )

    setEndIndex(null)
    setPrice('')
  }

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
                    openIndex={openIndex}
                    onToggle={handleToggle}
                    onEnd={(i) => {
                      setEndIndex(i)
                      setOpenIndex(null)
                    }}
                    onDelete={(i) => {
                      setConfirmIndex(i)
                      setOpenIndex(null)
                    }}
                    onView={(i) => {
                      setViewIndex(i)
                    }}
                    dropdownRef={dropdownRef}
                  />
                )
              })
            )}

            <div
              className={styles.addBtn}
              onClick={() => setIsAddOpen(true)}
            >
              +
            </div>
          </div>
        </div>
      </main>

      {/* 이용권 삭제 */}
      {confirmIndex !== null && (
        <ConfirmModal
          onCancel={() => setConfirmIndex(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* 이용권 종료 */}
      {endIndex !== null && (
        <TicketEndModal
          ticket={ticketList[endIndex]}
          selectedEndType={selectedEndType}
          setSelectedEndType={setSelectedEndType}
          price={price}
          setPrice={setPrice}
          END_TYPES={END_TYPES}
          onClose={() => setEndIndex(null)}
          onConfirm={handleEnd}
        />
      )}

      {/* 이용권 추가 */}
      {isAddOpen && (
        <TicketAddModal
          ticketType={ticketType}
          setTicketType={setTicketType}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          COLOR_OPTIONS={COLOR_OPTIONS}
          onClose={() => setIsAddOpen(false)}
          onConfirm={() => {
            setTicketList(prev => [
              ...prev,
              {
                id: Date.now(),
                name: '새 이용권',
                color: selectedColor,
                period: '2026.04.01 - 2026.06.01',
                count: ticketType === '횟수권' ? '20회' : '3개월',
                status: '진행 중',
              },
            ])
            setIsAddOpen(false)
          }}
        />
      )}

      {/* 이용권 조회 */}
      {viewIndex !== null && (
        <TicketAddModal
          mode="view"
          ticketType={ticketType}
          setTicketType={setTicketType}
          selectedColor={ticketList[viewIndex].color}
          setSelectedColor={setSelectedColor}
          COLOR_OPTIONS={COLOR_OPTIONS}
          onClose={() => setViewIndex(null)}
          onConfirm={() => setViewIndex(null)}
        />
      )}


    </div>
  )
}

export default TicketHistoryPage