import styles from './TicketRow.module.css'

import CalendarIcon from '../../assets/icons/sidebar/sidebar_calendar_active.png'
import Goal from '../../assets/icons/goal.png'
import MoreButton from '../../assets/icons/moreButton.png'
import EditIcon from '../../assets/icons/edit.png'
import DeleteIcon from '../../assets/icons/delete.png'

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

const getMonthDiff = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  const monthDiff = endDate.getMonth() - startDate.getMonth()
  return yearDiff * 12 + monthDiff
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
  const formattedPeriod = `${ticket.start_date.replaceAll('-', '.')} - ${ticket.end_date.replaceAll('-', '.')}`

  const formattedCount = `${ticket.target_count}회`

  return (
    <div
      className={`${styles.ticketRow} ${!isActive ? styles.ended : ''
        }`}
    >
      <div className={styles.colName}>
        <div
          className={styles.dot}
          style={{ backgroundColor: ticket.color }}
        />
        <span className={styles.exercise}>
          {ticket.exercise_type}
        </span>
      </div>

      <div className={styles.colPeriod}>
        <img src={CalendarIcon} alt="calendar_icon" />
        {formattedPeriod}
      </div>

      <div className={styles.colCount}>
        <img src={Goal} alt="goal_icon" />
        {formattedCount}
      </div>

      <button
        type="button"
        className={styles.colStatus}
        onClick={() => onView(index)}
      >
        {ticket.status}
      </button>

      <div className={styles.colAction}>
        <div
          className={styles.moreWrapper}
          ref={openIndex === index ? dropdownRef : null}
        >
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => onToggle(index)}
          >
            <img src={MoreButton} alt="more_button_icon" />
          </button>

          {openIndex === index && (
            <div className={styles.dropdown}>
              {isActive && (
                <div
                  className={`${styles.dropdownItem} ${styles.edit}`}
                  onClick={() => onEnd(index)}
                >
                  <img
                    src={EditIcon}
                    alt="edit"
                    className={styles.editIcon}
                  />
                  이용권 종료
                </div>
              )}

              <div
                className={`${styles.dropdownItem} ${styles.delete}`}
                onClick={() => onDelete(index)}
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
  )
}

export default TicketRow