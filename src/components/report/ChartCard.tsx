type ChartType = 'exercise' | 'expense';

export default function ChartCard({
  type,
  title,
  children,
}: {
  type: ChartType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 330,
        height: 289,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        padding: 18,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
        {title}
      </div>

      {/* ✅ 차트 바디 */}
      <div
        style={{
          position: 'relative',
          height: 'calc(100% - 40px)', // 제목 영역 제외
          overflow: 'visible',         // ⭐ 핵심
        }}
      >
        {children}
      </div>
    </div>
  );
}