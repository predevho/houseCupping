'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type CreateBeanState = {
  errors?: {
    cafe_name?: string
    bean_name?: string
    general?: string
  }
} | null

export type UpdateBeanState = CreateBeanState

export async function createBeanAction(
  _state: CreateBeanState,
  formData: FormData
): Promise<CreateBeanState> {
  const cafe_name = formData.get('cafe_name') as string
  const bean_name = formData.get('bean_name') as string
  const origin = (formData.get('origin') as string) || null
  const process = (formData.get('process') as string) || null
  const roast_level = (formData.get('roast_level') as string) || null

  if (!cafe_name) {
    return { errors: { cafe_name: '카페명을 입력해주세요' } }
  }

  if (!bean_name) {
    return { errors: { bean_name: '원두명을 입력해주세요' } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  const { data, error } = await supabase
    .from('beans')
    .insert({ user_id: user.id, cafe_name, bean_name, origin, process, roast_level })
    .select('id')
    .single()

  if (error || !data) {
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  redirect(`/beans/${data.id}`)
}

export async function updateBeanAction(
  _state: UpdateBeanState,
  formData: FormData
): Promise<UpdateBeanState> {
  const bean_id = formData.get('bean_id') as string
  const cafe_name = formData.get('cafe_name') as string
  const bean_name = formData.get('bean_name') as string
  const origin = (formData.get('origin') as string) || null
  const process = (formData.get('process') as string) || null
  const roast_level = (formData.get('roast_level') as string) || null

  if (!bean_id) {
    return { errors: { general: '원두 정보가 없습니다' } }
  }

  if (!cafe_name) {
    return { errors: { cafe_name: '카페명을 입력해주세요' } }
  }

  if (!bean_name) {
    return { errors: { bean_name: '원두명을 입력해주세요' } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  const { error } = await supabase
    .from('beans')
    .update({ cafe_name, bean_name, origin, process, roast_level })
    .eq('id', Number(bean_id))
    .eq('user_id', user.id)

  if (error) {
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  redirect(`/beans/${bean_id}`)
}
