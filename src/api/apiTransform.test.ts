import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getTickets } from './ticketApi'
import { createExercise } from './workoutApi'

const apiMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@/api/api', () => ({
  default: apiMocks,
}))

describe('API 데이터 변환', () => {
  beforeEach(() => {
    apiMocks.get.mockReset()
    apiMocks.post.mockReset()
  })

  it('이용권 날짜와 상태를 화면에서 사용하는 형태로 변환한다', async () => {
    apiMocks.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            user_id: 5,
            exercise_type: '헬스',
            color_code: '#D7EDFF',
            ticket_type: 'COUNT',
            target_count: 12,
            total_amount: 120000,
            start_date: '2026-09-02T00:00:00.000Z',
            end_date: '2026-10-02T00:00:00.000Z',
            created_at: '2026-09-01T12:30:00.000Z',
            status: 'ACTIVE',
          },
        ],
      },
    })

    const tickets = await getTickets()

    expect(tickets[0]).toMatchObject({
      start_date: '2026-09-02',
      end_date: '2026-10-02',
      created_at: '2026-09-01',
      status: '진행 중',
    })
  })

  it('운동 기록 날짜와 입력값을 FormData로 변환한다', async () => {
    apiMocks.post.mockResolvedValue({ data: { id: 1 } })

    await createExercise({
      date: new Date(2026, 8, 2, 12),
      workoutResult: '실패',
      memo: '야근했어요',
      failReason: '시간 부족',
      exercise: {
        id: 7,
        label: '헬스',
        color: '#D7EDFF',
      },
      imageFile: null,
    })

    const [url, body, config] = apiMocks.post.mock.calls[0] as [
      string,
      FormData,
      { headers: Record<string, string> },
    ]

    expect(url).toBe('/exercise-record')
    expect(body.get('exercise_date')).toBe('2026-09-02')
    expect(body.get('success')).toBe('false')
    expect(body.get('memo')).toBe('야근했어요')
    expect(body.get('ticket_id')).toBe('7')
    expect(body.get('fail_reason')).toBe('시간 부족')
    expect(config.headers['Content-Type']).toBe('multipart/form-data')
  })
})
