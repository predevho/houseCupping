import { render, screen } from '@testing-library/react'
import HomePage from '../page'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

const { createClient: mockCreateClient } = jest.requireMock('@/lib/supabase/server')

function mockFeedQuery({
  data,
  error = null,
}: {
  data: unknown[]
  error?: { message: string } | null
}) {
  mockCreateClient.mockResolvedValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data, error }),
      }),
    }),
  })
}

describe('HomePage', () => {
  it('최신 커핑 피드와 노트 목록을 렌더링한다', async () => {
    mockFeedQuery({
      data: [
        {
          id: 12,
          aroma: 4,
          acidity: 3.5,
          body: 3,
          roast_date: '2026-05-15',
          memo: '복숭아 향과 말린 자두 느낌',
          created_at: '2026-05-17T10:00:00.000Z',
          profiles: { username: 'tester', display_name: '테스터' },
          beans: { id: 2, bean_name: '예가체프', cafe_name: '블루보틀' },
        },
      ],
    })

    render(await HomePage())

    expect(screen.getByRole('heading', { name: '최신 커핑 피드' })).toBeInTheDocument()
    expect(screen.getByText('예가체프 - 블루보틀')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '필터해서 보기' })).toHaveAttribute('href', '/cupping')
  })

  it('노트가 없으면 빈 상태 문구를 보여준다', async () => {
    mockFeedQuery({ data: [] })

    render(await HomePage())

    expect(screen.getByText('아직 등록된 커핑 노트가 없어요')).toBeInTheDocument()
  })

  it('쿼리 실패 시 한국어 에러를 던진다', async () => {
    mockFeedQuery({
      data: [],
      error: { message: 'boom' },
    })

    await expect(HomePage()).rejects.toThrow('홈 피드를 불러오는 데 실패했어요')
  })
})
