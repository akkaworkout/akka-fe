import { expect, test } from '@playwright/test'

test('화면 너비에 따라 사이드바 로고와 본문 여백이 변경된다', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 })
  await page.goto('/')

  const logo = page.getByAltText('akka logo')
  const main = page.locator('main')

  await expect(logo).toHaveAttribute('src', /akka-logo\.png$/)
  await expect(main).toHaveCSS('margin-left', '220px')

  await page.setViewportSize({ width: 900, height: 900 })

  await expect(logo).toHaveAttribute('src', /akka-logo-symbol\.png$/)
  await expect(main).toHaveCSS('margin-left', '74px')
})
