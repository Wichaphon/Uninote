-- AlterTable
ALTER TABLE "sheets" ADD COLUMN     "department" TEXT,
ADD COLUMN     "faculty" TEXT,
ADD COLUMN     "purchaseCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "university" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "year" TEXT;

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_sheetId_idx" ON "purchases"("sheetId");

-- CreateIndex
CREATE INDEX "sheets_subject_idx" ON "sheets"("subject");

-- CreateIndex
CREATE INDEX "sheets_university_idx" ON "sheets"("university");

-- CreateIndex
CREATE INDEX "sheets_faculty_idx" ON "sheets"("faculty");

-- CreateIndex
CREATE INDEX "sheets_sellerId_idx" ON "sheets"("sellerId");
