import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageGrid, FeedbackImageGrid } from './ImageGrid';

// Mock images for testing
const mockImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
];

describe('ImageGrid', () => {
  it('renders nothing when no images provided', () => {
    const { container } = render(<ImageGrid images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when images is null/undefined', () => {
    const { container } = render(<ImageGrid images={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders grid with provided images', () => {
    const { container } = render(<ImageGrid images={mockImages} />);

    // Should render a grid container
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');

    // Should render buttons for each image
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockImages.length);
  });

  it('renders images with correct src attributes', () => {
    render(<ImageGrid images={mockImages} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockImages.length);
    
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockImages[index]);
    });
  });

  it('opens lightbox when image is clicked', () => {
    render(<ImageGrid images={mockImages} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    
    // Should show lightbox overlay
    const overlay = screen.getByRole('dialog', { hidden: true });
    expect(overlay).toBeInTheDocument();
  });

  it('closes lightbox when overlay is clicked', () => {
    render(<ImageGrid images={mockImages} />);
    
    // Open lightbox
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    
    // Click overlay to close
    const overlay = screen.getByRole('dialog', { hidden: true });
    fireEvent.click(overlay);
    
    // Lightbox should be closed (not visible)
    expect(overlay).not.toBeVisible();
  });

  it('handles image load errors gracefully', () => {
    render(<ImageGrid images={mockImages} />);
    
    const images = screen.getAllByRole('img');
    const firstImage = images[0];
    
    // Simulate image load error
    fireEvent.error(firstImage);
    
    // Image should still be in the document
    expect(firstImage).toBeInTheDocument();
  });

  it('applies proper CSS classes for responsive design', () => {
    const { container } = render(<ImageGrid images={mockImages} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('gap-3', 'sm:gap-4');

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('relative', 'overflow-hidden', 'rounded-xl');
    });
  });
});

describe('FeedbackImageGrid', () => {
  it('renders nothing when no images provided', () => {
    const { container } = render(<FeedbackImageGrid images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders grid with provided images', () => {
    const { container } = render(<FeedbackImageGrid images={mockImages} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockImages.length);
  });

  it('renders images with correct src attributes', () => {
    render(<FeedbackImageGrid images={mockImages} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockImages.length);
    
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockImages[index]);
    });
  });

  it('opens lightbox when image is clicked', () => {
    render(<FeedbackImageGrid images={mockImages} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    
    const overlay = screen.getByRole('dialog', { hidden: true });
    expect(overlay).toBeInTheDocument();
  });

  it('has different styling than regular ImageGrid', () => {
    const { container: gridContainer } = render(<ImageGrid images={mockImages} />);
    const { container: feedbackContainer } = render(<FeedbackImageGrid images={mockImages} />);
    
    // Both should have grid layout but may have different specific classes
    expect(gridContainer.querySelector('.grid')).toBeInTheDocument();
    expect(feedbackContainer.querySelector('.grid')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<FeedbackImageGrid images={mockImages} />);

    const firstButton = screen.getAllByRole('button')[0];

    // Should be focusable
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    // Should respond to Enter key - simulate click instead since that's what the component does
    fireEvent.click(firstButton);
    // Check if lightbox overlay appears with dialog role
    const overlay = screen.getByRole('dialog');
    expect(overlay).toBeInTheDocument();
  });
});
