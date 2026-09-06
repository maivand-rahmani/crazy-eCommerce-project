/*
  Warnings:

  - Made the column `discount_percent` on table `product_cards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount_percent` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "user_role" ADD VALUE 'super_admin';

-- AlterTable
ALTER TABLE "product_cards" ALTER COLUMN "discount_percent" SET NOT NULL,
ALTER COLUMN "discount_percent" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "discount_percent" SET NOT NULL,
ALTER COLUMN "discount_percent" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SettingsAuditLog" (
    "id" BIGSERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettingsAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_settings_audit_key" ON "SettingsAuditLog"("key");

-- CreateIndex
CREATE INDEX "idx_settings_audit_changed_by" ON "SettingsAuditLog"("changedBy");

-- CreateIndex
CREATE INDEX "idx_settings_audit_created_at" ON "SettingsAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
