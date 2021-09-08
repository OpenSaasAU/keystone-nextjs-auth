-- DropIndex
DROP INDEX "User.email_unique";

-- DropIndex
DROP INDEX "User.subjectId_unique";

-- CreateIndex
CREATE INDEX "User.email_index" ON "User"("email");

-- CreateIndex
CREATE INDEX "User.subjectId_index" ON "User"("subjectId");
