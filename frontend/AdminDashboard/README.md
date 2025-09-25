# Sports Platform Admin Dashboard

A comprehensive web-based admin dashboard for managing and analyzing all aspects of the sports platform. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 Secure admin authentication
- 📊 Analytics and data visualization
- 👥 User management and moderation
- 🎥 Video content management
- 🏃‍♂️ Sport-based filtering and organization
- 📱 Responsive design with minimal, classy UI
- 📈 Real-time system monitoring
- 📋 Data export and reporting

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Charts**: Recharts
- **UI Components**: Headless UI + Custom components
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   └── charts/         # Chart components
├── pages/              # Page components
├── services/           # API services
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Theme and styling
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the admin dashboard directory:
   ```bash
   cd frontend/AdminDashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API base URL

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design System

The dashboard follows a minimal, classy design philosophy with:

- Clean typography using Inter font
- Subtle color palette with primary blue tones
- Consistent spacing and border radius
- Soft shadows and smooth transitions
- Responsive breakpoints for all devices

## API Integration

The dashboard connects to the existing FastAPI backend with extended admin endpoints:

- Authentication and authorization
- User management operations
- Analytics data retrieval
- Content moderation tools
- System monitoring metrics

## Contributing

1. Follow the established folder structure
2. Use TypeScript for all new files
3. Follow the design system guidelines
4. Write meaningful commit messages
5. Test your changes thoroughly

## License

This project is part of the sports platform and follows the same licensing terms.