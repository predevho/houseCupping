import { render, screen } from '@testing-library/react'
import LogoutButton from '../LogoutButton'

jest.mock('@/app/(app)/_actions/logout', () => ({
  logoutAction: jest.fn(),
}))

describe('LogoutButton', () => {
  it('로그아웃 버튼을 렌더링한다', () => {
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument()
  })

  it('버튼이 form 안에 있다', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: '로그아웃' })
    expect(button.closest('form')).toBeInTheDocument()
  })
})
