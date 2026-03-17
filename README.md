# Crazy eCommerce

Production-ready e-commerce platform built with Next.js App Router, Prisma, and NextAuth. The project includes a multilingual storefront, a sandbox checkout flow, and a full admin panel for managing catalog, orders, users, and coupons.

## Features

- Product catalog with category browsing, search, related products, product specs, ratings, and comments
- Customer flows for authentication, wishlist management, cart updates, coupon validation, checkout, and order history
- Sandbox payment flow for local/demo checkout without a real payment gateway
- Account features such as address management, protected routes, and localized navigation
- Admin workspace for products, variants, orders, returns, users, coupons, and sales overview charts
- Internationalized UI with locale-aware routing and translation dictionaries for `en`, `ru`, and `fa`

## Tech Stack

| Technology | Role in the project |
| --- | --- |
| Next.js 15 (App Router) | Application framework, routing, layouts, server rendering, and API route handlers |
| React 18 | UI layer for storefront, account flows, and admin screens |
| Prisma ORM | Database access layer and schema management |
| PostgreSQL | Primary relational database |
| NextAuth.js | Authentication with credentials and OAuth providers |
| `@next-auth/prisma-adapter` | Persists auth sessions and users in PostgreSQL via Prisma |
| `next-intl` | Localization, locale routing, and translation loading |
| Tailwind CSS 4 | Utility-first styling across storefront and admin interfaces |
| styled-components | Component-scoped styling support, enabled via Next.js compiler |
| React Hook Form | Form state and validation for auth, checkout, and admin forms |
| Recharts | Admin dashboard charting and sales visualization |
| Vitest + Testing Library | Unit and component testing |
| react-hot-toast | In-app notifications and feedback messages |

## Core Functionality

### Storefront

- Home page with promotional sections and product showcases
- Catalog pages by category and product detail pages by variant
- Search results with client/server data flow
- Wishlist and recently viewed products
- Product reviews, ratings, and comment reactions
- Cart summary, coupon preview, and checkout with stock validation
- Order details, return requests, and eligible order cancellation

### Admin Panel

- Dashboard with sales overview and low-stock monitoring
- Product and variant management
- Order management and return processing workflows
- User management with role/state controls
- Coupon creation, editing, filtering, and soft deletion

## Getting Started

### Prerequisites

| Requirement | Recommended version |
| --- | --- |
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 14+ |

### Installation

```bash
git clone https://github.com/Kingnew2006/crazy-eCommerce-project.git
cd crazy-eCommerce-project
npm install
```

### Environment Variables

Create a `.env.local` file in the project root and add the variables your environment needs.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
INTERNAL_APP_URL="http://127.0.0.1:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection used by Prisma |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT/session signing |
| `NEXTAUTH_URL` | Recommended | Canonical app URL for auth callbacks |
| `INTERNAL_APP_URL` | Optional | Server-side fetch base URL override |
| `NEXT_PUBLIC_APP_URL` | Optional | Public application base URL fallback |
| `NEXT_PUBLIC_API_URL` | Optional | Client-side API base URL used by some product flows |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth login |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth login |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth login |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth login |

### Database Setup

Generate the Prisma client and apply the committed Prisma migrations to your local database:

```bash
npx prisma generate
npx prisma migrate dev
```

Note: the Prisma schema lives in `prisma/schema.prisma` and committed migrations are available in `prisma/migrations`. Sample seed data is not included, so a populated local database is recommended for the best demo experience.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000/en` in your browser.

### Production Build

```bash
npm run build
npm run start
```

### Quality Checks

```bash
npm run lint
npm run test
npm run test:watch
```

## Project Structure

```text
.
├── documentation/        # Additional project docs
├── prisma/               # Prisma client, helpers, and database schema
├── public/               # Static assets
├── src/
│   ├── app/              # App Router pages, layouts, and route handlers
│   ├── entities/         # Domain entities such as product, cart, order, user
│   ├── features/         # User and admin use-cases grouped by feature
│   ├── shared/           # Shared UI, utilities, auth helpers, i18n, styles
│   ├── widgets/          # Composed layout and section-level UI blocks
│   └── middleware.js     # Locale, auth, and admin route protection
├── tests/                # Test setup and global testing utilities
├── next.config.ts        # Next.js configuration
├── vitest.config.ts      # Vitest configuration
└── package.json          # Scripts and dependencies
```

### Key Paths

| Path | Description |
| --- | --- |
| `src/app/[locale]` | Localized storefront and admin routes |
| `src/app/api` | Route handlers for auth, products, cart, wishlist, orders, and user addresses |
| `src/features/auth` | Credentials/OAuth auth flows and UI |
| `src/features/admin-*` | Admin-specific modules for dashboard, orders, products, users, and coupons |
| `src/entities/product` | Product UI and pricing/spec helpers |
| `src/entities/cart` | Cart list and order summary components |
| `src/shared/lib/commerce/index.js` | Coupon validation, cart summary, and sandbox order placement logic |
| `src/shared/i18n` | Locale config, navigation helpers, and translation messages |
| `prisma/schema.prisma` | Database schema for products, variants, carts, orders, users, reviews, and wishlist |
| `tests/setup.ts` | Global test bootstrap for Vitest and Testing Library |

## Screenshots

Add screenshots to the repository and replace the placeholder paths below.

| View | Placeholder path |
| --- | --- |
| Home page | `documentation/screenshots/homepage.png` |
| Catalog page | `documentation/screenshots/catalog.png` |
| Product details | `documentation/screenshots/product-details.png` |
| Cart and checkout | `documentation/screenshots/cart-checkout.png` |
| Admin dashboard | `documentation/screenshots/admin-dashboard.png` |

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-change`
3. Make your changes
4. Run checks: `npm run lint && npm run test`
5. Commit with a clear message
6. Open a pull request with context, screenshots, and testing notes when relevant

For larger changes, open an issue first so scope and direction can be discussed before implementation.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Contact and Support

- Maintainer: Maivand Rahmani
- GitHub: `https://github.com/Kingnew2006`
- Repository: `https://github.com/Kingnew2006/crazy-eCommerce-project`
- Bug reports and feature requests: open an issue in the repository
