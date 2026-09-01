import styles from './TicketRow.module.css'
import { BiSolidEditAlt } from 'react-icons/bi'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { GoGoal } from 'react-icons/go'
import { IoIosMore } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'

import Button from '@/components/button/Button'

import type { Ticket } from '@/api/ticketApi'

type TicketRowProps = {
  ticket: Ticket
  index: number
  isActive: boolean
  openIndex: number | null
  onToggle: (index: number) => void
  onEnd: (index: number) => void
  onDelete: (index: number) => void
  onView: (index: number) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}

const TicketRow = ({
  ticket,
  index,
  isActive,
  openIndex,
  onToggle,
  onEnd,
  onDelete,
  onView,
  dropdownRef,
}: TicketRowProps) => {
  const formattedPeriod = `${ticket.start_date!.replaceAll('-', '.')} - ${ticket.end_date!.replaceAll('-', '.')}`

  const formattedCount = `${ticket.target_count}회`

  return (
    <div className={`${styles.ticketRow} ${!isActive ? styles.ended : ''}`}>
      <div className={styles.colName}>
        <div className={styles.dot} style={{ backgroundColor: ticket.color_code }} />

        <span className={styles.exercise}>{ticket.exercise_type}</span>
      </div>

      <div className={styles.colPeriod}>
        <FaRegCalendarCheck className={styles.calendarIcon} aria-hidden="true" />

        {formattedPeriod}
      </div>

      <div className={styles.colCount}>
        <GoGoal className={styles.goalIcon} aria-hidden="true" />

        {formattedCount}
      </div>

      <button type="button" className={styles.colStatus} onClick={() => onView(index)}>
        {ticket.status}
      </button>

      <div className={styles.colAction}>
        <div className={styles.moreWrapper} ref={openIndex === index ? dropdownRef : null}>
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => onToggle(index)}
            aria-label="이용권 메뉴 열기"
            aria-expanded={openIndex === index}
          >
            <IoIosMore className={styles.moreIcon} aria-hidden="true" />
          </button>

          {openIndex === index && (
            <div className={styles.dropdown}>
              {isActive && (
                <Button
                  variant="dropdownEdit"
                  icon={<BiSolidEditAlt />}
                  onClick={() => onEnd(index)}
                >
                  이용권 종료
                </Button>
              )}

              <Button variant="dropdownDelete" icon={<MdDelete />} onClick={() => onDelete(index)}>
                이용권 삭제
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketRow
