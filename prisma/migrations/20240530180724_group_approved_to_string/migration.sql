-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "homepageUrl" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "approved" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Group" ("approved", "createdAt", "description", "email", "homepageUrl", "id", "logoUrl", "name", "tags", "updatedAt") SELECT "approved", "createdAt", "description", "email", "homepageUrl", "id", "logoUrl", "name", "tags", "updatedAt" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
PRAGMA foreign_key_check("Group");
PRAGMA foreign_keys=ON;
