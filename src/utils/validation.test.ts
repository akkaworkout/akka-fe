import { describe, expect, it } from 'vitest'

import { isEmailValid, isPasswordValid } from './validation'

describe('입력값 공통 검증', () => {
  it('이메일 형식을 검증한다', () => {
    expect(isEmailValid('test@akka.com')).toBe(true)
    expect(isEmailValid('invalid-email')).toBe(false)
  })

  it('비밀번호가 8자 이상이고 특수문자를 포함하는지 검증한다', () => {
    expect(isPasswordValid('Password1!')).toBe(true)
    expect(isPasswordValid('Password1')).toBe(false)
    expect(isPasswordValid('Pass!')).toBe(false)
  })
})
