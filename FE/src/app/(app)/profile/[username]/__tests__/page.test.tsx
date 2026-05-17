import { render, screen } from '@testing-library/react'
import UserProfilePage from '../page'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

const { createClient: mockCreateClient } = jest.requireMock('@/lib/supabase/server')

describe('UserProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('다크모드 대응 텍스트 클래스를 사용한다', async () => {
    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
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

    render(await UserProfilePage({ params: Promise.resolve({ username: 'tester' }) }))

    expect(screen.getByText('테스터')).toHaveClass('dark:text-gray-300')
    expect(screen.getByText(/가입일/)).toHaveClass('dark:text-gray-500')
  })
})
