/*
  Warnings:

  - A unique constraint covering the columns `[cpf,corretor_id]` on the table `leads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `corretor_id` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- DropConstraint (replaces DROP INDEX which fails for constraint-backed indexes)
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_cpf_key";
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_email_key";

-- CreateTable
CREATE TABLE "corretores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corretores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "corretores_email_key" ON "corretores"("email");

-- AlterTable: add corretor_id as nullable first, then set NOT NULL after
ALTER TABLE "leads" ADD COLUMN "corretor_id" TEXT;

-- Delete any existing leads that cannot be associated (dev only)
DELETE FROM "leads" WHERE "corretor_id" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "leads" ALTER COLUMN "corretor_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leads_cpf_corretor_id_key" ON "leads"("cpf", "corretor_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_corretor_id_fkey" FOREIGN KEY ("corretor_id") REFERENCES "corretores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
