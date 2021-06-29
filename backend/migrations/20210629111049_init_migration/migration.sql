-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "canManageProducts" BOOLEAN,
    "canSeeOtherUsers" BOOLEAN,
    "canManageUsers" BOOLEAN,
    "canManageRoles" BOOLEAN,
    "canManageCart" BOOLEAN,
    "canManageOrgs" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "subjectId" TEXT,
    "role" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.subjectId_unique" ON "User"("subjectId");

-- CreateIndex
CREATE INDEX "User.role_index" ON "User"("role");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
