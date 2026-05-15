'use client'

import { useActionState } from 'react'
import { createBeanAction, type CreateBeanState } from './actions'

const PROCESS_OPTIONS = ['Washed', 'Natural', 'Honey', 'Anaerobic']
const ROAST_LEVEL_OPTIONS = ['Light', 'Medium', 'Dark', 'Extra Dark']

export default function BeanForm() {
  const [state, action, isPending] = useActionState<CreateBeanState, FormData>(
    createBeanAction,
    null
  )

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="cafe_name" className="text-xs font-semibold text-gray-500">
          카페명 <span className="text-red-500">*</span>
        </label>
        <input
          id="cafe_name"
          name="cafe_name"
          type="text"
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
        {state?.errors?.cafe_name && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.cafe_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bean_name" className="text-xs font-semibold text-gray-500">
          원두명 <span className="text-red-500">*</span>
        </label>
        <input
          id="bean_name"
          name="bean_name"
          type="text"
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
        {state?.errors?.bean_name && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.bean_name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="origin" className="text-xs font-semibold text-gray-500">
          원산지
        </label>
        <input
          id="origin"
          name="origin"
          type="text"
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="process" className="text-xs font-semibold text-gray-500">
          가공 방식
        </label>
        <select
          id="process"
          name="process"
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        >
          <option value="">선택 안 함</option>
          {PROCESS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="roast_level" className="text-xs font-semibold text-gray-500">
          로스팅
        </label>
        <select
          id="roast_level"
          name="roast_level"
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        >
          <option value="">선택 안 함</option>
          {ROAST_LEVEL_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
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
        {isPending ? '등록 중...' : '원두 등록'}
      </button>
    </form>
  )
}
