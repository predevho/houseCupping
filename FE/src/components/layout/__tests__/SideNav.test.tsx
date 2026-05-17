import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const { usePathname: mockUsePathname } =
  jest.requireMock('next/navigation')

describe('SideNav', () => {
  it('핵심 3개 카테고리 링크를 렌더링한다', async () => {
    const { default: SideNav } = await import('../SideNav')

    mockUsePathname.mockReturnValue('/')
    render(<SideNav />)

    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '원두' })).toHaveAttribute('href', '/beans')
    expect(screen.getByRole('link', { name: '커핑 노트' })).toHaveAttribute('href', '/cupping')
    expect(screen.queryByRole('link', { name: '프로필' })).not.toBeInTheDocument()
  })

  it('현재 경로와 일치하는 항목을 active 상태로 표시한다', async () => {
    const { default: SideNav } = await import('../SideNav')

    mockUsePathname.mockReturnValue('/cupping')
    render(<SideNav />)

    expect(screen.getByRole('link', { name: '커핑 노트' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('하위 경로도 해당 카테고리로 active 처리한다', async () => {
    const { default: SideNav } = await import('../SideNav')

    mockUsePathname.mockReturnValue('/beans/12')
    render(<SideNav />)

    expect(screen.getByRole('link', { name: '원두' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('active 항목은 옅은 배경과 좌측 포인트 바로 강조한다', async () => {
    const { default: SideNav } = await import('../SideNav')

    mockUsePathname.mockReturnValue('/cupping')
    render(<SideNav />)

    const activeLink = screen.getByRole('link', { name: '커핑 노트' })
    const inactiveLink = screen.getByRole('link', { name: '홈' })

    expect(activeLink).toHaveClass('bg-slate-100', 'border-l-2', 'border-slate-900', 'text-slate-950')
    expect(inactiveLink).not.toHaveAttribute('aria-current')
  })

  it('inactive 항목은 다크모드에서 더 밝은 텍스트 클래스를 사용한다', async () => {
    const { default: SideNav } = await import('../SideNav')

    mockUsePathname.mockReturnValue('/cupping')
    render(<SideNav />)

    expect(screen.getByRole('link', { name: '홈' })).toHaveClass('dark:text-slate-300')
  })
})
