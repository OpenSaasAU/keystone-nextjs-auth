/*
  Warnings:

  - Made the column `name` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageProducts` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canSeeOtherUsers` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageUsers` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageRoles` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageCart` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageOrgs` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subjectId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT E'',
ALTER COLUMN "canManageProducts" SET NOT NULL,
ALTER COLUMN "canManageProducts" SET DEFAULT false,
ALTER COLUMN "canSeeOtherUsers" SET NOT NULL,
ALTER COLUMN "canSeeOtherUsers" SET DEFAULT false,
ALTER COLUMN "canManageUsers" SET NOT NULL,
ALTER COLUMN "canManageUsers" SET DEFAULT false,
ALTER COLUMN "canManageRoles" SET NOT NULL,
ALTER COLUMN "canManageRoles" SET DEFAULT false,
ALTER COLUMN "canManageCart" SET NOT NULL,
ALTER COLUMN "canManageCart" SET DEFAULT false,
ALTER COLUMN "canManageOrgs" SET NOT NULL,
ALTER COLUMN "canManageOrgs" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT E'',
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DEFAULT E'',
ALTER COLUMN "subjectId" SET NOT NULL,
ALTER COLUMN "subjectId" SET DEFAULT E'';

-- RenameIndex
ALTER INDEX "User.email_index" RENAME TO "User_email_idx";

-- RenameIndex
ALTER INDEX "User.role_index" RENAME TO "User_role_idx";

-- RenameIndex
ALTER INDEX "User.subjectId_index" RENAME TO "User_subjectId_idx";
