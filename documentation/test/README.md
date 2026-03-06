# Testing Playbook

This file contains an English-language, step-by-step checklist for introducing automated testing across the entire project. Each checkbox is designed so you (or an agent) can execute or delegate tasks one at a time while tracing coverage per layer and per component.

## 1. Foundation
- [x] Pick Vitest as the preferred test runner (or another Next.js-friendly stack) and install dependencies.
- [x] Add an `npm run test` script and verify it hooks into the chosen runner.
- [x] Configure `tsconfig.json`/`vitest.config.ts` so `@/` aliases, JSX/TSX, CSS imports, and env variables work inside tests.
- [x] Create `tests/setup.ts` to hold shared globals/mocks (Auth/Intl wrappers, fetch stubs) even while the DOM env is pending.
- [x] Run `npm run test` manually to confirm the suite starts and exits cleanly (even before any tests exist).

## 2. Shared layer checks
- [x] `shared/lib/fetch.ts`: test that the serialized payload handles BigInt/Date and errors bubble properly. *(see `src/shared/lib/fetch.test.ts`)*  
- [x] `shared/utils/cx.ts`: verify class merging when conditional entries match or not, ensuring duplicates are skipped. *(see `src/shared/utils/cx.test.ts`)*  
- [ ] `shared/ui/modal/Modal.jsx`: render the modal in `isOpen`, toggle `isClosing`, and assert portal output.
- [ ] `shared/i18n/model/request.ts`: confirm headers, cookies, and locale detection follow the middleware contract.

## 3. Entities layer
- [ ] `entities/product/model` (create if missing) — test inventory logic: variant availability, stock flag, price conversion to cents/dollars.
- [x] `entities/cart/ui/OrderSummary.jsx`: ensure totals respect `subtotal`, `tax`, and `coupon`. *(see `src/entities/cart/ui/OrderSummary.test.jsx`)*  
- [ ] `entities/user/ui/AddUserAddressForm.jsx`: assert validation blocks invalid addresses and that form submission calls API helpers correctly.
- [ ] `entities/order/ui/modal/OrderModal.jsx`: test that the modal opens, shows the correct order status, and fires the close handler.

## 4. Features layer (one test per feature)
- [x] `features/catalog/model/index.js`: mock the catalog API response and confirm filtering by category, price, and color. *(see `src/features/catalog/model/index.test.js`)*  
- [x] `features/add-to-cart/model/addToCart.js`: simulate adding a product, track existing line updates, and assert return payload structure (`item`, `quantity`, `success` flag). *(see `src/features/add-to-cart/model/addToCart.test.js`)*  
- [x] `features/cart/model/index.js`: test quantity adjustments and removal logic, ensuring aggregated totals update. *(see `src/features/cart/model/index.test.js`)*  
- [x] `features/leave-comment/model/FormAction.js`: validate rules around rating/comment requirements and API posting. *(see `src/features/leave-comment/model/FormAction.test.js`)*  
- [x] `features/auth/model/register.js`: mock Prisma and ensure new user creation calls `prisma.user.create` and returns expected DTO. *(see `src/features/auth/model/register.test.js`)*  
- [x] `features/payment-mock/ui/PaymentMockForm.jsx`: check card formatting logic and that `onSubmit` receives sanitized data. *(see `src/features/payment-mock/ui/PaymentMockForm.test.jsx`)*  
- [x] `features/search/ui/ProductSearch.jsx`: confirm UI debounces input and renders results or “no data” state. *(see `src/features/search/ui/ProductSearch.test.jsx`)*  
- [ ] `features/payment-mock/index.js`: ensure the exported hooks/utilities behave as expected.

## 5. Widgets & page coverage
- [x] `widgets/header/ui/Header.jsx`: assert routes render, toggles update accessible labels, and wishlist/cart counts match API mock data. *(see `src/widgets/header/ui/Header.test.jsx`)*  
- [x] `widgets/footer/ui/Footer.jsx`: render translation-powered logo, nav links, and copyright block. *(see `src/widgets/footer/ui/Footer.test.jsx`)*  
- [ ] `widgets/(admin)/sidebar/ui/sidebar.jsx`: validate nav items render with correct icons, paths, and `exact` handling.
- [ ] `widgets/footer/ui/Footer.jsx`: check external links and dynamic year display.
- [x] `/cart` page: render `CartProductsList`, update totals, and show the `OrderSummary` when there is a balance. *(see `src/app/[locale]/cart/page.test.jsx`)*  
- [ ] `/catalog` page: render via App Router context, mock `ProductsContainer`, and ensure skeleton renders during loading.
- [ ] `/cart` page: assert `CartProductsList` renders item rows and `OrderSummary` displays the expected totals.
- [x] `/orders` page: simulate `Fetch("/api/orders")`, assert filters render, and verify at least one row/price/status entry. *(see `src/app/[locale]/orders/page.test.jsx`)*  
- [ ] `/orders` page: test filtering table rows by `status` and matching `orderId` links.
- [ ] Authentication pages: `pages/auth`, login/register forms should show validation errors on missing values.

## 6. API routes
- [ ] `app/api/products/search/route.js`: mock Prisma responses, confirm filters (`minPrice`, `minRating`) translate to query args, and `avg_rating` is computed.
- [ ] `app/api/cart/order/route.js`: test unauthorized access (401) and full order creation flow that records coupon/totals.
- [ ] `app/api/wishlist/route.js`: verify add/remove flows return the right JSON shape and statuses.
- [ ] `app/api/auth/register/route.js`: ensure validation errors (missing fields) return 400 and success returns the user payload.
- [ ] `app/api/products/[variantId]/rating/route.js`: confirm rating creation increments reviews array and returns sanitized stats.

## 7. CI & visibility
- [ ] Add a GitHub Actions (or other CI) workflow that runs `npm run lint` and `npm run test` per push or PR.
- [ ] Update the root `README.md` with a badge showing test status and link to the workflow.
- [ ] Keep `documentation/roadmap/README.md` aligned: mark checklist items as done, add the date, and note relevant PR references.
- [ ] Formalize the rule: any new feature must include at least one new test in the corresponding layer.

## 8. Agent-friendly execution plan
1. Claim a focused testing task (e.g., “Add modal tests for `widgets/header`”).
2. Refer to the relevant section above and ensure you know which files/components/responsibilities to cover.
3. Confirm `tests/setup.ts` (or `vitest.config.ts`) is ready; add mocks before touching the specific component.
4. Implement the test, run `npm run test`, and when green, update this README and `documentation/roadmap/README.md` by checking the box and logging the date/PR summary.
5. If blockers appear (missing exports, server-only modules), document them in the log, mention the needed fix, and re-run the checklist once resolved.
