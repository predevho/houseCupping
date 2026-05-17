import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

const mockSetTheme = jest.fn()
let mockTheme = 'system'

jest.mock('next-themes', () => ({
  __esModule: true,
  useTheme: jest.fn(() => ({ theme: mockTheme, setTheme: mockSetTheme })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockTheme = 'system'
    jest.clearAllMocks()
  })

  it('초기에는 드롭다운이 닫혀있다', async () => {
    const { default: ThemeToggle } = await import('../ThemeToggle')
    render(<ThemeToggle />)
    expect(screen.queryByText('라이트')).not.toBeInTheDocument()
    expect(screen.queryByText('다크')).not.toBeInTheDocument()
    expect(screen.queryByText('시스템')).not.toBeInTheDocument()
  })

  it('버튼 클릭 시 드롭다운이 열린다', async () => {
    const { default: ThemeToggle } = await import('../ThemeToggle')
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 변경' }))
    expect(screen.getByText('라이트')).toBeInTheDocument()
    expect(screen.getByText('다크')).toBeInTheDocument()
    expect(screen.getByText('시스템')).toBeInTheDocument()
  })

  it('다크 클릭 시 setTheme("dark")가 호출된다', async () => {
    const { default: ThemeToggle } = await import('../ThemeToggle')
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 변경' }))
    fireEvent.click(screen.getByText('다크'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('시스템 클릭 시 setTheme("system")이 호출된다', async () => {
    const { default: ThemeToggle } = await import('../ThemeToggle')
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 변경' }))
    fireEvent.click(screen.getByText('시스템'))
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })

  it('옵션 선택 후 드롭다운이 닫힌다', async () => {
    const { default: ThemeToggle } = await import('../ThemeToggle')
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 변경' }))
    fireEvent.click(screen.getByText('라이트'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
    expect(screen.queryByText('다크')).not.toBeInTheDocument()
  })
})
