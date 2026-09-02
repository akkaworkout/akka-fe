import { expect, test } from '@playwright/test'

import { mockCurrentUser, setAccessToken } from './helpers/auth'

test.describe('인증 사용자 흐름', () => {
  test('비로그인 사용자가 보호 페이지를 선택하면 로그인 화면으로 이동한다', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('로그인하고 이용할 수 있어요')
      await dialog.accept()
    })

    await page.goto('/')
    await page.getByText('캘린더', { exact: true }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()
  })

  test('로그인에 성공하면 메인 화면에서 사용자 이름을 표시한다', async ({ page }) => {
    await page.route(/\/auth\/login$/, async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        email: 'test@akka.com',
        password: 'Password1!',
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { accessToken: 'login-success-token' } }),
      })
    })
    await mockCurrentUser(page, '아까 테스트')

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('로그인이 완료되었어요')
      await dialog.accept()
    })

    await page.goto('/login')
    await page.getByLabel('이메일').fill('test@akka.com')
    await page.getByLabel('비밀번호', { exact: true }).fill('Password1!')
    await page.getByRole('button', { name: '로그인', exact: true }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText('아까 테스트', { exact: true })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('accessToken')))
      .toBe('login-success-token')
  })

  test('만료된 토큰으로 보호 페이지에 접근하면 자동 로그아웃한다', async ({ page }) => {
    await setAccessToken(page, 'expired-token')
    await page.route(/\/users\/me$/, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      })
    })
    await page.route(/\/tickets$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      })
    })

    await page.goto('/ticket')

    await expect(page).toHaveURL(/\/login$/)
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('accessToken')))
      .toBeNull()
  })
})
