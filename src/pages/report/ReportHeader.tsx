import { useState } from 'react';
import leftIcon from '../../assets/icons/chevron-left.png';
import styles from './Report.module.css';

export default function ReportHeader() {
  const [monthDate, setMonthDate] = useState(new Date(2026, 0, 1));

  const handlePrev = () => {
    setMonthDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setMonthDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const monthText = `${monthDate.getFullYear()}.${String(
    monthDate.getMonth() + 1
  ).padStart(2, '0')}`;

  return (
    <div className={styles.reportHeader}>
      {/* 월 이동 */}
      <div className={styles.monthArea}>
        <button className={styles.iconBtn} onClick={handlePrev}>
          <img src={leftIcon} alt="prev" width={17} height={19} />
        </button>

        <span className={styles.monthText}>{monthText}</span>

        <button className={styles.iconBtn} onClick={handleNext}>
          <img
            src={leftIcon}
            alt="next"
            width={17}
            height={19}
            style={{ transform: 'rotate(180deg)' }}
          />
        </button>
      </div>

      {/* 우측 요약 */}
      <div className={styles.summaryArea}>
        <Summary label="총 운동" value="15회" />
        <Divider />
        <Summary label="총 지출" value="₩918,000" />
        <Divider />
        <Summary label="노쇼 횟수" value="3회" />
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}