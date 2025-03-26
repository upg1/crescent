-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'GRADED', 'LATE', 'MISSING');

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "courseId" TEXT NOT NULL,
    "classCode" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "term" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "grade" TEXT,

    CONSTRAINT "class_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "classId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "pointsPossible" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_classCode_key" ON "classes"("classCode");

-- CreateIndex
CREATE UNIQUE INDEX "class_enrollments_userId_classId_key" ON "class_enrollments"("userId", "classId");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "class_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
