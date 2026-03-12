# 🚀 Project Roadmap

## 📌 Current State Overview
A full-featured Next.js e-commerce platform with multi-language support (i18n), user authentication (NextAuth), shopping cart, wishlist, order management, product catalog with categories, reviews/ratings, and checkout flow. Built with PostgreSQL/Prisma, following Feature-Sliced Design architecture.

---

## 🧩 Features Implemented

### 🔹 Authentication & User Management

#### ✅ Feature: User Registration
- **Description**: Email/password registration with validation
- **What works**: User creation, password hashing, NextAuth integration
- **Notes**: Uses custom registration flow with Prisma ORM

#### ✅ Feature: User Login
- **Description**: Email/password authentication
- **What works**: Session-based authentication via NextAuth
- **Notes**: Supports JWT sessions

#### ✅ Feature: OAuth Social Login
- **Description**: Google and GitHub social authentication
- **What works**: OAuth provider integration (Google, GitHub)
- **Notes**: Uses NextAuth with multiple providers

#### ✅ Feature: User Profile
- **Description**: Account management and profile editing
- **What works**: Profile modal, full address management
- **Notes**: Multiple shipping addresses support (JSON storage)

#### ⚠️ Partial Feature: Admin Dashboard
- **Description**: Store administration panel
- **What exists**: Basic page placeholder with metadata
- **What's missing**: Full CRUD operations for products, orders, users

---

### 🔹 Product Catalog

#### ✅ Feature: Product Listing (Catalog)
- **Description**: Browse products by category with filtering
- **What works**: Category-based filtering, product grid display, pagination
- **Notes**: Supports 10 predefined categories (Electronics, Clothing, Home & Garden, etc.)

#### ✅ Feature: Product Search
- **Description**: Full-text product search
- **What works**: Search API with query parameters, results display
- **Notes**: Integrated search page with results container

#### ✅ Feature: Product Detail Page
- **Description**: Comprehensive product information display
- **What works**: Image slider, product specs, pricing, stock status, variant selection
- **Notes**: Includes related products, rating stats, comments section

#### ✅ Feature: Product Variants
- **Description**: Multiple variants per product (size, color, etc.)
- **What works**: Variant selection, price variations, stock tracking
- **Notes**: Stored in product_variants table with variant_options

#### ✅ Feature: Product Ratings & Reviews
- **Description**: Star ratings and user reviews
- **What works**: Rating display (1-5 stars), review submission, rating stats
- **Notes**: Supports like/dislike reactions on reviews

#### ✅ Feature: Related Products
- **Description**: Products related to current item
- **What works**: Related products API and display component

---

### 🔹 Shopping Cart

#### ✅ Feature: Add to Cart
- **Description**: Add products with quantity selection
- **What works**: Client-side cart management, quantity counter, add/remove items
- **Notes**: Persistent cart per user in database

#### ✅ Feature: Cart Management
- **Description**: View, update quantities, remove items
- **What works**: Cart page with product list, quantity adjustment, item removal
- **Notes**: Real-time total calculation

#### ✅ Feature: Order Summary
- **Description**: Cart totals with subtotal, taxes, shipping estimate
- **What works**: Subtotal calculation, checkout button
- **Notes**: ⚠️ Taxes and shipping calculation may need implementation

#### ✅ Feature: Coupon/Discount Codes
- **Description**: Apply promo codes to orders
- **What works**: Coupon form, API validation, discount application
- **Notes**: Supports percentage and fixed amount discounts

---

### 🔹 Wishlist

#### ✅ Feature: Add to Wishlist
- **Description**: Save products for later
- **What works**: Heart icon toggle, wishlist API, database storage
- **Notes**: User-specific wishlist items

#### ✅ Feature: Wishlist Page
- **Description**: View saved products
- **What works**: Display wishlist items, empty state, link to move to cart

---

### 🔹 Checkout & Orders

#### ✅ Feature: Checkout Flow
- **Description**: Complete order placement
- **What works**: Order creation, address input, order summary
- **Notes**: ⚠️ Payment integration appears to be mocked (PaymentMockForm)

#### ✅ Feature: Order Management
- **Description**: View order history
- **What works**: Orders list page with filtering (status, sort), order details view
- **Notes**: Supports status filters (created, paid, shipped, delivered, cancelled)

#### ✅ Feature: Order Details
- **Description**: Individual order view
- **What works**: Order items, status, total, date, shipping address
- **Notes**: Dedicated order detail page with layout

---

### 🔹 Home Page & Navigation

#### ✅ Feature: Hero Banners
- **Description**: Promotional banner carousel
- **What works**: iPhone 17, PlayStation 5, Apple Vision Pro, MacBook Air banners
- **Notes**: Multiple banner components with CTAs

#### ✅ Feature: Category Navigation
- **Description**: Browse by product category
- **What works**: Category cards section, category listing
- **Notes**: 10 categories displayed on home page

#### ✅ Feature: Featured Products
- **Description**: Highlighted products on home page
- **What works**: Featured products section with grid display

---

### 🔹 Internationalization (i18n)

#### ✅ Feature: Multi-language Support
- **Description**: Site available in multiple languages
- **What works**: English (en), Russian (ru), Persian/Farsi (fa)
- **Notes**: Next-intl integration, language switcher component

---

### 🔹 UI Components

#### ✅ Feature: Responsive Header
- **Description**: Navigation with search, cart, wishlist, account
- **What works**: Desktop and mobile header variants
- **Notes**: MobileHeader and DesktopHeader components

#### ✅ Feature: Footer
- **Description**: Site footer with links
- **What works**: FooterCyber component

#### ✅ Feature: Product Cards
- **Description**: Reusable product display cards
- **What works**: ProductCard and SmallProductCard components

#### ✅ Feature: Product Badges (New/Sale)
- **Description**: Visual badges on product cards highlighting new and sale items
- **What works**: "New" badge for products within 7 days, "Sale" badge with discount percentage, discounted price display
- **Notes**: Requires `discount_percent` field on products, PR #88

#### ✅ Feature: Image Slider
- **Description**: Product image gallery
- **What works**: Slider component for product detail page

#### ✅ Feature: Search Results
- **Description**: Display search results
- **What works**: SearchResultsContainer with product grid

#### ✅ Feature: Loading States
- **Description**: Skeleton loaders and spinners
- **What works**: ProductCardSkeleton, ProductsRenderSkeleton, MiniLoader

---

## 🔄 User Flows

### Flow: Browse & Purchase
1. User lands on home page → sees featured products and categories
2. User browses catalog or uses search → filters products by category
3. User clicks product → views detail page with specs, reviews
4. User selects variant → adds to cart with quantity
5. User proceeds to cart → reviews items, applies coupon
6. User clicks checkout → enters/confirms address
7. User completes payment → order created with status

### Flow: User Authentication
1. User clicks Account/Login → redirected to auth page
2. User registers or logs in → session created via NextAuth
3. User can access: wishlist, orders, profile
4. User logs out → session terminated

### Flow: Wishlist Management
1. User browses products → clicks heart icon to add/remove
2. User navigates to Wishlist page → views saved items
3. User can move items to cart or continue shopping

### Flow: Order Tracking
1. User completes purchase → order created with "created" status
2. User views Orders page → filters by status
3. User clicks specific order → views order details and timeline

---

## 📊 Progress Summary
- **Total features**: ~30+
- **Completed**: ~25+
- **Partial**: ~3 (Admin, Shipping calculation)
- **Unclear**: ~2 (Blog section - not implemented, Contact form details)

---

## 🛠 In Progress / To Be Clarified

- [ ] **Admin Panel**: Full CRUD for products, categories, orders management
- [ ] **Shipping Calculation**: Not fully implemented

---

## ➕ Future Additions (EMPTY TEMPLATE - KEEP THIS)

### 🧠 Planned Features
- [ ] Feature name:
  - Description:
  - Priority:
  - Notes:

- [x] Theme switcher:
  - Description: A beautiful component for switching themes.
  - Priority: Medium
  - Notes: To implement this component, you first need to change the user's portal because only the user who is already registered has access to the portal now, and the users who are not registered, they go to the login page, and it is necessary that there is a button for moving to the registration page, and at the bottom there were those very components for changing the language and changing the theme.

### ⚡ Improvements

- [x] Now, when the user makes an order, the form of the user's address is shown to him and he can only add an address or edit the already existing one. I would like there to be an opportunity to select the existing user addresses in the system, if they are there, if not, then this form was shown. (Implemented in PR #22)

- [x] adding full skeleton layout for product page (Implemented in PR #25)

### 🐞 Fixes
- [ ] ...

- [x] On the search page, when we search for products, the addition to the favorite ones does not work in the product card. (Fixed in PR #20 and subsequent improvements)

- [x] On the back-end API side of the search The system that considers the average rating does not work. (Fixed in PR #35)
---

## 🧪 Testing Roadmap

- [ ] **Automated testing setup**
  - Description: Follow the detailed checklist in `documentation/test/README.md` for per-layer/component coverage.
  - Priority: High - ensures future changes remain safe and makes agentic work reproducible.
  - Notes: The playbook is increasingly granular (shared, entities, features, widgets, API, CI and agent workflow). Update this section whenever a major milestone completes.


---

## 📝 Development Log (EMPTY - FOR MANUAL USE)

### [Date]
- Added:
- Updated:
- Fixed:

### 29.2.2026
- Added: Function for editing and removing user addresses in the system has been added.

### 1.3.2026
- Fixed: Search page wishlist functionality - added proper authentication handling, auto-create wishlist for new users, fixed toast message for unauthenticated users
- Added: Address selection in checkout flow - users can now select existing saved addresses or add new ones during checkout (PR #22)

### 4.3.2026
- Added: Loading skeleton for product detail page - created loading.jsx with comprehensive skeleton UI including image slider, product info, specs, related products, and reviews sections (PR #25)

### 7.3.2026
- Fixed: Multiple bugs in cart checkout flow - removed empty try-catch blocks, fixed typo in function name, added null check for product images, simplified redundant logic in wishlist component (PR #51)

### 8.3.2026
- Added: Loading skeletons for catalog, search, and wishlist pages - created loading.jsx files with animated skeleton UI components for better UX while pages load (PR #66)

### 5.3.2026
- Fixed: Search API average rating - enabled reviews in query, added avg_rating and review_count to search results, enabled minRating filter (PR #35)

### 6.3.2026
- Added: Admin sidebar navigation - implemented AdminSidebar component with links to dashboard, products, orders, users, categories
- Updated: Admin page placeholder - added basic admin dashboard page with metadata
- Fix: NavLink active state - updated to use pathname for accurate active link highlighting
- Added: Tests for shared helpers (`shared/lib/fetch` and `shared/utils/cx`) to exercise foundation coverage.
- Added: Testing foundation with Vitest, `tests/setup.ts`, and the first shared fetch test so the automated suite can run end-to-end.

### 7.3.2026
- Added: `OrderSummary` totals test that mocks translations/auth props and validates subtotal/total rendering in checkout state.

### 8.3.2026
- Added: Catalog model tests that confirm product/category/search endpoints call `Fetch` with the expected query/parameter combinations.

### 9.3.2026
- Added: `addToCart` service tests covering add/remove/delete flows so the feature layer handles quantity/state transitions reliably.

### 10.3.2026
- Added: `cart` model test verifying `getUserCart` forwards `/api/cart` requests to the shared `Fetch`.
- Added: `leave-comment` action tests covering unauthorized flows and valid submissions calling `/api/products/comments`.
- Added: `register` model test that hashes passwords before POSTing to `/api/auth/register`.
- Added: `payment mock` form test that formats card/expiry inputs, shows coupon pricing, and advances the checkout step.
- Added: `ProductSearch` component tests that exercise the debounce, result list, and "view all" navigation.
- Added: Header widget test ensuring desktop/mobile fragments render together.
- Added: Footer widget test verifying nav/copyright copy, cart page test that surfaces `OrderSummary`, and orders page test covering filters/table rows.

### 12.3.2026
- Added: Shipping cost estimator in cart OrderSummary - displays shipping cost (free over $100, otherwise $10) with translations for en, ru, fa (PR #101)


(repeatable section)
