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

/* ---------- utils ---------- */
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

/* ---------- bubble plugin ---------- */
type BubbleOptions = {
    selectedIndex: number
    selectedLabel: string
    bubbleColor: string
    textColor: string
}

const bubblePlugin: Plugin<'bar'> = {
    id: 'exerciseBubblePlugin',
    afterDatasetsDraw(chart) {
        const opt = (chart.options.plugins as any)?.exerciseBubblePlugin as BubbleOptions
        if (!opt) return

        const el = chart.getDatasetMeta(0).data?.[opt.selectedIndex]
        if (!el) return

        const { ctx } = chart
        const { x, y } = el.getProps(['x', 'y'], true)

        const bubbleW = 53
        const bubbleH = 28
        const radius = 10

        const bubbleX = x - bubbleW / 2
        const bubbleY = y - bubbleH - 10

        ctx.save()
        ctx.font = '600 10px Nunito'
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // bubble
        ctx.fillStyle = opt.bubbleColor
        roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, radius)
        ctx.fill()

        // tail
        ctx.beginPath()
        ctx.moveTo(x - 9, bubbleY + bubbleH)
        ctx.lineTo(x, bubbleY + bubbleH + 10)
        ctx.lineTo(x + 9, bubbleY + bubbleH)
        ctx.closePath()
        ctx.fill()

        // text
        ctx.fillStyle = opt.textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
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

/* ---------- props ---------- */
type Props = {
    values: number[]
    labels: string[]
    width?: number
    height?: number

    // bar 색상
    activeColor?: string
    normalColor?: string

    // bubble 색상
    bubbleColor?: string
    bubbleTextColor?: string

    // grid / axis 색상
    gridColor?: string
    xTickColor?: string
    yTickColor?: string
}

/* ---------- component ---------- */
export default function ExerciseBarChart({
    values,
    labels,
    width = 267,
    height = 198,

    activeColor = '#3B46D7',
    normalColor = '#8DA6FF',

    bubbleColor = '#3B46D7',
    bubbleTextColor = '#FFFFFF',

    gridColor = '#EEF2FF',
    xTickColor = '#6B7280',
    yTickColor = '#9CA3AF',
}: Props) {
    const maxIndex = useMemo(() => values.indexOf(Math.max(...values)), [values])
    const [selectedIndex, setSelectedIndex] = useState(maxIndex)

    useEffect(() => {
        setSelectedIndex(maxIndex)
    }, [maxIndex])

    const maxAxis = getNiceScaleMax(Math.max(...values))
    const stepSize = getStepSize(maxAxis)

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: labels.map((_, i) =>
                    i === selectedIndex ? activeColor : normalColor
                ),
                barThickness: 18,
                borderRadius: { topLeft: 6, topRight: 6 },
                borderSkipped: false,
            },
        ],
    }

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 40, right: 0, left: 0, bottom: -12 } },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            exerciseBubblePlugin: {
                selectedIndex,
                selectedLabel: `${labels[selectedIndex]}요일`,
                bubbleColor,
                textColor: bubbleTextColor,
            },
        } as any,
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: xTickColor,
                    font: { size: 13, weight: 400 },
                    padding: 10,
                },
            },
            y: {
                beginAtZero: true,
                max: maxAxis,
                border: { display: false },
                ticks: {
                    stepSize,
                    color: yTickColor,
                    padding: 8,
                    callback: v => `${v}회`,
                },
                grid: { color: gridColor },
            },
        },
        onClick: (_, els) => els?.[0] && setSelectedIndex(els[0].index),
    }

    return (
        <div style={{ width, height }}>
            <Bar data={data} options={options} plugins={[bubblePlugin]} />
        </div>
    )
}