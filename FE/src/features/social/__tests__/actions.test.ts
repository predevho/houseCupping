import { toggleLikeAction, createCommentAction, deleteCommentAction } from '../actions'

jest.mock('@/lib/supabase/server', () => ({ createClient: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const mockCreateClient = createClient as jest.Mock
const mockRevalidatePath = revalidatePath as jest.Mock

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.set(k, v))
  return fd
}

beforeEach(() => jest.clearAllMocks())

// ─── toggleLikeAction ───────────────────────────────────────────
describe('toggleLikeAction', () => {
  it('비로그인 시 아무 것도 하지 않는다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
      from: jest.fn(),
    })
    await toggleLikeAction('note-1')
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('좋아요가 없으면 insert한다', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null })
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null })
    const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ select: mockSelect, insert: mockInsert }),
    })
    await toggleLikeAction('note-1')
    expect(mockInsert).toHaveBeenCalledWith({ note_id: 'note-1', user_id: 'user-1' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cupping/note-1')
  })

  it('좋아요가 있으면 delete한다', async () => {
    const mockMatch = jest.fn().mockResolvedValue({ error: null })
    const mockDelete = jest.fn().mockReturnValue({ match: mockMatch })
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: { id: 'like-1' } })
    const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ select: mockSelect, delete: mockDelete }),
    })
    await toggleLikeAction('note-1')
    expect(mockMatch).toHaveBeenCalledWith({ note_id: 'note-1', user_id: 'user-1' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cupping/note-1')
  })
})

// ─── createCommentAction ─────────────────────────────────────────
describe('createCommentAction', () => {
  it('content가 비어있으면 에러를 반환한다', async () => {
    const result = await createCommentAction(null, makeFormData({ note_id: 'note-1', content: '' }))
    expect(result).toEqual({ error: '댓글을 입력해주세요' })
  })

  it('content가 500자 초과면 에러를 반환한다', async () => {
    const result = await createCommentAction(null, makeFormData({ note_id: 'note-1', content: 'a'.repeat(501) }))
    expect(result).toEqual({ error: '댓글은 500자 이하로 입력해주세요' })
  })

  it('비로그인 시 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
      from: jest.fn(),
    })
    const result = await createCommentAction(null, makeFormData({ note_id: 'note-1', content: '좋아요!' }))
    expect(result).toEqual({ error: '로그인이 필요합니다' })
  })

  it('성공 시 insert 후 { success: true }를 반환한다', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ insert: mockInsert }),
    })
    const result = await createCommentAction(null, makeFormData({ note_id: 'note-1', content: '좋아요!' }))
    expect(mockInsert).toHaveBeenCalledWith({ note_id: 'note-1', user_id: 'user-1', content: '좋아요!' })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cupping/note-1')
    expect(result).toEqual({ success: true })
  })

  it('insert 실패 시 에러를 반환한다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ insert: jest.fn().mockResolvedValue({ error: new Error('DB') }) }),
    })
    const result = await createCommentAction(null, makeFormData({ note_id: 'note-1', content: '좋아요!' }))
    expect(result).toEqual({ error: '잠시 후 다시 시도해주세요' })
  })
})

// ─── deleteCommentAction ─────────────────────────────────────────
describe('deleteCommentAction', () => {
  it('비로그인 시 아무 것도 하지 않는다', async () => {
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
      from: jest.fn(),
    })
    await deleteCommentAction('comment-1', 'note-1')
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('성공 시 delete 후 revalidatePath를 호출한다', async () => {
    const mockEq2 = jest.fn().mockResolvedValue({ error: null })
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 })
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1 })
    mockCreateClient.mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: jest.fn().mockReturnValue({ delete: mockDelete }),
    })
    await deleteCommentAction('comment-1', 'note-1')
    expect(mockEq1).toHaveBeenCalledWith('id', 'comment-1')
    expect(mockEq2).toHaveBeenCalledWith('user_id', 'user-1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/cupping/note-1')
  })
})
