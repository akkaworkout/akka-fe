import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

import styles from './TicketHistory.module.css'

import SideNav from '../../components/sideNav/SideNav'
import WorkoutTabs from '../../components/write/WorkoutTabs'
import ConfirmModal from '../../components/write/modal/ConfirmModal'
import TicketEndModal from '../../components/write/modal/TicketEndModal'
import TicketAddModal from '../../components/write/modal/TicketAddModal'
import TicketRow from '../../components/write/TicketRow'
import SummaryCard, { type Exercise } from '../../components/common/SummaryCard'
import { API_BASE_URL, TICKET_ENDPOINTS } from '../../api/write'

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
}

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
  const [ticketList, setTicketList] = useState<Ticket[]>([])

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const ticketId = ticketList[confirmIndex!].id

      const response = await axios.delete(
        `${API_BASE_URL}/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (confirmIndex === null) return
      setTicketList(prev => prev.filter((_, i) => i !== confirmIndex))
      setConfirmIndex(null)

      alert('이용권이 정상적으로 삭제되었습니다.')

      console.log('DELETE 성공', response)
    } catch (error) {
      console.log('DELETE 실패', error)
    }
  }

  const handleEnd = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const ticketId = ticketList[endIndex!].id

      await axios.patch(
        `${API_BASE_URL}/tickets/${ticketId}/end`,
        {
          end_reason: selectedEndType.label === '완료'
            ? 'COMPLETED'
            : selectedEndType.label === '기간만료'
              ? 'EXPIRED'
              : selectedEndType.label === '환불'
                ? 'REFUNDED'
                : 'ETC',
          refund_price:
            selectedEndType.label === '환불'
              ? Number(price)
              : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('이용권이 정상적으로 종료되었습니다.')

      setEndIndex(null)
      setSelectedEndType(END_TYPES[0])
      setPrice('')
      fetchTickets()

    } catch (error) {
      console.log('PATCH 실패', error)
    }
  }

  const handleAddClose = () => {
    setIsAddOpen(false)

    setTicketType('횟수권')
    setSelectedColor(COLOR_OPTIONS[0])
  }

  const handleEndClose = () => {
    setEndIndex(null)

    setSelectedEndType(END_TYPES[0])
    setPrice('')
  }

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await axios.get(
        `${API_BASE_URL}${TICKET_ENDPOINTS.LIST}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setTicketList(
        response.data.map((item: any) => {
          let formattedStatus = '진행 중'

          if (item.status === 'ENDED') {
            switch (item.end_reason) {
              case 'COMPLETED':
                formattedStatus = '완료'
                break
              case 'EXPIRED':
                formattedStatus = '기간만료'
                break
              case 'REFUNDED':
                formattedStatus = '환불'
                break
              default:
                formattedStatus = '기타'
            }
          }

          return {
            id: item.ticket_id,
            exercise_type: item.exercise_type,
            color: item.color,
            ticket_type: item.ticket_type,
            target_count: item.target_count,
            total_price: item.total_price,
            start_date: item.start_date.split('T')[0],
            end_date: item.end_date.split('T')[0],
            status: formattedStatus,
          }
        })
      )

      console.log('GET 성공', response.data)
    } catch (error) {
      console.log('GET 실패', error)
    }
  }

  const createTicket = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await axios.post(
        `${API_BASE_URL}${TICKET_ENDPOINTS.CREATE}`,
        {
          exercise_type: data.exercise_type,
          color: data.color,
          ticket_type: data.ticket_type,
          target_count: data.target_count,
          total_price: data.total_price,
          start_date: data.start_date,
          end_date: data.end_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log('POST 성공:', response.data)
      alert('이용권 등록이 완료되었습니다.')

      await fetchTickets()
      setIsAddOpen(false)
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
        setOpenIndex(null)
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

      {confirmIndex !== null && (
        <ConfirmModal
          onCancel={() => setConfirmIndex(null)}
          onConfirm={handleDelete}
        />
      )}

      {endIndex !== null && (
        <TicketEndModal
          ticket={ticketList[endIndex]}
          selectedEndType={selectedEndType}
          setSelectedEndType={setSelectedEndType}
          price={price}
          setPrice={setPrice}
          END_TYPES={END_TYPES}
          onClose={handleEndClose}
          onConfirm={handleEnd}
        />
      )}

      {isAddOpen && (
        <TicketAddModal
          ticketType={ticketType}
          setTicketType={setTicketType}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          COLOR_OPTIONS={COLOR_OPTIONS}
          onClose={handleAddClose}
          onConfirm={createTicket}
        />
      )}

      {viewIndex !== null && (
        <TicketAddModal
          mode="view"
          ticketType={
            ticketList[viewIndex].ticket_type === 'COUNT'
              ? '횟수권'
              : '기간권'
          }
          setTicketType={setTicketType}
          selectedColor={ticketList[viewIndex].color}
          setSelectedColor={setSelectedColor}
          COLOR_OPTIONS={COLOR_OPTIONS}
          initialData={ticketList[viewIndex]}
          onClose={() => setViewIndex(null)}
          onConfirm={() => setViewIndex(null)}
        />
      )}

    </div>
  )
}

export default TicketHistoryPage