import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CuppingForm from '@/features/cupping/CuppingForm'
import { createCuppingAction } from '@/features/cupping/actions'

interface Props {
  searchParams: Promise<{ beanId?: string }>
}

export default async function CuppingNewPage({ searchParams }: Props) {
  const { beanId } = await searchParams

  if (!beanId) notFound()

  const supabase = await createClient()
  const { data: bean } = await supabase
    .from('beans')
    .select('cafe_name, bean_name')
    .eq('id', beanId)
    .maybeSingle()

  if (!bean) notFound()

  const beanLabel = `${bean.cafe_name} — ${bean.bean_name}`

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-lg font-bold mb-6">커핑 노트 등록</h1>
      <CuppingForm
        beanId={beanId}
        beanLabel={beanLabel}
        action={createCuppingAction}
        submitLabel="커핑 노트 등록"
      />
    </main>
  )
}
