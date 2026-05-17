'use client'

import DeleteActionButton from '@/components/ui/DeleteActionButton'
import { deleteCommentAction } from './actions'

interface Props {
  commentId: string
  noteId: string
}

export default function DeleteCommentButton({ commentId, noteId }: Props) {
  return <DeleteActionButton onDelete={() => deleteCommentAction(commentId, noteId)} />
}
