import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ isLoggedIn: false, token: null })
  })

  it('로그인하면 토큰을 상태와 localStorage에 저장한다', () => {
    useAuthStore.getState().login('test-access-token')

    expect(useAuthStore.getState().isLoggedIn).toBe(true)
    expect(useAuthStore.getState().token).toBe('test-access-token')
    expect(localStorage.getItem('accessToken')).toBe('test-access-token')
  })

  it('로그아웃하면 인증 상태와 저장된 토큰을 제거한다', () => {
    useAuthStore.getState().login('test-access-token')

    useAuthStore.getState().logout()

    expect(useAuthStore.getState().isLoggedIn).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
  })
})
