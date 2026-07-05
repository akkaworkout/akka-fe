import { useState } from "react";
import { Helmet } from "react-helmet-async";

import SummaryCard, {
  type Exercise,
} from "@/components/summaryCard/SummaryCard";

import BarChart from "./components/charts/BarChart";
import RingChart from "./components/charts/RingChart";

import Card from "@/components/card/Card";
import Spinner from "@/components/spinner/Spinner";

import ReportHeader from "./components/ReportHeader";
import InsightCard from "./components/card/InsightCard";
import TotalExpenseCard from "./components/card/TotalExpenseCard/TotalExpenseCard";
import TotalExerciseCard from "./components/card/TotalExerciseCard/TotalExerciseCard";
import TotalNoShowCard from "./components/card/TotalNoShowCard/TotalNoShowCard";

import styles from "@/pages/report/Report.module.css";

import MemoDetailModal from "@/pages/report/modals/MemoDetailModal";

import { useTickets } from "@/pages/records/hooks/useTickets";
import { useReportData } from "./hooks/useReportData";
import { useExerciseOptions } from "./hooks/useExerciseOptions";
import { useInsightCalculations } from "./hooks/useInsightCalculations";
import { useReportMetrics } from "./hooks/useReportMetrics";

export default function ReportPage() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [openMemo, setOpenMemo] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
  } = useTickets();

  const exerciseOptions = useExerciseOptions(tickets, year, month);

  const currentExercise =
    exerciseOptions.find(
      (exercise) => exercise.label === selectedExercise?.label,
    ) ??
    exerciseOptions[0] ??
    null;

  const {
    reportData,
    loading: reportLoading,
    error: reportError,
  } = useReportData(year, month, currentExercise?.label);

  const isInitialLoad = ticketsLoading;
  const isPartialLoading = reportLoading && !isInitialLoad;

  const insights = useInsightCalculations(reportData);
  const metrics = useReportMetrics(reportData);

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

  if (isInitialLoad) {
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
    <>
      <Helmet>
        <title>운동 리포트 | Akkaworkout</title>
        <meta
          name="description"
          content="운동 횟수, 노쇼 손실, 운동 지출을 리포트로 확인해 보세요."
        />
      </Helmet>

      <div className={styles.wrap}>
        <div className={styles.reportPage}>
          <section className={styles.reportInner}>
            <ReportHeader
              year={year}
              month={month}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              totalExerciseCount={metrics.totalExerciseCount}
              totalExpenseAmount={metrics.totalExpenseAmount}
              noShowCount={metrics.noShowCount}
            />

            {ticketsError && (
              <div className={styles.errorMessage}>
                이용권 정보를 불러오지 못했습니다.
              </div>
            )}

            {reportError && (
              <div className={styles.errorMessage}>{reportError}</div>
            )}


            <div className={styles.reportGrid}>
              <div className={styles.summarySection}>
                <Card
                  title="운동별 목표 달성률"
                  width="100%"
                  height={412}
                  radius={20}
                  backgroundColor="#ffffff"
                >
                  {currentExercise ? (
                    <>
                      <SummaryCard
                        expenses={exerciseOptions}
                        selected={currentExercise}
                        onChange={setSelectedExercise}
                      />
                      {isPartialLoading ? (
                        <div className={styles.goalLoadingContainer}>
                          <Spinner size={30} />
                        </div>
                      ) : (
                        <RingChart percent={metrics.ringPercent} />
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyState}>
                      <strong>등록된 이용권이 없어요</strong>
                      <p>
                        이용권을 등록하면 운동별 목표 달성률을 확인할 수 있어요.
                      </p>
                    </div>
                  )}
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
          </section>

          <MemoDetailModal
            open={openMemo}
            onClose={() => setOpenMemo(false)}
            monthText={`${year}.${String(month).padStart(2, "0")}`}
            rows={metrics.failMemoRows}
          />
        </div>
      </div>
    </>
  );
}
