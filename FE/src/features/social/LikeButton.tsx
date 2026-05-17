'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toggleLikeAction } from './actions'

interface Props {
  noteId: string
  userId: string | null
  initialLiked: boolean
  initialCount: number
}

export default function LikeButton({ noteId, userId, initialLiked, initialCount }: Props) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  const handleClick = () => {
    if (!userId) {
      router.push(`/auth?next=/cupping/${noteId}`)
      return
    }

    setCount((prev) => liked ? prev - 1 : prev + 1)
    setLiked((prev) => !prev)
    toggleLikeAction(noteId)
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
      {liked ? '♥' : '♡'} {count}
    </Button>
  )
}
