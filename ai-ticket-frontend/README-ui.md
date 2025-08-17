# TicketAI Frontend - Modern UI

A modern, accessible React frontend for the AI-powered ticket management system.

## 🎨 Design System

The application uses a comprehensive design system built with CSS variables for consistent theming:

- **Colors**: Primary (#5B7CFA), semantic colors (success, warning, danger, info)
- **Typography**: System font stack with consistent sizing scale
- **Spacing**: 8px-based spacing system
- **Components**: Reusable UI components with consistent styling

## 📁 Project Structure

```
src/
├── ui/                 # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Badge.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Table.jsx
│   ├── Toast.jsx
│   ├── Skeleton.jsx
│   ├── Tabs.jsx
│   └── Empty.jsx
├── layout/             # App shell components
│   ├── AppShell.jsx
│   ├── SidebarNav.jsx
│   └── Topbar.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── TicketsList.jsx
│   ├── TicketDetail.jsx
│   ├── Admin.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── lib/                # Utilities and API
│   ├── api.js
│   └── formatters.js
├── styles/             # Global styles
│   └── theme.css
└── components/         # Shared components
    └── check-auth.jsx
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file with:
   ```
   VITE_SERVER_URL=http://localhost:3000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌟 Features

### App Shell
- **Left Sidebar**: Navigation with Dashboard, Tickets, Admin (role-based), and Profile
- **Top Bar**: Global search, theme toggle, and user menu
- **Responsive**: Mobile-friendly with collapsible sidebar

### Dashboard
- **KPI Cards**: Open tickets, high priority, average response time, breach risk
- **Live Activity Feed**: Real-time updates (toggleable)
- **Visual Indicators**: Live status with pulsing dot

### Tickets Management
- **Advanced Filtering**: Search, priority, status, assignee filters
- **Bulk Actions**: Multi-select with bulk operations
- **Responsive Table**: Sticky headers, mobile-optimized
- **Quick Actions**: Status changes, assignments

### Ticket Detail
- **Two-Column Layout**: Main content and AI insights sidebar
- **AI Insights Panel**: 
  - Category and confidence badges
  - Required skills chips
  - Assignment rationale with icon
  - Re-run AI analysis button
- **Activity Timeline**: Visual timeline of ticket events
- **Tabbed Interface**: Details, Activity, Comments

### Admin Panel
- **User Management**: View, edit roles and skills
- **Search & Filter**: Find users quickly
- **Inline Editing**: Modal-based user updates
- **Role-Based Access**: Admin-only features

### Profile Settings
- **Account Info**: Display name, email (read-only)
- **Theme Selection**: Light, Dark, System preference
- **Notification Preferences**: Email, ticket updates, assignments
- **Account Stats**: Usage statistics

## 🎨 Theming

### Theme Toggle
The app supports light and dark themes with system preference detection:

```javascript
// Toggle theme
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

### CSS Variables
All colors and spacing use CSS variables for easy theming:

```css
:root {
  --primary: #5B7CFA;
  --bg: #ffffff;
  --text: #1e293b;
  --space-4: 1rem;
  /* ... */
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #f1f5f9;
  /* ... */
}
```

## 🔧 API Integration

### Centralized API Client
All API calls go through `src/lib/api.js`:

```javascript
import { tickets, users, auth } from '../lib/api';

// Usage
const ticketList = await tickets.getAll({ priority: 'high' });
const user = await users.update({ email, role, skills });
```

### Error Handling
- Toast notifications for success/error states
- Graceful fallbacks for missing data
- Loading skeletons during API calls

## 🎯 AI Features

### Visual AI Indicators
- **Confidence Badges**: Color-coded confidence levels
- **Processing States**: "Analyzing...", "Assigning...", "Notified"
- **Rationale Display**: Why AI made specific assignments
- **Re-analysis**: Manual AI re-run capability

### Smart Assignments
- Skill-based moderator matching
- Fallback to admin assignment
- Visual assignment rationale

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus states and trapping
- **ARIA Labels**: Screen reader support
- **Color Contrast**: WCAG AA compliant
- **Semantic HTML**: Proper heading hierarchy

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 640px, 768px, 1024px
- **Flexible Layouts**: Grid and flexbox layouts
- **Touch-Friendly**: Appropriate touch targets

## 🔄 State Management

### Local State
- React hooks for component state
- Toast notifications via context
- Theme persistence in localStorage

### Optimistic Updates
- Immediate UI updates with rollback on error
- Smooth user experience
- Error recovery

## 🧪 Demo Features

### Mock Data
- Placeholder content for empty states
- Simulated AI processing delays
- Demo statistics and metrics

### Live Updates
- Polling for dashboard updates (15s intervals)
- Toggleable live feed
- Visual indicators for real-time data

## 🚀 Performance

- **Code Splitting**: Route-based splitting ready
- **Lazy Loading**: Component lazy loading
- **Optimized Renders**: Minimal re-renders
- **Small Bundle**: No heavy UI libraries

## 🔮 Future Enhancements

- **WebSocket Integration**: Real-time updates
- **Advanced Search**: Full-text search with highlighting
- **Bulk Operations**: Enhanced bulk actions
- **Drag & Drop**: Ticket prioritization
- **Charts**: Data visualization components

---

The frontend is designed to be maintainable, accessible, and scalable while providing a premium user experience that showcases the AI capabilities of the ticket management system.