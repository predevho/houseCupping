import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeleteButton from '@/features/cupping/DeleteButton'

interface CuppingNoteDetail {
  id: string
  user_id: string
  bean_id: string
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  created_at: string
  profiles: { username: string } | null
  beans: { id: string; bean_name: string; cafe_name: string } | null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function CuppingDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('cupping_notes')
    .select('id, user_id, bean_id, aroma, acidity, body, roast_date, memo, created_at, profiles(username), beans(id, bean_name, cafe_name)')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()

  const note = data as unknown as CuppingNoteDetail

  const [{ data: ratingData, error: ratingError }, { data: authData }] = await Promise.all([
    supabase
      .from('bean_ratings')
      .select('score')
      .eq('user_id', note.user_id)
      .eq('bean_id', note.bean_id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ])

  if (ratingError) console.error('bean_ratings query error:', ratingError)

  const isOwner = authData.user?.id === note.user_id

  const beanLabel = note.beans
    ? `${note.beans.bean_name} — ${note.beans.cafe_name}`
    : '알 수 없음'

  const createdAt = new Date(note.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        {note.beans ? (
          <Link
            href={`/beans/${note.beans.id}`}
            className="text-sm text-[#8B2635] font-semibold"
          >
            {beanLabel} →
          </Link>
        ) : (
          <p className="text-sm text-gray-400">{beanLabel}</p>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <span>향미 {note.aroma}</span>
        <span>산미 {note.acidity}</span>
        <span>바디 {note.body}</span>
      </div>

      {ratingData?.score != null && (
        <p className="text-sm text-gray-500">작성자 종합 평점 {ratingData.score}</p>
      )}

      {note.roast_date && (
        <p className="text-sm text-gray-500">로스팅일 {note.roast_date}</p>
      )}

      {note.memo && <p className="text-sm text-gray-700">{note.memo}</p>}

      <div className="text-xs text-gray-400 flex items-center gap-1">
        {note.profiles?.username ? (
          <Link href={`/profile/${note.profiles.username}`}>
            @{note.profiles.username}
          </Link>
        ) : (
          <span>@알 수 없음</span>
        )}
        <span>·</span>
        <span>{createdAt}</span>
      </div>

      {isOwner && <DeleteButton noteId={note.id} beanId={note.bean_id} />}
    </main>
  )
}
