# AGENTS.md

This file contains guidelines and commands for agentic coding agents working on this crazy-eCommerce project.

## Build/Lint/Test Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle (uses Turbopack)
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run lint -- --fix` - Auto-fix linting issues
- `npm run lint path/to/file.js` - Lint specific file

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management

### Testing
Currently no test framework is configured. To add tests:
1. Install Jest/Vitest with appropriate React testing libraries
2. Add test script to package.json
3. Create __tests__ directories alongside components

## Project Structure & Architecture

### FSD (Feature-Sliced Design) Architecture
The project follows Feature-Sliced Design with these layers:

```
src/
├── app/              # Next.js App Router (pages)
├── entities/         # Business entities (Product, User, Cart, Comment)
├── features/         # Features (add-to-cart, auth, catalog, etc.)
├── shared/           # Shared utilities and UI
└── infrastructure/   # Cross-cutting concerns (i18n, etc.)
```

### Key Patterns
- **Server Components**: Default for all components unless marked with `"use client"`
- **Client Components**: Marked with `"use client"` at file top
- **API Routes**: Located in `app/api/` with RESTful structure
- **Path Aliases**: Use `@/` prefix for imports from src directory

## Code Style Guidelines

### General
- Use strict TypeScript where possible, JavaScript for simple components
- Prefer functional components with hooks
- Use ESLint configuration based on Next.js core-web-vitals
- Follow the existing FSD architecture strictly

### Import Order
```javascript
// 1. React/Next.js imports
import React, { useState } from "react";
import Image from "next/image";

// 2. Third-party libraries
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

// 3. Internal imports (using @/ alias)
import { Component } from "@/shared/ui/Component";
import { FeatureComponent } from "@/features/feature/ui/FeatureComponent";
```

### Component Structure
```javascript
"use client"; // Only for client components

import React from "react";

// Types/interfaces (if needed)
interface ComponentProps {
  data: Data;
  otherInfo?: OtherInfo;
}

// Component definition
const Component = ({ data, otherInfo }: ComponentProps) => {
  // Hooks first
  const router = useRouter();
  const [state, setState] = useState();

  // Helper functions
  const handleClick = () => {
    // logic
  };

  // Early returns
  if (!data) return <div>Loading...</div>;

  // JSX return
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
};

export default Component;
```

### Styling Guidelines

#### Tailwind CSS
- Use Tailwind classes for all styling
- Prefer utility classes over custom CSS
- Use `cx` utility from `@/shared/utils/cx` for conditional classes
- Follow mobile-first responsive design (`md:`, `lg:` prefixes)

#### CSS Classes Pattern
```javascript
// Layout
<div className="flex flex-col items-center justify-between">

// Spacing
<div className="p-4 m-2">

// Typography
<h1 className="text-2xl font-bold">

// Colors & States
<button className="bg-primary text-white hover:bg-primary_hover">

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
```

#### Custom CSS
- Keep custom CSS in `src/shared/styles/`
- Use CSS modules for component-specific styles
- Maintain the existing structure: `globals.css`, `components.css`, `animations.css`

### TypeScript Guidelines
- Use strict mode (already enabled in tsconfig.json)
- Prefer interfaces over types for object shapes
- Use proper typing for props and return values
- Import types with `import type` when possible

### API Routes
- Use async functions for all API handlers
- Implement proper error handling with try-catch
- Return consistent JSON responses
- Use NextResponse for responses
- Validate input parameters

```javascript
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const result = await businessLogic();
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
```

### Error Handling
- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors appropriately
- Use error boundaries for React components

### Database (Prisma)
- Use Prisma client from `@/prisma/client`
- Follow the existing schema patterns
- Use transactions for multiple operations
- Handle database errors gracefully

### State Management
- Use React hooks for local state
- Use Server Components for data fetching
- Implement proper loading states with Suspense
- Use react-hook-form for form handling

### Accessibility
- Use semantic HTML elements
- Implement ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (`ProductCard.jsx`, `AuthForm.jsx`)
- **Utilities**: camelCase (`cx.ts`, `fetch.js`)
- **Pages**: `page.jsx` (Next.js convention)
- **API Routes**: `route.js` (Next.js convention)
- **Hooks**: camelCase with `use` prefix (`useAuth.js`)

### Variables & Functions
- camelCase for variables and functions
- PascalCase for components and classes
- UPPER_SNAKE_CASE for constants
- Descriptive names that indicate purpose

### CSS Classes
- Use Tailwind utility classes directly
- Follow mobile-first approach
- Group related classes logically

## Security Considerations

- Never commit sensitive data or API keys
- Use environment variables for secrets
- Implement proper authentication with Clerk/NextAuth
- Validate all user inputs
- Use HTTPS in production
- Follow Next.js security best practices

## Performance Guidelines

- Use Next.js Image component for images
- Implement code splitting with dynamic imports
- Use React.memo for expensive components
- Optimize bundle size
- Use proper caching strategies
- Implement lazy loading where appropriate

## Internationalization

- Use next-intl for i18n
- Keep translations in `src/shared/i18n/`
- Follow existing patterns for language switching
- Use the `useTranslations` hook

## Development Workflow

1. **Before starting**: Run `npm run lint` to ensure clean state
2. **During development**: Use `npm run dev` with hot reload
3. **Before committing**: Run `npm run lint` to check for issues
4. **Before deploying**: Run `npm run build` to ensure production build works

## Common Patterns

### Data Fetching
```javascript
// Server Component
async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductCard data={product} />;
}

// Client Component with SWR/Fetch
"use client";
const [data, setData] = useState(null);

useEffect(() => {
  fetchData().then(setData);
}, []);
```

### Form Handling
```javascript
// Using react-hook-form
const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = (data) => {
  // Handle form submission
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
);
```

## Troubleshooting

### Common Issues
- **Build fails**: Check TypeScript errors, ensure all imports are correct
- **Styling issues**: Verify Tailwind classes, check CSS import order
- **API errors**: Check Next.js API route structure, verify request/response format
- **Database issues**: Verify Prisma schema, check database connection

### Debugging
- Use browser DevTools for client-side debugging
- Use Next.js debugging for server-side issues
- Check network tab for API call debugging
- Use console.log strategically for debugging (remove before committing)