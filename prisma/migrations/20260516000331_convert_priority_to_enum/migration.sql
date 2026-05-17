/*
  Warnings:

  - Changed the type of `priority` on the `leads` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('Alto', 'Medio', 'Baixo', 'NaoClassificado');

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "priority",
ADD COLUMN     "priority" "LeadPriority" NOT NULL;
