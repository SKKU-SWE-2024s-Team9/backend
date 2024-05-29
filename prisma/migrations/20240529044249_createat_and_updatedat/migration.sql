/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lab` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "activated" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("activated", "groupId", "id", "name", "password", "salt") SELECT "activated", "groupId", "id", "name", "password", "salt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_groupId_key" ON "User"("groupId");
CREATE TABLE "new_Club" (
    "groupId" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Club_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("campus", "groupId", "location") SELECT "campus", "groupId", "location" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_groupId_key" ON "Club"("groupId");
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "homepageUrl" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Group" ("approved", "description", "email", "homepageUrl", "id", "logoUrl", "name", "tags") SELECT "approved", "description", "email", "homepageUrl", "id", "logoUrl", "name", "tags" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE TABLE "new_Lab" (
    "groupId" INTEGER NOT NULL,
    "professor" TEXT NOT NULL,
    "numPostDoc" INTEGER NOT NULL,
    "numPhd" INTEGER NOT NULL,
    "numMaster" INTEGER NOT NULL,
    "numUnderGraduate" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lab_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lab" ("campus", "groupId", "numMaster", "numPhd", "numPostDoc", "numUnderGraduate", "professor", "roomNo") SELECT "campus", "groupId", "numMaster", "numPhd", "numPostDoc", "numUnderGraduate", "professor", "roomNo" FROM "Lab";
DROP TABLE "Lab";
ALTER TABLE "new_Lab" RENAME TO "Lab";
CREATE UNIQUE INDEX "Lab_groupId_key" ON "Lab"("groupId");
PRAGMA foreign_key_check("User");
PRAGMA foreign_key_check("Club");
PRAGMA foreign_key_check("Group");
PRAGMA foreign_key_check("Lab");
PRAGMA foreign_keys=ON;
