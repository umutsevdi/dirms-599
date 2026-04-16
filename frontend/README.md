# Disaster Information And Resource Management System

A comprehensive web-based disaster management dashboard for monitoring, analyzing, and responding to emergency situations using real-time map visualization and data analytics.

## Tech Stack

### Core
- **Vite** - Lightning-fast build tool and development server
- **React 18+** - Component-based UI library with hooks
- **TypeScript** - Static type checking for safer, more maintainable code

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework with `@tailwindcss/vite` plugin
- **DaisyUI** - Component library built on Tailwind CSS (primary UI components)
  - All available DaisyUI components are used: `drawer`, `navbar`, `table`, `modal`, `card`, `btn`, `input`, `tabs`, `badge`, `stats`, `range`, `join`, `dropdown`, `avatar`, `indicator`

### Mapping
- **Leaflet** - Interactive map library
- **React-Leaflet** - React bindings for Leaflet
- **OpenStreetMap** - Free, open-source map tiles

### Data Visualization
- **Recharts** - Composable charting library built on D3

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   └── DisasterMap.tsx      # OpenStreetMap with markers, circles, popups
│   │   ├── Tables/
│   │   │   └── DisasterTable.tsx    # Sortable disaster data table
│   │   ├── Charts/
│   │   │   └── DisasterStats.tsx    # Bar/Pie charts and stat cards
│   │   ├── Dialogs/
│   │   │   └── DisasterDialog.tsx   # Disaster detail modal
│   │   ├── Forms/
│   │   │   ├── AddressSearch.tsx    # Address/location search form
│   │   │   └── RadiusTool.tsx       # Radius drawing tool
│   │   └── Layout/
│   │       └── DashboardLayout.tsx  # Main dashboard layout with sidebar
│   ├── hooks/
│   │   ├── useDebounce.ts           # Debounce hook for search inputs
│   │   └── useGeolocation.ts        # Browser geolocation hook
│   ├── services/                    # API and geocoding services
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── distance.ts              # Haversine distance calculation
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind + DaisyUI imports
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Features

### Map Features
- Interactive OpenStreetMap with pan/zoom
- Custom markers for disasters and resources
- Circle overlays showing affected radius
- Click-to-add location support
- Geolocation integration

### Dashboard
- Responsive sidebar with drawer layout
- Address search with geocoding
- Radius drawing tool with adjustable range
- Tabbed interface for table and chart views
- Real-time disaster data table with severity/status badges
- Statistical charts (bar chart, pie chart) with stat cards
- Detail dialog/modal for disaster information

### Planned Features
- Address to coordinates (geocoding)
- Coordinates to address (reverse geocoding)
- Distance measurement between points
- Arrow indicators for distances
- Resource allocation tracking
- Real-time data updates via WebSockets
- Export reports

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Configuration

### Tailwind + DaisyUI
Tailwind CSS v4 is configured using the Vite plugin (`@tailwindcss/vite`). DaisyUI is loaded as a plugin in `src/index.css`:

```css
@import "tailwindcss";
@plugin "daisyui";
```

### Map Configuration
Default map center is set to Turkey (Ankara) with zoom level 6. This can be configured in the `DisasterMap` component props.

## Design Principles

1. **DaisyUI First** - All UI components use DaisyUI classes without custom styling where DaisyUI provides an equivalent
2. **Type Safety** - Full TypeScript coverage for all props, state, and data structures
3. **Responsive** - Mobile-first design with responsive drawer layout
4. **Accessible** - Semantic HTML and ARIA attributes where applicable
