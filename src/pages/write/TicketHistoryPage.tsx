import { useState, useRef, useEffect } from 'react'

import styles from './TicketHistory.module.css'
import SideNav from '../../components/sideNav/SideNav'
import WorkoutTabs from '../../components/write/WorkoutTabs'
import CalendarIcon from '../../assets/icons/sidebar/sidebar_calendar_active.png'
import Goal from '../../assets/icons/goal.png'
import MoreButton from '../../assets/icons/moreButton.png'
import EditIcon from '../../assets/icons/edit.png'
import DeleteIcon from '../../assets/icons/delete.png'

const TicketHistoryPage = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

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
      status: '진행 중',
    },
  ])

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
                아직 등록된 티켓이 없어요
              </div>
            ) : (
              ticketList.map((ticket, index) => (
                <div key={ticket.id} className={styles.ticket}>
                  <div className={styles.left}>
                    <div
                      className={styles.dot}
                      style={{ backgroundColor: ticket.color }}
                    />
                    <div className={styles.exercise}>{ticket.name}</div>
                  </div>

                  <div className={styles.center}>
                    <div className={styles.period}>
                      <img src={CalendarIcon} alt="calendar_icon" />
                      {ticket.period}
                    </div>
                    <div className={styles.count}>
                      <img src={Goal} alt="goal_icon" />
                      {ticket.count}
                    </div>
                  </div>

                  <div className={styles.right}>
                    <div className={styles.status}>{ticket.status}</div>

                    <div
                      className={styles.moreWrapper}
                      ref={openIndex === index ? dropdownRef : null}
                    >
                      <button
                        type="button"
                        className={styles.moreButton}
                        onClick={() => handleToggle(index)}
                      >
                        <img src={MoreButton} alt="more_button_icon" />
                      </button>

                      {openIndex === index && (
                        <div className={styles.dropdown}>
                          <div className={styles.dropdownItem}>
                            <img
                              src={EditIcon}
                              alt="edit"
                              className={styles.editIcon}
                            />
                            이용권 종료
                          </div>

                          <div
                            className={`${styles.dropdownItem} ${styles.delete}`}
                            onClick={() => {
                              setConfirmIndex(index)
                              setOpenIndex(null)
                            }}
                          >
                            <img
                              src={DeleteIcon}
                              alt="delete"
                              className={styles.deleteIcon}
                            />
                            이용권 삭제
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className={styles.addBtn}>+</div>
          </div>
        </div>
      </main>

      {confirmIndex !== null && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmText}>
              이용권을 정말 삭제하시겠습니까?
            </div>

            <div className={styles.confirmButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmIndex(null)}
              >
                취소
              </button>

              <button
                className={styles.confirmBtn}
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketHistoryPage