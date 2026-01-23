import ReportHeader from './ReportHeader';

import SummaryCard from '../../components/report/SummaryCard';
import InsightCard from '../../components/report/InsightCard';
import ChartCard from '../../components/report/ChartCard';
import ListCard from '../../components/report/ListCard';

export default function ReportPage() {
  return (
    <div style={{ backgroundColor: '#F7F8FA', minHeight: '100vh' }}>
      {/* 1) 헤더는 무조건 맨 위 */}
      <ReportHeader />

      {/* 2) 본문 */}
      <main
        style={{
          paddingTop: 18,      // 헤더 아래 간격
          paddingLeft: 247,    // 사이드바 offset
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '291px 330px 330px',
            gap: 18,
            alignItems: 'start',
          }}
        >
          {/* 좌측 Summary: 2행 차지 */}
          <div style={{ gridColumn: 1, gridRow: '1 / 3' }}>
            <SummaryCard />
          </div>

          {/* 상단 Insight */}
          <div style={{ gridColumn: '2 / 4', gridRow: 1 }}>
            <InsightCard />
          </div>

          {/* 차트 2개 */}
         <ChartCard type="exercise" title="운동 기록">
  <div />
</ChartCard>

<ChartCard type="expense" title="지출 기록">
  <div />
</ChartCard>


          {/* 하단 리스트 3개 */}
          <div style={{ gridColumn: 1, gridRow: 3 }}>
            <ListCard type="totalNoShow" />
          </div>
          <div style={{ gridColumn: 2, gridRow: 3 }}>
            <ListCard type="totalExercise" />
          </div>
          <div style={{ gridColumn: 3, gridRow: 3 }}>
            <ListCard type="totalExpense" />
          </div>
        </div>
      </main>
    </div>
  );
}