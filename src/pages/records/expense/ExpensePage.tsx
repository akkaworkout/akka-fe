// React / 외부 라이브러리
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//  API / 로직
import api from "@/api/client";
import { expenseApi } from "@/api/expense";

// 컴포넌트 (UI)
import WorkoutTabs from "@/components/recordTabs/RecordTabs";
import DateSelect from "@/components/dateSelect/DateSelect";
import SummaryCard, { type Expense } from "@/components/summaryCard/SummaryCard";
import RecordSummaryCard from '../components/RecordSummaryCard'

// 스타일
import styles from "../workout/Workout.module.css";

const EXPENSES = [
  { id: 1, value: "운동 용품", label: "운동 용품", color: "#fcd7ff" },
  { id: 2, value: "운동 식품", label: "운동 식품", color: "#FFE6CC" },
  { id: 3, value: "기타", label: "기타(교통비 등)", color: "#E0F0FF" },
];

// 생성
const createExpense = (data: {
  category: string;
  title: string;
  amount: number;
  expense_date: string;
}) => {
  return api.post(expenseApi.BASE, data);
};

// 요약 조회
const getExpenseStats = () => {
  return api.get(expenseApi.STATS);
};

const ExpensePage = () => {
  // 라우팅
  const navigate = useNavigate();

  // UI / 입력 상태
  const [date, setDate] = useState<Date>(new Date()); // 날짜 (생성일)
  const [selectedCategory, setSelectedCategory] = useState<Expense>(
    EXPENSES[0],
  ); // 선택된 카테고리
  const [item, setItem] = useState(""); // 기타 지출 아이템
  const [amount, setAmount] = useState(""); // 금액

  // 요약 데이터
  const [monthlyExpenseCount, setMonthlyExpenseCount] = useState(0);
  const [monthlyTotalExpense, setMonthlyTotalExpense] = useState(0);
  const [topExpenseCategory, setTopExpenseCategory] = useState("기록 없음");

  const isFormValid = item.trim() !== "" && amount.trim() !== "";

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleSubmit = async () => {
    try {
      await createExpense({
        category: selectedCategory.value,
        title: item,
        amount: Number(amount),
        expense_date: formatDate(date),
      });

      alert("운동지출 기록이 완료되었습니다.");
      navigate("/calendar");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const { data } = await getExpenseStats();

        const stats = data.data;
        setMonthlyExpenseCount(stats.expenseCount);
        setMonthlyTotalExpense(stats.totalAmount);
        setTopExpenseCategory(stats.topCategory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenseSummary();
  }, []);

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const { data } = await getExpenseStats();

        const stats = data.data;
        setMonthlyExpenseCount(stats.expenseCount);
        setMonthlyTotalExpense(stats.totalAmount);
        setTopExpenseCategory(stats.topCategory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenseSummary();
  }, []);

  return (
    <div className={styles.wrap}>
      {/* 메인 */}
      <main className={styles.writePage}>
        <div className={styles.writeInner}>
          {/* 헤더 */}
          <div className={styles.title}>기타 지출</div>

          <div className={styles.tabContainer}>
            <WorkoutTabs />
          </div>

          {/* 입력 영역 */}
          <div className={styles.write}>
            {/* 날짜 + 분류 */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label>날짜*</label>
                <DateSelect value={date} onChange={setDate} />
              </div>

              <div className={styles.field}>
                <label>지출 분류*</label>
                <SummaryCard
                  expenses={EXPENSES}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </div>

            {/* 항목 */}
            <div className={styles.field}>
              <label>항목*</label>
              <input
                className={styles.input}
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="단백질 쉐이크"
                maxLength={30}
              />
            </div>

            {/* 금액 */}
            <div className={styles.field}>
              <label>금액*</label>
              <div className={styles.priceInput}>
                <input
                  className={styles.input}
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="23,000"
                  maxLength={8}
                />
                <span className={styles.unit}>원</span>
              </div>
            </div>

            {/* 버튼 */}
            <div className={styles.footer}>
              <span className={styles.required}>*는 필수 입력사항입니다.</span>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                완료
              </button>
            </div>
          </div>

          {/* 요약 카드 */}
          <RecordSummaryCard
            title="이번 기록으로 이렇게 반영돼요"
            items={[
              `이번 달 지출: ${monthlyExpenseCount}회`,
              `이번 달 누적 지출금: ${monthlyTotalExpense.toLocaleString()}원`,
              `가장 많이 쓴 항목: ${topExpenseCategory}`,
            ]}
          />
        </div>
      </main>
    </div>
  );
};

export default ExpensePage;
