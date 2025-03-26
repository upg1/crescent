/*
  Warnings:

  - You are about to drop the column `chapterId` on the `paragraphs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[content,sectionId]` on the table `paragraphs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `paragraphs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "paragraphs" DROP CONSTRAINT "paragraphs_chapterId_fkey";

-- DropIndex
DROP INDEX "paragraphs_content_chapterId_key";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "exerciseId" TEXT,
ADD COLUMN     "figureId" TEXT,
ADD COLUMN     "sectionId" TEXT;

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "exerciseId" TEXT,
ADD COLUMN     "figureId" TEXT,
ADD COLUMN     "sectionId" TEXT;

-- AlterTable
ALTER TABLE "paragraphs" DROP COLUMN "chapterId",
ADD COLUMN     "sectionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "solution" TEXT,
    "order" INTEGER NOT NULL,
    "difficultyLevel" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "figures" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "figures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sections_title_chapterId_key" ON "sections"("title", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_content_sectionId_key" ON "exercises"("content", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "paragraphs_content_sectionId_key" ON "paragraphs"("content", "sectionId");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "figures" ADD CONSTRAINT "figures_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
