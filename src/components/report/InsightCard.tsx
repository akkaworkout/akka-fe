export default function InsightCard() {
  return (
    <div
      style={{
        width: 677,
        height: 87,
        background: '#fff',
        borderRadius: 14,
        padding: '0 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 20
      }}
    >
      <p style={{ margin: 0, fontSize: 16, color: '#2C2C2C' }}>
        이번 달엔 <span style={{ color: '#454DD7'}}>주말에 운동</span>이 몰렸어요.
        다음 달엔 <span style={{ color: '#454DD7'}}>평일 1회</span>만 추가해볼까요?
      </p>

      <p style={{ margin: '4px 0 0 0', fontSize: 16, color: '#2C2C2C' }}>
        노쇼로 <span style={{ color: '#454DD7'}}>70,000원</span>을 놓쳤어요.
      </p>
    </div>
  );
}