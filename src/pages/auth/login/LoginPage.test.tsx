import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LoginPage from './LoginPage'

const loginMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: loginMock,
  },
}))

const renderLoginPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset()
  })

  it('잘못된 이메일과 비밀번호를 제출하면 안내하고 API를 호출하지 않는다', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('이메일'), 'invalid-email')
    await user.type(screen.getByLabelText('비밀번호'), '1234')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('올바른 이메일 형식이 아닙니다')).toBeInTheDocument()
    expect(screen.getByText('비밀번호는 특수문자 포함 8자 이상이어야 합니다.')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })
})
