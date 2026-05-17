-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "simak";

-- CreateTable
CREATE TABLE "simak"."app_keys" (
    "id" UUID NOT NULL,
    "sekolah_id" UUID,
    "nama_app" TEXT NOT NULL,
    "key_api" TEXT NOT NULL,
    "key_webService" TEXT NOT NULL,
    "key_adminPanel" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_key_api_key" ON "simak"."app_keys"("key_api");

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_key_webService_key" ON "simak"."app_keys"("key_webService");

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_key_adminPanel_key" ON "simak"."app_keys"("key_adminPanel");
