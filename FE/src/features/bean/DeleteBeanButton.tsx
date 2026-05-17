'use client'

import DeleteActionButton from '@/components/ui/DeleteActionButton'
import { deleteBeanAction } from './actions'

interface Props {
  beanId: string
}

export default function DeleteBeanButton({ beanId }: Props) {
  return <DeleteActionButton onDelete={() => deleteBeanAction(beanId)} />
}
