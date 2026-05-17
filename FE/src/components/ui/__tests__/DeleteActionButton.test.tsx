import { fireEvent, render, screen } from '@testing-library/react'
import DeleteActionButton from '../DeleteActionButton'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

describe('DeleteActionButton', () => {
  beforeEach(() => {
    jest.requireMock('react').useTransition = () => [false, (fn: () => void) => fn()]
  })

  it('삭제 버튼이 렌더링된다', () => {
    render(<DeleteActionButton onDelete={jest.fn()} />)
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('클릭 시 onDelete를 호출한다', () => {
    const onDelete = jest.fn().mockResolvedValue(undefined)
    render(<DeleteActionButton onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('pending 상태에서 버튼이 비활성화되고 텍스트가 바뀐다', () => {
    jest.requireMock('react').useTransition = () => [true, jest.fn()]
    render(<DeleteActionButton onDelete={jest.fn()} />)
    expect(screen.getByRole('button', { name: '삭제 중...' })).toBeDisabled()
  })
})
