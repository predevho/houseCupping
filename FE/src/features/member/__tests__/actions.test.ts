import { updateProfileAction } from '../actions'

jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const mockCreateClient = createClient as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

function makeFormData(username: string, display_name: string) {
  const fd = new FormData()
  fd.set('username', username)
  fd.set('display_name', display_name)
  return fd
}

describe('updateProfileAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('username이 유효성 규칙을 위반하면 에러를 반환한다', async () => {
    const fd = makeFormData('ab', '닉네임테스트') // 2자 — 4자 미만
    const result = await updateProfileAction(null, fd)
    expect(result).toEqual({
      errors: { username: '4~16자, 영문/숫자/_/- 만 사용 가능합니다' },
    })
  })

  it('display_name이 4자 미만이면 에러를 반환한다', async () => {
    const fd = makeFormData('validuser', 'abc') // 3자 — 4자 미만
    const result = await updateProfileAction(null, fd)
    expect(result).toEqual({ errors: { display_name: '4~12자로 입력해주세요' } })
  })

  it('username이 중복이면 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'current-id' } },
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            neq: () => ({
              maybeSingle: () => Promise.resolve({ data: { id: 'other-id' } }),
            }),
          }),
        }),
      }),
    })

    const fd = makeFormData('takenuser', '닉네임테스트')
    const result = await updateProfileAction(null, fd)
    expect(result).toEqual({ errors: { username: '이미 사용 중인 아이디입니다' } })
  })

  it('성공 시 revalidatePath를 호출하고 null을 반환한다', async () => {
    const mockFrom = jest.fn()
      .mockReturnValueOnce({
        // 첫 번째 from(): 중복 확인 쿼리 — 중복 없음
        select: () => ({
          eq: () => ({
            neq: () => ({
              maybeSingle: () => Promise.resolve({ data: null }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        // 두 번째 from(): update 쿼리 — 성공
        update: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      })

    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'current-id' } },
        }),
      },
      from: mockFrom,
    })

    const fd = makeFormData('validuser', '닉네임테스트')
    const result = await updateProfileAction(null, fd)

    expect(mockRevalidatePath).toHaveBeenCalledWith('/profile')
    expect(result).toBeNull()
  })
})
