import { loginAction, signupAction } from '../actions'

jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const mockCreateClient = createClient as jest.Mock
const mockRedirect = redirect as unknown as jest.Mock

describe('loginAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('존재하지 않는 username이면 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) }),
    })

    const fd = new FormData()
    fd.set('username', 'unknownuser')
    fd.set('password', 'pw123456')

    const result = await loginAction(null, fd)
    expect(result).toEqual({ error: '아이디 또는 비밀번호가 올바르지 않습니다' })
  })

  it('비밀번호가 틀리면 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { email: 'test@example.com' } }) }) }) }),
      auth: { signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Invalid login credentials' } }) },
    })

    const fd = new FormData()
    fd.set('username', 'testuser')
    fd.set('password', 'wrongpw')

    const result = await loginAction(null, fd)
    expect(result).toEqual({ error: '아이디 또는 비밀번호가 올바르지 않습니다' })
  })

  it('로그인 성공 시 redirect를 호출한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { email: 'test@example.com' } }) }) }) }),
      auth: { signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'testuser')
    fd.set('password', 'correctpw')

    await loginAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })

  it('유효한 next가 있으면 로그인 후 해당 경로로 redirect한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { email: 'test@example.com' } }) }) }) }),
      auth: { signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'testuser')
    fd.set('password', 'correctpw')
    fd.set('next', '/cupping/12')

    await loginAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/cupping/12')
  })

  it('유효하지 않은 next면 로그인 후 루트로 fallback한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { email: 'test@example.com' } }) }) }) }),
      auth: { signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'testuser')
    fd.set('password', 'correctpw')
    fd.set('next', 'https://evil.example')

    await loginAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })
})

describe('signupAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('username 중복이면 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: { id: 'existing-id' } }) }) }) }),
    })

    const fd = new FormData()
    fd.set('username', 'existinguser')
    fd.set('display_name', '닉네임테스트')
    fd.set('email', 'new@example.com')
    fd.set('password', 'pw123456')

    const result = await signupAction(null, fd)
    expect(result).toEqual({ errors: { username: '이미 사용 중인 아이디입니다' } })
  })

  it('이메일 중복이면 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) }),
      auth: { signUp: jest.fn().mockResolvedValue({ data: { user: null }, error: { message: 'User already registered' } }) },
    })

    const fd = new FormData()
    fd.set('username', 'newuser1')
    fd.set('display_name', '닉네임테스트')
    fd.set('email', 'existing@example.com')
    fd.set('password', 'pw123456')

    const result = await signupAction(null, fd)
    expect(result).toEqual({ errors: { email: '이미 가입된 이메일입니다' } })
  })

  it('회원가입 성공 시 redirect를 호출한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) }),
      auth: { signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'new-uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'newuser1')
    fd.set('display_name', '닉네임테스트')
    fd.set('email', 'new@example.com')
    fd.set('password', 'pw123456')

    await signupAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })

  it('유효한 next가 있으면 회원가입 후 해당 경로로 redirect한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) }),
      auth: { signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'new-uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'newuser1')
    fd.set('display_name', '닉네임테스트')
    fd.set('email', 'new@example.com')
    fd.set('password', 'pw123456')
    fd.set('next', '/beans/5')

    await signupAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/beans/5')
  })

  it('이중 슬래시 next면 회원가입 후 루트로 fallback한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) }),
      auth: { signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'new-uuid' } }, error: null }) },
    })

    const fd = new FormData()
    fd.set('username', 'newuser1')
    fd.set('display_name', '닉네임테스트')
    fd.set('email', 'new@example.com')
    fd.set('password', 'pw123456')
    fd.set('next', '//evil.example')

    await signupAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })
})
