'use client'

import { useActionState } from 'react'
import { createCuppingAction, type CreateCuppingState } from './actions'

const SCORE_OPTIONS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

interface Props {
  beanId: string
  beanLabel: string
}

export default function CuppingForm({ beanId, beanLabel }: Props) {
  const [state, action, isPending] = useActionState<CreateCuppingState, FormData>(
    createCuppingAction,
    null
  )

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="bean_id" value={beanId} />

      <p className="text-sm text-gray-500">{beanLabel}</p>

      <div>
        <label htmlFor="aroma" className="text-xs font-semibold text-gray-500">
          향미 (Aroma) <span className="text-red-500">*</span>
        </label>
        <select
          id="aroma"
          name="aroma"
          required
          defaultValue=""
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
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
        <label htmlFor="acidity" className="text-xs font-semibold text-gray-500">
          산미 (Acidity) <span className="text-red-500">*</span>
        </label>
        <select
          id="acidity"
          name="acidity"
          required
          defaultValue=""
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
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
        <label htmlFor="body" className="text-xs font-semibold text-gray-500">
          바디 (Body) <span className="text-red-500">*</span>
        </label>
        <select
          id="body"
          name="body"
          required
          defaultValue=""
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
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
        <label htmlFor="roast_date" className="text-xs font-semibold text-gray-500">
          로스팅 날짜
        </label>
        <input
          id="roast_date"
          name="roast_date"
          type="date"
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="memo" className="text-xs font-semibold text-gray-500">
          메모
        </label>
        <textarea
          id="memo"
          name="memo"
          rows={3}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none resize-none"
        />
      </div>

      <div>
        <label htmlFor="score" className="text-xs font-semibold text-gray-500">
          종합 평점
        </label>
        <select
          id="score"
          name="score"
          defaultValue=""
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
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
        {isPending ? '등록 중...' : '커핑 노트 등록'}
      </button>
    </form>
  )
}
