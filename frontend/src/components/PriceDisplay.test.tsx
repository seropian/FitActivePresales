import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceDisplay, PriceSummary } from './PriceDisplay'

describe('PriceDisplay', () => {
  const defaultProps = {
    salePrice: 1448.80,
    fullPrice: 3098.80
  }

  it('renders sale price correctly', () => {
    render(<PriceDisplay {...defaultProps} />)
    
    expect(screen.getByText(/1[.,]448[.,]80/)).toBeInTheDocument()
    expect(screen.getByText('lei')).toBeInTheDocument()
  })

  it('renders full price with strikethrough', () => {
    render(<PriceDisplay {...defaultProps} />)
    
    const fullPriceElement = screen.getByText(/3[.,]098[.,]80 lei/)
    expect(fullPriceElement.closest('s')).toBeInTheDocument()
  })

  it('calculates and displays discount percentage correctly', () => {
    render(<PriceDisplay {...defaultProps} />)
    
    // Discount should be 53% (1 - 1448.80/3098.80 = 0.532...)
    expect(screen.getByText('-53%')).toBeInTheDocument()
  })

  it('calculates and displays savings correctly', () => {
    render(<PriceDisplay {...defaultProps} />)
    
    // Savings should be 3098.80 - 1448.80 = 1650.00
    expect(screen.getByText(/Economisești 1[.,]650[.,]00 lei/)).toBeInTheDocument()
  })

  it('hides discount when showDiscount is false', () => {
    render(<PriceDisplay {...defaultProps} showDiscount={false} />)
    
    expect(screen.queryByText('-53%')).not.toBeInTheDocument()
  })

  it('hides savings when showSavings is false', () => {
    render(<PriceDisplay {...defaultProps} showSavings={false} />)
    
    expect(screen.queryByText(/Economisești/)).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<PriceDisplay {...defaultProps} size="small" />)
    
    let priceElement = screen.getByText(/1[.,]448[.,]80/)
    expect(priceElement).toHaveClass('text-2xl')
    
    rerender(<PriceDisplay {...defaultProps} size="medium" />)
    priceElement = screen.getByText(/1[.,]448[.,]80/)
    expect(priceElement).toHaveClass('text-3xl')
    
    rerender(<PriceDisplay {...defaultProps} size="large" />)
    priceElement = screen.getByText(/1[.,]448[.,]80/)
    expect(priceElement).toHaveClass('text-5xl')
  })

  it('applies correct alignment classes', () => {
    const { rerender } = render(<PriceDisplay {...defaultProps} alignment="left" />)

    // The alignment classes are applied to the outermost div
    let container = screen.getByText('Preț promoție').parentElement
    expect(container).toHaveClass('justify-start')

    rerender(<PriceDisplay {...defaultProps} alignment="center" />)
    container = screen.getByText('Preț promoție').parentElement
    expect(container).toHaveClass('justify-center')

    rerender(<PriceDisplay {...defaultProps} alignment="right" />)
    container = screen.getByText('Preț promoție').parentElement
    expect(container).toHaveClass('justify-end')
  })
})

describe('PriceSummary', () => {
  const defaultProps = {
    salePrice: 1448.80,
    fullPrice: 3098.80
  }

  it('renders all price summary elements', () => {
    render(<PriceSummary {...defaultProps} />)
    
    expect(screen.getByText('Abonament All Inclusive')).toBeInTheDocument()
    expect(screen.getByText('Preț întreg')).toBeInTheDocument()
    expect(screen.getByText('Reducere')).toBeInTheDocument()
    expect(screen.getByText('Economisești')).toBeInTheDocument()
  })

  it('displays correct values in summary', () => {
    render(<PriceSummary {...defaultProps} />)
    
    expect(screen.getByText(/1[.,]448[.,]80 lei/)).toBeInTheDocument()
    expect(screen.getByText(/3[.,]098[.,]80 lei/)).toBeInTheDocument()
    expect(screen.getByText('-53%')).toBeInTheDocument()
    expect(screen.getByText(/1[.,]650[.,]00 lei/)).toBeInTheDocument()
  })

  it('applies strikethrough to full price', () => {
    render(<PriceSummary {...defaultProps} />)
    
    const fullPriceElements = screen.getAllByText(/3[.,]098[.,]80 lei/)
    const summaryFullPrice = fullPriceElements.find(el => el.closest('s'))
    expect(summaryFullPrice).toBeInTheDocument()
  })
})
