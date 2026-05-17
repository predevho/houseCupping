'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { createCommentAction, type CommentFormState } from './actions'

interface Props {
  noteId: string
  userId: string | null
}

export default function CommentForm({ noteId, userId }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const { showToast } = useToast()
  const [state, formAction, isPending] = useActionState<CommentFormState, FormData>(
    createCommentAction,
    null
  )

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      showToast({ message: '댓글이 등록되었어요', type: 'success' })
      return
    }

    if (state?.error) {
      showToast({ message: state.error, type: 'error' })
    }
  }, [showToast, state])

  if (!userId) {
    return (
      <Link href={`/auth?next=/cupping/${noteId}`} className="text-sm text-amber-700 underline">
        로그인하고 댓글 쓰기
      </Link>
    )
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="note_id" value={noteId} />
      <textarea
        name="content"
        placeholder="댓글을 입력하세요"
        className="w-full rounded-md border border-gray-200 p-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        rows={2}
      />
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? '등록 중...' : '등록'}
      </Button>
    </form>
  )
}
