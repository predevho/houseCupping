import { render, screen } from '@testing-library/react'
import AppLayout from '../layout'

jest.mock('@/components/layout/Header', () => () => <div data-testid="top-nav" />)
jest.mock('@/components/layout/SideNav', () => () => <div data-testid="side-nav" />)

describe('AppLayout', () => {
  it('top nav, side nav, content를 함께 렌더링한다', () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>
    )

    expect(screen.getByTestId('top-nav')).toBeInTheDocument()
    expect(screen.getByTestId('side-nav')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
