# Color System Documentation

## Strict Color Palette

This dashboard uses ONLY the following predefined colors. No other colors are permitted.

### Primary Colors

- **Sidebar Background**: `#0B1C2C` (Dark Blue)
- **Sidebar Hover**: `#12283D` (Slightly Lighter Dark Blue)

### Accent

- **Primary Accent (Active/Highlight)**: `#F4B400` (Gold)

### Background

- **Main Background**: `#F5F7FA` (Light Gray)
- **Card Background**: `#FFFFFF` (White)

### Text

- **Primary Text**: `#1F2937` (Dark Gray)
- **Secondary Text**: `#6B7280` (Medium Gray)

### Status

- **Success**: `#22C55E` (Green)
- **Border**: `#E5E7EB` (Light Gray Border)

## Usage Rules

| Component | Color | Hex Code |
|-----------|-------|----------|
| Sidebar Background | primary-dark | #0B1C2C |
| Sidebar Active Item | accent-gold | #F4B400 |
| Sidebar Hover | primary-hover | #12283D |
| Page Background | bg-main | #F5F7FA |
| Cards | bg-card | #FFFFFF |
| Card Border | border | #E5E7EB |
| Card Title/Headers | text-primary | #1F2937 |
| Secondary Text/Labels | text-secondary | #6B7280 |
| Primary Buttons | accent | #F4B400 |
| Success Buttons | success | #22C55E |
| Status Indicators | success | #22C55E |

## Implementation

### Tailwind Configuration
```typescript
colors: {
  primary: {
    DEFAULT: "#0B1C2C",
    hover: "#12283D",
  },
  accent: "#F4B400",
  background: "#F5F7FA",
  "bg-main": "#F5F7FA",
  "bg-card": "#FFFFFF",
  card: "#FFFFFF",
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
  },
  success: "#22C55E",
  border: "#E5E7EB",
}
```

### CSS Variables in Globals
```css
body {
  background: #F5F7FA;
  color: #1F2937;
}

input, textarea, select {
  border-color: #E5E7EB;
}

input:focus, textarea:focus, select:focus {
  border-color: #F4B400;
}
```

## Components Using Color System

1. **Sidebar** - Uses primary-dark background, accent-gold for active items, primary-hover for hover state
2. **Header** - Uses bg-card background with text-primary for text
3. **Cards** - Uses bg-card background with subtle border and shadow
4. **Buttons** - Primary buttons use accent-gold, success buttons use success green
5. **Inputs** - White background with border, gold focus state
6. **Tables** - Alternating bg-main and bg-card rows with text-primary/secondary

## Arabic RTL Support

All components are RTL-ready with `dir="rtl"` attribute on the HTML element.

---

**Last Updated**: April 12, 2026
**Strict Compliance**: All colors must match exactly. No Tailwind defaults or custom colors allowed.
