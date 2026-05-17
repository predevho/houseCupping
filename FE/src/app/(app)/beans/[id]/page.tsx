import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildRatingSummary } from '@/features/bean/ratingSummary'

interface BeanDetail {
  id: number
  user_id: string | null
  cafe_name: string
  bean_name: string
  origin: string | null
  process: string | null
  roast_level: string | null
  created_at: string
  profiles: { username: string } | null
}

interface CuppingNote {
  id: number
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  created_at: string
  profiles: { username: string } | null
}

interface BeanRating {
  score: number
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function BeanDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data }, { data: authData }] = await Promise.all([
    supabase
    .from('beans')
    .select('id, user_id, cafe_name, bean_name, origin, process, roast_level, created_at, profiles(username)')
    .eq('id', id)
    .maybeSingle(),
    supabase.auth.getUser(),
  ])

  if (!data) notFound()

  const bean = data as unknown as BeanDetail

  const { data: notesData, error: notesError } = await supabase
    .from('cupping_notes')
    .select('id, aroma, acidity, body, roast_date, memo, created_at, profiles(username)')
    .eq('bean_id', id)
    .order('created_at', { ascending: false })

  const { data: ratingsData, error: ratingsError } = await supabase
    .from('bean_ratings')
    .select('score')
    .eq('bean_id', id)

  if (notesError) console.error('cupping_notes query error:', notesError)
  if (ratingsError) console.error('bean_ratings query error:', ratingsError)

  const notes = (notesData ?? []) as unknown as CuppingNote[]
  const ratingSummary = buildRatingSummary((ratingsData ?? []) as BeanRating[])
  const isOwner = authData.user?.id === bean.user_id

  const registeredBy = bean.profiles?.username ?? '알 수 없음'

  const registeredAt = new Date(bean.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        <p className="text-lg font-bold">{bean.bean_name}</p>
        <p className="text-gray-500 text-sm">{bean.cafe_name}</p>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        {bean.origin && (
          <div className="flex gap-2">
            <dt className="text-gray-400 w-20 shrink-0">원산지</dt>
            <dd>{bean.origin}</dd>
          </div>
        )}
        {bean.process && (
          <div className="flex gap-2">
            <dt className="text-gray-400 w-20 shrink-0">가공</dt>
            <dd>{bean.process}</dd>
          </div>
        )}
        {bean.roast_level && (
          <div className="flex gap-2">
            <dt className="text-gray-400 w-20 shrink-0">로스팅</dt>
            <dd>{bean.roast_level}</dd>
          </div>
        )}
      </dl>

      <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        <p>등록자 @{registeredBy}</p>
        <p>등록일 {registeredAt}</p>
      </div>

      {isOwner && (
        <div>
          <Link href={`/beans/${bean.id}/edit`} className="text-xs text-gray-500 font-semibold">
            수정
          </Link>
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-xs font-semibold text-gray-500">종합 평점</p>
        {ratingSummary ? (
          <p className="mt-1 text-sm text-gray-700">
            평균 {ratingSummary.average} / 5.0 · {ratingSummary.count}명 참여
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-400">아직 등록된 종합 평점이 없어요</p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">커핑 노트</h2>
          <Link
            href={`/cupping/new?beanId=${id}`}
            className="text-xs text-[#8B2635] font-semibold"
          >
            + 노트 작성
          </Link>
        </div>

        {notes.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex flex-col gap-1 text-sm border-t border-gray-100 pt-4"
              >
                <div className="flex gap-4 text-sm">
                  <span>향미 {note.aroma}</span>
                  <span>산미 {note.acidity}</span>
                  <span>바디 {note.body}</span>
                </div>
                {note.roast_date && (
                  <p className="text-xs text-gray-400">로스팅일 {note.roast_date}</p>
                )}
                {note.memo && <p className="text-gray-600 text-sm">{note.memo}</p>}
                <p className="text-xs text-gray-400">
                  @{note.profiles?.username ?? '알 수 없음'} ·{' '}
                  {new Date(note.created_at).toLocaleDateString('ko-KR')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">아직 커핑 노트가 없어요</p>
        )}
      </div>
    </main>
  )
}
