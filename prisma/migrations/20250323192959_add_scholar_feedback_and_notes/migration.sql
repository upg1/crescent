/*
  Warnings:

  - You are about to drop the `_ParentChild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ParentChild" DROP CONSTRAINT "_ParentChild_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParentChild" DROP CONSTRAINT "_ParentChild_B_fkey";

-- DropTable
DROP TABLE "_ParentChild";

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "bookId" TEXT,
    "paragraphId" TEXT NOT NULL,
    "elementContent" TEXT,
    "feedbackType" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarLink" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "scholarId" TEXT NOT NULL,
    "linkCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParentScholar" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ParentScholar_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ParentScholar_B_index" ON "_ParentScholar"("B");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarLink" ADD CONSTRAINT "ScholarLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarLink" ADD CONSTRAINT "ScholarLink_scholarId_fkey" FOREIGN KEY ("scholarId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentScholar" ADD CONSTRAINT "_ParentScholar_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentScholar" ADD CONSTRAINT "_ParentScholar_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
