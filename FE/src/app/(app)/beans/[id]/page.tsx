import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildRatingSummary } from '@/features/bean/ratingSummary'
import DeleteBeanButton from '@/features/bean/DeleteBeanButton'
import CircleRatingDisplay from '@/features/cupping/CircleRatingDisplay'

interface BeanDetail {
  id: number
  user_id: string | null
  cafe_name: string
  bean_name: string
  origin: string | null
  process: string | null
  roast_level: string | null
  image_path: string | null
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

function isMissingImagePathColumn(error: { code?: string; message?: string } | null) {
  return error?.code === 'PGRST204' || error?.message?.includes('image_path')
}

export default async function BeanDetailPage({ params }: Props) {
  const { id } = await params
  const beanId = Number(id)
  if (!beanId) notFound()
  const supabase = await createClient()

  const [beanResult, authResult] = await Promise.all([
    supabase
      .from('beans')
      .select('id, user_id, cafe_name, bean_name, origin, process, roast_level, image_path, created_at, profiles(username)')
      .eq('id', beanId)
      .maybeSingle(),
    supabase.auth.getUser(),
  ])
  let beanData = beanResult.data as BeanDetail | null
  let beanError = beanResult.error
  const { data: authData } = authResult

  if (isMissingImagePathColumn(beanError)) {
    const fallbackResult = await supabase
      .from('beans')
      .select('id, user_id, cafe_name, bean_name, origin, process, roast_level, created_at, profiles(username)')
      .eq('id', beanId)
      .maybeSingle()

    beanError = fallbackResult.error
    beanData = fallbackResult.data
      ? {
        ...(fallbackResult.data as Omit<BeanDetail, 'image_path'>),
        image_path: null,
      }
      : null
  }

  if (beanError) {
    console.error('bean detail query error:', beanError)
    throw new Error('원두 상세를 불러오는 데 실패했어요')
  }

  if (!beanData) notFound()

  const bean = beanData

  const { data: notesData, error: notesError } = await supabase
    .from('cupping_notes')
    .select('id, aroma, acidity, body, roast_date, memo, created_at, profiles(username)')
    .eq('bean_id', beanId)
    .order('created_at', { ascending: false })

  const { data: ratingsData, error: ratingsError } = await supabase
    .from('bean_ratings')
    .select('score')
    .eq('bean_id', beanId)

  if (notesError) console.error('cupping_notes query error:', notesError)
  if (ratingsError) console.error('bean_ratings query error:', ratingsError)

  const notes = (notesData ?? []) as unknown as CuppingNote[]
  const ratingSummary = buildRatingSummary((ratingsData ?? []) as BeanRating[])
  const isOwner = authData.user?.id === bean.user_id
  const isAdmin = authData.user?.app_metadata?.role === 'admin'

  const registeredBy = bean.profiles?.username ?? '알 수 없음'

  const registeredAt = new Date(bean.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="max-w-md mx-auto px-4 py-8 flex flex-col gap-4">
      {bean.image_path && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={supabase.storage.from('beans').getPublicUrl(bean.image_path).data.publicUrl}
          alt={`${bean.bean_name} 대표 이미지`}
          className="w-full aspect-[4/3] rounded-xl object-cover border border-gray-100"
        />
      )}

      <div>
        <p className="text-lg font-bold">{bean.bean_name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{bean.cafe_name}</p>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        {bean.origin && (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400 dark:text-gray-500">원산지</dt>
            <dd>{bean.origin}</dd>
          </div>
        )}
        {bean.process && (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400 dark:text-gray-500">가공</dt>
            <dd>{bean.process}</dd>
          </div>
        )}
        {bean.roast_level && (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400 dark:text-gray-500">로스팅</dt>
            <dd>{bean.roast_level}</dd>
          </div>
        )}
      </dl>

      <div className="border-t border-gray-100 pt-2 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
        <p>등록자 @{registeredBy}</p>
        <p>등록일 {registeredAt}</p>
      </div>

      {(isOwner || isAdmin) && (
        <div className="flex items-center gap-3">
          {isOwner && (
            <Link
              href={`/beans/${bean.id}/edit`}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-[#8B2635]/30 hover:bg-[#8B2635]/[0.06] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/20 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-[#A43348]/50 dark:hover:bg-[#A43348]/10 dark:focus-visible:ring-[#A43348]/30"
            >
              수정
            </Link>
          )}
          {isAdmin && <DeleteBeanButton beanId={String(bean.id)} />}
        </div>
      )}

      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">종합 평점</p>
        {ratingSummary ? (
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
            평균 {ratingSummary.average} / 5.0 · {ratingSummary.count}명 참여
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">아직 등록된 종합 평점이 없어요</p>
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
                className="flex flex-col gap-1 border-t border-gray-100 pt-4 text-sm dark:border-gray-800"
              >
                <div className="flex flex-wrap gap-3">
                  <CircleRatingDisplay label="향미" value={note.aroma} />
                  <CircleRatingDisplay label="산미" value={note.acidity} />
                  <CircleRatingDisplay label="바디" value={note.body} />
                </div>
                {note.roast_date && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">로스팅일 {note.roast_date}</p>
                )}
                {note.memo && <p className="text-sm text-gray-600 dark:text-gray-300">{note.memo}</p>}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  @{note.profiles?.username ?? '알 수 없음'} ·{' '}
                  {new Date(note.created_at).toLocaleDateString('ko-KR')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">아직 커핑 노트가 없어요</p>
        )}
      </div>
    </main>
  )
}
