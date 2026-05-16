import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CuppingForm from '@/features/cupping/CuppingForm'
import { updateCuppingAction } from '@/features/cupping/actions'

interface CuppingNoteForEdit {
  id: string
  user_id: string
  bean_id: string
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  beans: { bean_name: string; cafe_name: string } | null
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function CuppingEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data }, { data: authData }] = await Promise.all([
    supabase
      .from('cupping_notes')
      .select('id, user_id, bean_id, aroma, acidity, body, roast_date, memo, beans(bean_name, cafe_name)')
      .eq('id', id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ])

  if (!data) notFound()

  const note = data as unknown as CuppingNoteForEdit

  if (authData.user?.id !== note.user_id) {
    redirect(`/cupping/${id}`)
  }

  const { data: ratingData } = await supabase
    .from('bean_ratings')
    .select('score')
    .eq('user_id', note.user_id)
    .eq('bean_id', note.bean_id)
    .maybeSingle()

  const beanLabel = note.beans
    ? `${note.beans.bean_name} — ${note.beans.cafe_name}`
    : '알 수 없음'

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-lg font-bold mb-6">커핑 노트 수정</h1>
      <CuppingForm
        noteId={note.id}
        beanId={note.bean_id}
        beanLabel={beanLabel}
        initialValues={{
          aroma: note.aroma,
          acidity: note.acidity,
          body: note.body,
          roast_date: note.roast_date,
          memo: note.memo,
          score: ratingData?.score ?? null,
        }}
        action={updateCuppingAction}
        submitLabel="수정하기"
      />
    </main>
  )
}
