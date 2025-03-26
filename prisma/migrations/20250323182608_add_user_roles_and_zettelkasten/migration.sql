-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'PARENT', 'TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeLimit" INTEGER,
    "contentFilters" TEXT[],
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "progressReports" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
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

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentConceptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "lessonId" TEXT,
    "bookId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION,
    "timeSpent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParentChild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ParentChild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RelatedNotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedNotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSettings_userId_key" ON "AccessSettings"("userId");

-- CreateIndex
CREATE INDEX "_ParentChild_B_index" ON "_ParentChild"("B");

-- CreateIndex
CREATE INDEX "_RelatedNotes_B_index" ON "_RelatedNotes"("B");

-- AddForeignKey
ALTER TABLE "AccessSettings" ADD CONSTRAINT "AccessSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_parentNoteId_fkey" FOREIGN KEY ("parentNoteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_parentConceptId_fkey" FOREIGN KEY ("parentConceptId") REFERENCES "Concept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentChild" ADD CONSTRAINT "_ParentChild_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentChild" ADD CONSTRAINT "_ParentChild_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedNotes" ADD CONSTRAINT "_RelatedNotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedNotes" ADD CONSTRAINT "_RelatedNotes_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
