export default function ReportLists() {
  return (
    <div style={{ display: 'flex', gap: 18 }}>
      <div style={{ width: 327, height: 324, background: '#fff', borderRadius: 14, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        totalExercise
      </div>
      <div style={{ width: 327, height: 324, background: '#fff', borderRadius: 14, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        totalExpense
      </div>
      <div style={{ width: 327, height: 324, background: '#fff', borderRadius: 14, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        totalNoShow
      </div>
    </div>
  );
}