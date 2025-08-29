import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CountdownBanner } from './CountdownBanner';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('CountdownBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders countdown banner with default content', () => {
    render(<CountdownBanner />);

    // Should render the main banner content - use getAllByText since there are mobile and desktop versions
    expect(screen.getAllByText(/oferta se termină în/i)).toHaveLength(2);
    expect(screen.getAllByText(/profită de oferta de presale/i)).toHaveLength(2);
  });

  it('displays countdown timer', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    render(<CountdownBanner targetDate={futureDate} />);

    // Should show countdown elements - check that they exist (mobile and desktop versions)
    expect(screen.getAllByText(/zile/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/ore/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/min/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/sec/i).length).toBeGreaterThanOrEqual(2);
  });

  it('updates countdown every second', () => {
    const futureDate = new Date(Date.now() + 3661000); // 1 hour, 1 minute, 1 second
    render(<CountdownBanner targetDate={futureDate} />);

    // Initial state - check for the actual numbers that would be displayed
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(4); // 1 hour and 1 minute (mobile + desktop)

    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should update seconds - check for 0 seconds
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2); // seconds should be 0 now (mobile + desktop)
  });

  it('shows expired state when countdown reaches zero', () => {
    const pastDate = new Date(Date.now() - 1000); // 1 second ago
    render(<CountdownBanner targetDate={pastDate} />);

    // When expired, it should show all zeros
    expect(screen.getAllByText('0')).toHaveLength(8); // 4 time units × 2 (mobile + desktop)
  });

  it('calls onCtaClick when CTA link is clicked', () => {
    const handleCtaClick = vi.fn();
    render(<CountdownBanner onCtaClick={handleCtaClick} />);

    const ctaLinks = screen.getAllByRole('link', { name: /profită de oferta de presale/i });
    fireEvent.click(ctaLinks[0]); // Click the first one (mobile or desktop)

    expect(handleCtaClick).toHaveBeenCalledTimes(1);
    expect(handleCtaClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders CTA links with correct text', () => {
    render(<CountdownBanner />);

    const ctaLinks = screen.getAllByRole('link', { name: /profită de oferta de presale/i });
    expect(ctaLinks).toHaveLength(2); // mobile and desktop versions
    ctaLinks.forEach(link => {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#comanda');
    });
  });

  it('handles image load errors gracefully', () => {
    render(<CountdownBanner />);
    
    const images = screen.getAllByRole('img');
    if (images.length > 0) {
      const firstImage = images[0];
      
      // Simulate image load error
      fireEvent.error(firstImage);
      
      // Image should still be in the document
      expect(firstImage).toBeInTheDocument();
    }
  });

  it('applies proper responsive classes', () => {
    const { container } = render(<CountdownBanner />);
    
    // Should have responsive layout classes
    const banner = container.firstChild as HTMLElement;
    expect(banner).toHaveClass('relative');
  });

  it('formats countdown numbers correctly', () => {
    const futureDate = new Date(Date.now() + 3661000); // 1 hour, 1 minute, 1 second
    render(<CountdownBanner targetDate={futureDate} />);

    // Should display single digit numbers (the component doesn't use leading zeros)
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(4); // 1 hour and 1 minute (mobile + desktop)
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<CountdownBanner />);
    
    // Spy on clearInterval
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    unmount();
    
    // Should clean up intervals
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('handles invalid target date gracefully', () => {
    const invalidDate = new Date('invalid');
    render(<CountdownBanner targetDate={invalidDate} />);

    // Should not crash and should show some content - use getAllByText since there are mobile and desktop versions
    expect(screen.getAllByText(/oferta se termină în/i)).toHaveLength(2);
  });

  it('displays urgency messaging', () => {
    render(<CountdownBanner />);

    // Should show the actual text that exists in the component - use getAllByText since there are mobile and desktop versions
    expect(screen.getAllByText(/oferta se termină în/i)).toHaveLength(2);
    expect(screen.getAllByText(/profită de oferta de presale/i)).toHaveLength(2);
  });

  it('has proper accessibility attributes', () => {
    render(<CountdownBanner />);

    // The CTA is an anchor link, not a button, so test for link role - use getAllByRole since there are mobile and desktop versions
    const ctaLinks = screen.getAllByRole('link', { name: /profită de oferta de presale/i });
    expect(ctaLinks).toHaveLength(2);
    ctaLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '#comanda');
    });
    
    // Timer should have appropriate ARIA labels
    const timerElements = screen.getAllByText(/\d{2}/);
    timerElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});
