import { createCuppingAction } from '../actions'

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

const validBase = { bean_id: 'bean-123', aroma: '4.0', acidity: '3.5', body: '3.0' }

describe('createCuppingAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('aroma가 범위를 벗어나면 에러를 반환한다', async () => {
    const fd = makeFormData({ ...validBase, aroma: '6.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { aroma: '향미는 0.5~5.0 사이로 입력해주세요' } })
  })

  it('acidity가 범위를 벗어나면 에러를 반환한다', async () => {
    const fd = makeFormData({ ...validBase, acidity: '0.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { acidity: '산미는 0.5~5.0 사이로 입력해주세요' } })
  })

  it('body가 범위를 벗어나면 에러를 반환한다', async () => {
    const fd = makeFormData({ ...validBase, body: '5.5' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { body: '바디는 0.5~5.0 사이로 입력해주세요' } })
  })

  it('score가 범위를 벗어나면 에러를 반환한다', async () => {
    const fd = makeFormData({ ...validBase, score: '6.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { score: '평점은 0.5~5.0 사이로 입력해주세요' } })
  })

  it('성공 시 cupping_notes insert 후 redirect를 호출한다', async () => {
    const mockFrom = jest.fn().mockImplementation((table: string) => {
      if (table === 'cupping_notes')
        return { insert: jest.fn().mockResolvedValue({ error: null }) }
      if (table === 'bean_ratings')
        return { upsert: jest.fn().mockResolvedValue({ error: null }) }
      return {}
    })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
      },
      from: mockFrom,
    })

    const fd = makeFormData({ ...validBase, score: '4.5' })
    await createCuppingAction(null, fd)
    expect(mockRedirect).toHaveBeenCalledWith('/beans/bean-123')
  })

  it('score 없으면 bean_ratings upsert를 호출하지 않는다', async () => {
    const mockFrom = jest.fn().mockImplementation((table: string) => {
      if (table === 'cupping_notes')
        return { insert: jest.fn().mockResolvedValue({ error: null }) }
      return {}
    })
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
      },
      from: mockFrom,
    })

    const fd = makeFormData(validBase)
    await createCuppingAction(null, fd)
    expect(mockFrom).not.toHaveBeenCalledWith('bean_ratings')
    expect(mockRedirect).toHaveBeenCalledWith('/beans/bean-123')
  })
})
