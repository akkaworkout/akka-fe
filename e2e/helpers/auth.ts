import type { Page } from '@playwright/test'

const TEST_ACCESS_TOKEN = 'playwright-access-token'

export const setAccessToken = async (page: Page, token = TEST_ACCESS_TOKEN) => {
  await page.addInitScript((accessToken) => {
    window.localStorage.setItem('accessToken', accessToken)
  }, token)
}

export const mockCurrentUser = async (page: Page, nickname = '테스트 사용자') => {
  await page.route(/\/users\/me$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          nickname,
          profile_image_url: null,
        },
      }),
    })
  })
}
