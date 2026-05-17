import { act, fireEvent, render, screen } from '@testing-library/react'
import { ToastProvider, useToast } from '../toast'

jest.useFakeTimers()

function TestButton() {
  const { showToast } = useToast()

  return (
    <button
      type="button"
      onClick={() => showToast({ message: '저장되었습니다', type: 'success' })}
    >
      열기
    </button>
  )
}

describe('ToastProvider', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('showToast 호출 시 토스트를 렌더링한다', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: '열기' }))

    expect(screen.getByText('저장되었습니다')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('일정 시간 후 토스트를 제거한다', () => {
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: '열기' }))

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('저장되었습니다')).not.toBeInTheDocument()
  })
})
