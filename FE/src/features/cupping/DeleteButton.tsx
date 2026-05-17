'use client'

import DeleteActionButton from '@/components/ui/DeleteActionButton'
import { deleteCuppingAction } from './actions'

interface Props {
  noteId: string
  beanId: string
}

export default function DeleteButton({ noteId, beanId }: Props) {
  return <DeleteActionButton onDelete={() => deleteCuppingAction(noteId, beanId)} />
}
