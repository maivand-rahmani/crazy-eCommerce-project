# crazy-eCommerce-project

```
crazy-eCommerce-project
├─ AGENTS.md
├─ CODEBASE_MEMORY.md
├─ LICENSE
├─ README.md
├─ documentation
│  └─ roadmap
│     └─ README.md
├─ eslint.config.mjs
├─ jsconfig.json
├─ next-intl.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ client.js
│  ├─ funcs.js
│  └─ schema.prisma
├─ prisma.config.ts
├─ public
│  └─ icons
│     ├─ github.png
│     ├─ google-color.png
│     └─ profile-circle-svgrepo-com.svg
├─ src
│  ├─ app
│  │  ├─ [locale]
│  │  │  ├─ about
│  │  │  │  ├─ layout.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ admin
│  │  │  │  └─ page.jsx
│  │  │  ├─ auth
│  │  │  │  ├─ layout.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ cart
│  │  │  │  ├─ layout.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ catalog
│  │  │  │  ├─ [categoryId]
│  │  │  │  │  ├─ [variantId]
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  └─ page.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ contact
│  │  │  │  ├─ layout.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ layout.jsx
│  │  │  ├─ loading.jsx
│  │  │  ├─ not-found.jsx
│  │  │  ├─ orders
│  │  │  │  ├─ [orderId]
│  │  │  │  │  ├─ layout.jsx
│  │  │  │  │  └─ page.jsx
│  │  │  │  ├─ layout.jsx
│  │  │  │  └─ page.jsx
│  │  │  ├─ page.jsx
│  │  │  ├─ search
│  │  │  │  └─ page.jsx
│  │  │  └─ wishlist
│  │  │     └─ page.jsx
│  │  └─ api
│  │     ├─ auth
│  │     │  ├─ [...nextauth]
│  │     │  │  └─ route.js
│  │     │  └─ register
│  │     │     └─ route.js
│  │     ├─ cart
│  │     │  ├─ check
│  │     │  │  └─ route.js
│  │     │  ├─ coupon
│  │     │  │  └─ route.js
│  │     │  ├─ order
│  │     │  │  └─ route.js
│  │     │  └─ route.js
│  │     ├─ categories
│  │     │  └─ route.js
│  │     ├─ orders
│  │     │  ├─ [orderId]
│  │     │  │  └─ route.js
│  │     │  └─ route.js
│  │     ├─ products
│  │     │  ├─ [variantId]
│  │     │  │  ├─ rating
│  │     │  │  │  └─ route.js
│  │     │  │  └─ route.js
│  │     │  ├─ comments
│  │     │  │  ├─ reaction
│  │     │  │  │  └─ route.js
│  │     │  │  └─ route.js
│  │     │  ├─ images
│  │     │  │  └─ route.js
│  │     │  ├─ related
│  │     │  │  └─ route.js
│  │     │  ├─ route.js
│  │     │  ├─ search
│  │     │  │  └─ route.js
│  │     │  ├─ specs
│  │     │  │  └─ route.js
│  │     │  └─ variants
│  │     │     └─ route.jsx
│  │     ├─ user
│  │     │  └─ addresses
│  │     │     └─ route.js
│  │     └─ wishlist
│  │        └─ route.js
│  ├─ entities
│  │  ├─ cart
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     ├─ CartProductsList.jsx
│  │  │     └─ OrderSummary.jsx
│  │  ├─ comment
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     └─ CommentSection
│  │  │        ├─ CommentSection
│  │  │        │  └─ CommentSection.jsx
│  │  │        ├─ MainComponent.jsx
│  │  │        └─ client
│  │  │           └─ CommentComponent.jsx
│  │  ├─ order
│  │  │  ├─ index.js
│  │  │  ├─ models
│  │  │  └─ ui
│  │  │     ├─ modal
│  │  │     │  └─ OrderModal.jsx
│  │  │     └─ ordering.jsx
│  │  ├─ product
│  │  │  ├─ ProductCard
│  │  │  │  └─ ProductCard.jsx
│  │  │  ├─ SmallProductCard
│  │  │  │  └─ SmallProductCard.jsx
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     ├─ MainInfo.jsx
│  │  │     ├─ ProductSpecs.jsx
│  │  │     └─ RelatedProducts.jsx
│  │  ├─ rating
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     ├─ CommentReaction.jsx
│  │  │     ├─ ProductRatingStats.jsx
│  │  │     └─ Rating.jsx
│  │  └─ user
│  │     ├─ index.js
│  │     ├─ model
│  │     └─ ui
│  │        ├─ AccountModal.jsx
│  │        ├─ AddUserAddressForm.jsx
│  │        ├─ UserProfileModal.jsx
│  │        └─ modals
│  │           └─ UserProfileModal.jsx
│  ├─ features
│  │  ├─ add-to-cart
│  │  │  ├─ index.js
│  │  │  ├─ model
│  │  │  │  ├─ addToCart.js
│  │  │  │  └─ handleCartQuantityChangeOnClient.js
│  │  │  └─ ui
│  │  │     ├─ AddToCartButtonForProductPage.jsx
│  │  │     ├─ counter.jsx
│  │  │     └─ deleteButton.jsx
│  │  ├─ add-to-wishlist
│  │  │  ├─ index.js
│  │  │  ├─ model
│  │  │  │  └─ addToWishList.js
│  │  │  └─ ui
│  │  │     └─ AddToWishListCom.jsx
│  │  ├─ add-user-address
│  │  │  ├─ model
│  │  │  │  └─ UserAddress.js
│  │  │  └─ ui
│  │  │     └─ addUserAddressModal.jsx
│  │  ├─ auth
│  │  │  ├─ index.js
│  │  │  ├─ model
│  │  │  │  ├─ SocialLogin.js
│  │  │  │  └─ register.js
│  │  │  └─ ui
│  │  │     ├─ AuthFormLayout.jsx
│  │  │     ├─ OAuthForm
│  │  │     │  └─ OAuthForm.jsx
│  │  │     └─ forms
│  │  │        ├─ LoginForm.jsx
│  │  │        └─ RegisterForm.jsx
│  │  ├─ cart
│  │  │  ├─ apply-cupon
│  │  │  │  └─ ui
│  │  │  │     └─ CouponForm.jsx
│  │  │  └─ index.js
│  │  ├─ catalog
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     └─ ProductsContainer
│  │  │        ├─ ProductsContainer.jsx
│  │  │        ├─ ProductsFilter.jsx
│  │  │        └─ ProductsLists.jsx
│  │  ├─ home
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     ├─ CategorySection
│  │  │     │  ├─ CategoryCard.jsx
│  │  │     │  ├─ FeaturedProducts.jsx
│  │  │     │  └─ Main.jsx
│  │  │     └─ banners
│  │  │        ├─ Iphone17.jsx
│  │  │        ├─ ResponsibleBanner.jsx
│  │  │        ├─ airpodspro.jsx
│  │  │        ├─ applevisionpro.jsx
│  │  │        ├─ macbook.jsx
│  │  │        ├─ main.jsx
│  │  │        └─ playstation5.jsx
│  │  ├─ leave-comment
│  │  │  ├─ index.js
│  │  │  ├─ model
│  │  │  │  └─ FormAction.js
│  │  │  └─ ui
│  │  │     └─ CommentForm.jsx
│  │  ├─ payment-mock
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     └─ PaymentMockForm.jsx
│  │  ├─ react-to-comment
│  │  │  ├─ index.js
│  │  │  └─ ui
│  │  │     └─ likeComponent.jsx
│  │  └─ search
│  │     ├─ index.js
│  │     └─ ui
│  │        └─ ProductSearch.jsx
│  ├─ middleware.js
│  └─ shared
│     ├─ contexts
│     ├─ hooks
│     ├─ i18n
│     │  ├─ index.js
│     │  ├─ json
│     │  │  ├─ en.json
│     │  │  ├─ fa.json
│     │  │  └─ ru.json
│     │  ├─ model
│     │  │  ├─ index.js
│     │  │  ├─ request.ts
│     │  │  └─ routing.js
│     │  └─ ui
│     │     ├─ Switcher.jsx
│     │     └─ index.js
│     ├─ index.js
│     ├─ lib
│     │  ├─ auth
│     │  │  ├─ authorizeUser.js
│     │  │  └─ getUserByEmail.js
│     │  ├─ fetch.js
│     │  └─ index.js
│     ├─ styles
│     │  ├─ animations.css
│     │  ├─ components.css
│     │  ├─ globals.css
│     │  └─ utilis.css
│     ├─ ui
│     │  ├─ Loading
│     │  │  ├─ ComponentLoader
│     │  │  │  ├─ miniloader.css
│     │  │  │  └─ miniloader.jsx
│     │  │  ├─ PageLoader
│     │  │  │  ├─ loader.jsx
│     │  │  │  └─ loading.css
│     │  │  └─ index.js
│     │  ├─ ScrollContainer
│     │  │  ├─ ScrollContainer.jsx
│     │  │  └─ index.js
│     │  ├─ dropdown
│     │  │  ├─ dropdown.tsx
│     │  │  └─ index.js
│     │  ├─ layout
│     │  │  ├─ Provider
│     │  │  │  └─ AuthProvider.jsx
│     │  │  ├─ footer
│     │  │  │  └─ Footer.jsx
│     │  │  ├─ header
│     │  │  │  ├─ Header.jsx
│     │  │  │  ├─ desktop
│     │  │  │  │  └─ DesktopHeader.jsx
│     │  │  │  ├─ mobile
│     │  │  │  │  └─ MobileHeader.jsx
│     │  │  │  └─ ui
│     │  │  │     ├─ NavLink.jsx
│     │  │  │     ├─ cyberIcon.jsx
│     │  │  │     ├─ index.js
│     │  │  │     ├─ shoppingCartButton.jsx
│     │  │  │     └─ wishlistButton.jsx
│     │  │  └─ index.js
│     │  ├─ modal
│     │  │  ├─ Modal.jsx
│     │  │  └─ index.js
│     │  ├─ search
│     │  │  ├─ SearchResultsContainer.jsx
│     │  │  └─ index.js
│     │  ├─ skeleton
│     │  │  ├─ index.js
│     │  │  └─ ui
│     │  │     ├─ ProductCardSkeleton.jsx
│     │  │     └─ ProductsRenderSkeleton.jsx
│     │  ├─ slider
│     │  │  ├─ Slider.jsx
│     │  │  └─ index.js
│     │  └─ urlWay
│     │     ├─ index.js
│     │     └─ url.jsx
│     └─ utils
│        └─ cx.ts
├─ tailwind.config.mjs
└─ tsconfig.json

```