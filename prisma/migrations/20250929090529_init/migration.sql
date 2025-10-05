/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Dudi` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Dudi" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Logbook" ADD COLUMN     "catatanDudi" TEXT;

-- CreateTable
CREATE TABLE "public"."SchoolSettings" (
    "id" SERIAL NOT NULL,
    "logo_url" TEXT,
    "nama_sekolah" TEXT,
    "alamat" TEXT,
    "telepon" TEXT,
    "email" TEXT,
    "website" TEXT,
    "kepala_sekolah" TEXT,
    "npsn" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSettings_npsn_key" ON "public"."SchoolSettings"("npsn");

-- CreateIndex
CREATE UNIQUE INDEX "Dudi_userId_key" ON "public"."Dudi"("userId");

-- AddForeignKey
ALTER TABLE "public"."Dudi" ADD CONSTRAINT "Dudi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
