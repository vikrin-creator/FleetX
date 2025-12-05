# FleetX Frontend

React-based frontend application for FleetX fleet management system.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components/` - React components
  - `common/` - Reusable UI components
  - `layout/` - Layout structure (Header, Footer, Layout)
- `src/pages/` - Page components for routing
- `src/services/` - API integration services
- `src/hooks/` - Custom React hooks
- `src/utils/` - Helper functions
- `src/context/` - React context providers
- `src/assets/` - Static assets (images, icons)
- `src/styles/` - Global CSS and Tailwind styles

## Development

The app uses Vite for fast development and building. All changes will hot-reload automatically.

## Building

```bash
npm run build
```

Build output will be in the `dist/` directory.
