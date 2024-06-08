/*
  Warnings:

  - Added the required column `numMembers` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `representativeName` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleScholarUrl` to the `Lab` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "numMembers" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "representativeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lab" ADD COLUMN     "googleScholarUrl" TEXT NOT NULL;
