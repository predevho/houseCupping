import { render, screen, fireEvent } from '@testing-library/react'
import DeleteCommentButton from '../DeleteCommentButton'
import { deleteCommentAction } from '../actions'

jest.mock('../actions', () => ({ deleteCommentAction: jest.fn() }))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

const mockDeleteAction = deleteCommentAction as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.requireMock('react').useTransition = () => [false, (fn: () => void) => fn()]
})

describe('DeleteCommentButton', () => {
  it('삭제 버튼이 렌더링된다', () => {
    render(<DeleteCommentButton commentId="comment-1" noteId="note-1" />)
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('클릭 시 deleteCommentAction을 호출한다', () => {
    mockDeleteAction.mockResolvedValue(undefined)
    render(<DeleteCommentButton commentId="comment-1" noteId="note-1" />)
    fireEvent.click(screen.getByRole('button', { name: '삭제' }))
    expect(mockDeleteAction).toHaveBeenCalledWith('comment-1', 'note-1')
  })

  it('pending 상태에서 버튼이 비활성화되고 텍스트가 바뀐다', () => {
    jest.requireMock('react').useTransition = () => [true, jest.fn()]
    render(<DeleteCommentButton commentId="comment-1" noteId="note-1" />)
    expect(screen.getByRole('button', { name: '삭제 중...' })).toBeDisabled()
  })
})
