# Design System Usage Guide

This project uses a unified design system that works with both **Tailwind CSS** and **Material-UI**.

## Color Tokens

All colors are defined in `src/styles/colors.ts` as the single source of truth.

### Using with Tailwind CSS

Use the predefined Tailwind classes:

```tsx
<div className="bg-primary text-text-on-primary">
  Primary background with contrasting text
</div>

<button className="bg-accent hover:bg-accent-dark">
  Accent Button
</button>
```

### Using with Material-UI

#### Option 1: Use theme colors (recommended)
```tsx
<Button color="primary">Primary Button</Button>
<Button color="secondary">Secondary Button</Button>
<Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
  Themed Box
</Box>
```

#### Option 2: Import colors directly
```tsx
import { colors } from '@/styles/colors';

<Box sx={{ backgroundColor: colors.primary.main }}>
  Direct color usage
</Box>
```

#### Option 3: Use CSS variables (for custom components)
```tsx
<Box sx={{ backgroundColor: 'var(--color-primary)' }}>
  CSS variable usage
</Box>
```

## Common Patterns

### Buttons
```tsx
// Tailwind
<button className="bg-button-positive hover:bg-button-positive-hover border border-button-positive-border rounded-md">
  Tailwind Button
</button>

// MUI
<Button variant="contained" color="secondary">
  MUI Button
</Button>
```

### Cards
```tsx
// Tailwind
<div className="bg-card border border-card-border rounded-lg p-4">
  Card content
</div>

// MUI
<Card sx={{ bgcolor: colors.card.main }}>
  <CardContent>Card content</CardContent>
</Card>
```

### Text Colors
```tsx
// Tailwind
<p className="text-text-primary">Primary text</p>
<p className="text-text-secondary">Secondary text</p>

// MUI
<Typography color="text.primary">Primary text</Typography>
<Typography color="text.secondary">Secondary text</Typography>
```

## Spacing & Layout

Use consistent spacing across both systems:

```tsx
// Tailwind (using standard spacing scale)
<div className="p-4 m-2 gap-4">

// MUI (uses theme.spacing, where spacing(1) = 8px)
<Box sx={{ p: 2, m: 1, gap: 2 }}>
```

## Border Radius

```tsx
// Tailwind
<div className="rounded-md">  {/* 0.5rem */}
<div className="rounded-lg">  {/* 0.75rem */}
<div className="rounded-full"> {/* 999px */}

// MUI (inherits from theme.shape.borderRadius = 8px)
<Box sx={{ borderRadius: 1 }}>  {/* theme borderRadius */}
<Box sx={{ borderRadius: 'var(--radius-md)' }}>  {/* CSS variable */}
```

## Best Practices

1. **Prefer theme colors in MUI**: Use `color="primary"` instead of hardcoded colors
2. **Use Tailwind classes for utility**: Quick layouts and spacing
3. **Keep colors in sync**: All changes should be made in `src/styles/colors.ts`
4. **Use semantic names**: `bg-primary` instead of `bg-[#606c38]`
5. **Combine both systems**: Use Tailwind for layout, MUI for components
