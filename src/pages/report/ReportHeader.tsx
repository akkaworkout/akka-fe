import { useState } from 'react';
import leftIcon from '../../assets/icons/chevron-left.png';

export default function ReportHeader() {
  const [monthDate, setMonthDate] = useState(new Date(2026, 0, 1)); // 2026.01

  const handlePrev = () => {
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const monthText = `${monthDate.getFullYear()}.${String(
    monthDate.getMonth() + 1
  ).padStart(2, '0')}`;

  return (
    <div style={wrapper}>
      {/* 월 이동 */}
      <div style={monthArea}>
        <button style={iconBtn} onClick={handlePrev}>
          <img src={leftIcon} alt="prev" width={17} height={19} />
        </button>

        <span style={monthTextStyle}>{monthText}</span>

        <button style={iconBtn} onClick={handleNext}>
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
      <div style={summaryArea}>
        <Summary label="총 운동" value="15회" />
        <Divider />
        <Summary label="총 지출" value="₩918,000" />
        <Divider />
        <Summary label="노쇼 횟수" value="3회" />
      </div>
    </div>
  );
}

/* ---------- components ---------- */

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryItem}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={divider} />;
}

/* ---------- styles ---------- */

const wrapper: React.CSSProperties = {
  width: 941,
  height: 51,
  display: 'flex',
  alignItems: 'center',
};

const monthArea: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const monthTextStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
};

const iconBtn: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
};

const summaryArea: React.CSSProperties = {
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: 18,
};

const summaryItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
};

const valueStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
};

const divider: React.CSSProperties = {
  width: 4,
  height: 51,
  backgroundColor: '#000',
};