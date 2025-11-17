-- AlterTable
ALTER TABLE "public"."Dudi" ADD COLUMN     "guru_penanggung_jawab_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Dudi" ADD CONSTRAINT "Dudi_guru_penanggung_jawab_id_fkey" FOREIGN KEY ("guru_penanggung_jawab_id") REFERENCES "public"."Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
