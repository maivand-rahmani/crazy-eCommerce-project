# CODEBASE_MEMORY.md

## 1. Project Overview

**Project Name:** crazy-eCommerce  
**Type:** Full-stack e-commerce web application  
**Core Features:**
- Product catalog with categories and variants
- Shopping cart with quantity management
- User authentication (credentials + OAuth via Google/GitHub)
- Wishlist functionality
- Order management
- Product ratings and comments
- Multi-language support (English, Russian, Persian)
- Multi-theme support (light, dark, vintage, retro)

## 2. Tech Stack

### Core Framework
- **Next.js 15** - App Router architecture
- **React 18** - UI library
- **TypeScript** - Type safety (partial adoption)

### Styling
- **Tailwind CSS v4** - Primary styling (via `@tailwindcss/postcss`)
- **Styled Components** - Enabled in Next.js config for SSR
- **Custom CSS** - Theme variables in `globals.css` with 4 themes

### State & Data
- **Prisma** - ORM for PostgreSQL
- **NextAuth.js** - Authentication (v4 with JWT strategy)
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### UI Libraries
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **Tiptap** - Rich text editor
- **React Aria Components** - Accessible components

### Internationalization
- **next-intl** - i18n with locale routing (en, ru, fa)

## 3. Architecture

### FSD (Feature-Sliced Design) Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── [locale]/          # Locale-based routing
│   │   ├── page.jsx       # Home page
│   │   ├── catalog/       # Product catalog routes
│   │   ├── cart/          # Shopping cart
│   │   ├── orders/        # Order management
│   │   ├── auth/          # Authentication
│   │   └── admin/         # Admin panel
│   └── api/              # API routes (REST)
├── entities/               # Business entities (domain layer)
│   ├── product/          # Product-related components
│   ├── cart/             # Cart components
│   ├── user/              # User components
│   ├── order/             # Order components
│   ├── comment/           # Comment components
│   └── rating/            # Rating components
├── features/               # Features (use cases)
│   ├── auth/             # Authentication features
│   ├── add-to-cart/      # Cart operations
│   ├── add-to-wishlist/  # Wishlist features
│   ├── catalog/          # Catalog features
│   ├── home/             # Homepage features
│   ├── search/           # Search features
│   └── ...
├── shared/                # Shared utilities & UI
│   ├── ui/              # Reusable UI components
│   │   ├── layout/      # Header, Footer
│   │   ├── modal/       # Modal component
│   │   ├── slider/      # Slider component
│   │   └── ...
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities (fetch, auth)
│   ├── styles/          # Global CSS & themes
│   └── i18n/           # Internationalization
└── prisma/              # Database schema & client
```

### Key Design Patterns

1. **Server Components** - Default; use `"use client"` only when needed
2. **Server Actions** - For mutations (addToCart, register, etc.)
3. **API Routes** - REST endpoints in `app/api/`
4. **FSD Layers** - Strict hierarchy: shared → entities → features → pages

## 4. Components System

### Component Organization

Each entity/feature typically has:
```
feature/
├── ui/                   # Presentational components
│   ├── Component.jsx
│   └── SubComponent.jsx
├── model/               # Business logic (server actions)
│   └── businessLogic.js
└── index.js             # Public exports
```

### Reusable Component List

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | shared/ui/layout/header | Main navigation |
| Footer | shared/ui/layout/footer | Site footer |
| Modal | shared/ui/modal | Reusable modal |
| ProductCard | entities/product | Product display |
| SmallProductCard | entities/product | Compact product |
| LoginForm | features/auth | Login form |
| RegisterForm | features/auth | Registration |
| AddToCartButton | features/add-to-cart | Add to cart |
| ProductsFilter | features/catalog | Filter sidebar |
| CouponForm | features/cart | Discount codes |
| CommentSection | entities/comment | Product reviews |
| Rating | entities/rating | Star rating |

### Props Patterns

```jsx
// Standard props pattern
const Component = ({ data, otherInfo }) => { }

// With TypeScript
interface Props {
  data: ProductData;
  otherInfo?: WishlistInfo;
}
```

## 5. Pages / Routes

### Main Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `[locale]/page.jsx` | Homepage with banners, categories |
| `/catalog` | `catalog/page.jsx` | Full product catalog |
| `/catalog/[categoryId]` | `catalog/[categoryId]/page.jsx` | Category products |
| `/catalog/[categoryId]/[variantId]` | `catalog/[categoryId]/[variantId]/page.jsx` | Product detail |
| `/cart` | `cart/page.jsx` | Shopping cart |
| `/wishlist` | `wishlist/page.jsx` | User wishlist |
| `/orders` | `orders/page.jsx` | Order history |
| `/orders/[orderId]` | `orders/[orderId]/page.jsx` | Order detail |
| `/auth` | `auth/page.jsx` | Login/Register |
| `/admin` | `admin/page.jsx` | Admin panel |
| `/contact` | `contact/page.jsx` | Contact page |
| `/about` | `about/page.jsx` | About page |

### API Routes

| Endpoint | File | Description |
|----------|------|-------------|
| `/api/auth/[...nextauth]` | nextauth/route.js | NextAuth handlers |
| `/api/auth/register` | auth/register/route.js | User registration |
| `/api/products` | products/route.js | Products CRUD |
| `/api/products/[variantId]` | products/[variantId]/route.js | Single product |
| `/api/cart` | cart/route.js | Cart operations |
| `/api/cart/coupon` | cart/coupon/route.js | Coupon validation |
| `/api/orders` | orders/route.js | Orders CRUD |
| `/api/wishlist` | wishlist/route.js | Wishlist operations |

## 6. Styling System

### Theme Configuration

Themes defined in `src/shared/styles/globals.css`:
- **Light** - Default theme (`[data-theme="light"]`)
- **Dark** - Dark mode (`[data-theme="dark"]`)
- **Vintage** - Warm tones (`[data-theme="vintage"]`)
- **Retro** - Bold colors (`[data-theme="retro"]`)

### CSS Variables

Core tokens:
```css
--bg, --surface, --text           /* Base colors */
--primary, --primary-text          /* Primary accent */
--button, --button-text            /* Button colors */
--border, --muted                   /* Neutrals */
--success, --danger                /* Status colors */
--status-*-bg, --status-*-text     /* Order statuses */
```

### Tailwind Usage
- Tailwind v4 uses `@tailwind` directives and `@theme` block
- Custom classes via `cx()` utility for conditional merging
- Mobile-first: `md:`, `lg:` prefixes

## 7. API Layer

### Fetch Pattern

```javascript
// Shared fetch utility (src/shared/lib/fetch.js)
import Fetch from "@/shared/lib/fetch";

// Usage
const data = await Fetch("/api/products?limit=10", "GET");
```

### Server Actions

Features expose server actions in `model/` folders:
```javascript
// features/add-to-cart/model/addToCart.js
export async function addToCart(variantId, method, cartId) {
  // Prisma operations
  revalidatePath("/cart");
}
```

### Data Flow
1. **Server Components** fetch directly via Prisma or server actions
2. **Client Components** use server actions or API routes
3. **API Routes** return JSON via NextResponse

## 8. Conventions

### File Naming
- Components: `PascalCase.jsx` (ProductCard.jsx)
- Pages: `page.jsx`, `layout.jsx`
- API: `route.js`
- Utils: `camelCase.js`
- Styles: `kebab-case.css`

### Import Aliases
```javascript
import { Component } from "@/shared/ui";
import { Feature } from "@/features/feature";
import { Entity } from "@/entities/entity";
```

### Component Structure
```jsx
"use client"; // Only when needed

import React from "react";
// Imports

// Types (if TypeScript)

const Component = ({ prop1, prop2 }) => {
  // Hooks
  // State
  // Helpers
  // Early returns
  // JSX
};

export default Component;
```

### Code Style
- ESLint with Next.js core-web-vitals config
- Prefer functional components
- Use `"use client"` sparingly
- Server-first data fetching

## 9. Important Notes

### Auth Flow
- NextAuth with JWT strategy
- Session token in cookies
- Protected routes via middleware (`/orders`, `/cart`, `/wishlist`)
- User roles: `user`, `admin`

### Database
- PostgreSQL with Prisma ORM
- Models: User, Product, Category, Cart, Order, Review, Wishlist
- Raw SQL queries via `$queryRaw` for complex joins

### i18n
- Locales: en, ru, fa
- Routing: `/[locale]/path`
- Middleware handles locale detection
- Translation files in `shared/i18n/json/`

### Non-obvious Decisions
1. **Theme applied at root**: `<html data-theme="vintage">` in layout
2. **Dual image approach**: Uses both `next/image` and plain `<img>` tags
3. **Raw SQL for cart**: Complex joins use `$queryRaw` for performance
4. **JSON addresses**: User addresses stored as JSON array in DB

## 10. Weak Points

### Technical Debt

1. **Mixed TypeScript/JavaScript** - Inconsistent typing across codebase
2. **No test coverage** - No Jest/Vitest configured
3. **Multiple user profile modals** - Duplicate components exist:
   - `entities/user/ui/UserProfileModal.jsx`
   - `entities/user/ui/modals/UserProfileModal.jsx`
4. **Inconsistent component exports** - Some use index.js, others direct
5. **Comment folder duplication** - `CommentSection/client/` and `CommentSection/CommentSection/`

### Code Smells

1. **Console.log in production** - Auth flows have `console.log(res)`
2. **Hardcoded API URL** - `${process.env.NEXT_PUBLIC_API_URL}` should be centralized
3. **No error boundaries** - Missing React error boundary implementation
4. **Unused imports possible** - No strict import analysis
5. **No loading states** - Some async operations lack loading feedback

### Inconsistencies

1. **Mixed naming conventions** - `productId` vs `product_id` (camel vs snake)
2. **Varying prop patterns** - Some components use `data`, others use named props
3. **Theme naming** - Config says "class" but themes use `data-theme`
4. **Image handling** - Mix of `next/image` and `<img>` tags

### Performance Considerations

1. **No image optimization** - Using plain `<img>` in ProductCard
2. **N+1 queries possible** - Some API routes may have inefficient queries
3. **No pagination** - Products list may load all items
4. **Bundle size** - Multiple large dependencies (framer-motion, tiptap)

---

*Last updated: 2026-02-27*
*Generated for AI agent onboarding*
