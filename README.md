# Personal Link Hub
A modern link management platform that allows users to create and share a personalized page with multiple links, similar to Linktree.
Live Demo: https://personal-link-hub-drab.vercel.app/dashboard

## Summary of Implemented Features

The Personal Link Hub includes the following features:

- **Authentication System**
  - Complete user registration and login flows using email (/signup and /signin routes)
  - Secure session management with NextAuth
  - Logout functionality

- **Dashboard Interface (/dashboard)**
  - Protected route requiring authentication
  - Page customization capabilities:
    - Custom title and description
    - Profile image upload and management
    - Custom URL based on username

- **Link Management**
  - Create, edit, and delete links
  - Enable/disable links without deletion (active status toggle)
  - Thumbnail image support for each link
  - Drag-and-drop reordering using Hello Pangea DND

- **Public Page View**
  - Accessible via /:username route
  - Responsive design for all device sizes
  - Displays all active links in the user-defined order

- **Responsive Design**
  - Mobile-friendly interface
  - Adaptive layouts for different screen sizes

- **Sidebar Navigation**
  - Pre-configured for future feature expansion

## Scope Decisions and Key Trade-offs

### Technology Stack

- **Next.js Framework**
  - Utilized for full-stack capabilities (frontend + API routes)
  - Provides server-side rendering for improved SEO and performance
  - Built-in routing system simplified navigation implementation
  - Used Turbopack for faster development experience

- **Authentication & Data Management**
  - NextAuth for secure authentication flows
  - React Query for data fetching, caching, and state management
    - Improved user experience with optimistic updates
    - Reduced API calls with intelligent caching
  - Initially planned to use Zustand for global state but prioritized other features due to time constraints

- **Backend & Storage**
  - Supabase for database and storage
    - Relational tables for profiles and links
    - Two storage buckets: one for user profile images, another for link thumbnails
  - Custom API routes built with Next.js API Routes

- **Code Quality Tools**
  - Lefthook for git hooks and automation
  - Biome for linting and formatting
  - Jest configured for testing
  - TypeScript for type safety across the application

### Design Decisions

- Custom-built components rather than using a UI library to demonstrate frontend skills
- API routes created from scratch to show backend development capabilities
- Focus on core functionality first with architecture designed for future expansion
- Responsive design as a priority from the beginning

### Data Structure

- Supabase tables:
  - `profiles`: Stores user information, page title, description, and customization settings
  - `links`: Contains all link data with references to user profiles
- Separate storage buckets to organize and manage different types of uploaded images

## Setup and Run Instructions

### Prerequisites

- Node.js version as specified in `.nvmrc` (recommended to use nvm for version management)
- Supabase account for database and storage

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string
```

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Use the correct Node.js version:
   ```bash
   nvm use
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
npm run build
npm run start
```

### Testing

```bash
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

## Project Structure

```
/src
  /app                  # Next.js app router
    /(auth)             # Authentication routes
      /signin           # Login page
      /signup           # Registration page
    /dashboard          # Protected dashboard pages
    /[username]         # Public profile page
    /api                # API routes
      /auth             # Authentication endpoints
      /links            # Link management endpoints
      /profiles         # Profile management endpoints
      /upload           # Image upload handling
  /components           # Reusable React components
    /ui                 # Basic UI components
    /forms              # Form components
    /dashboard          # Dashboard-specific components
    /profile            # Profile page components
  /hooks                # Custom React hooks
  /lib                  # Utility functions and config
    /supabase           # Supabase client config
    /auth               # Authentication helpers
  /types                # TypeScript type definitions
  /styles               # Global styles
```

## Dependencies

```json
{
  "dependencies": {
    "@hello-pangea/dnd": "^18.0.1",
    "@supabase/supabase-js": "^2.49.4",
    "@tanstack/react-query": "^5.75.5",
    "@tanstack/react-query-devtools": "^5.75.5",
    "next": "15.3.1",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "uuid": "^11.1.0",
    "zustand": "^5.0.4"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@commitlint/cli": "^19.8.0",
    "@commitlint/config-conventional": "^19.8.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^29.5.14",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/testing-library__react": "^10.2.0",
    "@types/uuid": "^10.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "lefthook": "^1.11.12",
    "typescript": "^5"
  }
}
```

## Screenshots

### Sign In Page (/signin)
![Sign In Page](/images/signin.png.png)
*User authentication screen with email and password login.*

### Sign Up Page (/signup)
![Sign Up Page](/images/signup.png)
*Registration page for new users with form validation.*

### Dashboard (/dashboard)
![Dashboard Page](/images/dashboard.png)
*Main control panel where users can manage their profile and links.*

### Public Profile Page (/:username)
![Public Profile Page](/images/username.png)
*Example of a published profile page that visitors see when accessing a user's links.*