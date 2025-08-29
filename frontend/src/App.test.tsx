import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock the router hook
vi.mock('./utils/router', () => ({
  useHashRoute: vi.fn()
}))

// Mock the page components
vi.mock('./pages/LandingPage', () => ({
  LandingPage: ({ spotsLeft, discount, ctaText }: any) => (
    <div data-testid="landing-page">
      <div>Spots Left: {spotsLeft}</div>
      <div>Discount: {discount}%</div>
      <div>CTA: {ctaText}</div>
    </div>
  )
}))

vi.mock('./pages/CheckoutPage', () => ({
  CheckoutPage: ({ discount, ctaText }: any) => (
    <div data-testid="checkout-page">
      <div>Discount: {discount}%</div>
      <div>CTA: {ctaText}</div>
    </div>
  )
}))

vi.mock('./pages/ThankYouPage', () => ({
  ThankYouPage: ({ orderID }: any) => (
    <div data-testid="thankyou-page">
      <div>Order ID: {orderID}</div>
    </div>
  )
}))

import { useHashRoute } from './utils/router'

const mockUseHashRoute = useHashRoute as any

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders landing page when route is home', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'home',
      params: {}
    })

    render(<App />)

    expect(screen.getByTestId('landing-page')).toBeInTheDocument()
    expect(screen.getByText('Spots Left: 100')).toBeInTheDocument()
    expect(screen.getByText('Discount: 53%')).toBeInTheDocument()
    expect(screen.getByText(/Profită de oferta de presale/)).toBeInTheDocument()
  })

  it('renders checkout page when route is comanda', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'comanda',
      params: {}
    })

    render(<App />)

    expect(screen.getByTestId('checkout-page')).toBeInTheDocument()
    expect(screen.getByText('Discount: 53%')).toBeInTheDocument()
  })

  it('renders thank you page when route is thankyou', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'thankyou',
      params: { order: 'TEST-123' }
    })

    render(<App />)

    expect(screen.getByTestId('thankyou-page')).toBeInTheDocument()
    expect(screen.getByText('Order ID: TEST-123')).toBeInTheDocument()
  })

  it('calculates discount correctly', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'home',
      params: {}
    })

    render(<App />)

    // Discount should be 53% (1 - 1448.80/3098.80 = 0.532...)
    expect(screen.getByText('Discount: 53%')).toBeInTheDocument()
  })

  it('formats price correctly for Romanian locale', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'home',
      params: {}
    })

    render(<App />)

    // Should contain the monthly price formatted - use getAllByText to handle multiple matches
    const priceElements = screen.getAllByText(/99[.,]90 lei\/lună/)
    expect(priceElements.length).toBeGreaterThan(0)
  })

  it('applies correct CSS custom properties', () => {
    mockUseHashRoute.mockReturnValue({
      page: 'home',
      params: {}
    })

    render(<App />)

    const styleElement = document.querySelector('style')
    expect(styleElement?.textContent).toContain('--fa-orange: #EC7C26')
    expect(styleElement?.textContent).toContain('--fa-dark: #111111')
  })
})
