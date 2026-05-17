'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type CuppingFormState = {
  errors?: {
    aroma?: string
    acidity?: string
    body?: string
    score?: string
    general?: string
  }
} | null

function isValidScore(v: number): boolean {
  return v >= 0.5 && v <= 5.0 && Number.isInteger(v * 2)
}

export async function createCuppingAction(
  _state: CuppingFormState,
  formData: FormData
): Promise<CuppingFormState> {
  const bean_id = Number(formData.get('bean_id') as string)
  if (!bean_id) {
    return { errors: { general: '원두 정보가 없습니다' } }
  }

  const aromaRaw = formData.get('aroma') as string
  const acidityRaw = formData.get('acidity') as string
  const bodyRaw = formData.get('body') as string

  if (!aromaRaw) return { errors: { aroma: '향미를 선택해주세요' } }
  if (!acidityRaw) return { errors: { acidity: '산미를 선택해주세요' } }
  if (!bodyRaw) return { errors: { body: '바디를 선택해주세요' } }

  const aroma = Number(aromaRaw)
  const acidity = Number(acidityRaw)
  const body = Number(bodyRaw)
  const roast_date = (formData.get('roast_date') as string) || null
  const memo = (formData.get('memo') as string) || null
  const scoreRaw = formData.get('score') as string
  const score = scoreRaw ? Number(scoreRaw) : null

  if (!isValidScore(aroma)) {
    return { errors: { aroma: '향미는 0.5~5.0 사이로 입력해주세요' } }
  }
  if (!isValidScore(acidity)) {
    return { errors: { acidity: '산미는 0.5~5.0 사이로 입력해주세요' } }
  }
  if (!isValidScore(body)) {
    return { errors: { body: '바디는 0.5~5.0 사이로 입력해주세요' } }
  }
  if (score !== null && !isValidScore(score)) {
    return { errors: { score: '평점은 0.5~5.0 사이로 입력해주세요' } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  const { error: noteError } = await supabase
    .from('cupping_notes')
    .insert({ user_id: user.id, bean_id, aroma, acidity, body, roast_date, memo })

  if (noteError) {
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  if (score !== null) {
    const { error: ratingError } = await supabase
      .from('bean_ratings')
      .upsert({ user_id: user.id, bean_id, score }, { onConflict: 'user_id,bean_id' })

    if (ratingError) {
      return { errors: { general: '잠시 후 다시 시도해주세요' } }
    }
  }

  redirect(`/beans/${bean_id}`)
}

export async function deleteCuppingAction(noteId: string, beanId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('cupping_notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  redirect(`/beans/${beanId}`)
}

export async function updateCuppingAction(
  _state: CuppingFormState,
  formData: FormData
): Promise<CuppingFormState> {
  const note_id = formData.get('note_id') as string
  if (!note_id) return { errors: { general: '노트 정보가 없습니다' } }

  const bean_id = Number(formData.get('bean_id') as string)
  const aromaRaw = formData.get('aroma') as string
  const acidityRaw = formData.get('acidity') as string
  const bodyRaw = formData.get('body') as string

  if (!aromaRaw) return { errors: { aroma: '향미를 선택해주세요' } }
  if (!acidityRaw) return { errors: { acidity: '산미를 선택해주세요' } }
  if (!bodyRaw) return { errors: { body: '바디를 선택해주세요' } }

  const aroma = Number(aromaRaw)
  const acidity = Number(acidityRaw)
  const body = Number(bodyRaw)
  const roast_date = (formData.get('roast_date') as string) || null
  const memo = (formData.get('memo') as string) || null
  const scoreRaw = formData.get('score') as string
  const score = scoreRaw ? Number(scoreRaw) : null

  if (!isValidScore(aroma)) return { errors: { aroma: '향미는 0.5~5.0 사이로 입력해주세요' } }
  if (!isValidScore(acidity)) return { errors: { acidity: '산미는 0.5~5.0 사이로 입력해주세요' } }
  if (!isValidScore(body)) return { errors: { body: '바디는 0.5~5.0 사이로 입력해주세요' } }
  if (score !== null && !isValidScore(score)) return { errors: { score: '평점은 0.5~5.0 사이로 입력해주세요' } }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { errors: { general: '로그인이 필요합니다' } }

  const { data: updatedRows, error: updateError } = await supabase
    .from('cupping_notes')
    .update({ aroma, acidity, body, roast_date, memo })
    .eq('id', note_id)
    .eq('user_id', user.id)
    .select('id')

  if (updateError) return { errors: { general: '잠시 후 다시 시도해주세요' } }
  if (!updatedRows || updatedRows.length === 0) return { errors: { general: '노트를 찾을 수 없습니다' } }

  if (score !== null && bean_id) {
    const { error: ratingError } = await supabase
      .from('bean_ratings')
      .upsert({ user_id: user.id, bean_id, score }, { onConflict: 'user_id,bean_id' })

    if (ratingError) return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  redirect(`/cupping/${note_id}`)
}
