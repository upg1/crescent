-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "mnemonicData" JSONB,
ADD COLUMN     "mnemonicType" TEXT,
ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "memory_nodes" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memory_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_nodes" (
    "id" TEXT NOT NULL,
    "memoryNodeId" TEXT NOT NULL,
    "storyText" TEXT NOT NULL,
    "nextNodeId" TEXT,
    "previousNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palace_nodes" (
    "id" TEXT NOT NULL,
    "memoryNodeId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" JSONB,
    "roomId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "palace_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "palaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "palaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "story_nodes_memoryNodeId_key" ON "story_nodes"("memoryNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "palace_nodes_memoryNodeId_key" ON "palace_nodes"("memoryNodeId");

-- AddForeignKey
ALTER TABLE "memory_nodes" ADD CONSTRAINT "memory_nodes_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_nodes" ADD CONSTRAINT "story_nodes_memoryNodeId_fkey" FOREIGN KEY ("memoryNodeId") REFERENCES "memory_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_nodes" ADD CONSTRAINT "story_nodes_nextNodeId_fkey" FOREIGN KEY ("nextNodeId") REFERENCES "story_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palace_nodes" ADD CONSTRAINT "palace_nodes_memoryNodeId_fkey" FOREIGN KEY ("memoryNodeId") REFERENCES "memory_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palace_nodes" ADD CONSTRAINT "palace_nodes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_palaceId_fkey" FOREIGN KEY ("palaceId") REFERENCES "palaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palaces" ADD CONSTRAINT "palaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
