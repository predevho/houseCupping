'use client'

import { useActionState, useState } from 'react'
import FieldError from '@/components/ui/FieldError'
import FormSubmitButton from '@/components/ui/FormSubmitButton'
import { type CuppingFormState } from './actions'
import CircleRatingInput from './CircleRatingInput'

const TODAY = new Date().toISOString().slice(0, 10)

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
  const [aroma, setAroma] = useState<number | null>(initialValues?.aroma ?? null)
  const [acidity, setAcidity] = useState<number | null>(initialValues?.acidity ?? null)
  const [body, setBody] = useState<number | null>(initialValues?.body ?? null)
  const [score, setScore] = useState<number | null>(initialValues?.score ?? null)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {beanId && <input type="hidden" name="bean_id" value={beanId} />}
      {noteId && <input type="hidden" name="note_id" value={noteId} />}

      <p className="text-sm text-gray-500 dark:text-gray-400">{beanLabel}</p>

      <div>
        <CircleRatingInput
          name="aroma"
          label="향미 (Aroma)"
          value={aroma}
          required
          onChange={setAroma}
        />
        <FieldError message={state?.errors?.aroma} />
      </div>

      <div>
        <CircleRatingInput
          name="acidity"
          label="산미 (Acidity)"
          value={acidity}
          required
          onChange={setAcidity}
        />
        <FieldError message={state?.errors?.acidity} />
      </div>

      <div>
        <CircleRatingInput
          name="body"
          label="바디 (Body)"
          value={body}
          required
          onChange={setBody}
        />
        <FieldError message={state?.errors?.body} />
      </div>

      <div>
        <CircleRatingInput
          name="score"
          label="종합 평점"
          value={score}
          onChange={setScore}
        />
        <FieldError message={state?.errors?.score} />
      </div>

      <div>
        <label htmlFor="roast_date" className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          로스팅 날짜
        </label>
        <input
          id="roast_date"
          name="roast_date"
          type="date"
          max={TODAY}
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

      <FieldError message={state?.errors?.general} />

      <FormSubmitButton isPending={isPending} pendingLabel="처리 중...">
        {submitLabel}
      </FormSubmitButton>
    </form>
  )
}
