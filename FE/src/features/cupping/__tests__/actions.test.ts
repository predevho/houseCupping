import { createCuppingAction, deleteCuppingAction, updateCuppingAction } from '../actions'

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

  it('bean_id가 없으면 general 에러를 반환한다', async () => {
    const fd = makeFormData({ aroma: '4.0', acidity: '3.5', body: '3.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '원두 정보가 없습니다' } })
  })

  it('aroma가 비어있으면 required 에러를 반환한다', async () => {
    const fd = makeFormData({ bean_id: 'bean-123', aroma: '', acidity: '3.5', body: '3.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { aroma: '향미를 선택해주세요' } })
  })

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

  it('cupping_notes insert 실패 시 general 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
      },
      from: jest.fn().mockImplementation((table: string) => {
        if (table === 'cupping_notes')
          return { insert: jest.fn().mockResolvedValue({ error: new Error('DB error') }) }
        return {}
      }),
    })

    const fd = makeFormData(validBase)
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '잠시 후 다시 시도해주세요' } })
  })

  it('bean_ratings upsert 실패 시 general 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
      },
      from: jest.fn().mockImplementation((table: string) => {
        if (table === 'cupping_notes')
          return { insert: jest.fn().mockResolvedValue({ error: null }) }
        if (table === 'bean_ratings')
          return { upsert: jest.fn().mockResolvedValue({ error: new Error('DB error') }) }
        return {}
      }),
    })

    const fd = makeFormData({ ...validBase, score: '4.0' })
    const result = await createCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '잠시 후 다시 시도해주세요' } })
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

describe('deleteCuppingAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('비로그인 시 redirect를 호출하지 않는다', async () => {
    const mockFrom = jest.fn()
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
      from: mockFrom,
    })
    await deleteCuppingAction('note-1', 'bean-1')
    expect(mockRedirect).not.toHaveBeenCalled()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('성공 시 cupping_notes를 삭제하고 redirect를 호출한다', async () => {
    const mockEqInner = jest.fn().mockResolvedValue({ error: null })
    const mockEqOuter = jest.fn().mockReturnValue({ eq: mockEqInner })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEqOuter })
    const mockFrom = jest.fn().mockReturnValue({ delete: mockDelete })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: mockFrom,
    })

    await deleteCuppingAction('note-1', 'bean-1')

    expect(mockFrom).toHaveBeenCalledWith('cupping_notes')
    expect(mockEqOuter).toHaveBeenCalledWith('id', 'note-1')
    expect(mockEqInner).toHaveBeenCalledWith('user_id', 'user-1')
    expect(mockRedirect).toHaveBeenCalledWith('/beans/bean-1')
  })
})

describe('updateCuppingAction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('note_id가 없으면 general 에러를 반환한다', async () => {
    const fd = makeFormData({ aroma: '4.0', acidity: '3.5', body: '3.0' })
    const result = await updateCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '노트 정보가 없습니다' } })
  })

  it('aroma가 비어있으면 required 에러를 반환한다', async () => {
    const fd = makeFormData({ note_id: 'note-1', aroma: '', acidity: '3.5', body: '3.0' })
    const result = await updateCuppingAction(null, fd)
    expect(result).toEqual({ errors: { aroma: '향미를 선택해주세요' } })
  })

  it('aroma가 범위를 벗어나면 에러를 반환한다', async () => {
    const fd = makeFormData({ note_id: 'note-1', aroma: '6.0', acidity: '3.5', body: '3.0' })
    const result = await updateCuppingAction(null, fd)
    expect(result).toEqual({ errors: { aroma: '향미는 0.5~5.0 사이로 입력해주세요' } })
  })

  it('비로그인 시 general 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
      from: jest.fn(),
    })
    const fd = makeFormData({ note_id: 'note-1', aroma: '4.0', acidity: '3.5', body: '3.0' })
    const result = await updateCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '로그인이 필요합니다' } })
  })

  it('성공 시 cupping_notes를 update하고 redirect를 호출한다', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: null })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq1 })
    const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: mockFrom,
    })

    const fd = makeFormData({ note_id: 'note-1', aroma: '4.0', acidity: '3.5', body: '3.0' })
    await updateCuppingAction(null, fd)

    expect(mockFrom).toHaveBeenCalledWith('cupping_notes')
    expect(mockRedirect).toHaveBeenCalledWith('/cupping/note-1')
  })

  it('score 있으면 bean_ratings upsert를 호출한다', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: null })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq1 })
    const mockUpsert = jest.fn().mockResolvedValue({ error: null })
    const mockFrom = jest.fn().mockImplementation((table: string) => {
      if (table === 'cupping_notes') return { update: mockUpdate }
      if (table === 'bean_ratings') return { upsert: mockUpsert }
      return {}
    })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: mockFrom,
    })

    const fd = makeFormData({ note_id: 'note-1', bean_id: 'bean-1', aroma: '4.0', acidity: '3.5', body: '3.0', score: '4.5' })
    await updateCuppingAction(null, fd)

    expect(mockFrom).toHaveBeenCalledWith('bean_ratings')
    expect(mockUpsert).toHaveBeenCalledWith(
      { user_id: 'user-1', bean_id: 'bean-1', score: 4.5 },
      { onConflict: 'user_id,bean_id' }
    )
    expect(mockRedirect).toHaveBeenCalledWith('/cupping/note-1')
  })

  it('UPDATE 실패 시 general 에러를 반환한다', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: new Error('DB error') })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq1 })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ update: mockUpdate }),
    })

    const fd = makeFormData({ note_id: 'note-1', aroma: '4.0', acidity: '3.5', body: '3.0' })
    const result = await updateCuppingAction(null, fd)
    expect(result).toEqual({ errors: { general: '잠시 후 다시 시도해주세요' } })
  })
})
