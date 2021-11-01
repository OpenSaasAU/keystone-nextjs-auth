/*
  Warnings:

  - A unique constraint covering the columns `[subjectId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_subjectId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "User_subjectId_key" ON "User"("subjectId");
