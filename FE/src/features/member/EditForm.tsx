'use client'

import { useActionState } from 'react'
import { updateProfileAction, type UpdateProfileState } from './actions'

interface EditFormProps {
  initialValues: { username: string; display_name: string }
}

export default function EditForm({ initialValues }: EditFormProps) {
  const [state, action, isPending] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    null
  )

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="username" className="text-xs font-semibold text-gray-500">
          사용자명
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={initialValues.username}
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
        {state?.errors?.username && (
          <p role="alert" className="text-[10px] text-red-600 mt-1">
            {state.errors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="display_name" className="text-xs font-semibold text-gray-500">
          표시이름
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={initialValues.display_name}
          required
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
        />
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
