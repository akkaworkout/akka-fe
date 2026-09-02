import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ isLoggedIn: false, token: null, refreshToken: null })
  })

  it('로그인하면 두 토큰을 상태와 localStorage에 저장한다', () => {
    useAuthStore.getState().login('test-access-token', 'test-refresh-token')

    expect(useAuthStore.getState().isLoggedIn).toBe(true)
    expect(useAuthStore.getState().token).toBe('test-access-token')
    expect(useAuthStore.getState().refreshToken).toBe('test-refresh-token')
    expect(localStorage.getItem('accessToken')).toBe('test-access-token')
    expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token')
  })

  it('액세스 토큰을 갱신하면 로그인 상태와 리프레시 토큰을 유지한다', () => {
    useAuthStore.getState().login('test-access-token', 'test-refresh-token')

    useAuthStore.getState().setAccessToken('renewed-access-token')

    expect(useAuthStore.getState().isLoggedIn).toBe(true)
    expect(useAuthStore.getState().token).toBe('renewed-access-token')
    expect(useAuthStore.getState().refreshToken).toBe('test-refresh-token')
    expect(localStorage.getItem('accessToken')).toBe('renewed-access-token')
    expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token')
  })

  it('로그아웃하면 인증 상태와 저장된 두 토큰을 제거한다', () => {
    useAuthStore.getState().login('test-access-token', 'test-refresh-token')

    useAuthStore.getState().logout()

    expect(useAuthStore.getState().isLoggedIn).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().refreshToken).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })
})
