'use client'

import { useActionState } from 'react'
import { type CuppingFormState } from './actions'

const SCORE_OPTIONS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

interface CuppingFormInitialValues {
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  score: number | null
}

interface Props {
  beanId?: string
  noteId?: string
  beanLabel: string
  initialValues?: CuppingFormInitialValues
  action: (state: CuppingFormState, formData: FormData) => Promise<CuppingFormState>
  submitLabel: string
}

export default function CuppingForm({
  beanId,
  noteId,
  beanLabel,
  initialValues,
  action,
  submitLabel,
}: Props) {
  const [state, formAction, isPending] = useActionState<CuppingFormState, FormData>(
    action,
    null
  )

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {beanId && <input type="hidden" name="bean_id" value={beanId} />}
      {noteId && <input type="hidden" name="note_id" value={noteId} />}

      <p className="text-sm text-gray-500 dark:text-gray-400">{beanLabel}</p>

      <div>
        <label htmlFor="aroma" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          향미 (Aroma) <span className="text-red-500">*</span>
        </label>
        <select
          id="aroma"
          name="aroma"
          required
          defaultValue={initialValues?.aroma?.toString() ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="" disabled>선택</option>
          {SCORE_OPTIONS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {state?.errors?.aroma && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.aroma}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="acidity" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          산미 (Acidity) <span className="text-red-500">*</span>
        </label>
        <select
          id="acidity"
          name="acidity"
          required
          defaultValue={initialValues?.acidity?.toString() ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="" disabled>선택</option>
          {SCORE_OPTIONS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {state?.errors?.acidity && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.acidity}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          바디 (Body) <span className="text-red-500">*</span>
        </label>
        <select
          id="body"
          name="body"
          required
          defaultValue={initialValues?.body?.toString() ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="" disabled>선택</option>
          {SCORE_OPTIONS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {state?.errors?.body && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.body}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="roast_date" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          로스팅 날짜
        </label>
        <input
          id="roast_date"
          name="roast_date"
          type="date"
          defaultValue={initialValues?.roast_date ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label htmlFor="memo" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          메모
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={3}
          defaultValue={initialValues?.memo ?? ''}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label htmlFor="score" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          종합 평점
        </label>
        <select
          id="score"
          name="score"
          defaultValue={initialValues?.score?.toString() ?? ''}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        >
          <option value="">선택 안 함</option>
          {SCORE_OPTIONS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {state?.errors?.score && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.score}
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
        {isPending ? '처리 중...' : submitLabel}
      </button>
    </form>
  )
}
