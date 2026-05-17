import { render, screen } from '@testing-library/react'
import AppLoading from '../loading'

describe('AppLoading', () => {
  it('공통 로딩 상태 UI를 렌더링한다', () => {
    render(<AppLoading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('불러오는 중이에요')).toBeInTheDocument()
    expect(
      screen.getByText('잠시만 기다려 주세요. 화면을 준비하고 있어요.')
    ).toBeInTheDocument()
  })
})
