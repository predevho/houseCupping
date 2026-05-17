import { render, screen } from '@testing-library/react'
import FormSubmitButton from '../FormSubmitButton'

describe('FormSubmitButton', () => {
  it('isPending=false이면 children을 렌더링하고 활성화된다', () => {
    render(
      <FormSubmitButton isPending={false} pendingLabel="저장 중...">
        저장
      </FormSubmitButton>
    )
    const btn = screen.getByRole('button', { name: '저장' })
    expect(btn).toBeEnabled()
    expect(btn).toHaveAttribute('type', 'submit')
  })

  it('isPending=true이면 pendingLabel을 렌더링하고 비활성화된다', () => {
    render(
      <FormSubmitButton isPending pendingLabel="저장 중...">
        저장
      </FormSubmitButton>
    )
    expect(screen.getByRole('button', { name: '저장 중...' })).toBeDisabled()
  })
})
