import { render, screen, fireEvent } from '@testing-library/react'
import LikeButton from '../LikeButton'
import { toggleLikeAction } from '../actions'

jest.mock('../actions', () => ({ toggleLikeAction: jest.fn() }))
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, onClick, type }: React.ComponentProps<'button'>) => (
    <button type={type} disabled={disabled} onClick={onClick}>{children}</button>
  ),
}))

const mockToggle = toggleLikeAction as jest.Mock

beforeEach(() => jest.clearAllMocks())

describe('LikeButton', () => {
  it('초기 count와 미좋아요 상태를 렌더링한다', () => {
    render(<LikeButton noteId="note-1" userId="user-1" initialLiked={false} initialCount={5} />)
    expect(screen.getByRole('button')).toHaveTextContent('♡ 5')
  })

  it('초기 좋아요 상태를 렌더링한다', () => {
    render(<LikeButton noteId="note-1" userId="user-1" initialLiked={true} initialCount={5} />)
    expect(screen.getByRole('button')).toHaveTextContent('♥ 5')
  })

  it('클릭 시 좋아요 상태가 즉시 반전되고 count가 증가한다', () => {
    render(<LikeButton noteId="note-1" userId="user-1" initialLiked={false} initialCount={5} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('♥ 6')
  })

  it('좋아요 상태에서 클릭하면 count가 감소한다', () => {
    render(<LikeButton noteId="note-1" userId="user-1" initialLiked={true} initialCount={5} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('♡ 4')
  })

  it('클릭 시 toggleLikeAction을 호출한다', () => {
    mockToggle.mockResolvedValue(undefined)
    render(<LikeButton noteId="note-1" userId="user-1" initialLiked={false} initialCount={5} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockToggle).toHaveBeenCalledWith('note-1')
  })

  it('userId가 null이면 버튼이 비활성화된다', () => {
    render(<LikeButton noteId="note-1" userId={null} initialLiked={false} initialCount={5} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
