import { render } from '@testing-library/react'
import CommentForm from '../CommentForm'

const mockShowToast = jest.fn()

jest.mock('../actions', () => ({ createCommentAction: jest.fn() }))
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type }: React.ComponentProps<'button'>) => (
    <button type={type} disabled={disabled}>{children}</button>
  ),
}))
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (action: unknown, initialState: unknown) => {
    void action
    return [initialState, jest.fn(), false]
  },
}))

describe('CommentForm toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('성공 상태일 때 성공 토스트를 띄운다', () => {
    jest.requireMock('react').useActionState = (action: unknown, initialState: unknown) => {
      void action
      void initialState
      return [{ success: true }, jest.fn(), false]
    }

    render(<CommentForm noteId="note-1" userId="user-1" />)

    expect(mockShowToast).toHaveBeenCalledWith({
      message: '댓글이 등록되었어요',
      type: 'success',
    })
  })

  it('에러 상태일 때 에러 토스트를 띄운다', () => {
    jest.requireMock('react').useActionState = (action: unknown, initialState: unknown) => {
      void action
      void initialState
      return [{ error: '댓글을 입력해주세요' }, jest.fn(), false]
    }

    render(<CommentForm noteId="note-1" userId="user-1" />)

    expect(mockShowToast).toHaveBeenCalledWith({
      message: '댓글을 입력해주세요',
      type: 'error',
    })
  })
})
