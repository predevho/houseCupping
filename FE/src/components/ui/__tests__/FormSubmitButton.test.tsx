import { fireEvent, render, screen } from '@testing-library/react'
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

  it('onClick prop이 전달되면 클릭 시 호출된다', () => {
    const onClick = jest.fn()
    render(
      <FormSubmitButton isPending={false} pendingLabel="저장 중..." onClick={onClick}>
        저장
      </FormSubmitButton>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('호버 시 색 변화가 분명한 강조 스타일을 사용한다', () => {
    render(
      <FormSubmitButton isPending={false} pendingLabel="저장 중...">
        저장
      </FormSubmitButton>
    )

    expect(screen.getByRole('button', { name: '저장' })).toHaveClass(
      'hover:bg-[#6F1D2A]',
      'hover:shadow-md',
      'transition-all'
    )
  })
})
