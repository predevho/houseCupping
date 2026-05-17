import { render, screen } from '@testing-library/react'
import BeansPage from '../page'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/features/bean/BeanSearch', () => ({
  __esModule: true,
  default: ({ q }: { q?: string }) => <div data-testid="bean-search">{q ?? ''}</div>,
}))

const { createClient: mockCreateClient } = jest.requireMock('@/lib/supabase/server')

function createStorageMock() {
  return {
    from: jest.fn().mockReturnValue({
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/bean.jpg' },
      }),
    }),
  }
}

describe('BeansPage', () => {
  it('원두 목록을 렌더링한다', async () => {
    const selectWithImage = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            bean_name: '예가체프',
            cafe_name: '블루보틀',
            origin: '에티오피아',
            image_path: null,
          },
        ],
        error: null,
      }),
    })

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: selectWithImage,
      }),
      storage: createStorageMock(),
    })

    render(await BeansPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('heading', { name: '원두 목록' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '원두 목록' })).toHaveClass('dark:text-gray-100')
    expect(screen.getByText('예가체프')).toBeInTheDocument()
    expect(screen.getByText('블루보틀')).toBeInTheDocument()
  })

  it('image_path 컬럼이 없는 환경이면 이미지 없이 목록을 다시 조회한다', async () => {
    const orderWithoutImage = jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          bean_name: '예가체프',
          cafe_name: '블루보틀',
          origin: '에티오피아',
        },
      ],
      error: null,
    })

    const select = jest
      .fn()
      .mockImplementationOnce(() => ({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: {
            code: 'PGRST204',
            message: "Could not find the 'image_path' column of 'beans' in the schema cache",
          },
        }),
      }))
      .mockImplementationOnce(() => ({
        order: orderWithoutImage,
      }))

    const from = jest.fn().mockReturnValue({ select })

    mockCreateClient.mockResolvedValue({
      from,
      storage: createStorageMock(),
    })

    render(await BeansPage({ searchParams: Promise.resolve({}) }))

    expect(select).toHaveBeenNthCalledWith(1, 'id, bean_name, cafe_name, origin, image_path')
    expect(select).toHaveBeenNthCalledWith(2, 'id, bean_name, cafe_name, origin')
    expect(screen.getByText('예가체프')).toBeInTheDocument()
  })

  it('다크모드 대비용 카드/텍스트 클래스를 사용한다', async () => {
    const selectWithImage = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            bean_name: '예가체프',
            cafe_name: '블루보틀',
            origin: '에티오피아',
            image_path: null,
          },
        ],
        error: null,
      }),
    })

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: selectWithImage,
      }),
      storage: createStorageMock(),
    })

    render(await BeansPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByRole('link', { name: /예가체프/i })).toHaveClass(
      'dark:bg-gray-900',
      'dark:border-gray-800',
      'hover:bg-[#8B2635]/[0.06]',
      'active:scale-[0.99]',
      'focus-visible:ring-2'
    )
    expect(screen.getByText('예가체프')).toHaveClass('dark:text-gray-100')
    expect(screen.getByText('블루보틀')).toHaveClass('dark:text-gray-300')
  })
})
