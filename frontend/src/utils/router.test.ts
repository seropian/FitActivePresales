import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHashRoute } from './router'

// Mock window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
})

describe('useHashRoute', () => {
  beforeEach(() => {
    // Reset location hash before each test
    window.location.hash = ''
    mockScrollTo.mockClear()
  })

  afterEach(() => {
    // Clean up hash after each test
    window.location.hash = ''
  })

  it('returns home route by default', () => {
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'home',
      params: {}
    })
  })

  it('returns comanda route for #comanda hash', () => {
    window.location.hash = '#comanda'
    
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'comanda',
      params: {}
    })
  })

  it('returns thankyou route for #thank-you hash', () => {
    window.location.hash = '#thank-you'
    
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'thankyou',
      params: {}
    })
  })

  it('parses query parameters correctly', () => {
    window.location.hash = '#thank-you?order=TEST-123&status=success'
    
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'thankyou',
      params: {
        order: 'TEST-123',
        status: 'success'
      }
    })
  })

  it('handles comanda route with parameters', () => {
    window.location.hash = '#comanda?discount=50&promo=EARLY'
    
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'comanda',
      params: {
        discount: '50',
        promo: 'EARLY'
      }
    })
  })

  it('falls back to home for unknown hash', () => {
    window.location.hash = '#unknown-page'
    
    const { result } = renderHook(() => useHashRoute())
    
    expect(result.current).toEqual({
      page: 'home',
      params: {}
    })
  })

  it('responds to hash changes', async () => {
    const { result } = renderHook(() => useHashRoute())
    
    // Initially home
    expect(result.current.page).toBe('home')
    
    // Change hash and trigger hashchange event
    act(() => {
      window.location.hash = '#comanda'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    
    expect(result.current).toEqual({
      page: 'comanda',
      params: {}
    })
  })

  it('scrolls to top when navigating to comanda page', async () => {
    vi.useFakeTimers()
    
    window.location.hash = '#comanda'
    renderHook(() => useHashRoute())
    
    // Fast-forward timers to trigger the setTimeout
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
    
    vi.useRealTimers()
  })

  it('scrolls to top when navigating to thank you page', async () => {
    vi.useFakeTimers()
    
    window.location.hash = '#thank-you'
    renderHook(() => useHashRoute())
    
    // Fast-forward timers to trigger the setTimeout
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
    
    vi.useRealTimers()
  })

  it('does not scroll for home page', async () => {
    vi.useFakeTimers()
    
    window.location.hash = ''
    renderHook(() => useHashRoute())
    
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    expect(mockScrollTo).not.toHaveBeenCalled()
    
    vi.useRealTimers()
  })
})
