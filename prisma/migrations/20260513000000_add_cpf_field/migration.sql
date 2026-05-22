-- AddColumn cpf to leads table
ALTER TABLE "leads" ADD COLUMN "cpf" TEXT NOT NULL DEFAULT '';

-- Create unique constraint on cpf
ALTER TABLE "leads" ADD CONSTRAINT "leads_cpf_key" UNIQUE ("cpf");

-- Remove default after constraint is created
ALTER TABLE "leads" ALTER COLUMN "cpf" DROP DEFAULT;
