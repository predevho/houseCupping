import { render, screen, fireEvent } from '@testing-library/react'
import DeleteButton from '../DeleteButton'
import { deleteCuppingAction } from '../actions'

jest.mock('../actions', () => ({ deleteCuppingAction: jest.fn() }))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

const mockDeleteAction = deleteCuppingAction as jest.Mock

describe('DeleteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react').useTransition = () => [false, (fn: () => void) => fn()]
  })

  it('삭제 버튼이 렌더링된다', () => {
    render(<DeleteButton noteId="note-1" beanId="bean-1" />)
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('버튼 클릭 시 deleteCuppingAction을 호출한다', () => {
    mockDeleteAction.mockResolvedValue(undefined)
    render(<DeleteButton noteId="note-1" beanId="bean-1" />)
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    expect(mockDeleteAction).toHaveBeenCalledWith('note-1', 'bean-1')
  })

  it('pending 상태에서 버튼이 비활성화되고 텍스트가 바뀐다', () => {
    jest.requireMock('react').useTransition = () => [true, jest.fn()]
    render(<DeleteButton noteId="note-1" beanId="bean-1" />)
    expect(screen.getByRole('button', { name: '삭제 중...' })).toBeDisabled()
  })
})
