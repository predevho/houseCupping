'use client'

import { useActionState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { updateProfileAction, type UpdateProfileState } from './actions'

interface EditFormProps {
  initialValues: { username: string; display_name: string }
}

export default function EditForm({ initialValues }: EditFormProps) {
  const { showToast } = useToast()
  const [state, action, isPending] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    null
  )

  useEffect(() => {
    if (state?.success) {
      showToast({ message: '프로필이 저장되었어요', type: 'success' })
    }
  }, [showToast, state])

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="username" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          사용자명
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={initialValues.username}
          minLength={4}
          maxLength={16}
          pattern="^[a-zA-Z0-9_-]{4,16}$"
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">영문, 숫자, _, - 만 사용 (4~16자)</p>
        {state?.errors?.username && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="display_name" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          표시이름
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={initialValues.display_name}
          minLength={4}
          maxLength={12}
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">4~12자</p>
        {state?.errors?.display_name && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.display_name}
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
        {isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
