import { useEffect, useMemo, useState } from 'react'
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

// ✅ 하드코딩 데이터
const values = [2, 4, 2, 2, 1, 10, 2]
const labels = ['월', '화', '수', '목', '금', '토', '일']

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

type BubbleOptions = {
    selectedIndex: number
    selectedLabel: string
    bubbleColor: string
    textColor: string
}

const bubblePlugin: Plugin<'bar'> = {
    id: 'exerciseBubblePlugin',
    afterDatasetsDraw(chart) {
        const opt = (chart.options.plugins as any)?.exerciseBubblePlugin as BubbleOptions | undefined
        if (!opt) return

        const meta = chart.getDatasetMeta(0)
        const el = meta.data?.[opt.selectedIndex]
        if (!el) return

        const { ctx } = chart
        const { x, y } = el.getProps(['x', 'y'], true)

        const paddingX = 14
        const bubbleH = 30
        const radius = 10

        ctx.save()
        ctx.font = '700 12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'

        const textW = ctx.measureText(opt.selectedLabel).width
        const bubbleW = Math.ceil(textW + paddingX * 2)

        // ✅ 너무 위로 올라가서 잘리는 문제 방지: -10 → -2
        const bubbleX = x - bubbleW / 2
        const bubbleY = y - bubbleH - 10

        const tailW = 18
        const tailH = 10
        const tailX = x
        const tailY = bubbleY + bubbleH

        // bubble
        ctx.fillStyle = opt.bubbleColor
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
        ctx.fillStyle = opt.textColor
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(opt.selectedLabel, x, bubbleY + bubbleH / 2)

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
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
}

export default function ExerciseBarChart() {
    const maxIndex = useMemo(
        () => values.indexOf(Math.max(...values)),
        [values.join(',')] // 하드코딩이면 그냥 [values]도 OK, 하지만 배열 리터럴이면 join이 안전
    )

    const [selectedIndex, setSelectedIndex] = useState(maxIndex) // 토요일
    useEffect(() => {
        setSelectedIndex(maxIndex)
    }, [maxIndex])

    const maxAxis = getNiceScaleMax(Math.max(...values))
    const stepSize = getStepSize(maxAxis)

    const data = useMemo(() => {
        const normal = '#8DA6FF'
        const active = '#3B46D7'

        return {
            labels,
            datasets: [
                {
                    data: values,
                    borderRadius: {
                        topLeft: 6,
                        topRight: 6,
                        bottomLeft: 0,
                        bottomRight: 0,
                    },
                    borderSkipped: false,

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

        // ✅ “아래 기준 정렬”을 위해 top만 확보하고 나머지 통일
        layout: { padding: { top: 40, right: 10, left: 6, bottom: 0 } },

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
            exerciseBubblePlugin: {
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
                    font: { size: 12, weight: 400 },
                    color: '#6B7280',
                    padding: 10,
                },
            },
            y: {
                beginAtZero: true,
                max: maxAxis,
                border: { display: false },
                ticks: {
                    stepSize,
                    font: { size: 12, weight: 400 },
                    color: '#9CA3AF',
                    padding: 8,
                    callback: (v) => `${v}회`,
                },
                grid: { color: '#EEF2FF' },
            },
        },

        onClick: (_evt, elements) => {
            if (!elements?.length) return
            setSelectedIndex(elements[0].index)
        },
    }

    return (
        <div style={{ width: 267, height: 198 }}>
            <Bar key={maxAxis} data={data} options={options} plugins={[bubblePlugin]} />
        </div>
    )
}