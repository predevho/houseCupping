import { createBeanAction } from '../actions'

jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const mockCreateClient = createClient as jest.Mock
const mockRedirect = redirect as unknown as jest.Mock

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.set(k, v))
  return fd
}

describe('createBeanAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('cafe_name이 비어있으면 에러를 반환한다', async () => {
    const fd = makeFormData({ cafe_name: '', bean_name: '에티오피아 예가체프' })
    const result = await createBeanAction(null, fd)
    expect(result).toEqual({ errors: { cafe_name: '카페명을 입력해주세요' } })
  })

  it('bean_name이 비어있으면 에러를 반환한다', async () => {
    const fd = makeFormData({ cafe_name: '블루보틀', bean_name: '' })
    const result = await createBeanAction(null, fd)
    expect(result).toEqual({ errors: { bean_name: '원두명을 입력해주세요' } })
  })

  it('성공 시 redirect를 호출한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-id' } },
        }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'new-bean-id' },
              error: null,
            }),
          }),
        }),
      }),
    })

    const fd = makeFormData({ cafe_name: '블루보틀', bean_name: '에티오피아 예가체프' })
    await createBeanAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/beans/new-bean-id')
  })
})
