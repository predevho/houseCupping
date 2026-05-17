import { render, screen } from '@testing-library/react'
import ProfilePage from '../page'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/features/member/EditForm', () => ({
  __esModule: true,
  default: () => <div data-testid="edit-form" />,
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

const { createClient: mockCreateClient } = jest.requireMock('@/lib/supabase/server')

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('다크모드 대응 텍스트 클래스를 사용한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                username: 'tester',
                display_name: '테스터',
                created_at: '2026-05-17T00:00:00.000Z',
              },
            }),
          }),
        }),
      }),
    })

    render(await ProfilePage())

    expect(screen.getByText('테스터')).toHaveClass('dark:text-gray-300')
    expect(screen.getByText(/가입일/)).toHaveClass('dark:text-gray-500')
    expect(screen.getByRole('heading', { name: '프로필 수정' })).toHaveClass('dark:text-gray-300')
  })
})
