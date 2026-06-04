import { useState } from "react";
import ReportHeader from "./ReportHeader";

import SummaryCard, {
  type Exercise,
} from "@/components/common/SummaryCard";

import InsightCard from "@/components/report/InsightCard";
import Card from "@/components/common/Card";
import BarChart from "@/components/report/charts/BarChart";
import TotalExpenseCard from "@/components/report/card/TotalExpenseCard/TotalExpenseCard";
import TotalExerciseCard from "@/components/report/card/TotalExerciseCard/TotalExerciseCard";
import TotalNoShowCard from "@/components/report/card/TotalNoShowCard/TotalNoShowCard";
import RingChart from "@/components/report/charts/RingChart";

import styles from "@/pages/report/Report.module.css";

import MemoDetailModal from "@/pages/report/modals/MemoDetailModal";

import Spinner from "@/components/common/Spinner";

import { useTickets } from "@/hooks/useTickets";
import { useReportData } from "@/hooks/useReportData";
import { useExerciseOptions } from "@/hooks/useExerciseOptions";
import { useInsightCalculations } from "@/hooks/useInsightCalculations";
import { useReportMetrics } from "@/hooks/useReportMetrics";

const EXERCISES: Exercise[] = [
  { id: 1, label: "발레", color: "rgb(252, 215, 255)" },
  { id: 2, label: "헬스", color: "#DAD7FF" },
  { id: 3, label: "필라테스", color: "#FFE6CC" },
  { id: 4, label: "수영", color: "#E0F0FF" },
];

export default function ReportPage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(
    EXERCISES[0],
  );
  const [openMemo, setOpenMemo] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  // === 데이터 로드 ===
  const { tickets, loading: ticketsLoading } = useTickets();
  const { reportData, loading: reportLoading } = useReportData(
    year,
    month,
    selectedExercise.label,
  );

  const loading = ticketsLoading || reportLoading;

  // === 계산 훅 ===
  const exerciseOptions = useExerciseOptions(tickets, year, month);
  const insights = useInsightCalculations(reportData);
  const metrics = useReportMetrics(reportData);

  // === 현재 선택된 운동 (유효성 검증) ===
  const currentExercise = exerciseOptions.some(
    (exercise) => exercise.label === selectedExercise.label,
  )
    ? selectedExercise
    : exerciseOptions[0];

  // === 월 네비게이션 ===
  const handlePrevMonth = () => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setMonth((prev) => {
      if (prev === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <main className={styles.reportPage}>
        <div className={styles.reportInner}>
          <ReportHeader
            year={year}
            month={month}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            totalExerciseCount={metrics.totalExerciseCount}
            totalExpenseAmount={metrics.totalExpenseAmount}
            noShowCount={metrics.noShowCount}
          />

          <div className={styles.reportGrid}>
            <div className={styles.summarySection}>
              <Card
                title="운동별 목표 달성률"
                width="100%"
                height={412}
                radius={20}
                backgroundColor="#ffffff"
              >
                <SummaryCard
                  expenses={exerciseOptions}
                  selected={currentExercise}
                  onChange={setSelectedExercise}
                />
                <RingChart percent={metrics.ringPercent} />
              </Card>
            </div>

            <div className={styles.insightSection}>
              <InsightCard
                집중요일={insights.집중요일}
                추천요일={insights.추천요일}
                추천횟수={insights.추천횟수}
                noshowLoss={metrics.noshowLossAmount}
              />
            </div>

            <Card
              title="운동 기록"
              width={330}
              height={289}
              backgroundColor="#ffffff"
              radius={20}
            >
              <BarChart
                values={insights.exerciseByDow}
                labels={["월", "화", "수", "목", "금", "토", "일"]}
                unit="회"
                activeColor="#4F46E5"
                normalColor="#C7D2FE"
                bubbleColor="#4F46E5"
                bubbleTextColor="#FFFFFF"
                gridColor="#EEF2FF"
              />
            </Card>

            <Card
              title="지출 기록"
              width={330}
              height={289}
              backgroundColor="#ffffff"
              radius={20}
            >
              <BarChart
                values={insights.expenseByDow}
                labels={["월", "화", "수", "목", "금", "토", "일"]}
                unit="원"
                activeColor="#FFC227"
                normalColor="#FFE7AA"
                bubbleColor="#FFC227"
                bubbleTextColor="#FFFFFF"
                gridColor="#EEF2FF"
              />
            </Card>

            <div className={styles.listSection1}>
              <TotalNoShowCard
                totalCount={metrics.noShowCount}
                lossAmount={metrics.noshowLossAmount}
                items={metrics.noshowItems}
                exercises={exerciseOptions}
                onOpenMemo={() => setOpenMemo(true)}
              />
            </div>

            <div className={styles.listSection2}>
              <TotalExerciseCard
                totalCount={metrics.totalExerciseCount}
                items={metrics.exerciseItems}
              />
            </div>

            <div className={styles.listSection3}>
              <TotalExpenseCard
                totalAmount={metrics.totalExpenseAmount}
                items={metrics.expenseItems}
              />
            </div>
          </div>
        </div>

        <MemoDetailModal
          open={openMemo}
          onClose={() => setOpenMemo(false)}
          monthText={`${year}.${String(month).padStart(2, "0")}`}
          rows={metrics.failMemoRows}
        />
      </main>
    </div>
  );
}