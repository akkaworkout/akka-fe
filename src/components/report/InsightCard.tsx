type Props = {
  집중요일?: string
  추천요일?: string
  추천횟수?: number
  noshowLoss?: number
}

export default function InsightCard({
  집중요일 = '주말',
  추천요일 = '평일',
  추천횟수 = 1,
  noshowLoss = 0
}: Props) {
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
        justifyContent: 'center'
      }}
    >
      <p style={{ margin: 0, fontSize: 16, color: '#2C2C2C' }}>
        이번 달엔 <span style={{ color: '#454DD7' }}>{집중요일}에 운동</span>이 몰렸어요.
        다음 달엔 <span style={{ color: '#454DD7' }}>{추천요일} {추천횟수}회</span>만 추가해볼까요?
      </p>

      <p style={{ margin: '4px 0 0 0', fontSize: 16, color: '#2C2C2C' }}>
        노쇼로 <span style={{ color: '#454DD7' }}>{noshowLoss.toLocaleString()}원</span>을 놓쳤어요.
      </p>
    </div>
  )
}