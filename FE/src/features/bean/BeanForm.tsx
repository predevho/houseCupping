'use client'

import { useActionState } from 'react'
import { createBeanAction, type CreateBeanState, type UpdateBeanState } from './actions'

const PROCESS_OPTIONS = ['Washed', 'Natural', 'Honey', 'Anaerobic']
const ROAST_LEVEL_OPTIONS = ['Light', 'Medium', 'Dark', 'Extra Dark']

interface BeanFormValues {
  cafe_name: string
  bean_name: string
  origin: string | null
  process: string | null
  roast_level: string | null
  image_path?: string | null
}

interface Props {
  action?: (state: CreateBeanState | UpdateBeanState, formData: FormData) => Promise<CreateBeanState | UpdateBeanState>
  submitLabel?: string
  initialValues?: BeanFormValues
  beanId?: string
}

export default function BeanForm({
  action = createBeanAction,
  submitLabel = '원두 등록',
  initialValues,
  beanId,
}: Props) {
  const [state, formAction, isPending] = useActionState<CreateBeanState | UpdateBeanState, FormData>(
    action,
    null
  )

  return (
    <form action={formAction} encType="multipart/form-data" className="flex flex-col gap-3">
      {beanId && <input type="hidden" name="bean_id" value={beanId} />}
      <div>
        <label htmlFor="cafe_name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          카페명 <span className="text-red-500">*</span>
        </label>
        <input
          id="cafe_name"
          name="cafe_name"
          type="text"
          defaultValue={initialValues?.cafe_name ?? ''}
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        {state?.errors?.cafe_name && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.cafe_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bean_name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          원두명 <span className="text-red-500">*</span>
        </label>
        <input
          id="bean_name"
          name="bean_name"
          type="text"
          defaultValue={initialValues?.bean_name ?? ''}
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        {state?.errors?.bean_name && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.bean_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="origin" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          원산지
        </label>
        <input
          id="origin"
          name="origin"
          type="text"
          defaultValue={initialValues?.origin ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label htmlFor="process" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          가공 방식
        </label>
        <select
          id="process"
          name="process"
          defaultValue={initialValues?.process ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">선택 안 함</option>
          {PROCESS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="roast_level" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          로스팅
        </label>
        <select
          id="roast_level"
          name="roast_level"
          defaultValue={initialValues?.roast_level ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">선택 안 함</option>
          {ROAST_LEVEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          대표 이미지
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:px-3 file:py-2 file:border-0 file:rounded-md file:bg-gray-100 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-300"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, WebP / 최대 5MB</p>
        {state?.errors?.image && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.image}
          </p>
        )}
      </div>

      {state?.errors?.general && (
        <p role="alert" className="text-xs text-red-600">
          {state.errors.general}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-10 bg-[#8B2635] text-white rounded-md text-sm font-semibold disabled:opacity-50"
      >
        {isPending ? '등록 중...' : submitLabel}
      </button>
    </form>
  )
}
