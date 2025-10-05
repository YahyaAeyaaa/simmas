-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'siswa', 'guru');

-- CreateEnum
CREATE TYPE "public"."DudiStatus" AS ENUM ('aktif', 'nonaktif', 'pending');

-- CreateEnum
CREATE TYPE "public"."MagangStatus" AS ENUM ('pending', 'diterima', 'ditolak', 'berlangsung', 'selesai', 'dibatalkan');

-- CreateEnum
CREATE TYPE "public"."LogbookStatus" AS ENUM ('pending', 'disetujui', 'ditolak');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Siswa" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guru" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dudi" (
    "id" SERIAL NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "penanggungJawab" TEXT NOT NULL,
    "status" "public"."DudiStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dudi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Magang" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "dudiId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,
    "status" "public"."MagangStatus" NOT NULL,
    "nilai_akhir" DOUBLE PRECISION,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Logbook" (
    "id" SERIAL NOT NULL,
    "magangId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "kendala" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "status_verifikasi" "public"."LogbookStatus" NOT NULL,
    "catatanGuru" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_userId_key" ON "public"."Siswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "public"."Siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "public"."Guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "public"."Guru"("nip");

-- AddForeignKey
ALTER TABLE "public"."Siswa" ADD CONSTRAINT "Siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Magang" ADD CONSTRAINT "Magang_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "public"."Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Magang" ADD CONSTRAINT "Magang_dudiId_fkey" FOREIGN KEY ("dudiId") REFERENCES "public"."Dudi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Magang" ADD CONSTRAINT "Magang_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "public"."Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Logbook" ADD CONSTRAINT "Logbook_magangId_fkey" FOREIGN KEY ("magangId") REFERENCES "public"."Magang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
