'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type CreateBeanState = {
  errors?: {
    cafe_name?: string
    bean_name?: string
    image?: string
    general?: string
  }
} | null

export type UpdateBeanState = CreateBeanState

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function getImageFile(formData: FormData): File | null {
  const file = formData.get('image')

  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  return file
}

function validateImageFile(file: File | null): string | null {
  if (!file) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'JPG, PNG, WebP 이미지만 업로드할 수 있어요'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return '이미지는 5MB 이하만 업로드할 수 있어요'
  }

  return null
}

function buildImagePath(userId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${userId}/${Date.now()}-${safeName}`
}

async function uploadBeanImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
): Promise<string | null> {
  const imagePath = buildImagePath(userId, file.name)

  const { error } = await supabase.storage
    .from('beans')
    .upload(imagePath, file, { contentType: file.type, upsert: false })

  if (error) return null

  return imagePath
}

export async function createBeanAction(
  _state: CreateBeanState,
  formData: FormData
): Promise<CreateBeanState> {
  const cafe_name = formData.get('cafe_name') as string
  const bean_name = formData.get('bean_name') as string
  const origin = (formData.get('origin') as string) || null
  const process = (formData.get('process') as string) || null
  const roast_level = (formData.get('roast_level') as string) || null
  const image = getImageFile(formData)

  if (!cafe_name) {
    return { errors: { cafe_name: '카페명을 입력해주세요' } }
  }

  if (!bean_name) {
    return { errors: { bean_name: '원두명을 입력해주세요' } }
  }

  const imageError = validateImageFile(image)
  if (imageError) {
    return { errors: { image: imageError } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  let image_path: string | null = null
  if (image) {
    image_path = await uploadBeanImage(supabase, user.id, image)

    if (!image_path) {
      return { errors: { image: '이미지 업로드에 실패했어요' } }
    }
  }

  const { data, error } = await supabase
    .from('beans')
    .insert({ user_id: user.id, cafe_name, bean_name, origin, process, roast_level, image_path })
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
  const image = getImageFile(formData)

  if (!bean_id) {
    return { errors: { general: '원두 정보가 없습니다' } }
  }

  if (!cafe_name) {
    return { errors: { cafe_name: '카페명을 입력해주세요' } }
  }

  if (!bean_name) {
    return { errors: { bean_name: '원두명을 입력해주세요' } }
  }

  const imageError = validateImageFile(image)
  if (imageError) {
    return { errors: { image: imageError } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { errors: { general: '로그인이 필요합니다' } }
  }

  let image_path: string | undefined
  if (image) {
    const uploadedPath = await uploadBeanImage(supabase, user.id, image)

    if (!uploadedPath) {
      return { errors: { image: '이미지 업로드에 실패했어요' } }
    }

    image_path = uploadedPath
  }

  const { error } = await supabase
    .from('beans')
    .update({
      cafe_name,
      bean_name,
      origin,
      process,
      roast_level,
      ...(image_path ? { image_path } : {}),
    })
    .eq('id', Number(bean_id))
    .eq('user_id', user.id)

  if (error) {
    return { errors: { general: '잠시 후 다시 시도해주세요' } }
  }

  redirect(`/beans/${bean_id}`)
}

export async function deleteBeanAction(beanId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('beans')
    .delete()
    .eq('id', Number(beanId))

  if (error) throw new Error(error.message)

  redirect('/beans')
}
