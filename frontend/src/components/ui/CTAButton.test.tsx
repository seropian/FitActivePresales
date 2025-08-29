import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CTAButton } from './CTAButton';

describe('CTAButton', () => {
  it('renders with default props', () => {
    render(<CTAButton>Test Button</CTAButton>);
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('renders with custom className', () => {
    render(<CTAButton className="custom-class">Test Button</CTAButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<CTAButton size="small">Small Button</CTAButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<CTAButton size="medium">Medium Button</CTAButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-5', 'py-3', 'text-base');

    rerender(<CTAButton size="large">Large Button</CTAButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-4', 'text-lg');
  });

  it('applies full width when specified', () => {
    render(<CTAButton width="full">Full Width Button</CTAButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CTAButton onClick={handleClick}>Clickable Button</CTAButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders children content correctly', () => {
    render(
      <CTAButton>
        <span>Custom Content</span>
      </CTAButton>
    );
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('includes ChevronRight icon', () => {
    render(<CTAButton>Button with Icon</CTAButton>);
    
    // The ChevronRight icon should be present
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CTAButton>Accessible Button</CTAButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies hover and transition classes', () => {
    render(<CTAButton>Hover Button</CTAButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-[var(--fa-orange-600)]', 'transition-colors');
  });

  it('handles complex children content', () => {
    render(
      <CTAButton>
        <div>
          <span>Line 1</span>
          <br />
          <span>Line 2</span>
        </div>
      </CTAButton>
    );
    
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });
});
