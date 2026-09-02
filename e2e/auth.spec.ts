import { expect, test } from '@playwright/test'

import { mockCurrentUser, setAuthTokens } from './helpers/auth'

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
        body: JSON.stringify({
          data: {
            accessToken: 'login-success-token',
            refreshToken: 'login-refresh-token',
          },
        }),
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
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('refreshToken')))
      .toBe('login-refresh-token')
  })

  test('액세스 토큰이 만료되면 갱신한 뒤 원래 요청을 다시 보낸다', async ({ page }) => {
    await setAuthTokens(page, 'expired-token', 'valid-refresh-token')

    let refreshRequestCount = 0

    await page.route(/\/auth\/refresh$/, async (route) => {
      refreshRequestCount += 1
      expect(route.request().postDataJSON()).toEqual({ refreshToken: 'valid-refresh-token' })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { accessToken: 'renewed-access-token' } }),
      })
    })

    await page.route(/\/users\/me$/, async (route) => {
      const authorization = route.request().headers().authorization

      if (authorization === 'Bearer renewed-access-token') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { nickname: '토큰 갱신 사용자' } }),
        })
        return
      }

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

    await expect(page).toHaveURL(/\/ticket$/)
    await expect(page.getByText('토큰 갱신 사용자', { exact: true })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('accessToken')))
      .toBe('renewed-access-token')
    expect(refreshRequestCount).toBe(1)
  })

  test('리프레시 토큰도 만료되면 자동 로그아웃한다', async ({ page }) => {
    await setAuthTokens(page, 'expired-token', 'expired-refresh-token')

    await page.route(/\/users\/me$/, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      })
    })
    await page.route(/\/auth\/refresh$/, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid refresh token' }),
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
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('refreshToken')))
      .toBeNull()
  })
})
