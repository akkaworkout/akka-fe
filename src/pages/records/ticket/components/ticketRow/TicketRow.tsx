import styles from './TicketRow.module.css'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { GoGoal } from 'react-icons/go'
import { IoIosMore } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import Button from '@/components/button/Button'
import type { Ticket } from '@/api/ticketApi'

type Props = {
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
}: Props) => {
  const period =
    ticket.start_date && ticket.end_date
      ? `${ticket.start_date.replaceAll('-', '.')} – ${ticket.end_date.replaceAll('-', '.')}`
      : '기간 정보 없음'
  const count =
    ticket.ticket_type === 'COUNT'
      ? `${ticket.remaining_count ?? ticket.target_count ?? 0} / ${ticket.target_count ?? 0}회 남음`
      : '기간권'

  return (
    <div
      className={`${styles.ticketRow} ${!isActive ? styles.ended : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${ticket.exercise_type} 이용권 상세 보기`}
      onClick={() => onView(index)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView(index)
        }
      }}
    >
      <div className={styles.mainInfo}>
        <span
          className={styles.dot}
          style={{ backgroundColor: ticket.color_code }}
          aria-hidden="true"
        />
        <div className={styles.textInfo}>
          <strong className={styles.exercise}>{ticket.exercise_type}</strong>
          <span className={styles.type}>
            {ticket.ticket_type === 'COUNT' ? '횟수권' : '기간권'}
          </span>
        </div>
      </div>
      <div className={styles.details}>
        <span>
          <FaRegCalendarCheck aria-hidden="true" />
          {period}
        </span>
        <span>
          <GoGoal aria-hidden="true" />
          {count}
        </span>
        {ticket.total_amount != null && (
          <span className={styles.amount}>{ticket.total_amount.toLocaleString()}원</span>
        )}
      </div>
      <span className={`${styles.status} ${isActive ? styles.active : ''}`}>{ticket.status}</span>
      <div
        className={styles.moreWrapper}
        ref={openIndex === index ? dropdownRef : null}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.moreButton}
          onClick={() => onToggle(index)}
          aria-label={`${ticket.exercise_type} 이용권 메뉴`}
          aria-expanded={openIndex === index}
        >
          <IoIosMore aria-hidden="true" />
        </button>
        {openIndex === index && (
          <div className={styles.dropdown}>
            {isActive && (
              <Button variant="dropdownEdit" icon={<BiSolidEditAlt />} onClick={() => onEnd(index)}>
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
  )
}

export default TicketRow
