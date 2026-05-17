'use client'

import { useActionState, useEffect } from 'react'
import FieldError from '@/components/ui/FieldError'
import FormSubmitButton from '@/components/ui/FormSubmitButton'
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
        <FieldError message={state?.errors?.username} />
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
        <FieldError message={state?.errors?.display_name} />
      </div>

      <FieldError message={state?.errors?.general} />

      <FormSubmitButton isPending={isPending} pendingLabel="저장 중...">
        저장
      </FormSubmitButton>
    </form>
  )
}
