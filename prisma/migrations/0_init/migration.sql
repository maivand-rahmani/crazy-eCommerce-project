-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."cart_status" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."coupon_type" AS ENUM ('percentage', 'fixed_amount');

-- CreateEnum
CREATE TYPE "public"."liketype" AS ENUM ('like', 'dislike');

-- CreateEnum
CREATE TYPE "public"."order_return_status" AS ENUM ('none', 'requested', 'approved', 'rejected', 'processed');

-- CreateEnum
CREATE TYPE "public"."order_status" AS ENUM ('created', 'paid', 'shipped', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."product_status" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "public"."variant_status" AS ENUM ('draft', 'active', 'archived');

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "role" "public"."user_role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'user',
    "addresses" JSONB[],
    "deletedAt" TIMESTAMPTZ(6),
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "public"."cart_items" (
    "id" BIGSERIAL NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carts" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."cart_status" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" BIGINT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coupons" (
    "id" SERIAL NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "description" TEXT,
    "discount_amount" DECIMAL(10,2),
    "discount_percent" INTEGER,
    "max_usage" INTEGER DEFAULT 1,
    "times_used" INTEGER DEFAULT 0,
    "valid_from" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "is_one_time" BOOLEAN NOT NULL DEFAULT true,
    "type" "public"."coupon_type" NOT NULL DEFAULT 'fixed_amount',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_cents" INTEGER NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "public"."order_status" NOT NULL DEFAULT 'created',
    "total_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coupon_id" INTEGER,
    "address" JSONB,
    "return_reason" TEXT,
    "return_requested" BOOLEAN NOT NULL DEFAULT false,
    "return_status" "public"."order_return_status" NOT NULL DEFAULT 'none',
    "returned_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_cards" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "product_name" TEXT NOT NULL,
    "variant_name" TEXT,
    "category_id" BIGINT,
    "price_cents" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variant_options" JSONB,
    "specs" JSONB,
    "discount_percent" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT,
    "url" TEXT NOT NULL,
    "variant_id" BIGINT,
    "position" SMALLINT,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_specs" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "product_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_name" TEXT,
    "price_cents" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "discount_percent" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "status" "public"."variant_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "status" "public"."product_status" NOT NULL DEFAULT 'active',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews_reactions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT,
    "comment_id" INTEGER,
    "type" "public"."liketype",
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."variant_options" (
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."variant_specs" (
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "variant_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wishlist" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wishlist_items" (
    "id" SERIAL NOT NULL,
    "wishlist_id" INTEGER NOT NULL,
    "product_id" BIGINT,
    "variant_id" BIGINT,
    "added_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "idx_users_deleted_at" ON "public"."User"("deletedAt" ASC);

-- CreateIndex
CREATE INDEX "idx_users_is_blocked" ON "public"."User"("isBlocked" ASC);

-- CreateIndex
CREATE INDEX "idx_users_role" ON "public"."User"("role" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key" ON "public"."cart_items"("cart_id" ASC, "variant_id" ASC);

-- CreateIndex
CREATE INDEX "idx_cart_items_cart" ON "public"."cart_items"("cart_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "public"."carts"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_coupon_code_key" ON "public"."coupons"("coupon_code" ASC);

-- CreateIndex
CREATE INDEX "idx_coupon_code" ON "public"."coupons"("coupon_code" ASC);

-- CreateIndex
CREATE INDEX "idx_coupons_deleted_at" ON "public"."coupons"("deleted_at" ASC);

-- CreateIndex
CREATE INDEX "idx_order_items_order" ON "public"."order_items"("order_id" ASC);

-- CreateIndex
CREATE INDEX "idx_orders_return_status" ON "public"."orders"("return_status" ASC);

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "public"."orders"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_orders_user" ON "public"."orders"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_product_cards_deleted_at" ON "public"."product_cards"("deleted_at" ASC);

-- CreateIndex
CREATE INDEX "idx_product_cards_is_active" ON "public"."product_cards"("is_active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "product_cards_variant_id_key" ON "public"."product_cards"("variant_id" ASC);

-- CreateIndex
CREATE INDEX "idx_product_variants_deleted_at" ON "public"."product_variants"("deleted_at" ASC);

-- CreateIndex
CREATE INDEX "idx_product_variants_product_id" ON "public"."product_variants"("product_id" ASC);

-- CreateIndex
CREATE INDEX "idx_product_variants_status" ON "public"."product_variants"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_product_variants_variant_name" ON "public"."product_variants"("variant_name" ASC);

-- CreateIndex
CREATE INDEX "idx_products_category" ON "public"."products"("category_id" ASC);

-- CreateIndex
CREATE INDEX "idx_products_deleted_at" ON "public"."products"("deleted_at" ASC);

-- CreateIndex
CREATE INDEX "idx_products_name" ON "public"."products"("name" ASC);

-- CreateIndex
CREATE INDEX "idx_products_status" ON "public"."products"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_reviews_product" ON "public"."reviews"("product_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_product_id_key" ON "public"."reviews"("user_id" ASC, "product_id" ASC);

-- CreateIndex
CREATE INDEX "idx_variant_specs_variant_id" ON "public"."variant_specs"("variant_id" ASC);

-- CreateIndex
CREATE INDEX "idx_wishlist_user_id" ON "public"."wishlist"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_user_id_key" ON "public"."wishlist"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_wishlist_items_product_id" ON "public"."wishlist_items"("product_id" ASC);

-- CreateIndex
CREATE INDEX "idx_wishlist_items_wishlist_id" ON "public"."wishlist_items"("wishlist_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_wishlist_id_product_id_variant_id_key" ON "public"."wishlist_items"("wishlist_id" ASC, "product_id" ASC, "variant_id" ASC);

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_specs" ADD CONSTRAINT "product_specs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews_reactions" ADD CONSTRAINT "reviews_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews_reactions" ADD CONSTRAINT "reviews_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."variant_options" ADD CONSTRAINT "variant_options_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."variant_specs" ADD CONSTRAINT "variant_specs_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlist"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

