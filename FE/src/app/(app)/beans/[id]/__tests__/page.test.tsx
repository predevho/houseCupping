import { render, screen } from '@testing-library/react'
import BeanDetailPage from '../page'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const { createClient: mockCreateClient } = jest.requireMock('@/lib/supabase/server')
const { notFound: mockNotFound } = jest.requireMock('next/navigation')

function createStorageMock() {
  return {
    from: jest.fn().mockReturnValue({
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/bean.jpg' },
      }),
    }),
  }
}

function createAuthMock() {
  return {
    getUser: jest.fn().mockResolvedValue({
      data: { user: null },
    }),
  }
}

describe('BeanDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('원두 상세 정보를 렌더링한다', async () => {
    const from = jest
      .fn()
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: {
                id: 12,
                user_id: 'user-1',
                cafe_name: '블루보틀',
                bean_name: '예가체프',
                origin: '에티오피아',
                process: 'Washed',
                roast_level: 'Light',
                image_path: null,
                created_at: '2026-05-17T00:00:00.000Z',
                profiles: { username: 'tester' },
              },
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      })

    mockCreateClient.mockResolvedValue({
      from,
      auth: createAuthMock(),
      storage: createStorageMock(),
    })

    render(await BeanDetailPage({ params: Promise.resolve({ id: '12' }) }))

    expect(screen.getByText('예가체프')).toBeInTheDocument()
    expect(screen.getByText('블루보틀')).toBeInTheDocument()
    expect(screen.getByText('에티오피아')).toBeInTheDocument()
    expect(screen.getByText('등록자 @tester')).toBeInTheDocument()
  })

  it('image_path 컬럼이 없는 환경이면 이미지 없이 상세를 다시 조회한다', async () => {
    const select = jest
      .fn()
      .mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: null,
            error: {
              code: 'PGRST204',
              message: "Could not find the 'image_path' column of 'beans' in the schema cache",
            },
          }),
        }),
      }))
      .mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: {
              id: 12,
              user_id: 'user-1',
              cafe_name: '블루보틀',
              bean_name: '예가체프',
              origin: '에티오피아',
              process: 'Washed',
              roast_level: 'Light',
              created_at: '2026-05-17T00:00:00.000Z',
              profiles: { username: 'tester' },
            },
            error: null,
          }),
        }),
      }))

    const from = jest
      .fn()
      .mockReturnValueOnce({ select })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: {
                id: 12,
                user_id: 'user-1',
                cafe_name: '블루보틀',
                bean_name: '예가체프',
                origin: '에티오피아',
                process: 'Washed',
                roast_level: 'Light',
                created_at: '2026-05-17T00:00:00.000Z',
                profiles: { username: 'tester' },
              },
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      })

    mockCreateClient.mockResolvedValue({
      from,
      auth: createAuthMock(),
      storage: createStorageMock(),
    })

    render(await BeanDetailPage({ params: Promise.resolve({ id: '12' }) }))

    expect(select).toHaveBeenNthCalledWith(
      1,
      'id, user_id, cafe_name, bean_name, origin, process, roast_level, image_path, created_at, profiles(username)'
    )
    expect(screen.getByText('예가체프')).toBeInTheDocument()
    expect(screen.queryByAltText('예가체프 대표 이미지')).not.toBeInTheDocument()
  })

  it('원두 조회 에러면 한국어 에러를 던진다', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const from = jest.fn().mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: null,
            error: { code: 'XX000', message: 'boom' },
          }),
        }),
      }),
    })

    mockCreateClient.mockResolvedValue({
      from,
      auth: createAuthMock(),
      storage: createStorageMock(),
    })

    await expect(
      BeanDetailPage({ params: Promise.resolve({ id: '12' }) })
    ).rejects.toThrow('원두 상세를 불러오는 데 실패했어요')
    expect(mockNotFound).not.toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})
