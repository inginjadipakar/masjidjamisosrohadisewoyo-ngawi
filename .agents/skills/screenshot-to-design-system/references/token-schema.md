# 📐 Panduan Skema Token & Inventaris Komponen (Rian Pratama)

## 1. Skema Token Standar (`tokens.json` & `tokens.css`)

```css
:root {
  /* Primitive Colors */
  --color-primary-50:  #...;
  --color-primary-500: #...;
  --color-primary-900: #...;
  
  /* Semantic Tokens */
  --color-bg-base:     #ffffff;
  --color-bg-surface:  #f8fafc;
  --color-text-main:   #0f172a;
  --color-text-muted:  #64748b;
  --color-accent:      #...;
  
  /* Spacing Scale (4px/8px basis) */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  --space-12: 3rem;   /* 48px */
  --space-16: 4rem;   /* 64px */

  /* Radius Scale */
  --radius-sm: 0.25rem; /* 4px */
  --radius-md: 0.5rem;  /* 8px */
  --radius-lg: 0.75rem; /* 12px */
  --radius-full: 9999px;

  /* Shadows (Elevations) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

## 2. Checklist 24 Kategori Komponen UI
1. **Button**: Primary, Secondary, Ghost, Destructive, Icon-only
2. **Input**: Text, Email, Password, Number, Search
3. **Select / Dropdown**: Simple select, Multi-select, Option group
4. **Checkbox**: Unchecked, Checked, Indeterminate, Disabled
5. **Radio Button**: Unchecked, Checked, Radio group
6. **Switch / Toggle**: Off, On, Loading, Disabled
7. **Slider / Range**: Single track, Dual range, Tooltip value
8. **Badge / Tag / Pill**: Neutral, Primary, Success, Warning, Error
9. **Avatar**: Single, Initials, Image, Group stack
10. **Card**: Basic container, Interactive card, Media card, Metric card
11. **Accordion / Collapse**: Single expand, Multi expand
12. **Tabs**: Underline style, Pill style, Segmented control
13. **Breadcrumbs**: Simple slash, Icon separator, Collapsed dots
14. **Pagination**: Numbered pages, Prev/Next, Compact mobile
15. **Modal / Dialog**: Center alert, Confirmation, Form dialog
16. **Drawer / Sheet**: Slide from right, Slide from bottom
17. **Toast / Notification**: Floating banner, Top-right snackbar
18. **Tooltip**: Top, Bottom, Left, Right popover
19. **Table**: Simple rows, Zebra stripes, Sortable headers
20. **List**: Simple text list, Rich meta list, Actionable list
21. **Progress Bar**: Linear indicator, Circular gauge, Stepper
22. **Skeleton / Loader**: Card skeleton, Text lines, Spinner
23. **Divider**: Horizontal separator, Vertical pipe, Text divider
24. **Navigation Bar**: Desktop topbar, Mobile bottom nav, Sidebar
