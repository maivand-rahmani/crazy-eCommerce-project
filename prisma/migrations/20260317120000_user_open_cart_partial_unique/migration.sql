ALTER TABLE "carts" DROP CONSTRAINT IF EXISTS "carts_user_id_key";

DROP INDEX IF EXISTS "carts_user_id_key";

CREATE UNIQUE INDEX "unique_user_open_cart"
ON "carts" ("user_id")
WHERE "status" = 'OPEN';
