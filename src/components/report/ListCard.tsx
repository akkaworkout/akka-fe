type ListType = 'totalExercise' | 'totalExpense' | 'totalNoShow';

export default function ListCard({ type }: { type: ListType }) {
  const map = {
    totalExercise: { title: '총 운동'},
    totalExpense: { title: '총 지출'},
    totalNoShow: { title: '총 노쇼'},
  } as const;

  const { title} = map[type];

  return (
    <div
      style={{
        width: '100%',
        height: 324,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: 18,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, color: '#2C2C2C' }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.5)' }}>
      </div>

      {/* 리스트 자리(나중에 실제 리스트/버튼 들어갈 공간) */}
      <div
        style={{
          marginTop: 12,
          height: 250,
          borderRadius: 14,
          background: '#eee',
        }}
      />
    </div>
  );
}