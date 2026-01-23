import ChartCard from '../../components/report/ChartCard';
import ExerciseBarChart from '../../components/report/charts/ExerciseBarChart';

export default function ReportCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '330px 330px', gap: 18 }}>
      <ChartCard type="exercise" title="운동 기록">
        <ExerciseBarChart />
      </ChartCard>

      <ChartCard type="expense" title="지출 기록">
        <div style={{ height: 220, background: '#eee', borderRadius: 14 }} />
      </ChartCard>
    </div>
  );
}