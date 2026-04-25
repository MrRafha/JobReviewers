-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'CLAIMED', 'RESOLVED', 'DISMISSED', 'APPROVED');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "claimedByAdminId" TEXT,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING';

-- Data migration: mark already-resolved reports
UPDATE "Report" SET status = 'RESOLVED' WHERE "resolvedAt" IS NOT NULL;

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminNote_authorId_idx" ON "AdminNote"("authorId");

-- CreateIndex
CREATE INDEX "AdminNote_createdAt_idx" ON "AdminNote"("createdAt");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_claimedByAdminId_idx" ON "Report"("claimedByAdminId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_claimedByAdminId_fkey" FOREIGN KEY ("claimedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
