/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScholarLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParentScholar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RelatedNotes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Concept` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'STAFF';

-- DropForeignKey
ALTER TABLE "AccessSettings" DROP CONSTRAINT "AccessSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_parentNoteId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarLink" DROP CONSTRAINT "ScholarLink_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarLink" DROP CONSTRAINT "ScholarLink_scholarId_fkey";

-- DropForeignKey
ALTER TABLE "_ParentScholar" DROP CONSTRAINT "_ParentScholar_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParentScholar" DROP CONSTRAINT "_ParentScholar_B_fkey";

-- DropForeignKey
ALTER TABLE "_RelatedNotes" DROP CONSTRAINT "_RelatedNotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_RelatedNotes" DROP CONSTRAINT "_RelatedNotes_B_fkey";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "chapterId" TEXT,
ADD COLUMN     "lessonId" TEXT,
ALTER COLUMN "paragraphId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "chapterId" TEXT,
ADD COLUMN     "paragraphId" TEXT;

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "ScholarLink";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_ParentScholar";

-- DropTable
DROP TABLE "_RelatedNotes";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tags" TEXT[],
    "type" TEXT,
    "conceptId" TEXT,
    "parentNoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isParentNote" BOOLEAN NOT NULL DEFAULT false,
    "noteRole" TEXT NOT NULL DEFAULT 'personal',
    "position" TEXT,
    "sourceId" TEXT,
    "sourceType" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "relatedNoteId" TEXT,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paragraphs" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "paragraphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholar_links" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "scholarId" TEXT NOT NULL,
    "linkCode" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'APPROVED',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "scholar_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParentChild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ParentChild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "notes_title_userId_key" ON "notes"("title", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_title_bookId_key" ON "chapters"("title", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "paragraphs_content_chapterId_key" ON "paragraphs"("content", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "scholar_links_linkCode_key" ON "scholar_links"("linkCode");

-- CreateIndex
CREATE UNIQUE INDEX "scholar_links_parentId_scholarId_key" ON "scholar_links"("parentId", "scholarId");

-- CreateIndex
CREATE INDEX "_ParentChild_B_index" ON "_ParentChild"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Concept_name_key" ON "Concept"("name");

-- AddForeignKey
ALTER TABLE "AccessSettings" ADD CONSTRAINT "AccessSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_parentNoteId_fkey" FOREIGN KEY ("parentNoteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_relatedNoteId_fkey" FOREIGN KEY ("relatedNoteId") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "paragraphs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "paragraphs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_links" ADD CONSTRAINT "scholar_links_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_links" ADD CONSTRAINT "scholar_links_scholarId_fkey" FOREIGN KEY ("scholarId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentChild" ADD CONSTRAINT "_ParentChild_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentChild" ADD CONSTRAINT "_ParentChild_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
