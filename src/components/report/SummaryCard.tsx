import './SummaryCard.css';

export default function SummaryCard() {
  return (
    <div
      style={{
        width: '100%',
        height: 412, // ✅ 피그마 고정
      }}
    >
      <section className="summaryCard">
        <h2 className="summaryCard__title">운동별 목표 달성률</h2>

        <div className="summaryCard__divider" />

        <button type="button" className="summaryCard__select">
          <span className="summaryCard__dot" />
          <span className="summaryCard__selectText">발레</span>
          <span className="summaryCard__chevron" />
        </button>

        <div className="summaryCard__ringWrap">
          <div
            className="summaryCard__ring"
            style={{ '--p': 75 } as React.CSSProperties}
          >
            <div className="summaryCard__ringCenter">
              <div className="summaryCard__percent">75%</div>
              <div className="summaryCard__sub">이번 달 목표 달성률</div>
            </div>
          </div>
        </div>

        <div className="summaryCard__foot">*개인 설정목표 기준</div>
      </section>
    </div>
  );
}