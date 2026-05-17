'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createCommentAction, type CommentFormState } from './actions'

interface Props {
  noteId: string
  userId: string | null
}

export default function CommentForm({ noteId, userId }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState<CommentFormState, FormData>(
    createCommentAction,
    null
  )

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  if (!userId) {
    return <p className="text-sm text-gray-500">로그인 후 댓글을 작성할 수 있습니다.</p>
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="note_id" value={noteId} />
      <textarea
        name="content"
        placeholder="댓글을 입력하세요"
        className="w-full rounded-md border border-gray-200 p-2 text-sm outline-none"
        rows={2}
      />
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? '등록 중...' : '등록'}
      </Button>
    </form>
  )
}
