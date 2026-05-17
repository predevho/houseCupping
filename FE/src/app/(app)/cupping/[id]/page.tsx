import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeleteButton from '@/features/cupping/DeleteButton'
import CircleRatingDisplay from '@/features/cupping/CircleRatingDisplay'
import LikeButton from '@/features/social/LikeButton'
import CommentForm from '@/features/social/CommentForm'
import DeleteCommentButton from '@/features/social/DeleteCommentButton'

interface CuppingNoteDetail {
  id: number
  user_id: string
  bean_id: number
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  created_at: string
  profiles: { username: string } | null
  beans: { id: number; bean_name: string; cafe_name: string } | null
}

interface Comment {
  id: number
  user_id: string
  content: string
  created_at: string
  profiles: { username: string; display_name: string } | null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function CuppingDetailPage({ params }: Props) {
  const { id } = await params
  const noteId = Number(id)
  if (!noteId) notFound()
  const supabase = await createClient()

  const { data } = await supabase
    .from('cupping_notes')
    .select('id, user_id, bean_id, aroma, acidity, body, roast_date, memo, created_at, profiles(username), beans(id, bean_name, cafe_name)')
    .eq('id', noteId)
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

  const { data: likes } = await supabase
    .from('likes')
    .select('id, user_id')
    .eq('note_id', noteId)

  const likeCount = likes?.length ?? 0
  const initialLiked = likes?.some((l) => l.user_id === authData.user?.id) ?? false

  const { data: commentsRaw } = await supabase
    .from('comments')
    .select('id, user_id, content, created_at, profiles(username, display_name)')
    .eq('note_id', noteId)
    .order('created_at', { ascending: true })

  const comments = (commentsRaw ?? []) as Comment[]

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
          <p className="text-sm text-gray-400 dark:text-gray-500">{beanLabel}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <CircleRatingDisplay label="향미" value={note.aroma} />
        <CircleRatingDisplay label="산미" value={note.acidity} />
        <CircleRatingDisplay label="바디" value={note.body} />
      </div>

      {ratingData?.score != null && (
        <p className="text-sm text-gray-500 dark:text-gray-400">작성자 종합 평점 {ratingData.score}</p>
      )}

      {note.roast_date && (
        <p className="text-sm text-gray-500 dark:text-gray-400">로스팅일 {note.roast_date}</p>
      )}

      {note.memo && <p className="text-sm text-gray-700 dark:text-gray-200">{note.memo}</p>}

      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
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

      {isOwner && (
        <div className="flex items-center gap-3">
          <Link
            href={`/cupping/${note.id}/edit`}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-[#8B2635]/30 hover:bg-[#8B2635]/[0.06] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/20 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-[#A43348]/50 dark:hover:bg-[#A43348]/10 dark:focus-visible:ring-[#A43348]/30"
          >
            수정
          </Link>
          <DeleteButton noteId={String(note.id)} beanId={String(note.bean_id)} />
        </div>
      )}

      {/* 좋아요 */}
      <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
        <LikeButton
          noteId={String(note.id)}
          userId={authData.user?.id ?? null}
          initialLiked={initialLiked}
          initialCount={likeCount}
        />
      </div>

      {/* 댓글 */}
      <section className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">댓글 {comments.length}개</h2>
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {comment.profiles?.display_name ?? comment.profiles?.username ?? '알 수 없음'}
                </span>
                {comment.user_id === authData.user?.id && (
                  <DeleteCommentButton commentId={String(comment.id)} noteId={String(note.id)} />
                )}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-100">{comment.content}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(comment.created_at).toLocaleDateString('ko-KR')}
              </span>
            </li>
          ))}
        </ul>
        <CommentForm noteId={String(note.id)} userId={authData.user?.id ?? null} />
      </section>
    </main>
  )
}
