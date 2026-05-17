import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BeanForm from '@/features/bean/BeanForm'
import { updateBeanAction } from '@/features/bean/actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BeanEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: bean } = await supabase
    .from('beans')
    .select('id, user_id, cafe_name, bean_name, origin, process, roast_level')
    .eq('id', id)
    .maybeSingle()

  if (!bean || bean.user_id !== user.id) {
    redirect(`/beans/${id}`)
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-lg font-bold mb-6">원두 수정</h1>
      <BeanForm
        action={updateBeanAction}
        submitLabel="원두 수정"
        beanId={String(bean.id)}
        initialValues={{
          cafe_name: bean.cafe_name,
          bean_name: bean.bean_name,
          origin: bean.origin,
          process: bean.process,
          roast_level: bean.roast_level,
        }}
      />
    </main>
  )
}
