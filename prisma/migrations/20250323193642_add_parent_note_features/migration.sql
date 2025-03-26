-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isParentNote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noteRole" TEXT NOT NULL DEFAULT 'personal',
ADD COLUMN     "position" TEXT,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';
