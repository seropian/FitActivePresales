# Icon Sizing & Color Guide

This document outlines the unified icon sizing system and color scheme implemented across the FitActive landing page to ensure visual consistency and proper responsive behavior.

## Icon Color Standard

All icons now use **RAL 2011 Deep Orange** (`#EC7C26`) for consistent branding:
- CSS Variable: `--fa-ral-2011: #EC7C26`
- Usage: `text-[var(--fa-ral-2011)]`

## Icon Size Categories

### 1. Small Inline Icons
**Usage**: Small decorative icons within feature lists, bullet points
**Size**: `w-3 h-3 sm:w-4 sm:h-4`
**Container**: `w-5 h-5 sm:w-6 sm:h-6` (icon containers)

### 2. Medium Icons
**Usage**: CTA buttons, navigation elements, badges
**Size**: `w-4 h-4 sm:w-5 sm:h-5`
**Examples**: Countdown banner icons, badge icons

### 3. Large Icons
**Usage**: Main action buttons, prominent CTAs
**Size**: `w-5 h-5 sm:w-6 sm:h-6`
**Examples**: ChevronRight in main CTA buttons

### 4. Section Header Icons
**Usage**: Large feature section headers, main selling points
**Size**: `w-5 h-5 sm:w-6 sm:h-6`
**Container**: `w-10 h-10 sm:w-12 sm:h-12` (header icon containers)

### 5. Card Icons
**Usage**: Guarantee cards, feature cards
**Size**: `w-5 h-5 sm:w-6 sm:h-6`
**Container**: `w-8 h-8 sm:w-10 sm:h-10` (card icon containers)

## Implementation Examples

### Countdown Banner
```jsx
<Clock className="w-4 h-4 sm:w-5 sm:h-5" />
<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
```

### Feature List Items
```jsx
<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gray-800 text-[var(--fa-ral-2011)] flex items-center justify-center flex-shrink-0 mt-0.5">
  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
</div>
```

### Section Headers
```jsx
<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--fa-ral-2011)]/20 text-[var(--fa-ral-2011)] flex items-center justify-center">
  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
</div>
```

### CTA Buttons
```jsx
<ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
```

### Guarantee Cards
```jsx
<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--fa-ral-2011)]/10 text-[var(--fa-ral-2011)] flex items-center justify-center mb-3">
  <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6" />
</div>
```

### Direct Icon Colors
```jsx
<Clock className="w-5 h-5 text-[var(--fa-ral-2011)]" />
<CheckCircle2 className="w-4 h-4 text-[var(--fa-ral-2011)]" />
```

## Responsive Behavior

All icons follow a consistent responsive pattern:
- **Mobile (default)**: Smaller sizes for better mobile UX
- **Small screens and up (sm:)**: Larger sizes for desktop viewing

## Benefits

1. **Visual Consistency**: All icons scale proportionally across the page
2. **Brand Consistency**: Unified RAL 2011 color creates cohesive visual identity
3. **Responsive Design**: Icons adapt appropriately to different screen sizes
4. **Accessibility**: Proper sizing ensures icons are visible and clickable
5. **Maintainability**: Standardized sizing and colors make future updates easier

## Usage Guidelines

- Always use responsive sizing (`w-X h-X sm:w-Y sm:h-Y`)
- Use RAL 2011 color (`text-[var(--fa-ral-2011)]`) for all icons unless specifically needed otherwise
- Match icon size to its container and context
- Maintain consistent spacing between icons and text
- Use appropriate icon containers for visual hierarchy
- For background colors, use `bg-[var(--fa-ral-2011)]/10` or `bg-[var(--fa-ral-2011)]/20` for subtle backgrounds
