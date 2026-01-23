import React, { useMemo, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    type ChartOptions,
    type Plugin,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// ✅ 피그마 데이터 (월~일)
const values = [2, 30, 3, 2, 1, 4, 2]
const labels = ['월', '화', '수', '목', '금', '토', '일']

// ✅ “예쁘게 자동 축”
function getNiceScaleMax(max: number) {
    if (max <= 0) return 1
    if (max <= 5) return 5
    if (max <= 8) return 8
    if (max <= 10) return 10
    if (max <= 12) return 12
    if (max <= 15) return 15
    if (max <= 20) return 20
    return Math.ceil(max / 10) * 10
}

function getStepSize(maxAxis: number) {
    if (maxAxis <= 5) return 1
    if (maxAxis <= 10) return 2
    if (maxAxis <= 20) return 5
    return 10
}

type DayBubbleOptions = {
    selectedIndex: number
    selectedLabel: string
    bubbleColor?: string
    textColor?: string
}

/**
 * ✅ 선택된 막대 위 “요일 말풍선” 플러그인
 * - options.plugins.dayBubblePlugin 에서 옵션 읽음(타입은 any로 접근)
 */
const dayBubblePlugin: Plugin<'bar'> = {
    id: 'dayBubblePlugin',
    afterDatasetsDraw(chart) {
        const opt = (chart.options.plugins as any)?.dayBubblePlugin as DayBubbleOptions | undefined
        if (!opt) return

        const selectedIndex = Number(opt.selectedIndex)
        const selectedLabel = String(opt.selectedLabel ?? '')
        if (selectedIndex < 0 || !selectedLabel) return

        const meta = chart.getDatasetMeta(0)
        const el = meta.data?.[selectedIndex]
        if (!el) return
        const { ctx } = chart
        const { x, y } = el.getProps(['x', 'y'], true)

        const bubbleColor = opt.bubbleColor ?? '#3B46D7'
        const textColor = opt.textColor ?? '#FFFFFF'

        ctx.save()
        ctx.font = '700 12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'

        const paddingX = 14
        const bubbleH = 30
        const radius = 10
        const textW = ctx.measureText(selectedLabel).width
        const bubbleW = Math.ceil(textW + paddingX * 2)

        // 위치: 막대 위
        const bubbleX = x - bubbleW / 2
        const bubbleY = y - bubbleH - 10

        // 꼬리
        const tailW = 18
        const tailH = 10
        const tailX = x
        const tailY = bubbleY + bubbleH

        // bubble
        ctx.fillStyle = bubbleColor
        roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, radius)
        ctx.fill()

        // tail
        ctx.beginPath()
        ctx.moveTo(tailX - tailW / 2, tailY)
        ctx.lineTo(tailX, tailY + tailH)
        ctx.lineTo(tailX + tailW / 2, tailY)
        ctx.closePath()
        ctx.fill()

        // text
        ctx.fillStyle = textColor
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(selectedLabel, x, bubbleY + bubbleH / 2)

        ctx.restore()
    },
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    const radius = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + w, y, x + w, y + h, radius)
    ctx.arcTo(x + w, y + h, x, y + h, radius)
    ctx.arcTo(x, y + h, x, y, radius)
    ctx.arcTo(x, y, x + w, y, radius)
    ctx.closePath()
}

export default function ExerciseBarChart() {
    // ✅ 기본 선택: 토요일(5)
    const [selectedIndex, setSelectedIndex] = useState(5)

    const maxValue = Math.max(...values)
    const maxAxis = getNiceScaleMax(maxValue)
    const stepSize = getStepSize(maxAxis)

    const data = useMemo(() => {
        const normal = '#8DA6FF'
        const active = '#3B46D7'

        return {
            labels,
            datasets: [
                {
                    data: values,
                    borderRadius: 8,
                    backgroundColor: labels.map((_, i) => (i === selectedIndex ? active : normal)),
                    barThickness: 22,
                    categoryPercentage: 0.7,
                    barPercentage: 0.9,
                },
            ],
        }
    }, [selectedIndex])

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 26, left: 6, right: 10, bottom: 0 } },

        // ✅ plugins 안에 커스텀 키(dayBubblePlugin)를 넣기 위해 plugins 전체를 any 캐스팅
        plugins: ({
            legend: { display: false },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    title: (items: any) => (items?.[0] ? `${items[0].label}` : ''),
                    label: (item: any) => ` ${item.parsed.y}회`,
                },
            },
            dayBubblePlugin: {
                selectedIndex,
                selectedLabel: `${labels[selectedIndex]}요일`,
                bubbleColor: '#3B46D7',
                textColor: '#FFFFFF',
            },
        } as any),

        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { size: 12, weight: 600 }, // ✅ 숫자
                    color: '#6B7280',
                },
            },
            y: {
                beginAtZero: true,
                max: maxAxis,
                border: { display: false },
                ticks: {
                    stepSize,
                    font: { size: 12, weight: 600 }, // ✅ 숫자
                    color: '#9CA3AF',
                    callback: (v) => `${v}회`,
                },
                grid: { color: '#EEF2FF' }, // ✅ v4에서는 drawBorder 없음
            },
        },

        onClick: (_evt, elements) => {
            if (!elements?.length) return
            setSelectedIndex(elements[0].index)
        },
    }

    return (
        <div style={{ width: 267, height: 198 }}>
            <Bar data={data} options={options} plugins={[dayBubblePlugin]} />
        </div>
    )
}