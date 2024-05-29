/*
  Warnings:

  - Added the required column `activated` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "homepageUrl" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Lab" (
    "groupId" INTEGER NOT NULL,
    "professor" TEXT NOT NULL,
    "numPostDoc" INTEGER NOT NULL,
    "numPhd" INTEGER NOT NULL,
    "numMaster" INTEGER NOT NULL,
    "numUnderGraduate" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    CONSTRAINT "Lab_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Club" (
    "groupId" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    CONSTRAINT "Club_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "activated" BOOLEAN NOT NULL,
    CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id", "name") SELECT "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_groupId_key" ON "User"("groupId");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Lab_groupId_key" ON "Lab"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Club_groupId_key" ON "Club"("groupId");
