import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeleteButton from '@/features/cupping/DeleteButton'
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

      {isOwner && (
        <div className="flex items-center gap-3">
          <Link
            href={`/cupping/${note.id}/edit`}
            className="text-xs text-gray-500 font-semibold"
          >
            수정
          </Link>
          <DeleteButton noteId={String(note.id)} beanId={String(note.bean_id)} />
        </div>
      )}

      {/* 좋아요 */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <LikeButton
          noteId={String(note.id)}
          userId={authData.user?.id ?? null}
          initialLiked={initialLiked}
          initialCount={likeCount}
        />
      </div>

      {/* 댓글 */}
      <section className="mt-6 border-t border-gray-100 pt-4 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-700">댓글 {comments.length}개</h2>
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  {comment.profiles?.display_name ?? comment.profiles?.username ?? '알 수 없음'}
                </span>
                {comment.user_id === authData.user?.id && (
                  <DeleteCommentButton commentId={String(comment.id)} noteId={String(note.id)} />
                )}
              </div>
              <p className="text-sm text-gray-800">{comment.content}</p>
              <span className="text-xs text-gray-400">
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
