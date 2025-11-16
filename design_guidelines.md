# Smart Calendar Website - Design Guidelines

## Design Approach
**System-Based with Productivity Focus**: Drawing from Linear's clean aesthetics, Notion's organizational clarity, and Google Calendar's functional time management patterns. This is a utility-focused application where efficiency and clarity are paramount.

## Color System
**Custom Earth-Tone Palette** (User-Specified):
- Primary: #414A37 (Dark Olive) - Sidebar, headers, primary actions
- Secondary: #99744A (Warm Brown) - Accents, secondary actions, hover states
- Background: #DBC2A6 (Warm Beige) - Main backgrounds, surfaces, cards
- Neutral additions: White (#FFFFFF) for maximum contrast areas, Dark gray (#1A1A1A) for text

Color application:
- Sidebar navigation: #414A37 background
- Main content area: #DBC2A6 base
- Cards/Panels: White with subtle shadows
- Active/Selected states: #99744A
- Primary buttons: #414A37, hover: #99744A
- Time blocks in calendar: Variations of the three main colors with opacity adjustments

## Typography
**System**: 
- Primary: 'Inter' (Google Fonts) - Modern, readable, excellent for UI
- Monospace: 'JetBrains Mono' (Google Fonts) - For time displays and calendar grids

**Hierarchy**:
- Headings: 24-32px, semibold (600)
- Subheadings: 18-20px, medium (500)
- Body: 14-16px, regular (400)
- Captions/Labels: 12-13px, medium (500)
- Time displays: Monospace, 14-16px

## Layout System
**Spacing Units**: Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistency
- Tight spacing: p-1, gap-2 (within components)
- Standard spacing: p-4, gap-4 (between elements)
- Section spacing: p-6, p-8 (content areas)
- Large spacing: p-12, p-16 (major sections)

**Grid Structure**:
- Sidebar: Fixed 280px width (hidden on mobile)
- Main content: flex-1 with max-w-7xl container
- Calendar grid: 7-column layout for week view
- Time slots: Hourly divisions with 60px height per hour

## Component Library

### Authentication (Login Page)
- Centered card (max-w-md) on solid background
- Logo/Brand at top
- Replit Auth integration with social login buttons
- Clean, minimal form fields
- Single-column layout
- No hero imagery - pure functional design

### Navigation Structure
**Sidebar** (persistent, left-aligned):
- Logo/Brand top
- Navigation items: Profile, Settings, Weekly To-Do, Inbox, AI Assistant
- Icons from Heroicons (outline style)
- Active state: #99744A background, rounded corners
- Collapsed state on mobile (hamburger menu)

### Dashboard Layout
**Three-column responsive grid** for main views:
- Left sidebar: Navigation (280px)
- Main content: Calendar/Active view (flex-1)
- Right panel: Quick actions/Inbox preview (320px, collapsible)

### Calendar Interface
**Time Blocking View**:
- Hour grid with 30-minute subdivisions
- Drag-and-drop task blocks (rounded corners, colored by category)
- Current time indicator (red line)
- Multi-day view: 7-column grid for week
- Day headers with dates
- All-day events row at top

**Task Blocks**:
- Rounded (rounded-lg)
- Semi-transparent backgrounds using color palette
- Title + time duration visible
- Border-left accent (4px) for priority/category
- Subtle shadow on hover
- Resize handles for duration adjustment

### Task Management
**Weekly To-Do View**:
- Kanban-style columns (To Do, In Progress, Done)
- Card-based tasks with checkboxes
- Priority indicators (colored dots)
- Time estimates displayed
- Drag-and-drop between columns and to calendar

**Inbox**:
- List view with newest first
- Quick capture input at top (always visible)
- Each item: title, optional notes, quick actions (schedule, delete)
- "Smart Schedule" button using AI

### AI Assistant Panel
- Chat-like interface
- Fixed bottom input field
- Suggestions cards for scheduling
- Natural language task parsing
- "Optimize my week" action button

### Forms & Inputs
- Outlined style with #99744A focus border
- Labels above inputs
- Placeholder text: muted dark gray
- Error states: red-500 with icon
- Success states: green-500 with icon

### Buttons
- Primary: bg-[#414A37], hover:bg-[#99744A], rounded-lg, px-6 py-3
- Secondary: border-2 border-[#414A37], hover:bg-[#414A37]/10
- Icon buttons: p-2, rounded-md, hover background
- Disabled: opacity-50, cursor-not-allowed

### Cards & Panels
- White backgrounds on #DBC2A6 base
- Subtle shadow: shadow-sm
- Rounded corners: rounded-xl
- Padding: p-6
- Border: Optional 1px border in light gray

### Profile & Settings
- Two-column layout on desktop, stacked on mobile
- Profile: Avatar (large, rounded-full), name, email, stats
- Settings: Grouped sections with clear headings
- Toggle switches for preferences
- Save button: sticky bottom-right

## Responsive Behavior
- Desktop (lg+): Full three-column layout
- Tablet (md): Sidebar collapsible, right panel hidden
- Mobile: Hamburger menu, single column, bottom navigation tabs

## Animations
**Minimal & Purposeful**:
- Sidebar slide: 200ms ease
- Task drag preview: subtle scale (1.02)
- Hover states: 150ms transitions on background/border
- NO page transitions
- NO scroll animations
- Focus on instant feedback

## Icons
**Heroicons (outline)**: Via CDN
- Navigation: home, calendar, inbox, cog, user, sparkles (AI)
- Actions: plus, trash, edit, check, clock
- Consistent 20px size for nav, 16px for inline

## Data Visualization
- Week overview: Bar chart showing hours allocated
- Productivity metrics: Simple cards with numbers
- Color-coded categories using palette variations

This design prioritizes **functional clarity** and **efficient workflows** for serious productivity users while maintaining a warm, approachable aesthetic through the earth-tone palette.