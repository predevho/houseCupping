'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CommentFormState = { error?: string; success?: true } | null

export async function toggleLikeAction(noteId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('note_id', noteId)
    .eq('user_id', user.id)
    .maybeSingle()

  const { error } = existing
    ? await supabase.from('likes').delete().eq('note_id', noteId).eq('user_id', user.id)
    : await supabase.from('likes').insert({ note_id: noteId, user_id: user.id })

  if (error) return
  revalidatePath(`/cupping/${noteId}`)
}

export async function createCommentAction(
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const content = (formData.get('content') as string)?.trim()
  const noteId = formData.get('note_id') as string

  if (!content) return { error: '댓글을 입력해주세요' }
  if (content.length > 500) return { error: '댓글은 500자 이하로 입력해주세요' }
  if (!noteId) return { error: '노트 정보가 없습니다' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다' }

  const { error } = await supabase.from('comments').insert({
    note_id: noteId,
    user_id: user.id,
    content,
  })

  if (error) return { error: '잠시 후 다시 시도해주세요' }

  revalidatePath(`/cupping/${noteId}`)
  return { success: true }
}

export async function deleteCommentAction(commentId: string, noteId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id)
  if (error) return
  revalidatePath(`/cupping/${noteId}`)
}
