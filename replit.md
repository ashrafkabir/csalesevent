# Intelligent Sales Tower

## Overview

This is a comprehensive AI-powered sales intelligence platform built for retail organizations to monitor and manage sales operations. The system provides advanced data visualization, predictive analytics, dependency mapping, and AI-powered insights with full source attribution for retail sales teams.

The application follows a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database using Drizzle ORM for type-safe database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Framework**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with custom dashboard theme
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware
- **Development**: Hot reload with Vite integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe queries
- **Schema**: Centralized schema definitions in `/shared`
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Data Models
The system manages several core entities:
- **Sales Events**: Campaign configuration and tracking
- **Sales Metrics**: Real-time performance data
- **Products**: Inventory items with SKU management
- **Stores**: Physical and regional location data
- **Incidents**: System health and operational issues
- **System Components**: Infrastructure monitoring

### Frontend Components
- **Dashboard**: Real-time metrics and performance visualization
- **Event Planning**: Sales event configuration and signal management
- **Event Management**: Active event monitoring and operations
- **Service Operations**: Incident management and system health

### UI Component System
Built on Radix UI primitives with consistent theming:
- Custom dark theme optimized for operations centers
- Responsive design with mobile considerations
- Accessible components following ARIA standards
- Real-time data indicators for different data types

## Data Flow

### Real-time Updates
- Frontend polls backend APIs every 10-30 seconds for live data
- React Query manages caching and background refetching
- Custom hooks provide real-time data patterns
- Data indicators show freshness (processed, real-time, AI-generated)

### API Communication
- RESTful endpoints for CRUD operations
- JSON payload validation using Zod schemas
- Error responses with consistent structure
- Request/response logging for debugging

### State Management
- Server state managed by React Query
- Local UI state managed by React hooks
- Form state handled by React Hook Form with Zod validation
- No global client state store needed

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Data visualization components
- **lucide-react**: Icon system

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution for server

## Deployment Strategy

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend compiled with esbuild to `dist/index.js`
3. Static assets served by Express in production
4. Environment-specific configuration

### Environment Configuration
- **Development**: Vite dev server with HMR
- **Production**: Express serves static files
- **Database**: Environment-based connection strings
- **Replit Integration**: Special handling for Replit environment

### Database Management
- Schema migrations using Drizzle Kit
- Environment-based database URL configuration
- Connection pooling for production scaling

## Recent Changes
- July 05, 2025: Extended database schema for complete war room data-driven architecture - added warRoomParticipants and incidentResolutionPaths tables to PostgreSQL with proper incident escalation tracking, AI/human participant management, and resolution path analytics
- July 05, 2025: Made all pages completely data-driven by connecting to backend APIs - replaced hardcoded values in LiveTickers, Customer Behavior, Aggregated Sales, Inventory Position, Top Products, and Regional Performance components with real-time data
- July 05, 2025: Enhanced customer satisfaction metrics with comprehensive analytics - added detailed satisfaction breakdown by category, NPS score, star ratings, recent customer feedback, and improved visibility
- July 05, 2025: Fixed missing Customer Satisfaction metric in Event Management Operations - added visible display in Customer Behavior tile showing 4.7/5 rating with trend indicator
- July 05, 2025: Fixed incident management modal themes - converted Incident Analytics, Impact Analysis, and Escalation Tracking modals to white background with proper color scheme (#1b244d text, #d63426 accents)
- July 05, 2025: Fixed visualization switching issue - graphs now properly clear and redraw when switching between modes instead of overlaying
- July 05, 2025: Enhanced field click behavior in hierarchical visualization - clicking individual fields now shows modal with all fields from that data source for better user experience
- July 05, 2025: Fixed data source disappearing issue in hierarchical visualization - improved field click handling and added sourceKey property to source nodes to maintain expansion state
- July 05, 2025: Fixed hierarchical visualization in Signal Graph - added missing click handlers for expand/collapse functionality to preserve labels and fields when nodes are expanded
- July 05, 2025: Fixed AI-Powered Buying Trends tile dark backgrounds - converted Social Mentions, Store Visitors, and AI Prediction sections to light theme
- July 05, 2025: Fixed remaining black background tiles in Event Management page (Top Performers, AI Insights Summary, and Inventory Position metrics)
- July 05, 2025: Changed "View Dependencies" button to "Signal Graph" in Planning page for clearer navigation
- July 05, 2025: Updated terminology from "Signal Bundle Configuration" to "Data Signals Configuration" throughout Planning page
- July 05, 2025: Replaced robot emoji indicators with purple AI visual indicators throughout the application
- July 05, 2025: Fixed System Status component to display functional data with mock system components
- July 05, 2025: Completed comprehensive theme conversion to white background with Rubik font
- July 05, 2025: Fixed all dark background tiles across Event Management, Planning, and Service Operations pages
- July 05, 2025: Updated color scheme throughout application - #1b244d for primary text, #d63426 for accent colors
- July 05, 2025: Converted all gray-700/gray-800 backgrounds to gray-50 with proper borders for consistency
- July 05, 2025: Enhanced text contrast and visibility across all dashboard components and tiles
- July 03, 2025: Rebranded to "Intelligent Sales Tower" with AI-powered sales intelligence focus
- July 03, 2025: Restructured layout with header-first navigation and sidebar underneath top bar
- July 03, 2025: Moved AI ticker directly below key metrics bar for prominent visibility
- July 03, 2025: Added source attribution to all AI-summarized data points with confidence scores
- July 03, 2025: Enhanced D3.js integration for sophisticated tree and force-directed visualizations

## Architecture Updates
- **Layout Structure**: Changed from sidebar-first to header-first layout pattern
- **AI Integration**: Enhanced AI insights with scrolling ticker, source attribution, and confidence metrics
- **Data Visualization**: Integrated D3.js library for advanced graph visualizations and animations
- **Typography**: Professional font stack matching enterprise dashboard standards
- **Navigation**: Sidebar positioned below header for improved screen space utilization

## User Preferences

Preferred communication style: Simple, everyday language.
Application branding: "Intelligent Sales Tower" - AI-powered sales intelligence platform
UI Layout: Header-first with sidebar underneath, AI ticker below metrics bar
Theme: White background theme with Rubik font family
Typography: font-family: Rubik, sans-serif; font-weight: 400; font-size: 1rem; line-height: 1.5
Color scheme: #1b244d for primary text, #d63426 for emphasis/accent colors, white background
Data Attribution: All AI insights must include data sources and confidence scores