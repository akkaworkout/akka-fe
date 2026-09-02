import { expect, test } from '@playwright/test'

import { mockCurrentUser, setAccessToken } from './helpers/auth'

type TicketResponse = {
  id: number
  user_id: number
  exercise_type: string
  color_code: string
  ticket_type: 'COUNT'
  target_count: number
  total_amount: number
  start_date: string
  end_date: string
  status: 'ACTIVE'
  remaining_count: number
}

test('이용권을 등록한 뒤 해당 이용권으로 운동 기록을 작성한다', async ({ page }) => {
  await setAccessToken(page)
  await mockCurrentUser(page)

  const tickets: TicketResponse[] = []
  let createdTicketPayload: Record<string, unknown> | null = null

  await page.route(/\/tickets$/, async (route) => {
    if (route.request().method() === 'POST') {
      createdTicketPayload = route.request().postDataJSON()

      const ticket: TicketResponse = {
        id: 1,
        user_id: 1,
        exercise_type: String(createdTicketPayload?.exercise_type),
        color_code: String(createdTicketPayload?.color_code),
        ticket_type: 'COUNT',
        target_count: Number(createdTicketPayload?.target_count),
        total_amount: Number(createdTicketPayload?.total_amount),
        start_date: String(createdTicketPayload?.start_date),
        end_date: String(createdTicketPayload?.end_date),
        status: 'ACTIVE',
        remaining_count: Number(createdTicketPayload?.target_count),
      }

      tickets.push(ticket)

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: ticket }),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: tickets }),
    })
  })

  await page.route(/\/tickets\/active$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: tickets }),
    })
  })

  await page.route(/\/tickets\/1\/summary$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          remainingCount: 12,
          usedCount: 0,
          amountPerSession: 10000,
        },
      }),
    })
  })

  await page.route(/\/calendar\?year=/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":[]}' })
  })
  await page.route(/\/calendar\/goal\?year=/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":[]}' })
  })
  await page.route(/\/calendar\/summary\?year=/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          totalAmount: 0,
          targetBudget: 0,
          failAmount: 0,
          exerciseCount: 1,
          targetExerciseCount: 12,
        },
      }),
    })
  })
  await page.route(/\/calendar\/\d{4}-\d{2}-\d{2}$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"data":{"records":[]}}',
    })
  })

  let workoutRequestCount = 0
  await page.route(/\/exercise-record$/, async (route) => {
    workoutRequestCount += 1
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ data: { id: 1 } }),
    })
  })

  page.on('dialog', (dialog) => dialog.accept())

  await page.goto('/ticket')
  await expect(page.getByText('등록된 티켓이 없어요')).toBeVisible()

  await page.getByLabel('이용권 추가').click()
  await page.getByLabel('운동 종목').fill('발레')
  await page.getByRole('button', { name: '다음' }).click()
  await page.getByLabel('목표 횟수').fill('12')
  await page.getByLabel('금액', { exact: true }).fill('120000')
  await page.getByRole('button', { name: '완료', exact: true }).click()

  await expect.poll(() => createdTicketPayload).not.toBeNull()
  expect(createdTicketPayload).toMatchObject({
    exercise_type: '발레',
    ticket_type: 'COUNT',
    target_count: 12,
    total_amount: 120000,
  })

  await page.getByRole('button', { name: '✕' }).click()
  await expect(page.getByText('발레', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '운동 기록' }).click()
  await expect(page).toHaveURL(/\/write$/)
  await expect(page.getByText('발레', { exact: true })).toBeVisible()

  await page.getByLabel('메모').fill('Playwright 운동 기록')
  await page.getByRole('button', { name: '완료', exact: true }).click()

  await expect(page).toHaveURL(/\/calendar$/)
  expect(workoutRequestCount).toBe(1)
})
