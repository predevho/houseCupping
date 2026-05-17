// FE/src/features/social/__tests__/CommentForm.test.tsx
import { render, screen } from '@testing-library/react'
import CommentForm from '../CommentForm'

jest.mock('../actions', () => ({ createCommentAction: jest.fn() }))
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type }: React.ComponentProps<'button'>) => (
    <button type={type} disabled={disabled}>{children}</button>
  ),
}))
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: (_action: unknown, initialState: unknown) => [initialState, jest.fn(), false],
}))

beforeEach(() => jest.clearAllMocks())

describe('CommentForm', () => {
  it('userId가 null이면 로그인 CTA 링크를 렌더링한다', () => {
    render(<CommentForm noteId="note-1" userId={null} />)
    expect(screen.getByRole('link', { name: '로그인하고 댓글 쓰기' })).toHaveAttribute(
      'href',
      '/auth?next=/cupping/note-1'
    )
  })

  it('userId가 있으면 textarea와 등록 버튼을 렌더링한다', () => {
    render(<CommentForm noteId="note-1" userId="user-1" />)
    expect(screen.getByPlaceholderText('댓글을 입력하세요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '등록' })).toBeInTheDocument()
  })

  it('에러 상태가 있으면 에러 메시지를 표시한다', () => {
    jest.requireMock('react').useActionState = (_: unknown, __: unknown) =>
      [{ error: '댓글을 입력해주세요' }, jest.fn(), false]
    render(<CommentForm noteId="note-1" userId="user-1" />)
    expect(screen.getByText('댓글을 입력해주세요')).toBeInTheDocument()
  })

  it('isPending 상태에서 버튼이 비활성화된다', () => {
    jest.requireMock('react').useActionState = (_: unknown, __: unknown) =>
      [null, jest.fn(), true]
    render(<CommentForm noteId="note-1" userId="user-1" />)
    expect(screen.getByRole('button', { name: '등록 중...' })).toBeDisabled()
  })
})
