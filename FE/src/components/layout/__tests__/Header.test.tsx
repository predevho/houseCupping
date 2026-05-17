import { render, screen } from '@testing-library/react'
import Header from '../Header'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('../LogoutButton', () => () => <div data-testid="logout-button" />)

const { createClient: mockCreateClient } =
  jest.requireMock('@/lib/supabase/server')

function mockUser(username: string) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { user_metadata: { username } } },
      }),
    },
  })
}

describe('Header', () => {
  it('비회원이면 로그인과 회원가입 링크를 렌더링한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    })
    render(await Header())
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/auth')
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/auth')
  })

  it('비회원이면 LogoutButton을 렌더링하지 않는다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
    })
    render(await Header())
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument()
  })

  it('로고 텍스트를 렌더링한다', async () => {
    mockUser('tester')
    render(await Header())
    expect(screen.getByText('☕ House Cupping')).toBeInTheDocument()
  })

  it('로고가 /로 이동하는 링크이다', async () => {
    mockUser('tester')
    render(await Header())
    expect(screen.getByRole('link', { name: '☕ House Cupping' })).toHaveAttribute('href', '/')
  })

  it('프로필 링크가 /profile로 이동한다', async () => {
    mockUser('tester')
    render(await Header())
    expect(screen.getByRole('link', { name: 'tester' })).toHaveAttribute('href', '/profile')
  })

  it('username이 없으면 프로필 링크 텍스트를 "프로필"로 표시한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { user_metadata: {} } },
        }),
      },
    })
    render(await Header())
    expect(screen.getByRole('link', { name: '프로필' })).toBeInTheDocument()
  })

  it('LogoutButton을 렌더링한다', async () => {
    mockUser('tester')
    render(await Header())
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })
})
