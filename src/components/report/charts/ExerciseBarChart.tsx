// src/components/report/charts/ExerciseBarChart.tsx
export default function ExerciseBarChart() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 임시 데이터(횟수)
  const data = [2, 0, 3, 2, 1, 4, 2]; // 월~일
  const max = 5;

  return (
    <div style={{ width: '100%', height: 220 }}>
      {/* 위: 차트(세로 눈금 + 막대) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '34px 1fr', // ✅ 왼쪽 눈금 + 차트
          height: 190,
          columnGap: 10,
        }}
      >
        {/* Y축 라벨 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 18, // ✅ x축 글자 공간 살짝 고려
            color: 'rgba(0,0,0,0.35)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {[5, 4, 3, 2, 1, 0].map((v) => (
            <div key={v} style={{ lineHeight: 1 }}>
              {v}회
            </div>
          ))}
        </div>

        {/* 차트 영역: 가로선 + 막대 */}
        <div style={{ position: 'relative' }}>
          {/* 가로 grid line 5칸 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateRows: 'repeat(5, 1fr)',
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                }}
              />
            ))}
          </div>

          {/* 막대들 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 6px 18px', // ✅ 아래 x축 공간
            }}
          >
            {data.map((v, idx) => {
              const isSat = days[idx] === '토';
              const h = (v / max) * 160; // ✅ 막대 최대 높이(대충)
              return (
                <div
                  key={idx}
                  style={{
                    width: 26,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {/* 토요일 pill */}
                  {isSat && (
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: '#3F4FD9',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: 2,
                      }}
                    >
                      토요일
                    </div>
                  )}

                  {/* bar */}
                  <div
                    style={{
                      width: '100%',
                      height: Math.max(6, h),
                      borderRadius: 8,
                      background: isSat ? '#3F4FD9' : '#8EA2FF',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 아래: X축 라벨 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '34px 1fr',
          marginTop: 6,
        }}
      >
        <div /> {/* 왼쪽 눈금 자리 비워서 정렬 맞추기 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 6px',
            color: 'rgba(0,0,0,0.55)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {days.map((d) => (
            <div key={d} style={{ width: 26, textAlign: 'center' }}>
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}