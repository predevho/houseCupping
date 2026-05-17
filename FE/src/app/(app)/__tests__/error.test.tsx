import { fireEvent, render, screen } from '@testing-library/react'
import AppError from '../error'

describe('AppError', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('공통 에러 메시지와 재시도 버튼을 렌더링한다', () => {
    render(<AppError error={new Error('boom')} reset={jest.fn()} />)

    expect(screen.getByText('문제가 발생했어요')).toBeInTheDocument()
    expect(
      screen.getByText('잠시 후 다시 시도하거나 아래 버튼으로 다시 불러와 주세요.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('다시 시도 버튼 클릭 시 reset을 호출한다', () => {
    const reset = jest.fn()

    render(<AppError error={new Error('boom')} reset={reset} />)

    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
