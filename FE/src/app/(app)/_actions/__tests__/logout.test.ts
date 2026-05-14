import { logoutAction } from '../logout'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

const { createClient: mockCreateClient } =
  jest.requireMock('@/lib/supabase/server')
const { redirect: mockRedirect } = jest.requireMock('next/navigation')

describe('logoutAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('supabase signOut을 호출한다', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    mockCreateClient.mockResolvedValue({ auth: { signOut: mockSignOut } })

    await logoutAction()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('signOut 후 /auth로 redirect한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { signOut: jest.fn().mockResolvedValue({ error: null }) },
    })

    await logoutAction()

    expect(mockRedirect).toHaveBeenCalledWith('/auth')
  })

  it('signOut 실패해도 /auth로 redirect한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { signOut: jest.fn().mockResolvedValue({ error: new Error('fail') }) },
    })

    await logoutAction()

    expect(mockRedirect).toHaveBeenCalledWith('/auth')
  })
})
