import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface BeanDetail {
  cafe_name: string
  bean_name: string
  origin: string | null
  process: string | null
  roast_level: string | null
  created_at: string
  profiles: { username: string } | null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function BeanDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('beans')
    .select('cafe_name, bean_name, origin, process, roast_level, created_at, profiles(username)')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()

  const bean = data as unknown as BeanDetail

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
    </main>
  )
}
