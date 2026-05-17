import { fireEvent, render, screen } from '@testing-library/react'
import DeleteBeanButton from '../DeleteBeanButton'
import { deleteBeanAction } from '../actions'

jest.mock('../actions', () => ({
  ...jest.requireActual('../actions'),
  deleteBeanAction: jest.fn(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

const mockDeleteBeanAction = deleteBeanAction as jest.Mock

describe('DeleteBeanButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useTransition = () => [false, (fn: () => void) => fn()]
  })

  it('삭제 버튼이 렌더링된다', () => {
    render(<DeleteBeanButton beanId="12" />)
    expect(screen.getByRole('button', { name: '삭제' })).toHaveClass(
      'h-10',
      'px-4',
      'border',
      'rounded-md',
      'text-sm'
    )
  })

  it('버튼 클릭 시 deleteBeanAction을 호출한다', () => {
    mockDeleteBeanAction.mockResolvedValue(undefined)

    render(<DeleteBeanButton beanId="12" />)
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))

    expect(mockDeleteBeanAction).toHaveBeenCalledWith('12')
  })

  it('pending 상태에서 버튼이 비활성화된다', () => {
    jest.requireMock('react').useTransition = () => [true, jest.fn()]

    render(<DeleteBeanButton beanId="12" />)

    expect(screen.getByRole('button', { name: '삭제 중...' })).toBeDisabled()
  })
})
