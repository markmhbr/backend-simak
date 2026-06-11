-- CreateTable
CREATE TABLE "simak"."mandala" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url_mandala" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mandala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mandala_key_key" ON "simak"."mandala"("key");
